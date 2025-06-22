import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useAuth } from '../services/AuthContext';
import { tasksAPI, submissionsAPI } from '../services/api';
import '../App.css';
import './TaskDetail.css';

const API_BASE_URL = 'http://localhost:5000'; // Backend URL

const TaskDetail = () => {
    const { id: taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [isTesting, setIsTesting] = useState(false);
    const workerRef = useRef(null);

    const { user } = useAuth(); // Get authenticated user

    // Exam flow state
    const [examStarted, setExamStarted] = useState(false);
    const [submissionFinished, setSubmissionFinished] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer effect
    useEffect(() => {
        let timerInterval;
        if (examStarted && !submissionFinished) {
            timerInterval = setInterval(() => {
                if (startTime) {
                    setElapsedTime(Date.now() - startTime);
                }
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [examStarted, submissionFinished, startTime]);

    // Fetch Task & Initialize Worker
    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const res = await tasksAPI.getById(taskId);
                const fetchedTask = res.data.data;
                if (fetchedTask.questions && Array.isArray(fetchedTask.questions)) {
                    fetchedTask.questions = fetchedTask.questions.filter(q => !q.isHidden);
                }
                setTask(fetchedTask);
                const initialAnswers = {};
                if (fetchedTask.questions) {
                    fetchedTask.questions.forEach(q => {
                        initialAnswers[q.id] = q.type === 'code' ? (q.codeTemplate || '') : '';
                    });
                }
                setUserAnswers(initialAnswers);
            } catch (err) {
                setError('Tapşırıq məlumatları yüklənərkən xəta baş verdi.');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();

        workerRef.current = new Worker('/codeRunner.worker.js');
        workerRef.current.onmessage = (event) => {
            clearTimeout(workerRef.current.timeoutId);
            const { type, results } = event.data;
            if (type === 'DONE') {
                setTestResults(results);
                setIsTesting(false);
            }
        };
        workerRef.current.onerror = (err) => {
            clearTimeout(workerRef.current.timeoutId);
            setError(`Test zamanı xəta baş verdi: ${err.message}`);
            setIsTesting(false);
        };
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, [taskId]);
    
    const handleStartExam = () => {
        setStartTime(Date.now());
        setExamStarted(true);
    };

    const handleFinishExam = async () => {
        if (!window.confirm("İmtahanı bitirmək istədiyinizə əminsiniz?")) return;
        setLoading(true);
        const submissionData = {
            taskId,
            taskTitle: task.title,
            userName: user?.name || 'Authenticated User', // Use user's name from auth context
            duration: elapsedTime,
            answers: userAnswers,
        };
        try {
            await submissionsAPI.create(submissionData);
            setSubmissionFinished(true);
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || "Nəticələr göndərilərkən xəta baş verdi.");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (ms) => {
        if (ms === null) return '0 dəq 00 san';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} dəq ${seconds.toString().padStart(2, '0')} san`;
    };

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleRunTests = useCallback(() => {
        const currentQuestion = task.questions[activeQuestionIndex];
        if (currentQuestion.type !== 'code' || !workerRef.current) return;
        setIsTesting(true);
        setTestResults([]);
        setError('');
        const userCode = userAnswers[currentQuestion.id];

        workerRef.current.timeoutId = setTimeout(() => {
            workerRef.current.terminate();
            setError('Test vaxtı bitdi. Kodunuzda sonsuz döngə ola bilər.');
            setIsTesting(false);
            // Re-initialize worker
            workerRef.current = new Worker('/codeRunner.worker.js');
        }, 5000);

        workerRef.current.postMessage({
            userCode,
            testCases: currentQuestion.testCases || []
        });
    }, [task, activeQuestionIndex, userAnswers]);
    
    const renderAnswerInput = (currentQuestion) => {
        if (!currentQuestion) return null;
        switch (currentQuestion.type) {
            case 'multiple-choice':
                return (
                    <div className="options-container">
                        {currentQuestion.options.map((option, index) => (
                            <label key={index} className={`option-label ${userAnswers[currentQuestion.id] === index ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name={`question-${currentQuestion.id}`} 
                                    value={index}
                                    checked={userAnswers[currentQuestion.id] === index}
                                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );
            case 'code':
                return (
                    <div className="code-question-container">
                        <CodeMirror value={userAnswers[currentQuestion.id]} height="300px" extensions={[javascript({ jsx: true })]} onChange={(value) => handleAnswerChange(currentQuestion.id, value)} theme="dark" />
                        <div className="code-actions">
                            <button onClick={handleRunTests} disabled={isTesting} className="primary-button">{isTesting ? 'Test edilir...' : 'Testləri işə sal'}</button>
                            {error && isTesting && <span className="error-message testing-error">{error}</span>}
                        </div>
                        {(testResults.length > 0 || isTesting) && (
                            <div className="test-results-panel">
                                <h4>Test Nəticələri</h4>
                                {isTesting && !testResults.length ? <p>Testlər işə salınır...</p> : <ul>{testResults.map((result, index) => (<li key={index} className={result.passed ? 'pass' : 'fail'}><strong className="test-status">Test {index + 1}: {result.passed ? 'Uğurlu ✔' : 'Xəta ✖'}</strong>{!result.passed && (<div className="test-details"><p><strong>Giriş:</strong><code>{result.input}</code></p><p><strong>Gözlənilən:</strong><code>{result.expected}</code></p><p><strong>Alınan:</strong><code>{result.received}</code></p></div>)}</li>))}</ul>}
                            </div>
                        )}
                    </div>
                );
            case 'text':
                return <input type="text" className="text-answer-input" value={userAnswers[currentQuestion.id] || ''} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)} placeholder="Cavabınızı bura daxil edin" />;
            default: return null;
        }
    };
    
    if (loading && !submissionFinished) return <div className="page-container centered">Yüklənir...</div>;
    if (error && !examStarted) return <div className="page-container centered error-message">{error}</div>;
    if (!task) return <div className="page-container centered">Tapşırıq tapılmadı.</div>;
    
    const activeQuestion = task.questions && task.questions[activeQuestionIndex];
    const questionImageUrl = activeQuestion?.imageUrl 
        ? `${API_BASE_URL}/${activeQuestion.imageUrl.replace(/\\/g, '/')}` 
        : null;

    if (!examStarted) {
        return (
            <div className="page-container centered">
                <div className="start-exam-card modern">
                    <div className="start-exam-header">
                        <h1>{task.title}</h1>
                        <p>{task.description}</p>
                    </div>

                    <div className="exam-rules">
                        <h3>İmtahan Qaydaları</h3>
                        <ul>
                            <li>
                                <span className="rule-icon">✔️</span>
                                <span><strong>Sualların sayı:</strong> {task.questions?.length || 0}</span>
                            </li>
                            <li>
                                <span className="rule-icon">⏳</span>
                                <span><strong>Vaxt:</strong> Taymeri izləməyi unutmayın.</span>
                            </li>
                            <li>
                                <span className="rule-icon">🚫</span>
                                <span>İmtahanı bitirdikdən sonra cavablara düzəliş edə bilməyəcəksiniz.</span>
                            </li>
                            <li>
                                <span className="rule-icon">💡</span>
                                <span>Bütün sualları cavabladığınıza əmin olun. Uğurlar!</span>
                            </li>
                        </ul>
                    </div>
                    
                    <button onClick={handleStartExam} className="primary-button large-button">
                        İmtahana Başla
                    </button>
                </div>
            </div>
        );
    }
    
    if (submissionFinished) {
        return (
            <div className="page-container centered">
                <div className="submission-card">
                    <h2>Təşəkkürlər, {user?.name || 'Authenticated User'}!</h2>
                    <p>"{task.title}" tapşırığı üçün nəticələriniz uğurla göndərildi.</p>
                    <p>Sərf etdiyiniz zaman: <strong>{formatTime(elapsedTime)}</strong></p>
                    <button onClick={() => navigate('/')} className="primary-button">Ana Səhifəyə Qayıt</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container task-detail-layout">
            <div className="question-list-panel">
                <h3>{task.title}</h3>
                <div className="exam-timer">Vaxt: {formatTime(elapsedTime)}</div>
                <ul className="question-nav-list">
                    {task.questions.map((q, index) => (
                        <li key={q.id} className={`question-nav-item ${index === activeQuestionIndex ? 'active' : ''}`} onClick={() => { setActiveQuestionIndex(index); setTestResults([]); setError(''); }}>
                            Sual {index + 1} <span className="question-type-badge">{q.type}</span>
                        </li>
                    ))}
                </ul>
                <div className="exam-actions-container">
                    <Link to="/dashboard" className="exam-button exam-button-secondary">Geri Çıx</Link>
                    <button
                        onClick={handleFinishExam}
                        className="exam-button exam-button-danger"
                    >
                        İmtahanı Bitir
                    </button>
                </div>
            </div>
            <div className="question-content-panel">
                {activeQuestion ? (
                    <>
                        <div className="question-header">
                            <h2>{activeQuestion.title || activeQuestion.question || activeQuestion.text || `Sual ${activeQuestionIndex + 1}`}</h2>
                        </div>
                        <div className="question-body">
                            {activeQuestion.description && <p>{activeQuestion.description}</p>}
                            {questionImageUrl && (
                                <div className="question-image-container">
                                    <img src={questionImageUrl} alt={`Sual ${activeQuestionIndex + 1} üçün şəkil`} className="question-image" />
                                </div>
                            )}
                            {renderAnswerInput(activeQuestion)}
                        </div>
                    </>
                ) : (
                    <div className="no-questions-placeholder">Sual tapılmadı. Zəhmət olmasa, soldakı siyahıdan seçin.</div>
                )}
            </div>
        </div>
    );
};

export default TaskDetail; 
import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { usersAPI } from '../services/api'; // usersAPI-nı import edirik
import './TaskForm.css';
import { v4 as uuidv4 } from 'uuid';

// Simple SVG Icons
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zM14.95 14.95a10.05 10.05 0 01-1.414.542A10.048 10.048 0 0110 17c-4.478 0-8.268-2.943-9.542-7a10.048 10.048 0 013.3-5.343l-1.727-1.727a1 1 0 011.414-1.414l14 14zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const TaskForm = ({ task, onSave, onCancel }) => {
  const initialFormState = {
    title: '',
    description: '',
    deadline: '',
    difficulty: 'easy',
    category: 'frontend',
    assignedUserIds: [] // Təyin olunmuş istifadəçilər üçün state
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isScrolled, setIsScrolled] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const textareaRef = useRef(null); // Ref for the question textarea
  const [questions, setQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const API_BASE_URL = 'http://localhost:5000'; // Backend URL

  // Bütün istifadəçiləri yükləmək üçün
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await usersAPI.getAll();
        const userOptions = res.data.data.map(user => ({
          value: user.id,
          label: `${user.username} (${user.email})`
        }));
        setUsers(userOptions);
      } catch (error) {
        console.error("İstifadəçiləri yükləmək mümkün olmadı:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 0);
  };

  useEffect(() => {
    if (task) {
      const initialQuestions = task.questions?.map(q => ({
        ...q,
        localId: q.id || uuidv4(),
        imagePreview: q.imageUrl || null, // For existing images
        imageFile: null
      })) || [];
      setQuestions(initialQuestions);
      if (initialQuestions.length) {
        setActiveQuestionId(initialQuestions[0].localId);
      }

      // Mövcud tapşırığın təyin olunduğu istifadəçiləri formaya yükləmək
      // Qeyd: task obyektində assignedUsers olmalıdır.
      // Bu, Task modelində 'as: assignedUsers' ilə təyin olunub.
      // API-dan gələn task-da bu məlumat yoxdursa, əlavə bir sorğu lazım ola bilər.
      const assignedIds = task.assignedUsers ? task.assignedUsers.map(u => u.id) : [];
      const preSelectedUsers = users.filter(u => assignedIds.includes(u.value));
      setSelectedUsers(preSelectedUsers);

      setFormData({
        title: task.title || '',
        description: task.description || '',
        deadline: task.deadline ? new Date(task.deadline).toISOString().substring(0, 10) : '',
        difficulty: task.difficulty || 'easy',
        category: task.category || 'frontend',
        assignedUserIds: assignedIds
      });
    } else {
      setFormData(initialFormState);
      setQuestions([]);
      setActiveQuestionId(null);
      setSelectedUsers([]);
    }
  }, [task, users]); // `users` asılılığı əlavə olunur

  useEffect(() => {
    // Auto-resize textarea when the current question changes
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [task, activeQuestionId, questions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuestionChange = (id, field, value) => {
    setQuestions(prev => prev.map(q => q.localId === id ? { ...q, [field]: value } : q));
  };
  
  const handleToggleQuestionVisibility = (id) => {
    setQuestions(prev => prev.map(q => q.localId === id ? { ...q, isHidden: !q.isHidden } : q));
  };
  
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    if (!newQuestions[qIndex]) return;
    if (!newQuestions[qIndex].options) {
        newQuestions[qIndex].options = [];
    }
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    // This function seems to be legacy and is replaced by handleAddQuestion
    // We will leave it to avoid breaking anything unexpected but it should be removed in the future.
    const newQuestion = { localId: uuidv4(), type: 'text', question: 'Yeni Sual', answer: '', isHidden: false };
    setQuestions(prev => [...prev, newQuestion]);
    setActiveQuestionId(newQuestion.localId);
  };
  
  const removeQuestion = (idToRemove) => {
    if (!window.confirm("Bu sualı silmək istədiyinizə əminsiniz?")) return;
    
    setQuestions(prev => {
        const newQuestions = prev.filter(q => q.localId !== idToRemove);
        
        // If the active question was deleted, select another one
        if (activeQuestionId === idToRemove) {
            if (newQuestions.length > 0) {
                // Find index of deleted question to select the previous one
                const oldIndex = questions.findIndex(q => q.localId === idToRemove);
                const newActiveIndex = Math.max(0, oldIndex - 1);
                setActiveQuestionId(newQuestions[newActiveIndex]?.localId || null);
            } else {
                setActiveQuestionId(null);
            }
        }
        return newQuestions;
    });
  };

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
    const userIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({ ...prev, assignedUserIds: userIds }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setQuestions(prev => prev.map(q => 
        q.localId === activeQuestionId 
        ? { ...q, imageFile: file, imagePreview: preview } 
        : q
      ));
    }
  };
  
  const handleRemoveImage = () => {
    setQuestions(prev => prev.map(q => 
      q.localId === activeQuestionId 
      ? { ...q, imageFile: null, imagePreview: null, imageUrl: null } // Also clear existing imageUrl
      : q
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    
    // Append text data
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('deadline', formData.deadline);
    submitData.append('difficulty', formData.difficulty);
    submitData.append('category', formData.category);
    submitData.append('assignedUserIds', JSON.stringify(formData.assignedUserIds));

    // Handle questions and images
    const questionsToSave = await Promise.all(questions.map(async (q) => {
      let imageUrl = q.imageUrl || null;
      if (q.imageFile) {
        // This is a placeholder for the actual upload logic
        // In a real app, you would upload the file and get a URL
        // For now, we'll just simulate this.
        console.log(`Uploading image for question ${q.id}: ${q.imageFile.name}`);
        // const imageUploadData = new FormData();
        // imageUploadData.append('image', q.imageFile);
        // const res = await axios.post('/api/upload', imageUploadData);
        // imageUrl = res.data.url; 
        imageUrl = `uploads/temp_${q.imageFile.name}`; // Placeholder URL
      }
      return { ...q, imageUrl, imageFile: undefined, imagePreview: undefined };
    }));

    submitData.append('questions', JSON.stringify(questionsToSave));
    
    // Pass FormData to parent
    onSave(submitData, task?.id);
  };
  
  const renderQuestionFields = (q, index) => {
    const questionExists = !!q;

    // Construct the full image URL
    let fullImageUrl = null;
    if (questionExists && q.imagePreview) {
        if (q.imagePreview.startsWith('blob:')) {
            fullImageUrl = q.imagePreview; // It's a local temporary preview
        } else {
            fullImageUrl = `${API_BASE_URL}/${q.imagePreview.replace(/\\/g, '/')}`; // It's a saved image path from backend
        }
    }
    
    return (
      <div className={`question-content ${q?.isHidden ? 'hidden-question' : ''}`}>
        {!questionExists ? (
            <div className="question-content-empty">
                <p>Sual seçin və ya yeni sual yaradın.</p>
            </div>
        ) : (
        <>
            <div className="question-header">
            <h4>Sual {index + 1}</h4>
            <div className="question-actions">
                <button type="button" onClick={() => handleToggleQuestionVisibility(q.localId)} className="visibility-toggle-btn" title={q.isHidden ? "Göstər" : "Gizlət"}>
                {q.isHidden ? <EyeOffIcon/> : <EyeIcon/>}
                <span>{q.isHidden ? "Göstər" : "Gizlət"}</span>
                </button>
                <button type="button" onClick={() => removeQuestion(q.localId)} className="danger-button icon-button" title="Sil">
                    <TrashIcon/>
                    <span>Sil</span>
                </button>
            </div>
            </div>

            <div className="form-container">
            <div className="form-group">
                <label htmlFor={`question-${q.id}`}>Sualın mətni</label>
                <textarea
                ref={textareaRef}
                id={`question-${q.id}`}
                name="question"
                className="form-control"
                value={q.question || q.title || q.text || ''}
                onChange={(e) => handleQuestionChange(q.localId, 'question', e.target.value)}
                required
                rows="4"
                />
            </div>
            <div className="form-group">
                <label htmlFor={`type-${q.id}`}>Sualın Tipi</label>
                <div className="select-wrapper">
                <select
                    id={`type-${q.id}`}
                    name="type"
                    className="form-control"
                    value={q.type}
                    onChange={(e) => handleQuestionChange(q.localId, 'type', e.target.value)}
                >
                    <option value="text">Mətn</option>
                    <option value="multiple-choice">Çoxseçimli</option>
                    <option value="code">Kod</option>
                </select>
                </div>
            </div>
            
            {
                {
                'multiple-choice': (
                    <>
                    <div className="form-group">
                        <label>Variantlar</label>
                        {q.options && q.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-input">
                            <input
                            type="text"
                            className="form-control"
                            placeholder={`Variant ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                            />
                            <button type="button" onClick={() => removeOption(index, oIndex)} className="remove-option-btn" title="Variantı sil">－</button>
                        </div>
                        ))}
                        <button type="button" className="add-option-btn" onClick={() => addOption(index)}>
                        <PlusIcon />
                        <span>Variant əlavə et</span>
                        </button>
                    </div>
                    <div className="form-group">
                        <label htmlFor={`answer-${q.id}`}>Düzgün Cavab</label>
                        <input
                        type="text"
                        id={`answer-${q.id}`}
                        name="answer"
                        className="form-control"
                        placeholder="Düzgün variantın mətnini yazın"
                        value={q.answer || ''}
                        onChange={(e) => handleQuestionChange(q.localId, 'answer', e.target.value)}
                        />
                    </div>
                    </>
                ),
                'code': (
                    <>
                    <div className="form-group">
                        <label htmlFor={`codeTemplate-${q.id}`}>Kod şablonu (Tələbə üçün başlanğıc kod)</label>
                        <textarea id={`codeTemplate-${q.id}`} name="codeTemplate" value={q.codeTemplate || ''} onChange={(e) => handleQuestionChange(q.localId, 'codeTemplate', e.target.value)} rows="5"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor={`testCases-${q.id}`}>Test ssenariləri (JSON formatında)</label>
                        <textarea
                        id={`testCases-${q.id}`}
                        name="testCases"
                        value={q.testCases || '[]'}
                        onChange={(e) => handleQuestionChange(q.localId, 'testCases', e.target.value)}
                        rows="5"
                        ></textarea>
                    </div>
                    </>
                ),
                'text': (
                    <div className="form-group">
                    <label htmlFor={`answer-${q.id}`}>Düzgün Cavab</label>
                    <input
                        type="text"
                        id={`answer-${q.id}`}
                        name="answer"
                        value={q.answer || ''}
                        onChange={(e) => handleQuestionChange(q.localId, 'answer', e.target.value)}
                    />
                    </div>
                )
                }[q.type]
            }

            {/* Image Upload Section */}
            <div className="form-group">
                <label>Sual üçün şəkil (opsional)</label>
                {fullImageUrl ? (
                <div className="image-preview-container">
                    <img src={fullImageUrl} alt="Sual üçün önizləmə" className="image-preview" />
                    <button type="button" onClick={() => handleRemoveImage(q.localId)} className="remove-image-btn">Sil</button>
                </div>
                ) : (
                <label className="image-upload-label">
                    + Şəkil Yüklə
                    <input type="file" onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                </label>
                )}
            </div>
            </div>
        </>
        )}
      </div>
    );
  };
  
  const currentQuestion = questions.find(q => q.localId === activeQuestionId);

  const handleAddQuestion = () => {
    const newQuestion = {
      localId: uuidv4(),
      type: 'text',
      question: `Yeni Sual ${questions.length + 1}`,
      isHidden: false,
      options: [],
      answer: '',
      codeTemplate: '',
      testCases: '[]',
      solution: '',
      imageFile: null,
      imagePreview: null,
      imageUrl: null,
    };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    setActiveQuestionId(newQuestion.localId);
  };

  return (
    <div className="modal-backdrop">
      <div className="task-form-modal">
        <form onSubmit={handleSubmit} className="task-form">
          <div className={`modal-header ${isScrolled ? 'scrolled' : ''}`}>
             <h2>{task ? 'Tapşırığı Redaktə Et' : 'Yeni Tapşırıq Yarat'}</h2>
          </div>
          <div className="form-scroll-container" onScroll={handleScroll}>
            <div className="task-details-section">
                <div className="form-group">
                    <label htmlFor="title">Başlıq</label>
                    <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Təsvir</label>
                    <textarea id="description" name="description" className="form-control" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="deadline">Son tarix</label>
                        <input type="date" id="deadline" name="deadline" className="form-control" value={formData.deadline} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="difficulty">Çətinlik</label>
                        <div className="select-wrapper">
                          <select id="difficulty" name="difficulty" className="form-control" value={formData.difficulty} onChange={handleChange}>
                              <option value="easy">Asan</option>
                              <option value="medium">Orta</option>
                              <option value="hard">Çətin</option>
                          </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Kateqoriya</label>
                        <div className="select-wrapper">
                          <select id="category" name="category" className="form-control" value={formData.category} onChange={handleChange}>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                              <option value="database">Baza</option>
                              <option value="algorithm">Alqoritm</option>
                          </select>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                  <label htmlFor="assignedUsers">İstifadəçiləri təyin et</label>
                  <Select
                    id="assignedUsers"
                    isMulti
                    name="users"
                    options={users}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="İstifadəçiləri seçin..."
                    value={selectedUsers}
                    onChange={handleUserChange}
                  />
                </div>
            </div>
            
            <div className="form-divider"></div>

            <div className="questions-section">
              <h3>Sual Paketi</h3>
              <div className="question-editor-layout">
                <nav className="question-nav">
                  <ul>
                    {questions.map((q, index) => (
                      <li key={q.localId} className={q.localId === activeQuestionId ? 'active' : ''}>
                        <button type="button" onClick={() => setActiveQuestionId(q.localId)}>
                          <span className="question-nav-title">Sual {index + 1}</span>
                          {q.isHidden && <span className="hidden-indicator" title="Gizlidir"><EyeOffIcon /></span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="add-question-nav-btn" onClick={handleAddQuestion}>
                    <PlusIcon />
                    <span>Yeni Sual</span>
                  </button>
                </nav>
                {renderQuestionFields(currentQuestion, questions.findIndex(q => q.localId === activeQuestionId))}
              </div>
            </div>
          </div>
          <div className={`modal-footer ${isScrolled ? 'scrolled' : ''}`}>
            <button type="button" className="secondary-button" onClick={onCancel}>Ləğv Et</button>
            <button type="submit" className="primary-button">Yadda Saxla</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { tasksAPI } from '../services/api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const TaskCard = ({ task }) => {
    const progress = task.progress || 0;
    
    // Kateqoriyaya görə ikon seçimi (nümunə)
    const getCategoryIcon = (category) => {
        switch(category?.toLowerCase()) {
            case 'frontend':
                return '💻';
            case 'backend':
                return '⚙️';
            case 'dizayn':
                return '🎨';
            default:
                return '📝';
        }
    };

    return (
        <Link to={`/task/${task.id}`} className="task-card-link">
            <div className="task-card">
                <div className="task-card-header">
                    <div className="task-icon">{getCategoryIcon(task.category)}</div>
                    <div className="task-title-date">
                        <h3 className="task-title">{task.title}</h3>
                        <p className="task-date">Son tarix: {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="task-card-body">
                    <p className="task-description">{task.description}</p>
                     <div className="task-progress">
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="progress-text">{progress}% tamamlanıb</span>
                    </div>
                </div>
                <div className="task-card-footer">
                    <span className={`task-category-tag ${task.category?.toLowerCase()}`}>{task.category}</span>
                    <div className="continue-button">
                        Davam et
                        <span className="arrow-icon">→</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                // Assuming the API returns all tasks and we filter by assigned user on the client,
                // or the backend handles this logic. Using the existing tasksAPI.
                const response = await tasksAPI.getAll(); 
                // The actual data might be nested in response.data.data
                setTasks(response.data.data || response.data);
            } catch (error) {
                console.error("Tapşırıqları gətirmək alınmadı:", error);
                setError('Tapşırıqlar yüklənərkən xəta baş verdi.');
                 // Nümunə məlumatlar (backend-də xəta olanda test üçün)
                 setTasks([
                    { id: 1, title: 'React komponenti yaratmaq', description: 'Login səhifəsi üçün istifadəçi giriş komponenti hazırlanmalıdır.', deadline: '2024-12-11', category: 'Frontend', progress: 75 },
                    { id: 2, title: 'API endpoint hazırlamaq', description: 'İstifadəçi məlumatlarını qaytaran yeni bir API endpoint-i yazılmalıdır.', deadline: '2024-11-25', category: 'Backend', progress: 50 },
                    { id: 3, title: 'Loqo dizaynı', description: 'Yeni mobil proqram üçün loqo və brendinq elementləri hazırlanmalıdır.', deadline: '2024-11-30', category: 'Dizayn', progress: 20 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Xoş gəldin, {user?.firstName || user?.username}!</h1>
                <p>Bu gün üçün planların bunlardır. Uğurlar!</p>
            </div>
            
            <div className="dashboard-content">
                <div className="tasks-header">
                    <h2>Aktiv tapşırıqlar</h2>
                </div>
                {loading && <p>Yüklənir...</p>}
                {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
                {!loading && tasks.length > 0 ? (
                    <div className="tasks-grid">
                        {tasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                ) : (
                    !loading && <div className="no-tasks-message">
                        <p>Hal-hazırda sizə təyin edilmiş aktiv tapşırıq yoxdur.</p>
                        <p>Yeni tapşırıqlar üçün bildirişləri izləyin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 
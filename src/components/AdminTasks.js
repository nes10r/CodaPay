import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import TaskForm from './TaskForm'; 
import SubmissionsModal from './SubmissionsModal';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // State for submissions modal
  const [isSubmissionsVisible, setIsSubmissionsVisible] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await tasksAPI.getAll();
        setTasks(res.data.data);
      } catch (err) {
        setError('Tapşırıqları yükləmək mümkün olmadı.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    if (window.confirm('Bu tapşırığı silmək istədiyinizə əminsinizmi?')) {
      try {
        await tasksAPI.delete(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err) {
        setError('Tapşırığı silmək mümkün olmadı.');
        console.error(err);
      }
    }
  };

  const handleOpenForm = (task = null) => {
    setEditingTask(task);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setIsFormVisible(false);
  };

  const handleOpenSubmissions = (task) => {
    setViewingTask(task);
    setIsSubmissionsVisible(true);
  };

  const handleCloseSubmissions = () => {
    setIsSubmissionsVisible(false);
    setViewingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
        if (editingTask) {
            const updatedTask = await tasksAPI.update(editingTask.id, taskData);
            setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask.data.data : t));
        } else {
            const newTask = await tasksAPI.create(taskData);
            setTasks([newTask.data.data, ...tasks]);
        }
        handleCloseForm();
    } catch (err) {
        setError('Tapşırığı yadda saxlamaq mümkün olmadı.');
        console.error(err);
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      {isFormVisible && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCloseForm}
        />
      )}
      {isSubmissionsVisible && viewingTask && (
        <SubmissionsModal 
          taskId={viewingTask.id}
          taskTitle={viewingTask.title}
          onClose={handleCloseSubmissions} 
        />
      )}
      <div className="admin-header">
        <h1>Tapşırıqların İdarəedilməsi</h1>
        <button className="primary-button" onClick={() => handleOpenForm()}>Yeni tapşırıq</button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Başlıq</th>
              <th>Status</th>
              <th>Son tarix</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>
                  <span className={`status-badge status-${task.status.toLowerCase()}`}>{task.status}</span>
                </td>
                <td>{new Date(task.deadline).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button className="primary-button-outline" onClick={() => handleOpenSubmissions(task)}>İştirakçılar</button>
                  <button className="secondary-button" onClick={() => handleOpenForm(task)}>Redaktə et</button>
                  <button className="danger-button" onClick={() => handleDelete(task.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminTasks; 
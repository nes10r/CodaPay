import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import AdminTasks from '../components/AdminTasks';
import AdminUsers from '../components/AdminUsers';
import '../App.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      if (!isAdmin()) {
        alert('Bu səhifəyə giriş üçün admin səlahiyyətiniz yoxdur!');
        navigate('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="admin-root">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Yüklənir...</h2>
        </div>
      </div>
    );
  }

  // If not admin, don't render anything (will redirect)
  if (!isAdmin()) {
    return (
      <div className="admin-root">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Giriş qadağandır</h2>
          <p>Bu səhifəyə giriş üçün admin səlahiyyətiniz yoxdur.</p>
          <p>Ana səhifəyə yönləndirilirsiniz...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <AdminTasks />;
      case 'users':
        return <AdminUsers />;
      case 'vacancies':
        return <div>Vakansiyaların idarəedilməsi yaxında...</div>;
      default:
        return <AdminTasks />;
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-header">
        <h1>Admin Paneli</h1>
        <p>Xoş gəlmisiniz, Admin!</p>
      </div>
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tapşırıqlar
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          İstifadəçilər
        </button>
        <button
          className={`admin-tab ${activeTab === 'vacancies' ? 'active' : ''}`}
          onClick={() => setActiveTab('vacancies')}
        >
          Vakansiyalar
        </button>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin; 
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import VirtualApp from "./pages/VirtualApp";
import Vacancy from "./pages/Vacancy";
import TaskDetail from './pages/TaskDetail';
import Admin from './pages/Admin';
import MainLayout from './components/MainLayout';
import { useAuth } from './services/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Yüklənir...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();
    
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Yüklənir...
            </div>
        );
    }
    
    if (isAdmin()) {
        return children;
    }
    
    return <Navigate to="/dashboard" replace />;
}

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />} />
      <Route path="/reset-password/:token" element={isAuthenticated ? <Navigate to="/" /> : <ResetPassword />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="task/:id" element={<TaskDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="virtual" element={<VirtualApp />} />
        <Route path="vacancy" element={<Vacancy />} />
        <Route path="admin" element={
            <AdminRoute>
                <Admin />
            </AdminRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import VirtualApp from "./pages/VirtualApp";
import Vacancy from "./pages/Vacancy";
import './App.css';

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/");
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/about" element={<About />} />
      <Route path="/" element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/virtual" element={isLoggedIn ? <VirtualApp onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/vacancy" element={isLoggedIn ? <Vacancy onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

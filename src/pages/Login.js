import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

const RegisterTypes = [
  { key: "user", label: "User" },
  { key: "course", label: "Course" },
  { key: "company", label: "Company" },
];

const Login = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [registerType, setRegisterType] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regEmailValid, setRegEmailValid] = useState(false);
  const [regPasswordValid, setRegPasswordValid] = useState(false);
  const [regConfirmValid, setRegConfirmValid] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.value.length >= 6);
  };

  const handleRegEmailChange = (e) => {
    setRegEmail(e.target.value);
    setRegEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  };

  const handleRegPasswordChange = (e) => {
    setRegPassword(e.target.value);
    setRegPasswordValid(e.target.value.length >= 6);
    setRegConfirmValid(e.target.value === regConfirm && e.target.value.length >= 6);
  };

  const handleRegConfirmChange = (e) => {
    setRegConfirm(e.target.value);
    setRegConfirmValid(e.target.value === regPassword && e.target.value.length >= 6);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Admin login yoxlaması
    if ((email === "admin" || email === "admin@admin.com") && password === "admin") {
      if (onLogin) onLogin();
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Burada register funksionallığı olacaq
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <nav className="login-navbar">
          <Link to="/" className="active">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="login-card-wrapper">
          <div className="login-tabs-wrapper">
            <div className="login-tabs">
              <span className={activeTab === "login" ? "active" : "inactive"} onClick={() => setActiveTab("login")}>Log in</span>
              <span className={activeTab === "register" ? "active" : "inactive"} onClick={() => setActiveTab("register")}>Register</span>
            </div>
          </div>
          {activeTab === "login" ? (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label>Enter your email or phone number</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                {email && (
                  <span className="clear-icon" style={{cursor: 'pointer', color:'#1976d2', fontWeight:'bold', fontSize:'20px', position:'absolute', right:'10px', top:'34px'}} onClick={() => setEmail("")}>&times;</span>
                )}
                {emailValid && email && (
                  <span className="valid-icon">✔</span>
                )}
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {password && (
                  <span className="clear-icon" style={{cursor: 'pointer', color:'#1976d2', fontWeight:'bold', fontSize:'20px', position:'absolute', right:'10px', top:'34px'}} onClick={() => setPassword("")}>&times;</span>
                )}
              </div>
              <button
                type="submit"
                className="login-btn"
                disabled={!( (emailValid && passwordValid) || ((email === "admin" || email === "admin@admin.com") && password === "admin") )}
              >
                Log in
              </button>
            </form>
          ) : (
            <div className="register-type-select">
              {RegisterTypes.map((type) => (
                <button
                  key={type.key}
                  className={`register-type-btn${registerType === type.key ? " selected" : ""}`}
                  onClick={() => setRegisterType(type.key)}
                  type="button"
                >
                  {type.label}
                </button>
              ))}
              {registerType === "user" && (
                <form className="login-form" style={{marginTop: 24}}>
                  <div className="input-group">
                    <label>Email</label>
                    <input type="email" required />
                  </div>
                  <div className="input-group">
                    <label>Password</label>
                    <input type="password" required />
                  </div>
                  <div className="input-group">
                    <label>Confirm password</label>
                    <input type="password" required />
                  </div>
                  <button className="login-btn" type="submit">Register as User</button>
                </form>
              )}
              {registerType === "course" && (
                <form className="login-form" style={{marginTop: 24}}>
                  <div className="input-group">
                    <label>Course Name</label>
                    <input type="text" required />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input type="email" required />
                  </div>
                  <div className="input-group">
                    <label>Password</label>
                    <input type="password" required />
                  </div>
                  <button className="login-btn" type="submit">Register as Course</button>
                </form>
              )}
              {registerType === "company" && (
                <form className="login-form" style={{marginTop: 24}}>
                  <div className="input-group">
                    <label>Company Name</label>
                    <input type="text" required />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input type="email" required />
                  </div>
                  <div className="input-group">
                    <label>Password</label>
                    <input type="password" required />
                  </div>
                  <div className="input-group">
                    <label>Confirm password</label>
                    <input type="password" required />
                  </div>
                  <button className="login-btn" type="submit">Register as Company</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="login-illustration">
        <svg width="1800" height="1800" style={{ position: 'absolute', right: '-900px', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}>
          <circle cx="900" cy="900" r="600" fill="#2196f3" fillOpacity="0.2" />
          <circle cx="900" cy="900" r="440" fill="#2196f3" fillOpacity="0.4" />
          <circle cx="900" cy="900" r="280" fill="#2196f3" fillOpacity="0.7" />
        </svg>
        <img src="/Loginimage.png" alt="Login" className="login-main-image" style={{ position: 'relative', zIndex: 1, width: '420px', maxWidth: '90%' }} />
      </div>
    </div>
  );
};

export default Login; 
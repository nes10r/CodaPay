import React, { useState } from "react";
import "../App.css";
import { Link, useLocation } from "react-router-dom";

const demoUser = {
  avatar: "🧑‍💻",
  name: "Nuri Hoca",
  email: "nuri.hoca@example.com",
  status: "Active",
  role: "Frontend Developer",
  joined: "2023-01-15"
};

const Profile = ({ onLogout }) => {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(demoUser);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const location = useLocation();

  const handleEdit = () => setEdit(true);
  const handleCancel = () => { setEdit(false); setForm({ name: user.name, email: user.email }); setMsg(""); };
  const handleSave = e => {
    e.preventDefault();
    setUser(u => ({ ...u, name: form.name, email: form.email }));
    setEdit(false);
    setMsg("Məlumatlar yeniləndi!");
  };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePasswordChange = e => setPassword(e.target.value);
  const handleNewPasswordChange = e => setNewPassword(e.target.value);
  const handlePasswordSave = e => {
    e.preventDefault();
    setPassword(""); setNewPassword(""); setMsg("Şifrə uğurla dəyişdirildi!");
  };

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">CodaPay</div>
        <nav className="sidebar-menu">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}><span role="img" aria-label="home">🏠</span> Home</Link>
          <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}><span role="img" aria-label="profile">👤</span> Profile</Link>
          <Link to="/virtual" className={location.pathname === "/virtual" ? "active" : ""}><span role="img" aria-label="virtual">💻</span> Virtual application</Link>
          <Link to="/vacancy" className={location.pathname === "/vacancy" ? "active" : ""}><span role="img" aria-label="vacancy">📄</span> Vacancy</Link>
        </nav>
        <div className="sidebar-logout">
          <a onClick={onLogout} style={{cursor:'pointer'}}><span role="img" aria-label="logout">🚪</span> Log out</a>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="profile-root">
          <div className="profile-card">
            <div className="profile-avatar">{user.avatar}</div>
            <div className="profile-info">
              {edit ? (
                <form onSubmit={handleSave} className="profile-form">
                  <label>Ad:</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                  <label>Email:</label>
                  <input name="email" value={form.email} onChange={handleChange} required />
                  <div className="profile-actions">
                    <button type="submit">Yadda saxla</button>
                    <button type="button" onClick={handleCancel}>Ləğv et</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="profile-name">{user.name}</div>
                  <div className="profile-email">{user.email}</div>
                  <div className="profile-status">Status: <b>{user.status}</b></div>
                  <div className="profile-role">Rolu: {user.role}</div>
                  <div className="profile-joined">Qoşulma tarixi: {user.joined}</div>
                  <button className="profile-edit-btn" onClick={handleEdit}>Redaktə et</button>
                </>
              )}
            </div>
          </div>
          <div className="profile-card">
            <h4>Şifrəni dəyiş</h4>
            <form onSubmit={handlePasswordSave} className="profile-form">
              <label>Köhnə şifrə:</label>
              <input type="password" value={password} onChange={handlePasswordChange} required />
              <label>Yeni şifrə:</label>
              <input type="password" value={newPassword} onChange={handleNewPasswordChange} required />
              <button type="submit">Yenilə</button>
            </form>
          </div>
          {msg && <div className="profile-msg">{msg}</div>}
        </div>
      </main>
    </div>
  );
};

export default Profile; 
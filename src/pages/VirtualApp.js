import React, { useState } from "react";
import "../App.css";
import { Link, useLocation } from "react-router-dom";

const notifications = [
  { id: 1, text: "Your application was received.", date: "2024-06-21" },
  { id: 2, text: "Document upload is available.", date: "2024-06-22" },
];

const faqs = [
  { q: "How do I apply?", a: "Fill out the online application form and submit." },
  { q: "How can I track my status?", a: "Status is shown below after you submit your application." },
  { q: "Is my data secure?", a: "Yes, all your data is encrypted and protected." },
];

const VirtualApp = ({ onLogout }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("Not submitted");
  const [file, setFile] = useState(null);
  const [notif, setNotif] = useState(notifications);
  const location = useLocation();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setStatus("Pending review");
    setNotif(n => [{ id: Date.now(), text: "Application submitted!", date: new Date().toLocaleDateString() }, ...n]);
  };
  const handleFile = e => setFile(e.target.files[0]);

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
        <div className="virtualapp-root">
          <div className="virtualapp-card">
            <h2 className="virtualapp-title">Virtual Application</h2>
            <p className="virtualapp-desc">
              Apply online, track your application status, upload documents, and get instant notifications!
            </p>
            <div className="virtualapp-section">
              <h4>Online Application Form</h4>
              {submitted ? (
                <div className="virtualapp-success">Your application has been submitted!</div>
              ) : (
                <form className="virtualapp-form" onSubmit={handleSubmit}>
                  <label>Name:</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                  <label>Email:</label>
                  <input name="email" value={form.email} onChange={handleChange} required type="email" />
                  <label>Message:</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3} />
                  <button type="submit">Submit Application</button>
                </form>
              )}
            </div>
            <div className="virtualapp-section">
              <h4>Application Status</h4>
              <div className="virtualapp-status">{status}</div>
            </div>
            <div className="virtualapp-section">
              <h4>Document Upload</h4>
              <input type="file" onChange={handleFile} />
              {file && <div className="virtualapp-file">Selected: {file.name}</div>}
            </div>
            <div className="virtualapp-section">
              <h4>Notifications</h4>
              <ul className="virtualapp-list">
                {notif.map(n => <li key={n.id}><b>{n.date}:</b> {n.text}</li>)}
              </ul>
            </div>
            <div className="virtualapp-section">
              <h4>FAQ</h4>
              <ul className="virtualapp-list">
                {faqs.map((f,i) => <li key={i}><b>{f.q}</b><br /><span style={{color:'#555'}}>{f.a}</span></li>)}
              </ul>
            </div>
            <div className="virtualapp-section">
              <h4>Coming soon</h4>
              <ul className="virtualapp-list">
                <li>Live chat with support</li>
                <li>Integration with external services</li>
                <li>Advanced analytics</li>
                <li>Multi-step application wizard</li>
                <li>Personalized dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualApp; 
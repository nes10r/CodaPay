import React, { useState } from "react";
import "../App.css";
import { Link, useLocation } from "react-router-dom";

const vacancies = [
  {
    id: 1,
    title: "Frontend Developer",
    desc: "React və PWA texnologiyaları ilə işləyəcək müasir frontend proqramçı.",
    requirements: [
      "React və JavaScript bilikləri",
      "CSS və UI/UX təcrübəsi",
      "Git və komanda işi bacarığı"
    ],
    deadline: "2024-07-10"
  },
  {
    id: 2,
    title: "Backend Developer",
    desc: "Node.js və REST API-lərlə işləyəcək təcrübəli backend proqramçı.",
    requirements: [
      "Node.js və Express bilikləri",
      "Verilənlər bazası təcrübəsi (MongoDB, SQL)",
      "REST API dizaynı"
    ],
    deadline: "2024-07-15"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    desc: "Web və mobil üçün müasir interfeys dizaynı bacarığı olan dizayner.",
    requirements: [
      "Figma və ya Adobe XD təcrübəsi",
      "Minimalist və korporativ dizayn zövqü",
      "Portfolio təqdim etmək"
    ],
    deadline: "2024-07-20"
  }
];

const Vacancy = ({ onLogout }) => {
  const [applied, setApplied] = useState([]);
  const handleApply = id => setApplied(a => [...a, id]);
  const location = useLocation();

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
        <div className="vacancy-root">
          <h2 className="vacancy-title">Vakansiyalar</h2>
          <div className="vacancy-list">
            {vacancies.map(v => (
              <div className="vacancy-card" key={v.id}>
                <div className="vacancy-header">
                  <span className="vacancy-job">{v.title}</span>
                  <span className="vacancy-deadline">Son tarix: {v.deadline}</span>
                </div>
                <div className="vacancy-desc">{v.desc}</div>
                <ul className="vacancy-reqs">
                  {v.requirements.map((r,i) => <li key={i}>{r}</li>)}
                </ul>
                <button className="vacancy-apply-btn" onClick={() => handleApply(v.id)} disabled={applied.includes(v.id)}>
                  {applied.includes(v.id) ? "Müraciət olundu" : "Müraciət et"}
                </button>
              </div>
            ))}
          </div>
          <div className="vacancy-section">
            <h4>Tezliklə əlavə imkanlar</h4>
            <ul className="vacancy-future">
              <li>Online müsahibə planlaşdırılması</li>
              <li>CV yükləmə və yoxlama</li>
              <li>Vakansiya üçün bildirişlər</li>
              <li>Şəxsi müraciət statusu</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Vacancy; 
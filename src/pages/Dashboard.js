import React, { useState } from "react";
import "../App.css";
import { Link, useLocation } from "react-router-dom";

const tasks = [
  {
    title: "Easy Tasks",
    date: "22 November 2023",
    progress: 40,
    total: 100,
    color: "#1976d2",
    bg: "#e3f2fd",
    btn: "Continue",
    btnColor: "#fff",
    btnBg: "#1565c0",
    icon: "📝",
    description: "Practice basic concepts and warm up your skills. Perfect for beginners and daily practice.",
    deadline: "2023-11-30",
    status: "in-progress",
    steps: [
      "Read the instructions",
      "Solve the quiz",
      "Submit your answer"
    ],
    resources: [
      { name: "Intro to Math", url: "https://www.khanacademy.org/math" },
      { name: "Sample PDF", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
    ],
    faq: [
      { q: "Can I retry the task?", a: "Yes, you can retry as many times as you want." },
      { q: "How do I get feedback?", a: "Feedback is shown instantly after submitting your answer." }
    ],
    questions: [
      { id: 1, text: "What is 2 + 2?", type: "text", answer: "4" },
      { id: 2, text: "Select the even number:", type: "select", options: ["3", "5", "8", "9"], answer: "8" }
    ],
    comments: [
      { user: "Nuri Hoca", text: "Great for warm-up!", date: "2024-06-20", avatar: "🧑‍🏫" }
    ]
  },
  {
    title: "Medium Tasks",
    date: "20 November 2023",
    progress: 0,
    total: 100,
    color: "#a259e6",
    bg: "#f3e6fa",
    btn: "START",
    btnColor: "#fff",
    btnBg: "#a259e6",
    icon: "📚",
    description: "Algorithmic puzzles and real-world scenarios. Test your speed and logic!",
    deadline: "2023-12-10",
    status: "not-started",
    steps: [
      "Read the problem statement",
      "Write your solution",
      "Check your result"
    ],
    resources: [
      { name: "Algorithms 101", url: "https://visualgo.net/en" }
    ],
    faq: [
      { q: "Are hints available?", a: "Yes, click the hint button if you get stuck." }
    ],
    questions: [
      { id: 1, text: "What is the output of 3 * 3?", type: "text", answer: "9" }
    ],
    comments: []
  },
  {
    title: "Hard Tasks",
    date: "19 November 2023",
    progress: 0,
    total: 100,
    color: "#ffe082",
    bg: "#fffde7",
    btn: "START",
    btnColor: "#fff",
    btnBg: "#ffe082",
    icon: "💡",
    description: "Complex projects and multi-step problems. Compete on the leaderboard!",
    deadline: "2023-12-20",
    status: "not-started",
    steps: [
      "Understand the requirements",
      "Design your solution",
      "Submit for review"
    ],
    resources: [
      { name: "Advanced Coding", url: "https://leetcode.com/" }
    ],
    faq: [
      { q: "Is teamwork allowed?", a: "Yes, you can collaborate with others." }
    ],
    questions: [
      { id: 1, text: "What is the time complexity of binary search?", type: "text", answer: "O(log n)" }
    ],
    comments: []
  },
  {
    title: "Internship",
    date: "-",
    progress: 0,
    total: 100,
    color: "#ffb3b3",
    bg: "#ffeaea",
    btn: "START",
    btnColor: "#fff",
    btnBg: "#ffb3b3",
    icon: "👨‍💻",
    description: "Project-based assignments and feedback from mentors. Portfolio-ready results!",
    deadline: "2023-12-31",
    status: "not-started",
    steps: [
      "Read the project brief",
      "Submit your project",
      "Get feedback"
    ],
    resources: [
      { name: "Internship Guide", url: "https://www.internships.com/career-advice" }
    ],
    faq: [
      { q: "Will I get a certificate?", a: "Yes, after successful completion." }
    ],
    questions: [],
    comments: []
  }
];

const Dashboard = ({ onLogout }) => {
  const [activeTask, setActiveTask] = useState(null);
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [taskStatus, setTaskStatus] = useState({});
  const [taskComments, setTaskComments] = useState({});
  const [step, setStep] = useState(0);
  const [answerResult, setAnswerResult] = useState(null);
  const location = useLocation();

  const handleAnswer = (qid, value, correct) => {
    setAnswers(a => ({ ...a, [qid]: value }));
    setAnswerResult(null);
  };
  const handleCheckAnswer = (q, value) => {
    if (value && value.toString().trim().toLowerCase() === q.answer.toString().trim().toLowerCase()) {
      setAnswerResult("Correct!");
    } else {
      setAnswerResult("Incorrect, try again!");
    }
  };
  const handleComment = () => {
    if (!activeTask) return;
    setTaskComments(prev => ({
      ...prev,
      [activeTask.title]: [
        ...(prev[activeTask.title] || activeTask.comments || []),
        { user: "You", text: comment, date: new Date().toLocaleDateString(), avatar: "🧑" }
      ]
    }));
    setComment("");
  };
  const handleFile = e => {
    setFile(e.target.files[0]);
  };
  const handleComplete = () => {
    if (!activeTask) return;
    setTaskStatus(prev => ({ ...prev, [activeTask.title]: "completed" }));
    setActiveTask({ ...activeTask, status: "completed" });
  };
  const handleStep = dir => {
    setStep(s => Math.max(0, Math.min((activeTask?.steps?.length || 1) - 1, s + dir)));
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
        <h2 className="dashboard-title">Tasks</h2>
        <div className="dashboard-tasks">
          {tasks.map((task, idx) => (
            <div
              className="task-card"
              key={idx}
              style={{background: task.color, cursor: 'pointer'}}
              onClick={() => { setActiveTask(task); setStep(0); setAnswerResult(null); }}
            >
              <div className="task-card-content">
                <div className="task-card-icon">{task.icon}</div>
                <div>
                  <div className="task-card-title">{task.title}</div>
                  <div className="task-card-date">{task.date}</div>
                </div>
              </div>
              <div className="task-card-progress">
                <div className="task-card-progress-bar-bg">
                  <div className="task-card-progress-bar" style={{width: `${task.progress}%`, background: '#fff'}}></div>
                </div>
                <div className="task-card-progress-info">
                  {task.progress}/{task.total}
                </div>
                <button
                  className="task-card-btn"
                  style={{background: task.btnBg, color: task.btnColor}}
                  onClick={e => { e.stopPropagation(); setActiveTask(task); setStep(0); setAnswerResult(null); }}
                >
                  {task.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
        {activeTask && (
          <div className="task-modal-bg" onClick={() => setActiveTask(null)}>
            <div className="task-modal task-modal-full" onClick={e => e.stopPropagation()}>
              <div className="task-modal-icon">{activeTask.icon}</div>
              <h3 className="task-modal-title">{activeTask.title}</h3>
              <div className="task-modal-status">
                <span>Status: <b>{taskStatus[activeTask.title] || activeTask.status}</b></span>
                <span>Deadline: <b>{activeTask.deadline}</b></span>
              </div>
              <div className="task-modal-desc">{activeTask.description}</div>
              {/* Steps */}
              {activeTask.steps && (
                <div className="task-modal-steps">
                  <div>Step {step+1} of {activeTask.steps.length}</div>
                  <div>{activeTask.steps[step]}</div>
                  <div style={{display:'flex', gap:8}}>
                    <button onClick={()=>handleStep(-1)} disabled={step===0}>Geri</button>
                    <button onClick={()=>handleStep(1)} disabled={step===activeTask.steps.length-1}>İrəli</button>
                  </div>
                </div>
              )}
              {/* Resources */}
              {activeTask.resources && activeTask.resources.length > 0 && (
                <div className="task-modal-resources">
                  <div>Resurslar:</div>
                  <ul>
                    {activeTask.resources.map((r,i)=>(<li key={i}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a></li>))}
                  </ul>
                </div>
              )}
              <div className="task-modal-progress">
                <span>Proqres: {activeTask.progress}/{activeTask.total}</span>
                <div className="task-card-progress-bar-bg" style={{width: 180}}>
                  <div className="task-card-progress-bar" style={{width: `${activeTask.progress}%`, background: '#1976d2'}}></div>
                </div>
              </div>
              {/* Questions */}
              {activeTask.questions && activeTask.questions.length > 0 && (
                <div className="task-modal-questions">
                  <h4>Sual(lar)</h4>
                  {activeTask.questions.map(q => (
                    <div key={q.id} className="task-modal-question">
                      <div>{q.text}</div>
                      {q.type === "text" ? (
                        <>
                          <input type="text" value={answers[q.id] || ""} onChange={e => handleAnswer(q.id, e.target.value, q.answer)} />
                          <button onClick={()=>handleCheckAnswer(q, answers[q.id])}>Yoxla</button>
                        </>
                      ) : (
                        <>
                          <select value={answers[q.id] || ""} onChange={e => handleAnswer(q.id, e.target.value, q.answer)}>
                            <option value="">Seçin</option>
                            {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <button onClick={()=>handleCheckAnswer(q, answers[q.id])}>Yoxla</button>
                        </>
                      )}
                    </div>
                  ))}
                  {answerResult && <div style={{marginTop:8, color: answerResult==="Correct!"?'#43a047':'#d32f2f', fontWeight:600}}>{answerResult}</div>}
                </div>
              )}
              {/* Upload */}
              <div className="task-modal-upload">
                <label>Fayl yüklə: <input type="file" onChange={handleFile} /></label>
                {file && <span>{file.name}</span>}
              </div>
              {/* Comments */}
              <div className="task-modal-comments">
                <h4>Şərhlər</h4>
                <div className="task-modal-comments-list">
                  {(taskComments[activeTask.title] || activeTask.comments || []).map((c, i) => (
                    <div key={i} className="task-modal-comment">
                      <span>{c.avatar || "🧑"}</span>
                      <b>{c.user}</b> <span style={{color:'#888', fontSize:'0.95em', marginLeft:4}}>{c.date}</span>: {c.text}
                    </div>
                  ))}
                </div>
                <div className="task-modal-comment-form">
                  <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Şərh əlavə et..." />
                  <button onClick={handleComment}>Göndər</button>
                </div>
              </div>
              {/* FAQ */}
              {activeTask.faq && activeTask.faq.length > 0 && (
                <div className="task-modal-faq">
                  <h4>Tez-tez verilən suallar</h4>
                  <ul>
                    {activeTask.faq.map((f,i)=>(<li key={i}><b>{f.q}</b><br/><span>{f.a}</span></li>))}
                  </ul>
                </div>
              )}
              <div className="task-modal-actions">
                <button className="task-modal-close" onClick={() => setActiveTask(null)}>Bağla</button>
                <button className="task-modal-complete" onClick={handleComplete} disabled={taskStatus[activeTask.title] === "completed"}>Tamamlandı kimi işarələ</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 
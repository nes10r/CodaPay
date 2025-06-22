import React, { useState } from "react";
import "./VirtualApp.css";

const faqsData = [
  { q: "How do I apply?", a: "Fill out the online application form and submit." },
  { q: "How can I track my status?", a: "Status is shown below after you submit your application." },
  { q: "Is my data secure?", a: "Yes, all your data is encrypted and protected." },
];

const ApplicationForm = ({ form, handleChange, handleSubmit, submitted }) => (
  <div className="va-card">
    <h3>Online Application Form</h3>
    {submitted ? (
      <div className="va-success-message">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
        <span>Your application has been submitted! We will review it shortly.</span>
      </div>
    ) : (
      <form className="va-form" onSubmit={handleSubmit}>
        <div className="va-form-group">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="va-form-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" value={form.email} onChange={handleChange} required type="email" />
        </div>
        <div className="va-form-group">
           <label htmlFor="message">Cover Letter (Optional)</label>
           <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={4} />
        </div>
        <button type="submit" className="va-button">Submit Application</button>
      </form>
    )}
  </div>
);

const DocumentUpload = ({ file, handleFile }) => (
    <div className="va-card">
        <h3>Document Upload</h3>
        <p>Please upload your resume or other relevant documents (PDF, DOCX).</p>
        <div className="va-file-upload-wrapper">
            <input type="file" id="file-upload" onChange={handleFile} className="va-file-input" />
            <label htmlFor="file-upload" className="va-file-upload-label">
                {file ? "File Selected" : "Choose a file..."}
            </label>
            {file && <span className="va-file-name">{file.name}</span>}
        </div>
    </div>
);


const StatusSection = ({ status }) => (
  <div className="va-card">
    <h3>Application Status</h3>
    <div className={`va-status va-status-${status.toLowerCase().replace(" ", "-")}`}>{status}</div>
  </div>
);

const Notifications = ({ notifications }) => (
  <div className="va-card">
    <h3>Notifications</h3>
    <ul className="va-notification-list">
      {notifications.map(n => (
        <li key={n.id}>
          <div className="va-notification-text">{n.text}</div>
          <div className="va-notification-date">{n.date}</div>
        </li>
      ))}
    </ul>
  </div>
);

const FaqSection = ({ faqs }) => (
  <div className="va-card">
    <h3>Frequently Asked Questions</h3>
    <div className="va-faq-list">
      {faqs.map((faq, index) => (
        <details key={index} className="va-faq-item">
          <summary>{faq.q}</summary>
          <p>{faq.a}</p>
        </details>
      ))}
    </div>
  </div>
);


const VirtualApp = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("Not Submitted");
  const [file, setFile] = useState(null);
  const [notifications, setNotifications] = useState([
      { id: 1, text: "Welcome! Fill out the form to start your application.", date: "2024-07-27" },
  ]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = e => setFile(e.target.files[0]);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setStatus("Pending Review");
    setNotifications(n => [
        { id: Date.now(), text: "Application successfully submitted!", date: new Date().toLocaleDateString('en-CA') },
        ...n
    ]);
  };

  return (
    <div className="va-container">
      <div className="va-header">
        <h1>Virtual Application Portal</h1>
        <p>Apply online, track your application status, and upload documents with ease.</p>
      </div>
      <div className="va-main-grid">
        <div className="va-grid-left">
          <ApplicationForm form={form} handleChange={handleChange} handleSubmit={handleSubmit} submitted={submitted} />
          <DocumentUpload file={file} handleFile={handleFile} />
        </div>
        <div className="va-grid-right">
          <StatusSection status={status} />
          <Notifications notifications={notifications} />
          <FaqSection faqs={faqsData} />
        </div>
      </div>
    </div>
  );
};

export default VirtualApp; 
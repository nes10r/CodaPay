import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-bg">
      <nav className="login-navbar">
        <Link to="/" className="active">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <section className="about-main">
        <header className="about-header">
          <h1>About Our Platform</h1>
          <p className="about-lead">
            We build scalable, secure, and user-centric web solutions for modern businesses and individuals.
          </p>
        </header>
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To empower users and organizations with innovative digital products that are reliable, intuitive, and future-proof.
          </p>
        </section>
        <section className="about-section">
          <h2>Key Advantages</h2>
          <ul className="about-list">
            <li>Progressive Web App (PWA) technology</li>
            <li>Secure authentication & registration</li>
            <li>Modular, maintainable React architecture</li>
            <li>Fully responsive and accessible design</li>
            <li>Easy integration and future extensibility</li>
          </ul>
        </section>
        <section className="about-section">
          <h2>Our Team</h2>
          <ul className="about-list">
            <li>Nuri Hoca — Frontend Developer</li>
            <li>Team Members — Design, Backend, QA</li>
          </ul>
        </section>
      </section>
    </div>
  );
};

export default About; 
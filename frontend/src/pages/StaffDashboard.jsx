import React, { useState, useEffect } from "react";
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.email.split('@')[0].replace('.', ' ') || 'User';
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">UMS</h2>
        <ul>
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/studentcourses')}>Courses</li>
          <li>My Exams</li>
          <li>Archive</li>
          <li onClick={() => navigate('/stafffacilities')}>Rooms</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2 className="welcome-message">
            Welcome, {userName.charAt(0).toUpperCase() + userName.slice(1)}!
          </h2>
          <button
            className="customize-button"
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </header>

        <section>
        <h3>What do you want to do?</h3>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate('/register')}>
              <span className="icon">👤</span>
              <h4>Manage students</h4>
              <p>Give them an F and ruin their lives.</p>
            </div>

            <div className="action-card" onClick={() => navigate('/courses')}>
              <span className="icon">🎓</span>
              <h4>Add classes</h4>
              <p>Create course content for your students.</p>
            </div>

            <div className="action-card" onClick={() => navigate('/adminfacilities')}>
              <span className="icon">🏫</span>
              <h4>Make exams</h4>
              <p>Make it so hard that the suicide rate in Egypt spikes.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
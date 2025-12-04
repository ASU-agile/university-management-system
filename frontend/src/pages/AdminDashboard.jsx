import React, { useState, useEffect } from "react";
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.email.split('@')[0].replace('.', ' ') || 'Admin';
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">UMS</h2>
        <ul>
          <li onClick={() => navigate('/admin/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/students')}>Students</li>
          <li onClick={() => navigate('/courses')}>Courses</li>
          <li onClick={() => navigate('/staff')}>Staff</li>
          <li onClick={() => navigate('/settings')}>Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2 className="welcome-message">
            Welcome to your dashboard, admin {userName.charAt(0).toUpperCase() + userName.slice(1)}!
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
              <h4>Register users</h4>
              <p>Create and manage user accounts.</p>
            </div>

            <div className="action-card" onClick={() => navigate('/courses')}>
              <span className="icon">🎓</span>
              <h4>Add classes</h4>
              <p>Create course content for your students.</p>
            </div>

            <div className="action-card" onClick={() => navigate('/adminfacilities')}>
              <span className="icon">🏫</span>
              <h4>Manage rooms</h4>
              <p>Add and manage halls, sections, and labs.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
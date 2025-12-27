// frontend/src/pages/StaffDashboard.jsx
import React, { useState, useEffect } from "react";
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";



function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.email.split('@')[0].replace('.', ' ') || 'User';
  const navigate = useNavigate();
  const userRole = user?.role;
  return (
    <div className="dashboard-container">
      <Sidebar />

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
          <div className="action-card" onClick={() => navigate('/staff/courses')}>
            <span className="icon">📚</span>
            <h4>Manage Courses</h4>
            <p>Upload and manage course content for your students.</p>
          </div>

          <div className="action-card" onClick={() => navigate('/addsubject')}>
            <span className="icon">➕</span>
            <h4>Create New Course</h4>
            <p>Add a new course to the system.</p>
          </div>

          <div className="action-card" onClick={() => navigate('/stafffacilities')}>
            <span className="icon">🏫</span>
            <h4>View Facilities</h4>
            <p>Check available rooms and facilities.</p>
          </div>
          {/* TA card */}
          {userRole === "teaching assistant" && (
            <div
              className="action-card"
              onClick={() => navigate('/staff/responsibilities')}
            >
              <span className="icon">📝</span>
              <h4>My Responsibilities</h4>
              <p>View and complete tasks assigned by professors.</p>
            </div>
          )}

          {/* Professor card */}
          {userRole === "professor" && (
            <div
              className="action-card"
              onClick={() => navigate('/staff/assign-responsibilities')}
            >
              <span className="icon">🧑‍🏫</span>
              <h4>Assign Responsibilities</h4>
              <p>Assign tasks to teaching assistants.</p>
            </div>
          )}
        </div>
      </section>
      </main>
    </div>
  );
}

export default Dashboard;
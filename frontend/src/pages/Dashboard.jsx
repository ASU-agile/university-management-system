import React, { useState, useEffect } from "react";
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

const DUMMY_COURSES = [
  { id: 1, title: 'Basic Science', code: 'ASUX12', semester: 'Selected Topics in...', color: '#1E90FF' },
  { id: 2, title: 'Comp. & Systems Eng.', code: 'CSE233', semester: 'Agile Software Engin...', color: '#3CB371' },
  { id: 3, title: 'Database Systems', code: 'IT320', semester: 'Fall 2025', color: '#DAA520' },
  { id: 4, title: 'Software Engineering', code: 'SE401', semester: 'Spring 2026', color: '#6A5ACD' },
];

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.email.split('@')[0].replace('.', ' ') || 'User';
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">UMS</h2>
        <ul>
          <li>Dashboard</li>
          <li>Students</li>
          <li>Courses</li>
          <li>Staff</li>
          <li onClick={() => navigate('/stafffacilities')}>Facilities</li>
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

        <section className="course-preview-section">
          <h3>Your Current Courses</h3>
          <div className="course-preview-grid">
            {DUMMY_COURSES.map(course => (
              <CourseCard 
                key={course.id} 
                title={course.title} 
                code={course.code}
                semester={course.semester} 
                color={course.color}
              />
            ))}
          </div>
          <button className="view-all-button">View All Courses</button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
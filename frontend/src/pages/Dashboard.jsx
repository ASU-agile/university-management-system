import React, { useState, useEffect } from "react";
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";


function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.email.split('@')[0].replace('.', ' ') || 'User';
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar />

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
          <h3></h3>
          <div className="student-actions-grid">
            <div id="studentgpa" style={{ padding: "25px"}}>
              <span className="icon" style={{ fontSize: "40px" }}>📊</span>
              <h4 style={{ fontSize: "24px", margin: "10px 0" }}>GPA</h4>
              <p style={{ fontSize: "20px", fontWeight: "600" }}>3.5</p>
            </div>

            <div id="studenttraining" style={{ padding: "25px"}}>
              <span className="icon" style={{ fontSize: "40px" }}>📝</span>
              <h4 style={{ fontSize: "24px", margin: "10px 0" }}>Training Weeks</h4>
              <p style={{ fontSize: "20px", fontWeight: "600" }}>12 / 14</p>
            </div>

            <div id="studentwarning" style={{ padding: "25px"}}>
              <span className="icon" style={{ fontSize: "40px" }}>⚠️</span>
              <h4 style={{ fontSize: "24px", margin: "10px 0" }}>Warnings</h4>
              <p style={{ fontSize: "20px", fontWeight: "600" }}>0</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
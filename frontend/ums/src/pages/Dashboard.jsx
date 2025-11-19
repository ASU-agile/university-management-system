// Dashboard.jsx
import React from 'react';
import { useLocation } from "react-router-dom";
import CourseCard from '../components/CourseCard'; // Import the CourseCard component

// --- DUMMY DATA ---
// A few courses to populate the preview
const DUMMY_COURSES = [
  { id: 1, title: 'Basic Science', code: 'ASUX12', semester: 'Selected Topics in...', color: '#1E90FF' },
  { id: 2, title: 'Comp. & Systems Eng.', code: 'CSE233', semester: 'Agile Software Engin...', color: '#3CB371' },
  { id: 3, title: 'Database Systems', code: 'IT320', semester: 'Fall 2025', color: '#DAA520' },
  { id: 4, title: 'Software Engineering', code: 'SE401', semester: 'Spring 2026', color: '#6A5ACD' },
];


function Dashboard() {
  const location = useLocation();
  // Use a sensible default name if the email isn't available or is long
  const rawEmail = location.state?.email || "User";
  // Assuming the 'email' contains the user's name at the start (e.g., "noha.elsayed@...")
  const userName = rawEmail.split('@')[0].replace('.', ' '); 
  
  return (
    <div className="dashboard-container">

      {/* Sidebar - Remains for navigation */}
      <aside className="sidebar">
        <h2 className="sidebar-title">UMS</h2>
        <ul>
          <li>Dashboard</li>
          <li>Students</li>
          <li>Courses</li>
          <li>Staff</li>
          <li>Facilities</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Topbar: Welcome Message */}
        <header className="topbar">
          {/* Capitalize the first letter of the name for a nicer look */}
          <h2 className="welcome-message">
            Welcome, {userName.charAt(0).toUpperCase() + userName.slice(1)}!
          </h2>
          <button className="customize-button">Settings</button>
        </header>

        {/* Course Preview Section */}
        <section className="course-preview-section">
          <h3>Your Current Courses</h3>
          
          <div className="course-preview-grid">
            {/* Map over the dummy data to create a grid of course previews */}
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
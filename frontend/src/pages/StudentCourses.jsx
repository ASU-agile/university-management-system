import React, { useState, useEffect } from "react";
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axiosInstance";
import { getStudentCourses } from "../api/courses";
import Sidebar from "../components/Sidebar";

/*
|--backend
| |-src
| | |--controllers
| | |--db
| | | |--supabase.js
| | |--routes

|--frontend
| |-src
| | |--api
| | |--pages
| | | |--StudentCourses.js
| | |--components

*/


function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getStudentCourses(user.id);
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const getRandomColor = () => {
    const colors = ['#3299ffff', '#3CB371', '#DAA520', '#6A5ACD', '#FF6347', '#20B2AA'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <h2 className="welcome-message">
            Welcome, {user?.email.split('@')[0].replace('.', ' ')}
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
            {courses.map(course => (
              <CourseCard
                key={course.id}
                title={course.subject_name}
                code={course.subject_code}
                semester={"Fall 2025"}
                color={getRandomColor()}
                onClick={() => navigate(`/course/${course.id}`)}
              />
            ))}

          </div>
          <button className="view-all-button">View All Courses</button>
        </section>
      </main>
    </div>
  );
}

export default StudentCourses;
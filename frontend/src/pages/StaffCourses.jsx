import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

function StaffCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.email ? user.email.split("@")[0].replace(".", " ") : "User";

  useEffect(() => {
    const fetchStaffCourses = async () => {
      try {
        // Get all subjects (you may want to filter by staff_id if you have that field)
        const res = await api.get("/api/subjects");
        setCourses(res.data || []);
        // Store in localStorage for reference in other components
        localStorage.setItem("staffCourses", JSON.stringify(res.data || []));
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffCourses();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">UMS</h2>
        <ul>
          <li onClick={() => navigate("/staff/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/staff/courses")}>My Courses</li>
          <li>Training</li>
          <li>Archive</li>
          <li onClick={() => navigate("/stafffacilities")}>Rooms</li>
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
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </header>

        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2>My Courses</h2>
            <button
              onClick={() => navigate("/addsubject")}
              className="btn-primary"
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Create New Course
            </button>
          </div>

          {loading ? (
            <p>Loading courses...</p>
          ) : courses.length === 0 ? (
            <p>No courses yet. Create one to get started!</p>
          ) : (
            <div className="courses-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}>
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="course-card"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                    {course.subject_code}
                  </h3>
                  <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "16px" }}>
                    {course.subject_name}
                  </p>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => navigate(`/staff/courses/${course.id}/upload`)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      📁 Upload Content
                    </button>

                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      👁️ View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StaffCourses;

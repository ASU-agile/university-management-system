import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { getCourseCatalog, registerForSubject } from "../api/courses";
import Sidebar from "../components/Sidebar";

export default function CourseCatalog() {
  const [studentId, setStudentId] = useState(null);
  const [core, setCore] = useState([]);
  const [electives, setElectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  
useEffect(() => {
  const loadUserAndCatalog = async () => {
    // Get user from localStorage
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!localUser || !localUser.id) {
      console.log("No logged-in user found in localStorage");
      return;
    }

    const userId = localUser.id;
    setStudentId(userId);

    try {
      const result = await getCourseCatalog(userId);
      setCore(result.core);
      setElectives(result.electives);
    } catch (err) {
      console.error("Failed to load catalog:", err);
    }

    setLoading(false);
  };

  loadUserAndCatalog();
}, []);




  const handleRegister = async (subjectId) => {
    try {
      const result = await registerForSubject(studentId, subjectId);
      setMsg(result.message);

      // reload catalog after registering
      const res = await getCourseCatalog(studentId);
      setCore(res.core);
      setElectives(res.electives);
    } catch (err) {
      setMsg(err.response?.data?.error || "Registration failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
  <div className="page-container">
    <Sidebar />
    <main className="content">
      <h2>Course Catalog</h2>

      {msg && <p style={{ color: "blue" }}>{msg}</p>}

      <h3>Core Subjects</h3>
      <div className="catalog-grid">
        {core.map((course) => (
          <div className="catalog-card" key={course.id}>
            <h4>{course.subject_name}</h4>
            <p>{course.subject_code}</p>
            <p>{course.credit_hours} credit hours</p>

            {course.registered ? (
              <button className="registered-btn" disabled>Registered</button>
            ) : (
              <button className="register-btn" onClick={() => handleRegister(course.id)}>
                Register
              </button>
            )}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "40px" }}>Electives</h3>
      <div className="catalog-grid">
        {electives.map((course) => (
          <div className="catalog-card" key={course.id}>
            <h4>{course.subject_name}</h4>
            <p>{course.subject_code}</p>
            <p>{course.credit_hours} credit hours</p>

            {course.registered ? (
              <button className="registered-btn" disabled>Registered</button>
            ) : (
              <button className="register-btn" onClick={() => handleRegister(course.id)}>
                Register
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  </div>
);
}

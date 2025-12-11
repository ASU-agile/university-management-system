// frontend/src/pages/CoursePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseMaterials, getStudentCourses } from "../api/courses";

function CoursePage() {
  const { id } = useParams(); // course ID
  const [materials, setMaterials] = useState([]);
  const [course, setCourse] = useState(null); // store course info
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // fetch materials
        const mats = await getCourseMaterials(id);
        setMaterials(mats);

        // fetch course info
        const courses = await getStudentCourses(null); // pass null to get all? or modify API to get by id
        const selectedCourse = courses.find(c => c.id === parseInt(id));
        setCourse(selectedCourse);
      } catch (err) {
        console.error("Failed to fetch course data:", err);
      }
    };
    fetchCourseData();
  }, [id]);

  return (
    <div className="course-page-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">UMS</h2>
        <ul>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/studentcourses")}>Courses</li>
          <li>Training</li>
          <li>Archive</li>
          <li onClick={() => navigate("/stafffacilities")}>Rooms</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="course-main-content">
        {course && (
          <h2>
            {course.subject_code} - {course.subject_name}
          </h2>
        )}

        <div className="course-sections">
          <section className="course-section">
            <h3>Project</h3>
            {materials.length === 0 && <p>No project materials yet.</p>}
            {materials.map(mat => (
              <div className="material-card" key={mat.id}>
                <a
                  href={`https://wlzboctpseaptffewrzb.supabase.co/storage/v1/object/public/materials/${mat.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {mat.file_name}
                </a>
              </div>
            ))}
          </section>

          <section className="course-section">
            <h3>Lectures</h3>
            <p>No lectures uploaded yet.</p>
          </section>

          <section className="course-section">
            <h3>Assignments</h3>
            <p>No assignments uploaded yet.</p>
          </section>

          <section className="course-section">
            <h3>Exams</h3>
            <p>No exams uploaded yet.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CoursePage;

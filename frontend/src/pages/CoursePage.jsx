// frontend/src/pages/CoursePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseMaterials, getStudentCourses } from "../api/courses";
import Sidebar from "../components/Sidebar";

function CoursePage() {
  const { id } = useParams();
  const [materials, setMaterials] = useState([]);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);


  useEffect(() => {
    const fetchCourseData = async () => {
      try {

        const mats = await getCourseMaterials(id);
        setMaterials(mats);

        const ass = await getCourseAssignments(id);
        setAssignments(ass);

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
      <Sidebar />
      
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
            {assignments.length === 0 && <p>No assignments uploaded yet.</p>}

            {assignments.map(a => (
              <div
                className="material-card"
                key={a.id}
                onClick={() => navigate(`/course/${id}/assignment/${a.id}`)}
                style={{ cursor: "pointer" }}
              >
                {a.title}
              </div>
            ))}
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

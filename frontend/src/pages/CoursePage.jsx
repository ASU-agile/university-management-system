// frontend/src/pages/CoursePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseMaterials, getCourseAssignments} from "../api/courses";
import Sidebar from "../components/Sidebar";
import api from "../api/axiosInstance";

function CoursePage() {
  const { id } = useParams();
  const [materials, setMaterials] = useState([]);
  const [course, setCourse] = useState(null);
  const [hideEmptySections, setHideEmptySections] = useState(false);
  const [filterSection, setFilterSection] = useState('all');
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);


  useEffect(() => {
    const fetchCourseData = async () => {
      try {

        const mats = await getCourseMaterials(id);
        setMaterials(mats);

        const ass = await getCourseAssignments(id);
        setAssignments(ass);

        // Get subjects list (server returns all subjects). Using /api/subjects
        const subjectsRes = await api.get(`/api/subjects`);
        const courses = subjectsRes.data || [];
        const selectedCourse = courses.find((c) => c.id === parseInt(id));
        setCourse(selectedCourse);

        // Fetch announcements
        const announcementsRes = await api.get(`/api/announcements/${id}`);
        setAnnouncements(announcementsRes.data || []);
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

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <div />
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <label style={{display:'flex', alignItems:'center', gap:8}}>
              <input type="checkbox" checked={hideEmptySections} onChange={(e) => setHideEmptySections(e.target.checked)} />
              Hide empty sections
            </label>
            <label style={{display:'flex', alignItems:'center', gap:8}}>
              Show:
              <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
                <option value="all">All</option>
                <option value="lecture">Lectures</option>
                <option value="project">Project</option>
                <option value="lab">Lab</option>
                <option value="slides">Slides</option>
                <option value="reading">Reading</option>
                <option value="exam">Exam</option>
                <option value="assignment">assignment</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        </div>

        {/* Announcements Section - Prominently displayed */}
        {announcements.length > 0 && (
          <section style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#856404' }}>
              📢 Announcements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {announcements.map((ann) => (
                <div key={ann.id} style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #ffc107',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px' }}>
                    {ann.title}
                  </h4>
                  <p style={{ margin: '0 0 10px 0', color: '#555', lineHeight: '1.6' }}>
                    {ann.content}
                  </p>
                  <div style={{ fontSize:'12px', color:'#888', display:'flex', gap:'15px' }}>
                    <span>📅 {new Date(ann.created_at).toLocaleDateString()}</span>
                    <span>👤 {ann.author?.user_email?.split('@')[0] || 'Staff'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="course-sections">
          {/** Render main course sections in a fixed order. materials are grouped by content_type. */}
          {/** Sections: Lectures, Project, Assignments, Lab, Slides, Reading, Exams, Other */}
          {[
            { key: 'lecture', title: 'Lectures' },
            { key: 'project', title: 'Project' },
            { key: 'lab', title: 'Lab' },
            { key: 'slides', title: 'Slides' },
            { key: 'reading', title: 'Reading' },
            { key: 'exam', title: 'Exam' },
            { key: 'assignment', title: 'Assignment' },
            { key: 'other', title: 'Other' },
          ].map((section) => {
            // Normalize content_type for comparison
            const key = section.key;
            const items = materials.filter((m) => {
              const ct = (m.content_type || 'project').toString().toLowerCase();
              if (key === 'other') return !['lecture','project','lab','slides','reading','exam','assignment','other'].includes(ct);
              return ct === key;
            });
            // apply filterSection and hideEmptySections controls
            if (filterSection !== 'all' && filterSection !== key) return null;
            if (hideEmptySections && items.length === 0) return null;

            return (
              <section className="course-section" key={key}>
                <h3>{section.title}</h3>
                {items.length === 0 && <p>No {section.title.toLowerCase()} uploaded yet.</p>}

                {items.map((mat) => (
                  <div className="material-card" key={mat.id}>
                    <a
                      href={`https://wlzboctpseaptffewrzb.supabase.co/storage/v1/object/public/materials/${mat.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mat.file_name}
                    </a>
                    <div style={{marginTop:6}}>
                      <span style={{fontSize:12,color:'#444'}}>Section:</span>
                      <span style={{background:'#eef',padding:'3px 8px',borderRadius:8,marginLeft:8,fontSize:12}}>{(mat.content_type||'project')}</span>
                    </div>
                  </div>
                ))}
              </section>
            );
          })}

          {/* Assignment Submission section - shows actual assignments for student submission */}
          <section className="course-section">
            <h3>Assignment Submission</h3>
            {assignments.length === 0 && <p>No assignments available yet.</p>}

            {assignments.map((a) => {
              // Find materials linked to this assignment
              const assignmentMaterials = materials.filter(m => m.assignment_id === a.id);
              
              return (
                <div key={a.id} style={{marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
                  <div
                    onClick={() => navigate(`/course/${id}/assignment/${a.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h4 style={{margin: '0 0 8px 0'}}>{a.title}</h4>
                    <p style={{fontSize:13, color:'#666', margin:'0'}}>
                      Due: {new Date(a.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Grading Button for Staff */}
                  {['professor', 'teaching assistant', 'admin', 'staff'].includes(JSON.parse(localStorage.getItem('user'))?.role) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${id}/assignment/${a.id}/grading`);
                      }}
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        backgroundColor: "#17a2b8",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Grade Submissions
                    </button>
                  )}
                  
                  {/* Show assignment materials below the assignment */}
                  {assignmentMaterials.length > 0 && (
                    <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ddd'}}>
                      <p style={{fontSize:12, color:'#666', margin: '0 0 8px 0', fontWeight: 600}}>Materials:</p>
                      {assignmentMaterials.map((mat) => (
                        <div key={mat.id} style={{marginBottom: '8px'}}>
                          <a
                            href={`https://wlzboctpseaptffewrzb.supabase.co/storage/v1/object/public/materials/${mat.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#0066cc',
                              textDecoration: 'none',
                              fontSize: '13px',
                              display: 'block',
                              padding: '6px 8px',
                              background: '#fff',
                              borderRadius: '4px',
                              border: '1px solid #ddd'
                            }}
                          >
                            📄 {mat.file_name}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}

export default CoursePage;

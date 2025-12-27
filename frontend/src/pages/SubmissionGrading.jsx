import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./SubmissionGrading.css"; // Import styles
import Sidebar from "../components/Sidebar";

function SubmissionGrading() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [editingIds, setEditingIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());

  // Helper to get assignment details
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/api/assignments/${assignmentId}`);
        setAssignment(res.data);
      } catch (err) {
        console.error("Failed to fetch assignment:", err);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const res = await api.get(`/api/assignments/${assignmentId}/submissions`);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeChange = (id, field, value) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
  };

  const toggleEdit = (id) => {
    setEditingIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
    // If we start editing, remove "Saved" badge
    if (savedIds.has(id)) {
        setSavedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }
  };

  const saveGrade = async (submissionId) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    // Validate grade
    if (sub.grade < 0 || sub.grade > 10) {
      alert("Grade must be between 0 and 10");
      return;
    }

    try {
      await api.put(`/api/assignments/submissions/${submissionId}`, {
        grade: sub.grade,
        feedback: sub.feedback,
      });
      // Success logic: Exit edit mode, show saved badge
      setEditingIds(prev => {
        const next = new Set(prev);
        next.delete(submissionId);
        return next;
      });
      setSavedIds(prev => {
        const next = new Set(prev);
        next.add(submissionId);
        return next;
      });

      // Optional: Clear "Saved" badge after 3 seconds
      setTimeout(() => {
        setSavedIds(prev => {
            const next = new Set(prev);
            next.delete(submissionId);
            return next;
        });
      }, 3000);

    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save grade");
    }
  };

  if (loading) return <div>Loading submissions...</div>;

  const submittedList = submissions.filter(s => s.status === "Submitted");
  const notSubmittedList = submissions.filter(s => s.status === "Not Submitted");

  return (
    <div className="grading-container">
      <Sidebar />
      
      <main className="grading-main-content">
        <header className="grading-header">
          <div>
            <h2>{assignment?.title || "Grading Assignment"}</h2>
            <p style={{color: '#6c757d', marginTop: '5px'}}>
              Course: {courseId} • Enrollment: {submissions.length} • Submitted: {submittedList.length}
            </p>
          </div>
          <button onClick={() => navigate(`/course/${courseId}`)} className="back-button">
            &larr; Back to Course
          </button>
        </header>

        <div className="submissions-section">
          <h3>Submitted ({submittedList.length})</h3>
          <div className="submissions-table-card">
            {submittedList.length === 0 ? (
              <p className="empty-text">No submissions yet.</p>
            ) : (
              <table className="grading-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Submitted At</th>
                    <th>File</th>
                    <th>Grade</th>
                    <th>Feedback</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedList.map((sub) => {
                    const studentName = sub.student?.user_name || sub.student?.user_email || "Unknown";
                    const initial = studentName.charAt(0).toUpperCase();
                    const isEditing = editingIds.has(sub.id);
                    const isSaved = savedIds.has(sub.id);

                    return (
                      <tr key={sub.id || sub.submission_id}>
                        <td>
                          <div className="student-name">
                            <div className="student-avatar">{initial}</div>
                            <span>{studentName}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-wrapper">
                            <span className="date-text">
                              {new Date(sub.submitted_at).toLocaleString()}
                            </span>
                            {sub.isLate && <span className="badge-late">LATE</span>}
                          </div>
                        </td>
                        <td>
                          <a
                            href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/submissions/${sub.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            📄 View
                          </a>
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={sub.grade || ""}
                              placeholder="/10"
                              className="grade-input"
                              onChange={(e) => handleGradeChange(sub.id, "grade", e.target.value)}
                            />
                          ) : (
                            <span className="grade-display">
                              {sub.grade !== null && sub.grade !== undefined ? `${sub.grade} / 10` : "-"}
                            </span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <textarea
                              value={sub.feedback || ""}
                              placeholder="Enter feedback..."
                              className="feedback-textarea"
                              onChange={(e) => handleGradeChange(sub.id, "feedback", e.target.value)}
                            />
                          ) : (
                            <p className="feedback-display">
                              {sub.feedback || <span style={{color:'#999', fontStyle:'italic'}}>No feedback</span>}
                            </p>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <button
                              className="save-btn"
                              onClick={() => saveGrade(sub.id)}
                            >
                              Save
                            </button>
                          ) : (
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                              <button
                                className="edit-btn"
                                onClick={() => toggleEdit(sub.id)}
                              >
                                Edit
                              </button>
                              {isSaved && <span className="saved-badge">✅ Saved</span>}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="submissions-section" style={{ marginTop: '40px' }}>
          <h3>Not Submitted ({notSubmittedList.length})</h3>
          <div className="submissions-table-card">
            {notSubmittedList.length === 0 ? (
              <p className="empty-text">Everyone has submitted!</p>
            ) : (
              <table className="grading-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notSubmittedList.map((sub) => {
                     const studentName = sub.student?.user_name || sub.student?.user_email || "Unknown";
                     const initial = studentName.charAt(0).toUpperCase();
                     return (
                      <tr key={sub.student.id}>
                        <td>
                          <div className="student-name">
                            <div className="student-avatar" style={{backgroundColor: '#ccc'}}>{initial}</div>
                            <span>{studentName}</span>
                          </div>
                        </td>
                        <td>
                          <span className="status-badge-missing">Not Submitted</span>
                        </td>
                        <td>
                          <button disabled className="disabled-btn">
                            --
                          </button>
                        </td>
                      </tr>
                     );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SubmissionGrading;

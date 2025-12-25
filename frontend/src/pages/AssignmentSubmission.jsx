import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./AssignmentSubmission.css";

function AssignmentSubmission() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [submissionDetails, setSubmissionDetails] = useState(null);

    const getStudentId = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.id || null;
    };

    useEffect(() => {
        const fetchAssignmentAndSubmission = async () => {
             const studentId = getStudentId();
            try {
                // Fetch assignment details
                const res = await api.get(`/api/assignments/${assignmentId}`);
                setAssignment(res.data);

                // Fetch student submission
                if (studentId) {
                    const subRes = await api.get(
                        `/api/assignments/${assignmentId}/submission?student_id=${studentId}`
                    );
                    if (subRes.data) {
                        console.log("Student Submission Details:", subRes.data);
                        setSubmissionDetails(subRes.data);
                        setSubmitted(true);
                    }
                }

            } catch (err) {
                console.error("Failed to load assignment data:", err);
            }
        };

        fetchAssignmentAndSubmission();
    }, [assignmentId]);

    const submitAssignment = async () => {
        if (!file) {
            alert("Please select a file first");
            return;
        }

        const studentId = getStudentId();

        const formData = new FormData();
        formData.append("file", file); 
        formData.append("assignment_id", assignmentId);
        formData.append("student_id", studentId);

        setUploading(true);

        try {
            const res = await api.post(
                "/api/assignments/submit",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            console.log("Upload response:", res.data);
            setSubmitted(true);
            setSubmissionDetails({
                submitted_at: new Date().toISOString()
            });
            alert("Assignment submitted successfully!");
        } catch (err) {
            console.error("Upload failed:", err);
            alert(`Upload failed: ${err.response?.data?.error || err.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="submission-container">
            <Sidebar />

            <main className="submission-main-content">
                {!assignment && <p>Loading assignment...</p>}

                {assignment && (
                    <>
                        <header className="submission-header">
                             <button 
                                onClick={() => navigate("/studentcourses")}
                                style={{
                                    marginBottom: "15px",
                                    padding: "8px 16px",
                                    border: "1px solid #ddd",
                                    background: "white",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    color: "#555"
                                }}
                            >
                                &larr; Back to Courses
                            </button>
                            <h2>{assignment.title}</h2>
                            <div className="submission-meta">
                                <span>📅 Due: {new Date(assignment.deadline).toLocaleString()}</span>
                                <span>📚 Course ID: {assignment.subject_id}</span>
                            </div>
                        </header>

                        <div className="submission-card">
                            <div className="assignment-description">
                                <h3>Instructions</h3>
                                <p>{assignment.description}</p>
                            </div>

                            {/* Show assignment PDF */}
                            {assignment.file_path && (
                                <div className="pdf-preview">
                                    <iframe
                                        src={`https://wlzboctpseaptffewrzb.supabase.co/storage/v1/object/public/materials/${assignment.file_path}`}
                                        width="100%"
                                        height="500px"
                                        title="Assignment PDF"
                                        style={{ border: "none" }}
                                    />
                                </div>
                            )}

                            {/* Submission Area */}
                            {["professor", "teaching assistant", "admin", "staff"].includes(JSON.parse(localStorage.getItem('user'))?.role) ? (
                                <div className="status-card" style={{ background: '#e9ecef', border: '1px solid #dee2e6' }}>
                                    <div className="status-header">
                                        <span>👀 View Only (Staff)</span>
                                    </div>
                                    <p>You are viewing this assignment as a staff member.</p>
                                    <button 
                                        onClick={() => navigate(`/course/${assignment.subject_id}/assignment/${assignment.id}/grading`)}
                                        style={{
                                            marginTop: '10px',
                                            padding: '8px 16px',
                                            background: '#28a745',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Go to Grading
                                    </button>
                                </div>
                            ) : !submitted ? (
                                <div className="upload-section">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="file-input"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <button
                                        onClick={submitAssignment}
                                        className="submit-btn"
                                        disabled={!file || uploading}
                                    >
                                        {uploading ? "Uploading..." : "Submit Assignment"}
                                    </button>
                                </div>
                            ) : (
                                <div className="status-card submitted">
                                    <div className="status-header">
                                        <span>✅ Submitted Successfully</span>
                                    </div>
                                    <p>
                                        You submitted this assignment on {new Date(submissionDetails?.submitted_at || Date.now()).toLocaleString()}
                                    </p>

                                    {/* Grade & Feedback Display */}
                                    {(submissionDetails?.grade != null || submissionDetails?.feedback) && (
                                        <div className="grade-feedback-section">
                                            {submissionDetails.grade != null && (
                                                <div className="grade-box">
                                                    <span className="grade-label">Grade</span>
                                                    <div className="grade-value">{submissionDetails.grade} / 10</div>
                                                </div>
                                            )}
                                            
                                            {submissionDetails.feedback && (
                                                <div className="feedback-box">
                                                    <span className="grade-label">Feedback</span>
                                                    <p className="feedback-text">{submissionDetails.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default AssignmentSubmission;
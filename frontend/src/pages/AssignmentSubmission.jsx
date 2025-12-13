import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AssignmentSubmission() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);

    const getStudentId = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.id || null;
    };

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/assignments/${assignmentId}`
                );
                setAssignment(res.data);
            } catch (err) {
                console.error("Failed to load assignment:", err);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    const submitAssignment = async () => {
        if (!file) {
            alert("Please select a file first");
            return;
        }

        const studentId = getStudentId();

        console.log("Submitting file:", file, "assignmentId:", assignmentId, "studentId:", studentId);

        const formData = new FormData();
        formData.append("file", file); 
        formData.append("assignment_id", assignmentId);
        formData.append("student_id", studentId);

        console.log("FormData contents:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        setUploading(true);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/assignments/submit",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            console.log("Upload response:", res.data);
            setSubmitted(true);
            alert("Assignment submitted successfully!");
        } catch (err) {
            console.error("Upload failed:", err);
            console.error("Error response:", err.response?.data);
            alert(`Upload failed: ${err.response?.data?.error || err.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="course-page-container">
            {/* Sidebar */}
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

            {/* Main content */}
            <main className="course-main-content">
                {!assignment && <p>Loading...</p>}

                {assignment && (
                    <div className="assignment-content">
                        <h2>{assignment.title}</h2>
                        <p>{assignment.description}</p>
                        <h4>
                            Deadline: {new Date(assignment.deadline).toLocaleString()}
                        </h4>

                        {/* Show assignment PDF from Supabase */}
                        {assignment.file_path && (
                            <div style={{ margin: "20px 0" }}>
                                <iframe
                                    src={`https://wlzboctpseaptffewrzb.supabase.co/storage/v1/object/public/materials/${assignment.file_path}`}
                                    width="100%"
                                    height="600px"
                                    title="Assignment PDF"
                                />
                            </div>
                        )}

                        {/* Upload submission */}
                        <div className="upload-box" style={{ marginTop: "20px" }}>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    console.log("File selected:", selectedFile);
                                    setFile(selectedFile);
                                }}
                            />
                            <button
                                onClick={submitAssignment}
                                className="submit-btn"
                                disabled={!file || uploading}
                                style={{ 
                                    marginLeft: "10px", 
                                    padding: "6px 12px", 
                                    cursor: uploading ? "not-allowed" : "pointer",
                                    opacity: uploading ? 0.6 : 1
                                }}
                            >
                                {uploading ? "Uploading..." : "Submit"}
                            </button>
                        </div>

                        {submitted && (
                            <p style={{ color: "green", marginTop: "15px" }}>
                                ✅ Submitted successfully!
                            </p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default AssignmentSubmission;
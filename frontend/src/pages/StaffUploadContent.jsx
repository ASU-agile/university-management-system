import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../pages/AdminRoomManager.css";

function StaffUploadContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);
  const [contentType, setContentType] = useState("project");
  const [assignmentDeadline, setAssignmentDeadline] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.email.split("@")[0].replace(".", " ") || "User";

  // Fetch course details and existing materials
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Get course info from localStorage or fetch it
        const courses = JSON.parse(localStorage.getItem("staffCourses")) || [];
        const course = courses.find((c) => c.id === parseInt(courseId));

        if (course) {
          setCourseName(course.subject_name);
          setCourseCode(course.subject_code);
        }

        // Fetch existing materials
        const res = await api.get(`/api/courses/${courseId}/materials`);
        setMaterials(res.data || []);

        // Fetch announcements
        const announcementsRes = await api.get(`/api/announcements/${courseId}`);
        setAnnouncements(announcementsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    // If content_type is assignment, deadline is required
    if (contentType === "assignment" && !assignmentDeadline) {
      setMessage("Please set a deadline for the assignment");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_id", courseId);
    formData.append("content_type", contentType);
    
    // Add professor_id if available
    if (user?.id) {
      formData.append("professor_id", user.id);
    }

    // Add assignment deadline and title if this is an assignment
    if (contentType === "assignment") {
      formData.append("assignment_deadline", assignmentDeadline);
      formData.append("assignment_title", `${file.name.split('.')[0]} Assignment`);
    }

    setUploading(true);
    setMessage("");

    try {
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
      }
      
      console.log("Uploading file:", file.name, "to courseId:", courseId);
      
      // Make POST request with FormData. The axios interceptor will handle
      // Content-Type to allow browser to set the multipart boundary.
      const res = await api.post("/api/courses/upload-content", formData);

      console.log("Upload response:", res.data);
      setMessage(`✅ File uploaded successfully!`);
      setFile(null);

      // Refresh materials list
      const updatedMaterials = await api.get(`/api/courses/${courseId}/materials`);
      setMaterials(updatedMaterials.data || []);

      // Clear input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Upload failed - Full error:", err);
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
      setMessage(
        `❌ Upload failed: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId, filePath) => {
    if (!window.confirm(`Delete this material?`)) return;

    try {
      // Delete from storage and database
      await api.delete(`/api/courses/${courseId}/materials/${materialId}`, {
        data: { file_path: filePath },
      });

      setMessage("✅ Material deleted successfully!");

      // Refresh materials list
      const updatedMaterials = await api.get(`/api/courses/${courseId}/materials`);
      setMaterials(updatedMaterials.data || []);
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage(`❌ Delete failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementTitle || !announcementContent) {
      setAnnouncementMessage("Please provide both title and content");
      return;
    }

    try {
      const payload = {
        course_id: courseId,
        created_by: user?.id,
        title: announcementTitle,
        content: announcementContent,
      };
      
      console.log("Creating announcement with payload:", payload);
      
      await api.post("/api/announcements", payload);

      setAnnouncementMessage("✅ Announcement created successfully!");
      setAnnouncementTitle("");
      setAnnouncementContent("");

      // Refresh announcements
      const announcementsRes = await api.get(`/api/announcements/${courseId}`);
      setAnnouncements(announcementsRes.data || []);
    } catch (err) {
      console.error("Create announcement failed:", err);
      setAnnouncementMessage(`❌ Failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      await api.delete(`/api/announcements/${announcementId}`, {
        data: { created_by: user?.id },
      });

      setAnnouncementMessage("✅ Announcement deleted successfully!");

      // Refresh announcements
      const announcementsRes = await api.get(`/api/announcements/${courseId}`);
      setAnnouncements(announcementsRes.data || []);
    } catch (err) {
      console.error("Delete announcement failed:", err);
      setAnnouncementMessage(`❌ Failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">UMS</h2>
        <ul>
          <li onClick={() => navigate("/staffdashboard")}>Dashboard</li>
          <li onClick={() => navigate("/courses")}>My Courses</li>
          <li onClick={() => navigate('/staff-profile', { state: { staff: user } })}>Office Hours</li>
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

        <div className="course-upload-container">
          <button
            onClick={() => navigate("/courses")}
            style={{
              marginBottom: "20px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            ← Back to Courses
          </button>

          <h2>
            Upload Course Content: {courseCode && `${courseCode} - `}
            {courseName}
          </h2>

          {/* Upload Section */}
          <section className="upload-section">
            <h3>Upload New Material</h3>

            <div className="upload-form">
              <div className="form-group">
                <label htmlFor="contentType">Section:</label>
                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="lecture">Lecture</option>
                  <option value="project">Project</option>
                  <option value="lab">Lab</option>
                  <option value="slides">Slides</option>
                  <option value="reading">Reading</option>
                  <option value="video">Video</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">assignment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {contentType === "assignment" && (
                <div className="form-group">
                  <label htmlFor="assignmentDeadline">Deadline:</label>
                  <input
                    id="assignmentDeadline"
                    type="date"
                    value={assignmentDeadline}
                    onChange={(e) => setAssignmentDeadline(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="fileInput">Select File:</label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx,.mp4,.mov"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    console.log("File selected:", selectedFile);
                    setFile(selectedFile);
                  }}
                />
              </div>

              <button
                onClick={handleUpload}
                className="btn-primary"
                disabled={!file || uploading}
                style={{
                  padding: "10px 20px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>

              {message && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    borderRadius: "4px",
                    backgroundColor: message.includes("✅")
                      ? "#d4edda"
                      : "#f8d7da",
                    color: message.includes("✅") ? "#155724" : "#721c24",
                  }}
                >
                  {message}
                </div>
              )}
            </div>
          </section>

          {/* Announcements Section */}
          <section className="announcements-section">
            <h3>📢 Course Announcements</h3>

            <div className="announcement-form">
              <h4>Create New Announcement</h4>
              <div className="form-group">
                <label htmlFor="announcementTitle">Title:</label>
                <input
                  id="announcementTitle"
                  type="text"
                  placeholder="e.g., Midterm Exam Schedule"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="announcementContent">Content:</label>
                <textarea
                  id="announcementContent"
                  rows="4"
                  placeholder="Enter announcement details..."
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                />
              </div>

              <button
                onClick={handleCreateAnnouncement}
                className="btn-primary"
                style={{
                  padding: "10px 20px",
                }}
              >
                Post Announcement
              </button>

              {announcementMessage && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    borderRadius: "4px",
                    backgroundColor: announcementMessage.includes("✅")
                      ? "#d4edda"
                      : "#f8d7da",
                    color: announcementMessage.includes("✅") ? "#155724" : "#721c24",
                  }}
                >
                  {announcementMessage}
                </div>
              )}
            </div>

            <div className="announcements-list">
              <h4>Posted Announcements ({announcements.length})</h4>
              {announcements.length === 0 ? (
                <p>No announcements yet.</p>
              ) : (
                <div className="announcements-grid">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="announcement-item">
                      <h5>{ann.title}</h5>
                      <p>{ann.content}</p>
                      <div className="announcement-meta">
                        <span>Posted: {new Date(ann.created_at).toLocaleString()}</span>
                        <span>By: {ann.author?.user_email || "Unknown"}</span>
                      </div>
                      {user?.id === ann.created_by && (
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="btn-delete"
                          style={{ marginTop: "10px", padding: "6px 12px" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Materials List Section */}
          <section className="materials-section">
            <h3>Course Materials ({materials.length})</h3>

            {materials.length === 0 ? (
              <p>No materials uploaded yet.</p>
            ) : (
              <div className="materials-grid">
                {materials.map((mat) => (
                  <div key={mat.id} className="material-item">
                    <div className="material-info">
                      <h4>{mat.file_name}</h4>
                      <p className="material-date">
                        Uploaded: {new Date(mat.uploaded_at).toLocaleDateString()}
                      </p>
                      <p style={{marginTop:6,fontSize:12,color:'#444'}}>
                        <strong>Section:</strong> <span style={{background:'#eef',padding:'2px 6px',borderRadius:6,marginLeft:8}}>{mat.content_type || 'project'}</span>
                      </p>
                    </div>
                    <div className="material-actions">
                      <a
                        href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/materials/${mat.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(mat.id, mat.file_path)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <style>{`
        .course-upload-container {
          padding: 20px;
        }

        .upload-section,
        .materials-section {
          margin: 30px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 500px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-weight: 600;
        }

        .form-group select,
        .form-group input[type="file"] {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .material-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .material-info h4 {
          margin: 0 0 10px 0;
          color: #333;
          word-break: break-word;
        }

        .material-type,
        .material-date {
          margin: 5px 0;
          font-size: 13px;
          color: #666;
        }

        .material-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .btn-view,
        .btn-delete {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          flex: 1;
          text-align: center;
          text-decoration: none;
        }

        .btn-view {
          background: #28a745;
          color: white;
          transition: background 0.3s;
        }

        .btn-view:hover {
          background: #218838;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
          transition: background 0.3s;
        }

        .btn-delete:hover {
          background: #c82333;
        }

        .announcements-section {
          margin: 30px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .announcement-form {
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 8px;
        }

        .announcement-form h4 {
          margin-top: 0;
          margin-bottom: 15px;
        }

        .announcement-form textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }

        .announcement-form input[type="text"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .announcements-list {
          margin-top: 20px;
        }

        .announcements-grid {
          display: grid;
          gap: 15px;
          margin-top: 15px;
        }

        .announcement-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #007bff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .announcement-item h5 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 16px;
        }

        .announcement-item p {
          margin: 0 0 10px 0;
          color: #555;
          line-height: 1.5;
        }

        .announcement-meta {
          display: flex;
          gap: 20px;
          font-size: 12px;
          color: #888;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }
      `}</style>
    </div>
  );
}

export default StaffUploadContent;

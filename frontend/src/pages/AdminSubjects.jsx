import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSubjectCard from "../components/AdminSubjectCard";
import api from "../api/axiosInstance";

function AdminSubjects() {
  const [subjects, setSubjects] = useState({ core: [], elective: [] });
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/api/subjects?group=true");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching subjects");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (subject) => {
    navigate("/add-subject", { state: { subject } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/api/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting subject");
    }
  };

  return (
    <div className="admin-subjects-page" style={{ padding: "20px" }}>
      {/* Back to Dashboard button above the header */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
      <span
        onClick={() => navigate("/admin/dashboard")}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          color: "#007bff",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ← Back to Dashboard
      </span>
    </div>


      <h2>Subjects Management</h2>

      {/* Add Subject Button */}
      <button
        onClick={() => navigate("/add-subject")}
        style={{ marginBottom: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Add Subject
      </button>

      {/* Core Subjects */}
      <section>
        <h3>Core Subjects</h3>
        {subjects.core.length === 0 && <p>No core subjects found.</p>}
        <div className="subjects-grid">
          {subjects.core.map((sub) => (
            <AdminSubjectCard
              key={sub.id}
              subject={sub}
              onEdit={() => handleEdit(sub)}
              onDelete={() => handleDelete(sub.id)}
            />
          ))}
        </div>
      </section>

      {/* Elective Subjects */}
      <section>
        <h3>Elective Subjects</h3>
        {subjects.elective.length === 0 && <p>No elective subjects found.</p>}
        <div className="subjects-grid">
          {subjects.elective.map((sub) => (
            <AdminSubjectCard
              key={sub.id}
              subject={sub}
              onEdit={() => handleEdit(sub)}
              onDelete={() => handleDelete(sub.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminSubjects;

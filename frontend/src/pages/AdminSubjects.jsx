import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSubjectCard from "../components/AdminSubjectCard";
import api from "../api/axiosInstance"; // your existing axios instance

function AdminSubjects() {
  const [subjects, setSubjects] = useState({ core: [], elective: [] });
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/api/subjects?group=true");
      setSubjects(res.data); // { core: [...], elective: [...] }
    } catch (err) {
      console.error(err);
      alert("Error fetching subjects");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (subject) => {
    // Keep the inline edit if you want, you can later navigate to an edit page
    // For now, you can implement inline edit logic here or navigate to edit form
    alert("Edit functionality can be implemented here.");
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
    <div className="admin-subjects-page">
      <h2>Subjects Management</h2>

      {/* Navigate to the separate Add Subject Form page */}
      <button onClick={() => navigate("/add-subject")}>Add Subject</button>

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

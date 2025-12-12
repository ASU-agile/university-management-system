import React, { useEffect, useState } from "react";
import AdminSubjectCard from "../components/AdminSubjectCard";
import SubjectForm from "../components/SubjectForm";
import api from "../api/axiosInstance"; // your existing axios instance

function AdminSubjects() {
  const [subjects, setSubjects] = useState({ core: [], elective: [] });
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/api/subjects?group=true"); // <-- added /api
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
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/api/subjects/${id}`); // <-- added /api
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting subject");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSubject(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingSubject) {
        // update
        await api.patch(`/api/subjects/${editingSubject.id}`, formData); // <-- added /api
      } else {
        // create
        await api.post("/api/subjects", formData); // <-- added /api
      }
      handleFormClose();
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving subject");
    }
  };

  return (
    <div className="admin-subjects-page">
      <h2>Subjects Management</h2>
      <button onClick={() => setShowForm(true)}>Add Subject</button>

      {showForm && (
        <SubjectForm
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingSubject}
        />
      )}

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

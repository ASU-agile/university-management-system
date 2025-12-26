import React, { useState } from "react";
import SubjectForm from "../components/SubjectForm";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./AddSubjectForm.css";

function AddSubjectForm() {
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try {
      await api.post("/api/subjects", formData);
      alert("Subject created successfully!");
      setFormKey(prev => prev + 1); // resets the form
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating subject");
    }
  };

  return (
    <div className="add-subject-container">
      <Sidebar />
      
      <main className="add-subject-main">
        <header className="add-subject-header">
          <h2>Create New Course</h2>
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            &larr; Back to Dashboard
          </button>
        </header>

        <div className="form-card">
          <SubjectForm
            key={formKey} // ensures form resets after creation
            onSubmit={handleFormSubmit}
          />
        </div>
      </main>
    </div>
  );
}

export default AddSubjectForm;

import React, { useState } from "react";
import SubjectForm from "../components/SubjectForm";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

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
    <div className="app-container" style={{ position: "relative" }}>
      {/* Back to Dashboard Button at Top-Right */}
      <button
        type="button"
        onClick={() => navigate("/admin/dashboard")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          color: "#007bff",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ← Back to Dashboard
      </button>

      <h2 style={{ marginBottom: "20px" }}>Add New Subject</h2>
      <SubjectForm
        key={formKey} // ensures form resets after creation
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default AddSubjectForm;

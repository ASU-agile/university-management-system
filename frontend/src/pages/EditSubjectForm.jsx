import React, { useState } from "react";
import SubjectForm from "../components/SubjectForm";
import api from "../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

function EditSubjectForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get subject to edit from navigate state
  const subjectToEdit = location.state?.subject;

  if (!subjectToEdit) {
    // If someone navigates directly, redirect back
    navigate("/courses");
    return null;
  }

  const [formKey, setFormKey] = useState(0);

  const handleFormSubmit = async (formData) => {
    try {
      await api.patch(`/api/subjects/${subjectToEdit.id}`, formData);
      alert("Subject updated successfully!");
      setFormKey(prev => prev + 1); // reset form (optional)
      navigate("/courses"); // go back to subjects list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating subject");
    }
  };

  return (
    <div className="app-container" style={{ position: "relative" }}>
      <span
        onClick={() => navigate("/courses")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          color: "#007bff",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ← Back to Subjects
      </span>

      <h2 style={{ marginBottom: "20px" }}>Edit Subject</h2>
      <SubjectForm
        key={formKey}
        initialData={subjectToEdit}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default EditSubjectForm;

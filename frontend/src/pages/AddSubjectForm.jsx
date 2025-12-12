import React, { useState } from "react";
import SubjectForm from "../components/SubjectForm";
import api from "../api/axiosInstance";

function AddSubjectForm() {
  // We'll use a key to force SubjectForm to remount after submission
  const [formKey, setFormKey] = useState(0);

  const handleFormSubmit = async (formData) => {
    try {
      await api.post("/api/subjects", formData);
      alert("Subject created successfully!");
      
      // Reset the form by changing the key
      setFormKey(prev => prev + 1);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating subject");
    }
  };

  return (
    <div className="add-subject-page">
      <h2>Add New Subject</h2>
      <SubjectForm 
        key={formKey} // ensures form resets after creation
        onSubmit={handleFormSubmit} 
      />
    </div>
  );
}

export default AddSubjectForm;

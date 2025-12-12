import React, { useState, useEffect } from "react";

function SubjectForm({ onClose, onSubmit, initialData }) {
  const [subjectName, setSubjectName] = useState(initialData?.subject_name || "");
  const [subjectCode, setSubjectCode] = useState(initialData?.subject_code || "");
  const [creditHours, setCreditHours] = useState(initialData?.credit_hours || "");
  const [majorIdInput, setMajorIdInput] = useState(
    initialData?.major_id ? initialData.major_id.toString() : ""
  );
  const [isElective, setIsElective] = useState(initialData?.is_elective || false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const major_id = parseInt(majorIdInput);
    if (!subjectName || !subjectCode || !creditHours || isNaN(major_id)) {
      alert("Name, code, credit hours, and major ID are required");
      return;
    }

    // Send object compatible with backend PATCH or POST
    const payload = {
      subject_name: subjectName,
      subject_code: subjectCode,
      credit_hours: parseInt(creditHours),
      is_elective: isElective,
    };

    // Include major_id differently depending on create vs edit
    if (initialData) {
      payload.major_id = major_id; // PATCH uses major_id
    } else {
      payload.major_ids = [major_id]; // POST uses major_ids array
    }

    onSubmit(payload);
  };

  return (
    <div className="subject-form">
      <h3>{initialData ? "Edit Subject" : "Add Subject"}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
        </label>

        <label>
          Code:
          <input
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            required
          />
        </label>

        <label>
          Credit Hours:
          <input
            type="number"
            value={creditHours}
            onChange={(e) => setCreditHours(e.target.value)}
            required
          />
        </label>

        <label>
          Major ID:
          <input
            type="number"
            value={majorIdInput}
            onChange={(e) => setMajorIdInput(e.target.value)}
            placeholder="e.g., 1"
            required
          />
        </label>

        <label>
          Elective:
          <input
            type="checkbox"
            checked={isElective}
            onChange={(e) => setIsElective(e.target.checked)}
          />
        </label>

        <div style={{ marginTop: "10px" }}>
          <button type="submit">{initialData ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

export default SubjectForm;

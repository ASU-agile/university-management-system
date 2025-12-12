import React, { useState, useEffect } from "react";

function SubjectForm({ onClose, onSubmit, initialData }) {
  const [subjectName, setSubjectName] = useState(initialData?.subject_name || "");
  const [subjectCode, setSubjectCode] = useState(initialData?.subject_code || "");
  const [creditHours, setCreditHours] = useState(initialData?.credit_hours || "");
  const [majorIdsInput, setMajorIdsInput] = useState(
    initialData?.major_id ? initialData.major_id.toString() : ""
  );
  const [isElective, setIsElective] = useState(initialData?.is_elective || false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse the string into an array of numbers
    const major_ids = majorIdsInput
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id)); // remove any invalid entries

    if (!subjectName || !subjectCode || !creditHours || major_ids.length === 0) {
      alert("subject_name, subject_code, credit_hours, and major_ids (array) are required");
      return;
    }

    onSubmit({
      subject_name: subjectName,
      subject_code: subjectCode,
      credit_hours: parseInt(creditHours),
      major_ids,
      is_elective: isElective,
    });
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
          Major IDs (comma separated):
          <input
            value={majorIdsInput}
            onChange={(e) => setMajorIdsInput(e.target.value)}
            placeholder="e.g., 1,2,3"
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
          <button type="button" onClick={onClose} style={{ marginLeft: 5 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubjectForm;

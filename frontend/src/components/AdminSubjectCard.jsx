import React from "react";

function AdminSubjectCard({ subject, onEdit, onDelete }) {
  const color = subject.is_elective ? "#FFD700" : "#3CB371"; // elective = gold, core = green

  return (
    <div className="course-card" style={{ backgroundColor: color, position: "relative" }}>
      <h4 className="card-title">{subject.subject_name}</h4>
      <p className="card-subtitle">{subject.subject_code}</p>
      <p className="card-semester">Credits: {subject.credit_hours}</p>
      <p className="card-semester">Major ID: {subject.major_id}</p>

      {/* Admin buttons */}
      <div style={{ position: "absolute", top: 5, right: 5 }}>
        <button onClick={onEdit} style={{ marginRight: 5 }}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default AdminSubjectCard;

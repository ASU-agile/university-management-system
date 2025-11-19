// CourseCard.jsx
import React from 'react';

// Props: title, code, semester, and a color for the background
function CourseCard({ title, code, semester, color }) {
  return (
    // Style applied directly for simplicity, but you should use a CSS class
    <div className="course-card" style={{ backgroundColor: color }}>
      <h4 className="card-title">{title}</h4>
      <p className="card-subtitle">{code}</p>
      <p className="card-semester">{semester}</p>
    </div>
  );
}

export default CourseCard;
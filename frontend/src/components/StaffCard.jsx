import React from "react";

function StaffCard({ staff }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        marginBottom: "12px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
      }}
    >
      <div style={{ fontSize: "40px" }}>👤</div>

      <div>
        <h4 style={{ margin: 0 }}>
          {staff.user_name || staff.name || "Unknown"}
        </h4>

        <p style={{ margin: "4px 0", fontWeight: "600" }}>
          {staff.role || "Staff"}   {/* ← This is all you need */}
        </p>

        <p style={{ margin: 0, color: "#555" }}>
          {staff.user_email || staff.email || "No email"}
        </p>
      </div>
    </div>
  );
}

export default StaffCard;
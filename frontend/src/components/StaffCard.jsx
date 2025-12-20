import React from "react";

function StaffCard({ staff }) {
  const getRoleName = (type_id) => {
    if (type_id === 1) return "Professor";
    if (type_id === 4) return "Teaching Assistant";
    return "Staff";
  };

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
      }}
    >
      <div style={{ fontSize: "40px" }}>👤</div>

      <div>
        <h4 style={{ margin: 0 }}>
          {staff.name || staff.user_name || "Unknown"}
        </h4>

        <p style={{ margin: "4px 0", fontWeight: "600" }}>
          {getRoleName(staff.type_id)}
        </p>

        <p style={{ margin: 0, color: "#555" }}>
          {staff.email || staff.user_email || "No email"}
        </p>
      </div>
    </div>
  );
}

export default StaffCard;

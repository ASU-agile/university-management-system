import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function StaffProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const staff = location.state?.staff;

  if (!staff) {
    navigate("/staff-directory");
    return null;
  }

  const getRoleName = (type_id) => {
    if (type_id === 1) return "Professor";
    if (type_id === 4) return "Teaching Assistant";
    return "Staff";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <span
        onClick={() => navigate("/staff-directory")}
        style={{
          color: "#007bff",
          textDecoration: "underline",
          cursor: "pointer",
          display: "inline-block",
          marginBottom: "20px"
        }}
      >
        ← Back to Staff Directory
      </span>

      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          fontSize: "50px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px"
        }}>👤</div>

        <h2>{staff.user_name || staff.name || "Unknown"}</h2>
        <p><strong>Email:</strong> {staff.user_email || staff.email}</p>
        <p><strong>Role:</strong> {getRoleName(staff.type_id)}</p>

        <hr style={{ margin: "20px 0" }} />

        <h3>Biography</h3>
        <p>
          This is a dummy biography for {staff.user_name || staff.name}. 
          Passionate about education, supporting students, and contributing to the academic community. Experienced in classroom management, mentoring, and fostering a positive learning environment.
        </p>
      </div>
    </div>
  );
}

export default StaffProfile;

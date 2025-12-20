import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function StaffDirectory() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get("/api/staff");
        setStaff(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load staff directory");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading staff directory...</p>;
  }

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Back to Dashboard (same style you used before) */}
      <span
        onClick={() => navigate("/dashboard")}
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
        ← Back to Dashboard
      </span>

      <h2 style={{ marginBottom: "20px" }}>Staff Directory</h2>

      {staff.length === 0 ? (
        <p>No staff members found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Email</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id}>
                <td style={tdStyle}>{member.name}</td>
                <td style={tdStyle}>{member.role}</td>
                <td style={tdStyle}>{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

export default StaffDirectory;

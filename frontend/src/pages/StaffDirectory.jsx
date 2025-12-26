import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import StaffCard from "../components/StaffCard";

function StaffDirectory() {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get("/api/staff");
        setStaff(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load staff directory");
      }
    };

    fetchStaff();
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">UMS</h2>
        <ul>
          {isAdmin ? (
            <>
              <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
              <li onClick={() => navigate("/students")}>Students</li>
              <li onClick={() => navigate("/courses")}>Courses</li>
              <li onClick={() => navigate("/staff")}>Staff</li>
              <li onClick={() => navigate("/settings")}>Settings</li>
            </>
          ) : (
            <>
              <li onClick={() => navigate("/staffdashboard")}>Dashboard</li>
              <li onClick={() => navigate("/staff/courses")}>My Courses</li>
              <li onClick={() => navigate("/staff-profile", { state: { staff: user } })}>Office Hours</li>
              <li>Training</li>
              <li>Archive</li>
              <li onClick={() => navigate("/stafffacilities")}>Rooms</li>
              <li>Settings</li>
            </>
          )}
        </ul>
      </aside>

      <main className="main-content">
        <div style={{ padding: "30px" }}>
          <h2 style={{ marginBottom: "20px" }}>Staff Directory</h2>

          {staff.length === 0 && <p>No staff found.</p>}

          {staff.map((person) => (
            <div
              key={person.id}
              onClick={() => navigate("/staff-profile", { state: { staff: person } })}
              style={{ cursor: "pointer", marginBottom: "15px" }}
            >
              <StaffCard staff={person} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default StaffDirectory;

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

  return (
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
  );
}

export default StaffDirectory;

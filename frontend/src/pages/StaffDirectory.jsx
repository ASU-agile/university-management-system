import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import StaffCard from "../components/StaffCard";

function StaffDirectory() {
  const [staff, setStaff] = useState([]);

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
        <StaffCard key={person.id} staff={person} />
      ))}
    </div>
  );
}

export default StaffDirectory;

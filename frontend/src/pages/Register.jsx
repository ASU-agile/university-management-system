// frontend/src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default
  const [major, setMajor] = useState("");
  const [majors, setMajors] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch majors from backend
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/majors");
        setMajors(data);
      } catch (err) {
        console.error("Failed to fetch majors:", err);
      }
    };
    fetchMajors();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate student major
    if (role === "student" && !major) {
      setMessage("Please select a major for the student.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/auth/register", {
        email,
        password,
        role,
        major_id: role === "student" ? major : undefined,
      });

      setMessage("Registration successful! You can now login.");
      setEmail("");
      setPassword("");
      setRole("student");
      setMajor("");
    }catch (err) {
  console.error("ERROR DATA:", err.response?.data);
  console.error("ERROR STATUS:", err.response?.status);

  setMessage(
    err.response?.data?.error ||
    JSON.stringify(err.response?.data) ||
    "Registration failed"
  );
}


  };

  return (
    <div className="app-container">
      <h2>Register Users</h2>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ROLE DROPDOWN */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="professor">Professor</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="teaching assistant">Teaching Assistant</option>
          
        </select>

        {/* MAJOR DROPDOWN - only for students */}
        {role === "student" && (
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
          >
            <option value="">Select Major</option>
            {majors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.major_name}
              </option>
            ))}
          </select>
        )}

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>

      <p style={{ marginTop: "20px" }}>
        <Link
          to="/admin/dashboard"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          Back to Dashboard
        </Link>
      </p>
    </div>
  );
}

export default Register;

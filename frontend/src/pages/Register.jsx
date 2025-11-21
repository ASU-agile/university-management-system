import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // default
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('http://localhost:5000/auth/register', { 
        email, 
        password,
        role                // <-- IMPORTANT!
      });

      setMessage('Registration successful! You can now login.');
    } catch (err) {
      console.error('Registration error:', err);
      setMessage('Registration failed');
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
        <option value="student">Student</option>
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Register</button>
    </form>

    <p>{message}</p>

    {/* 🔵 BACK TO DASHBOARD LINK */}
    <p style={{ marginTop: "20px" }}>
      <Link to="/admin/dashboard" style={{ color: "blue", textDecoration: "underline" }}>
        Back to Dashboard
      </Link>
    </p>
  </div>
);

}

export default Register;
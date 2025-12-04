
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import React, { useState, useEffect } from "react";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('http://localhost:5000/auth/login', { email, password });

      // 1️⃣ Store user in localStorage for persistent login
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2️⃣ Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'staff') {
        navigate('/staffdashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setMessage('Login failed');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="app-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Login;
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">UMS</h2>
      <ul>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/catalog")}>Courses</li>
        <li onClick={() => navigate("/studentcourses")}>My Courses</li>
        <li onClick={() => navigate("/staff-directory")}>Staff Directory</li>
        <li onClick={() => navigate("/training")}>Training</li>
        <li onClick={() => navigate("/archive")}>Archive</li>
        <li onClick={() => navigate("/stafffacilities")}>Rooms</li>
        <li onClick={() => navigate("/settings")}>Settings</li>
      </ul>
    </aside>
  );
}


import React from "react";
import AdminRoomManager from "./pages/AdminRoomManager";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";   
import ViewRooms from "./pages/ViewRooms";
import StaffDashboard from "./pages/StaffDashboard";
import StudentCourses from "./pages/StudentCourses";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />  
        <Route path="/adminfacilities" element={<AdminRoomManager />} /> 
        <Route path="/stafffacilities" element={<ViewRooms />} />
        <Route path="/staffdashboard" element={<StaffDashboard />}/>
        <Route path="/studentcourses" element={<StudentCourses />}/>
      </Routes>
    </Router>
  );
}

export default App;


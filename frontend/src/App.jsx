import React from "react";
import AdminRoomManager from "./pages/AdminRoomManager";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubjects from "./pages/AdminSubjects"; // <-- import your admin subjects page
import Register from "./pages/Register";   
import ViewRooms from "./pages/ViewRooms";
import StaffDashboard from "./pages/StaffDashboard";
import StudentCourses from "./pages/StudentCourses";
import AddSubjectForm from "./pages/AddSubjectForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/courses" element={<AdminSubjects />} /> 
        <Route path="/addsubject" element={<AddSubjectForm />} /> {/* form-only page */}
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

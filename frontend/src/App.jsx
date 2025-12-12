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
import CoursePage from "./pages/CoursePage";
import AddSubjectForm from "./pages/AddSubjectForm";
import EditSubjectForm from "./pages/EditSubjectForm";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/courses" element={<AdminSubjects />} /> 
        <Route path="/add-subject" element={<AddSubjectForm />} /> {/* form-only page */}
        <Route path="/edit-subject" element={<EditSubjectForm />} />
        <Route path="/register" element={<Register />} />  
        <Route path="/adminfacilities" element={<AdminRoomManager />} /> 
        <Route path="/stafffacilities" element={<ViewRooms />} />
        <Route path="/staffdashboard" element={<StaffDashboard />}/>
        <Route path="/studentcourses" element={<StudentCourses />}/>
        <Route path="/course/:id" element={<CoursePage />} />

      </Routes>
    </Router>
  );
}

export default App;

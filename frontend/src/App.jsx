
import React from "react";
import AdminRoomManager from "./pages/AdminRoomManager";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import AdminSubjects from "./pages/AdminSubjects";
import ViewRooms from "./pages/ViewRooms";
import StaffDashboard from "./pages/StaffDashboard";
import StudentCourses from "./pages/StudentCourses";
import CoursePage from "./pages/CoursePage";
import AddSubjectForm from "./pages/AddSubjectForm";
import EditSubjectForm from "./pages/EditSubjectForm";
import CourseCatalog from "./pages/CourseCatalog";
import AssignmentSubmission from "./pages/AssignmentSubmission";
import StaffCourses from "./pages/StaffCourses";
import StaffUploadContent from "./pages/StaffUploadContent";
import StaffDirectory from "./pages/StaffDirectory";
import StaffProfile from "./pages/StaffProfile";
import SubmissionGrading from "./pages/SubmissionGrading";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/courses" element={<AdminSubjects />} />
        <Route path="/add-subject" element={<AddSubjectForm />} /> {/* form-only page */}
        <Route path="/addsubject" element={<AddSubjectForm />} /> {/* alternative route */}
        <Route path="/edit-subject" element={<EditSubjectForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminfacilities" element={<AdminRoomManager />} />
        <Route path="/stafffacilities" element={<ViewRooms />} />
        <Route path="/staffdashboard" element={<StaffDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/courses" element={<StaffCourses />} />
        <Route path="/staff/courses/:courseId/upload" element={<StaffUploadContent />} />
        <Route path="/studentcourses" element={<StudentCourses />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/course/:courseId/assignment/:assignmentId" element={<AssignmentSubmission />} />
        <Route path="/staff-directory" element={<StaffDirectory />} />
        <Route path="/staff-profile" element={<StaffProfile />} />
        <Route path="/course/:courseId/assignment/:assignmentId/grading" element={<SubmissionGrading />} />

      </Routes>
    </Router>
  );
}

export default App;

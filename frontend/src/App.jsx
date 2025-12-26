import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ===== Layouts ===== */
import StudentLayout from "./layouts/StudentLayout";
import StaffLayout from "./layouts/StaffLayout";
import AdminLayout from "./layouts/AdminLayout";

/* ===== Public Pages ===== */
import Login from "./pages/Login";
import Register from "./pages/Register";

/* ===== Student Pages ===== */
import Dashboard from "./pages/Dashboard";
import CourseCatalog from "./pages/CourseCatalog";
import StudentCourses from "./pages/StudentCourses";
import CoursePage from "./pages/CoursePage";
import AssignmentSubmission from "./pages/AssignmentSubmission";
import ViewRooms from "./pages/ViewRooms";

/* ===== Staff Pages ===== */
import StaffDashboard from "./pages/StaffDashboard";
import StaffCourses from "./pages/StaffCourses";
import StaffUploadContent from "./pages/StaffUploadContent";
import StaffDirectory from "./pages/StaffDirectory";
import StaffProfile from "./pages/StaffProfile";

/* ===== Admin Pages ===== */
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubjects from "./pages/AdminSubjects";
import AddSubjectForm from "./pages/AddSubjectForm";
import EditSubjectForm from "./pages/EditSubjectForm";
import AdminRoomManager from "./pages/AdminRoomManager";

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= STUDENT LAYOUT (NEW) ================= */}
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/student/catalog" element={<CourseCatalog />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/course/:id" element={<CoursePage />} />
          <Route
            path="/student/course/:courseId/assignment/:assignmentId"
            element={<AssignmentSubmission />}
          />
          <Route path="/student/rooms" element={<ViewRooms />} />
        </Route>

        {/* ================= STAFF LAYOUT (NEW) ================= */}
        <Route element={<StaffLayout />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/courses" element={<StaffCourses />} />
          <Route
            path="/staff/courses/:courseId/upload"
            element={<StaffUploadContent />}
          />
        </Route>

        {/* ================= ADMIN LAYOUT (NEW) ================= */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminSubjects />} />
          <Route path="/admin/subjects/add" element={<AddSubjectForm />} />
          <Route path="/admin/subjects/edit" element={<EditSubjectForm />} />
          <Route path="/admin/rooms" element={<AdminRoomManager />} />
        </Route>

        {/* ================= LEGACY ROUTES (KEEP FOR PHASE 1) ================= */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/studentcourses" element={<StudentCourses />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route
          path="/course/:courseId/assignment/:assignmentId"
          element={<AssignmentSubmission />}
        />
        <Route path="/staffdashboard" element={<StaffDashboard />} />
        <Route path="/stafffacilities" element={<ViewRooms />} />
        <Route path="/courses" element={<AdminSubjects />} />
        <Route path="/add-subject" element={<AddSubjectForm />} />
        <Route path="/addsubject" element={<AddSubjectForm />} />
        <Route path="/edit-subject" element={<EditSubjectForm />} />
        <Route path="/adminfacilities" element={<AdminRoomManager />} />
      </Routes>
    </Router>
  );
}

export default App;

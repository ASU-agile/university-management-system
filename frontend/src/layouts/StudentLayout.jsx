import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function StudentLayout() {
  return (
    <div className="layout-container">
      <Sidebar />

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;

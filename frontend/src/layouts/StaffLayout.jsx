import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function StaffLayout() {
  return (
    <div className="layout-container">
      <Sidebar />

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default StaffLayout;

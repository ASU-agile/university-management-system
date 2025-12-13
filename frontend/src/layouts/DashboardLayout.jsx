import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "../App.css"; // ensures layout css is loaded

export default function DashboardLayout() {
  return (
    <div className="layout-container">
      <Sidebar />

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

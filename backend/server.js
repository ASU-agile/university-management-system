//backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import roomsRoute from "./src/routes/rooms.js";
import adminRoomRoute from "./src/routes/adminRoom.js";
import authRoutes from "./src/routes/auth.js";
import coursesRoutes from "./src/routes/courses.js";
import subjectsRoute from "./src/routes/subjects.js";
import assignmentsRoutes from "./src/routes/assignments.js";
import staffRoutes from "./src/routes/staff.js";
import taTasksRoutes from './src/routes/taTasks.js';
import announcementsRoutes from './src/routes/announcements.js';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// routes
app.use("/api/rooms", roomsRoute);
app.use("/api/admin-rooms", adminRoomRoute);
app.use("/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/subjects", subjectsRoute);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/staff", staffRoutes);
app.use('/ta-tasks', taTasksRoutes);
app.use('/api/announcements', announcementsRoutes);

// root test endpoint
app.get("/", (req, res) => res.send("University Management API is running."));
// simple health check
app.get("/_health", (req, res) => res.json({ status: "ok", pid: process.pid }));

// process-level diagnostic hooks to capture crashes and exits
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", reason, promise);
});
process.on("exit", (code) => {
  console.log(`Process exiting with code: ${code}`);
});
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
});
process.on("SIGINT", () => {
  console.log("SIGINT received");
});

const PORT = process.env.PORT || 5000;

console.log("Starting server...");

// Debug: beforeExit to capture why node decides to terminate
process.on("beforeExit", (code) => {
  console.log(`beforeExit with code: ${code}`);
  try {
    const handles = process._getActiveHandles();
    console.log("Active handles count:", handles.length);
  } catch (e) {
    console.log("Could not enumerate active handles", e);
  }
});

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Keep-alive heartbeat (Required to prevent process exit)
const hb = setInterval(() => { }, 10000);

server.on("close", () => {
  console.log("Server closed");
  clearInterval(hb);
});

// expose server on process for interactive debugging (optional)
process.server = server;
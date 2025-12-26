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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
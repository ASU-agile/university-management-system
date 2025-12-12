import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import roomsRoute from "./src/routes/rooms.js";
import adminRoomRoute from "./src/routes/adminRoom.js";
import authRoutes from "./src/routes/auth.js";
import subjectsRoute from "./src/routes/subjects.js"; // << import subjects route

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/rooms", roomsRoute);
app.use("/api/admin-rooms", adminRoomRoute);
app.use("/auth", authRoutes);
app.use("/api/subjects", subjectsRoute); // << mount subjects route

// root test endpoint
app.get("/", (req, res) => res.send("University Management API is running."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

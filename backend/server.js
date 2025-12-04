import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import roomsRoute from "./src/routes/rooms.js";
import adminRoomRoute from "./src/routes/adminRoom.js";
import authRoutes from "./src/routes/auth.js";  // import your auth route

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/rooms", roomsRoute);
app.use("/api/admin-rooms", adminRoomRoute);
app.use("/api/test", testRoutes);
app.use("/auth", authRoutes);   // mount auth

// root test endpoint
app.get("/", (req, res) => res.send("University Management API is running."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

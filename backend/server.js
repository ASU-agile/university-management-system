import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import roomsRoute from "./src/routes/rooms.js";
import testRoutes from "./src/routes/tests.routes.js";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// root test endpoint
app.get("/", (req, res) => res.send("University Management API is running."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

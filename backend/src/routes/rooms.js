// backend/src/routes/room.js
import express from "express";
import { getRooms, bookRoom } from "../controllers/roomsController.js";

const router = express.Router();

// GET /api/rooms → list all rooms
router.get("/", getRooms);

// POST /api/rooms/book → book a room
router.post("/book", bookRoom);

export default router;
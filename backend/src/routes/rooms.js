import express from "express";
import { getRooms, bookRoom } from "../controllers/roomsController.js";

const router = express.Router();

// GET /api/rooms
router.get("/", getRooms);

// POST /api/rooms/book
router.post("/book", bookRoom);

export default router;

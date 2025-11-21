// backend/src/routes/adminRoom.js
import express from "express";
import { getRoomsWithAttributes, addRoom, editRoom, deleteRoom } from "../controllers/adminRoomController.js";

const router = express.Router();

router.get("/", getRoomsWithAttributes);   // GET /api/admin-rooms
router.post("/", addRoom);                 // POST /api/admin-rooms
router.put("/:id", editRoom);              // PUT /api/admin-rooms/:id
router.delete("/:id", deleteRoom);         // DELETE /api/admin-rooms

export default router;

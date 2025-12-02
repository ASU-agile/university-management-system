// backend/src/controllers/roomsController.js
import { supabase } from "../db/supabase.js";

// GET /api/rooms
export const getRooms = async (req, res) => {
  try {
    const { booking_date, start_time, end_time } = req.query;

    // Fetch all rooms
    const { data: rooms, error: roomError } = await supabase
      .from("rooms")
      .select(`
        id,
        room_no,
        room_capacity,
        buildings(building_name)
      `);

    if (roomError) throw roomError;

    // Fetch bookings only if date/time filters provided
    let bookings = [];
    if (booking_date && start_time && end_time) {
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_date", booking_date)
        .gte("end_time", start_time)
        .lte("start_time", end_time);

      if (bookingError) throw bookingError;
      bookings = bookingData;
    }

    // Compute availability per room
    const roomsWithAvailability = rooms.map((room) => {
      const overlapping = bookings.some((b) => b.room_id === room.id);
      return {
        ...room,
        room_availability: !overlapping,
      };
    });

    res.status(200).json(roomsWithAvailability);
  } catch (err) {
    console.error("Error fetching rooms:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// POST /api/rooms/book
export const bookRoom = async (req, res) => {
  try {
    const { room_id, user_id, booking_date, start_time, end_time } = req.body;

    const userId = user_id || 1; // dummy user

    // 1️⃣ Check for overlapping bookings on the same date
    const { data: existingBookings, error: checkError } = await supabase
      .from("bookings")
      .select("*")
      .eq("room_id", room_id)
      .eq("booking_date", booking_date)
      .gte("end_time", start_time)
      .lte("start_time", end_time);

    if (checkError) throw checkError;

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "Room is already booked at this time." });
    }

    // 2️⃣ Insert booking
    const { data: newBooking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          room_id,
          user_id: userId,
          booking_date,
          start_time,
          end_time,
        },
      ])
      .select();

    if (bookingError) throw bookingError;

    // ✅ Do NOT update room_availability to avoid dirty writes
    // Optional: you can keep room_availability logic later with transactions

    res.status(200).json({ message: "Room booked successfully!", booking: newBooking[0] });
  } catch (err) {
    console.error("Booking error:", err.message);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};
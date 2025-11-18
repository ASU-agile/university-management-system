import { supabase } from "../db/supabase.js";



// GET /api/rooms
export const getRooms = async (req, res) => {
  const { data, error } = await supabase
    .from("rooms")
    .select(`
      id,
      room_no,
      room_capacity,
      room_availability,
      buildings(building_name)
    `);

  if (error) {
    console.error("Error fetching rooms:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};


// POST /api/rooms/book
export const bookRoom = async (req, res) => {
  const { room_id, user_id, booking_date, start_time, end_time } = req.body;

  // Step 1: Insert into bookings table
  const { error: bookingError } = await supabase.from("bookings").insert([
    {
      room_id,
      user_id,
      booking_date,
      start_time,
      end_time,
    },
  ]);

  if (bookingError) {
    console.error("Booking error:", bookingError.message);
    return res.status(400).json({ error: bookingError.message });
  }

  // Step 2: Update room availability
  const { error: updateError } = await supabase
    .from("rooms")
    .update({ room_availability: false })
    .eq("id", room_id);

  if (updateError) {
    console.error("Room update error:", updateError.message);
    return res.status(500).json({ error: updateError.message });
  }

  res.json({ message: "Room booked successfully!" });
};

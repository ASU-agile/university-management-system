import React, { useEffect, useState } from "react";
import { getRooms, bookRoom } from "../api/rooms";

const ViewRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMessage, setBookingMessage] = useState("");

  // Fetch rooms from backend
  const fetchRooms = async () => {
    setLoading(true);
    const data = await getRooms();
    setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleBook = async (roomId) => {
    // For now, we will use a dummy user_id
    const bookingData = {
      room_id: roomId,
      user_id: 1, // replace with logged-in user later
      booking_date: new Date().toISOString().split("T")[0],
      start_time: "09:00",
      end_time: "10:00",
    };

    const response = await bookRoom(bookingData);
    if (response.message) {
      setBookingMessage(`Room ${roomId} booked successfully!`);
      fetchRooms(); // refresh list to update availability
    } else {
      setBookingMessage("Booking failed. Try again.");
    }

    // Clear message after 3 seconds
    setTimeout(() => setBookingMessage(""), 3000);
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Rooms</h2>
      {bookingMessage && <p>{bookingMessage}</p>}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Room No</th>
            <th>Building</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.room_no}</td>
              <td>{room.buildings?.building_name || "N/A"}</td>
              <td>{room.room_capacity}</td>
              <td>{room.room_availability ? "Yes" : "No"}</td>
              <td>
                {room.room_availability ? (
                  <button onClick={() => handleBook(room.id)}>Book</button>
                ) : (
                  "Unavailable"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRooms;

import React, { useEffect, useState } from "react";
import { getRooms, bookRoom } from "../api/rooms";

const ViewRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMessage, setBookingMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // date picker
  const [startTime, setStartTime] = useState("09:00");  // start time picker
  const [endTime, setEndTime] = useState("10:00");      // end time picker

  // Fetch rooms from backend
  const fetchRooms = async () => {
    setLoading(true);
    const data = await getRooms();
    setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
    // Default booking date: today
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleBook = async (roomId) => {
    const bookingData = {
      room_id: roomId,
      user_id: 1, // dummy user for now
      booking_date: selectedDate,
      start_time: startTime,
      end_time: endTime,
    };

    const response = await bookRoom(bookingData);

    // Display backend message
    if (response.message) {
      setBookingMessage(response.message);
      fetchRooms(); // refresh room list
    } else if (response.error) {
      setBookingMessage(response.error);
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

      {/* Booking controls */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Date:{" "}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>{" "}
        <label>
          Start Time:{" "}
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>{" "}
        <label>
          End Time:{" "}
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>

      {/* Success/Error message */}
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

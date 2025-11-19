import React, { useEffect, useState } from "react";
import { getRooms, bookRoom } from "../api/rooms";

const ViewRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMessage, setBookingMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); 
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const fetchRooms = async () => {
    setLoading(true);
    const data = await getRooms();
    setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleBook = async (roomId) => {
    const bookingData = {
      room_id: roomId,
      user_id: 1,
      booking_date: selectedDate,
      start_time: startTime,
      end_time: endTime,
    };

    const response = await bookRoom(bookingData);

    if (response.message) {
      setBookingMessage(response.message);
      fetchRooms();
    } else if (response.error) {
      setBookingMessage(response.error);
    } else {
      setBookingMessage("Booking failed. Try again.");
    }

    setTimeout(() => setBookingMessage(""), 3000);
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div className="App-header">
      {/* Navigation */}
      <nav>
        <a href="/" className="App-link">Home</a>
        <a href="/view-rooms" className="App-link">View Rooms</a>
      </nav>

      {/* Page title */}
      <h2>Available Rooms</h2>

      {/* Booking controls */}
      <div className="booking-controls">
        <label>
          Date:{" "}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Start Time:{" "}
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End Time:{" "}
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>

      {/* Messages */}
      {bookingMessage && <p className="booking-message">{bookingMessage}</p>}

      {/* Rooms table */}
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table>
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
    </div>
  );
};

export default ViewRooms;

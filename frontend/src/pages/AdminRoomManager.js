import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminRoomManager.css";

function AdminRoomManager() {
  const [rooms, setRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [form, setForm] = useState({
    roomNumber: "",
    buildingId: "",
    floorNumber: "",
    roomCapacity: "",
    roomType: "",
    availability: true,
  });

  // fetch rooms on load
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRoom = async () => {
  try {
    await axios.post("http://localhost:5000/rooms", {
      ...form,
      floorNumber: parseInt(form.floorNumber),
      roomCapacity: parseInt(form.roomCapacity)
    });
    setShowAddModal(false);
    setForm({
      roomNumber: "",
      buildingId: "",
      floorNumber: "",
      roomCapacity: "",
      roomType: "",
      availability: true,
    });
    fetchRooms();
  } catch (err) {
    console.error(err); // check console for details
  }
};


  const handleEditRoom = (room) => {
    setCurrentRoom(room);
    setForm({
      roomNumber: room.room_no,
      buildingId: room.building_id,
      floorNumber: room.floorNumber || "",
      roomCapacity: room.room_capacity,
      roomType: room.roomType || "",
      availability: room.room_availability,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/rooms/${currentRoom.id}`, form);
      setShowEditModal(false);
      setCurrentRoom(null);
      setForm({
        roomNumber: "",
        buildingId: "",
        floorNumber: "",
        roomCapacity: "",
        roomType: "",
        availability: true,
      });
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:5000/rooms/${room.id}`);
        fetchRooms();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Room Manager</h2>
      <button onClick={() => setShowAddModal(true)}>Add Room</button>

      <div className="room-list-container">
        <table>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Building ID</th>
              <th>Floor Number</th>
              <th>Capacity</th>
              <th>Room Type</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.room_no}</td>
                <td>{room.building_id}</td>
                <td>{room.floorNumber || ""}</td>
                <td>{room.room_capacity}</td>
                <td>{room.roomType || ""}</td>
                <td>{room.room_availability ? "Available" : "Unavailable"}</td>
                <td>
                  <button onClick={() => handleEditRoom(room)}>Edit</button>
                  <button onClick={() => handleDeleteRoom(room)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="modal">
          <h3>Add Room</h3>
          <input
            name="roomNumber"
            placeholder="Room Number"
            value={form.roomNumber}
            onChange={handleInputChange}
          />
          <input
            name="buildingId"
            placeholder="Building ID"
            value={form.buildingId}
            onChange={handleInputChange}
          />
          <input
            name="floorNumber"
            placeholder="Floor Number"
            value={form.floorNumber}
            onChange={handleInputChange}
          />
          <input
            name="roomCapacity"
            placeholder="Capacity"
            value={form.roomCapacity}
            onChange={handleInputChange}
          />
          <input
            name="roomType"
            placeholder="Room Type"
            value={form.roomType}
            onChange={handleInputChange}
          />
          <div className="modal-buttons">
            <button onClick={handleAddRoom}>Add</button>
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && (
        <div className="modal">
          <h3>Edit Room</h3>
          <input
            name="roomNumber"
            placeholder="Room Number"
            value={form.roomNumber}
            onChange={handleInputChange}
          />
          <input
            name="buildingId"
            placeholder="Building ID"
            value={form.buildingId}
            onChange={handleInputChange}
          />
          <input
            name="floorNumber"
            placeholder="Floor Number"
            value={form.floorNumber}
            onChange={handleInputChange}
          />
          <input
            name="roomCapacity"
            placeholder="Capacity"
            value={form.roomCapacity}
            onChange={handleInputChange}
          />
          <input
            name="roomType"
            placeholder="Room Type"
            value={form.roomType}
            onChange={handleInputChange}
          />
          <div className="modal-buttons">
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRoomManager;

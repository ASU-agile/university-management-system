import axios from "axios";
import "./AdminRoomManager.css";
import React, { useState, useEffect } from "react";

export default function AdminRoomManager() {
  const API = import.meta.env.VITE_API_URL; // Use same API for ALL requests

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

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API}/api/admin-rooms`);
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      roomNumber: "",
      buildingId: "",
      floorNumber: "",
      roomCapacity: "",
      roomType: "",
      availability: true,
    });
  };

  const handleAddRoom = async () => {
    try {
      await axios.post(`${API}/api/admin-rooms`, {
        room_no: form.roomNumber,
        building_id: form.buildingId,
        floorNumber: parseInt(form.floorNumber),
        room_capacity: parseInt(form.roomCapacity),
        roomType: form.roomType,
        room_availability: form.availability,
      });

      setShowAddModal(false);
      resetForm();
      fetchRooms();
    } catch (err) {
      console.error("Error adding room:", err);
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
      await axios.put(`${API}/api/admin-rooms/${currentRoom.id}`, {
        room_no: form.roomNumber,
        building_id: form.buildingId,
        floorNumber: parseInt(form.floorNumber),
        room_capacity: parseInt(form.roomCapacity),
        roomType: form.roomType,
        room_availability: form.availability,
      });

      setShowEditModal(false);
      setCurrentRoom(null);
      resetForm();
      fetchRooms();
    } catch (err) {
      console.error("Error editing room:", err);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`${API}/api/admin-rooms/${room.id}`);
      fetchRooms();
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Admin Room Manager</h2>
      <button onClick={() => setShowAddModal(true)}>Add Room</button>

      <div className="room-list-container">
        <table>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Building ID</th>
              <th>Floor</th>
              <th>Capacity</th>
              <th>Type</th>
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

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal">
          <h3>Add Room</h3>

          <input name="roomNumber" placeholder="Room Number" value={form.roomNumber} onChange={handleInputChange} />
          <input name="buildingId" placeholder="Building ID" value={form.buildingId} onChange={handleInputChange} />
          <input name="floorNumber" placeholder="Floor Number" value={form.floorNumber} onChange={handleInputChange} />
          <input name="roomCapacity" placeholder="Capacity" value={form.roomCapacity} onChange={handleInputChange} />
          <input name="roomType" placeholder="Room Type" value={form.roomType} onChange={handleInputChange} />

          <div className="modal-buttons">
            <button onClick={handleAddRoom}>Add</button>
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal">
          <h3>Edit Room</h3>

          <input name="roomNumber" placeholder="Room Number" value={form.roomNumber} onChange={handleInputChange} />
          <input name="buildingId" placeholder="Building ID" value={form.buildingId} onChange={handleInputChange} />
          <input name="floorNumber" placeholder="Floor Number" value={form.floorNumber} onChange={handleInputChange} />
          <input name="roomCapacity" placeholder="Capacity" value={form.roomCapacity} onChange={handleInputChange} />
          <input name="roomType" placeholder="Room Type" value={form.roomType} onChange={handleInputChange} />

          <div className="modal-buttons">
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

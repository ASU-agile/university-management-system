// frontend/src/components/RoomCard.jsx
export default function RoomCard({ room }) {
  return (
    <div style={{ border: "1px solid gray", padding: "1rem", margin: "0.5rem" }}>
      <h3>Room {room.room_no}</h3>
      <p>Capacity: {room.room_capacity}</p>
      <p>Available: {room.room_availability ? "Yes" : "No"}</p>
      {/* Book button will be added later */}
    </div>
  );
}
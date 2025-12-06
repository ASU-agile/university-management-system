// frontend/src/api/rooms.js
import axios from "axios";

// Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL + "/api";

export const getRooms = async (booking_date, start_time, end_time) => {
  const res = await fetch(
    `${BASE_URL}/rooms?booking_date=${booking_date}&start_time=${start_time}&end_time=${end_time}`
  );
  return res.json();
};

export const bookRoom = async (bookingData) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/rooms/book`, bookingData);
    return data;
  } catch (error) {
    console.error("Error booking room:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Booking failed" };
  }
};

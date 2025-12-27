// frontend/src/api/rooms.js
import axiosInstance from "./axiosInstance";

const BASE_URL = "/api";

export const getRooms = async (booking_date, start_time, end_time) => {
  const res = await axiosInstance.get(
    `${BASE_URL}/rooms?booking_date=${booking_date}&start_time=${start_time}&end_time=${end_time}`
  );
  return res.data;
};

export const bookRoom = async (bookingData) => {
  try {
    const { data } = await axiosInstance.post(`${BASE_URL}/rooms/book`, bookingData);
    return data;
  } catch (error) {
    console.error("Error booking room:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Booking failed" };
  }
};

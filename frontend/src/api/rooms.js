import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getRooms = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/rooms`);
    return data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
};

export const bookRoom = async (bookingData) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/rooms/book`, bookingData);
    return data;
  } catch (error) {
    console.error("Error booking room:", error);
    return { error: "Booking failed" };
  }
};

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import roomsRoute from "./src/routes/rooms.js";
import testRoutes from "./src/routes/test.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomsRoute);
app.use("/api/test", testRoutes);



app.post("/api/rooms/book", (req, res) => {
  console.log("Booking data received:", req.body);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

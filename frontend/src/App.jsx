import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ViewRooms from "./pages/ViewRooms";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px" }}>
        <Link to="/">Home</Link> | <Link to="/rooms">View Rooms</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>University System Home</h1>} />
        <Route path="/rooms" element={<ViewRooms />} />
      </Routes>
    </Router>
  );
}

export default App;


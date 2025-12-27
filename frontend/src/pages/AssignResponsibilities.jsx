// frontend/src/pages/AssignResponsibilities.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance"; // your configured axios instance

function AssignResponsibilities() {
  const user = JSON.parse(localStorage.getItem("user")); // logged-in professor
  const [tas, setTAs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    ta_id: "",
    course_id: "",
    task_title: "",
    task_description: "",
    due_date: ""
  });
  const [message, setMessage] = useState("");

  // Fetch TAs and professor courses on mount
  useEffect(() => {
    const fetchTAs = async () => {
      try {
        const res = await axios.get("/ta-tasks/tas");
        setTAs(res.data);
      } catch (err) {
        console.error("Failed to fetch TAs", err);
      }
    };
    
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`/ta-tasks/courses?professorId=${user.id}`);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };

    fetchTAs();
    fetchCourses();
  }, [user.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.ta_id || !form.course_id || !form.task_title || !form.task_description) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post("/ta-tasks/assign", { ...form, professor_id: user.id });
      setMessage("Task assigned successfully!");
      setForm({ ta_id: "", course_id: "", task_title: "", task_description: "", due_date: "" });
    } catch (err) {
      console.error("Failed to assign task", err);
      setMessage("Failed to assign task.");
    }
  };
  useEffect(() => {
  console.log("Logged-in user:", user);
  console.log("Professor ID sent to backend:", user?.id);
}, []);
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2>Assign Responsibilities to TAs</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Teaching Assistant:</label>
        <select name="ta_id" value={form.ta_id} onChange={handleChange} required>
          <option value="">Select TA</option>
          {tas.length === 0 && <option disabled>No TAs available</option>}
          {tas.map((ta) => (
            <option key={ta.id} value={ta.id}>{ta.user_name}</option>
          ))}
        </select>

        <label>Course:</label>
<select name="course_id" value={form.course_id} onChange={handleChange} required>
  <option value="">Select Course</option>
  {courses.length === 0 && <option disabled>No courses assigned</option>}
  {courses.map((course) => (
    <option key={course.id} value={course.id}>{course.subject_name}</option> // <-- changed from course_name
  ))}
</select>


        <label>Task Title:</label>
        <input type="text" name="task_title" value={form.task_title} onChange={handleChange} required />

        <label>Task Description:</label>
        <textarea name="task_description" value={form.task_description} onChange={handleChange} required />

        <label>Due Date (optional):</label>
        <input type="date" name="due_date" value={form.due_date} onChange={handleChange} />

        <button type="submit" style={{ marginTop: "10px" }}>Assign Task</button>
      </form>
    </div>
  );
}

export default AssignResponsibilities;

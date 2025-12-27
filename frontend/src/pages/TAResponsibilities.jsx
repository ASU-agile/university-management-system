// frontend/src/pages/TAResponsibilities.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

function TAResponsibilities() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [tasks, setTasks] = useState([]);
  
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/ta-tasks/ta/${user.id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
    console.log(tasks);

  };
  useEffect(() => {
  console.log("Logged-in TA user:", user);
  console.log("TA ID sent to backend:", user?.id);
  fetchTasks();
}, []);

  const markComplete = async (taskId) => {
    try {
      await axios.patch(`/ta-tasks/${taskId}/complete`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>My Responsibilities</h2>
      {tasks.length === 0 ? <p>No tasks assigned.</p> :
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Task</th>
              <th>Description</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.course_name}</td>
                <td>{task.task_title}</td>
                <td>{task.task_description}</td>
                <td>{task.status}</td>
                <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
                <td>
                  {task.status === 'pending' && (
                    <button onClick={() => markComplete(task.id)}>Mark Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

export default TAResponsibilities;

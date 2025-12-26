import { useState } from 'react';
import { assignTask } from '../api/taTasks';

export default function AssignTATask({ courseId, taId }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const professor_id = user?.id;

  const [task, setTask] = useState('');
  const [hours, setHours] = useState('');

  const handleAssign = async () => {
    await assignTask({
      course_id: courseId,
      professor_id,
      ta_id: taId,
      task_description: task,
      hours
    });

    setTask('');
    setHours('');
    alert('Task assigned');
  };

  return (
    <div>
      <h3>Assign Task to TA</h3>

      <textarea
        placeholder="Task description"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <input
        placeholder="Office/Lab hours"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <button onClick={handleAssign}>Assign</button>
    </div>
  );
}

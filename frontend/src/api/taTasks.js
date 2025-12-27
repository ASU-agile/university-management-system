import axios from './axiosInstance';

// Professor assigns task
export const assignTask = (task) =>
  axios.post('/ta-tasks', task);

// TA gets their tasks
export const getMyTasks = (ta_id) =>
  axios.get(`/ta-tasks?ta_id=${ta_id}`);

// TA completes task
export const completeTask = (id) =>
  axios.put(`/ta-tasks/${id}/complete`);

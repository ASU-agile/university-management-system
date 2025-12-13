//frontend/src/api/courses.js

import axios from "./axiosInstance"; // use your axios instance

const BASE_URL = "http://localhost:5000/api";

export const getStudentCourses = async (id) => {
  const res = await axios.get(`${BASE_URL}/courses/student/${id}`);
  return res.data;
};


export const getCourseMaterials = async (courseId) => {
  const { data } = await axios.get(`${BASE_URL}/courses/${courseId}/materials`);
  return data;
};

export const getCourseCatalog = async (studentId) => {
  const res = await axios.get(`${BASE_URL}/courses/catalog/${studentId}`);
  return res.data;
};

export const registerForSubject = async (studentId, subjectId) => {
  const res = await axios.post(`${BASE_URL}/courses/register/${studentId}`, {
    subject_id: subjectId
  });
  return res.data;
};


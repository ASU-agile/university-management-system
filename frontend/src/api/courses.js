//frontend/src/api/courses.js

import axios from "./axiosInstance"; // use your axios instance

// axiosInstance already has baseURL 'http://localhost:5000'
// So we just need to append '/api/...'
const BASE_URL = "/api";

export const getStudentCourses = async (id) => {
  const res = await axios.get(`${BASE_URL}/courses/student/${id}`);
  return res.data;
};


export const getCourseMaterials = async (courseId) => {
  const { data } = await axios.get(`${BASE_URL}/courses/${courseId}/materials`);
  return data;
};

export const getCourseAssignments = async (courseId) => {
  const { data } = await axios.get(`${BASE_URL}/courses/${courseId}/assignments`);
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

export const uploadCourseContent = async (courseId, file, contentType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("subject_id", courseId);
  formData.append("content_type", contentType);

  // Axios interceptor will handle Content-Type for FormData automatically
  const { data } = await axios.post(`${BASE_URL}/courses/upload-content`, formData);
  return data;
};

export const deleteCourseContent = async (courseId, materialId, filePath) => {
  const { data } = await axios.delete(
    `${BASE_URL}/courses/${courseId}/materials/${materialId}`,
    {
      data: { file_path: filePath },
    }
  );
  return data;
};

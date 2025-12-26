//frontend/src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', // Use env var or default to local
});

// Set default JSON header for most requests, but allow FormData to override
axiosInstance.interceptors.request.use((config) => {
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  } else {
    // For FormData, delete the default Content-Type so axios/browser can set multipart boundary
    delete config.headers['Content-Type'];
  }
  return config;
});

export default axiosInstance;
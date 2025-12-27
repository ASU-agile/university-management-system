//frontend/src/api/axiosInstance.js
import axios from 'axios';

let apiURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Ensure protocol is present to avoid relative path resolution
if (apiURL && !apiURL.startsWith('http://') && !apiURL.startsWith('https://')) {
  apiURL = `https://${apiURL}`;
}

console.log('API Base URL:', apiURL);

const axiosInstance = axios.create({
  baseURL: apiURL,
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
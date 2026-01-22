import axios from 'axios';

const api = axios.create({
  baseURL: 'https://social-media-jev1.onrender.com/api',
});

// Tự động thêm token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const BACKEND_DOMAIN = "https://social-media-jev1.onrender.com";
export default api;
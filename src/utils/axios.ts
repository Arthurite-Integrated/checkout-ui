import axios from 'axios';
import env from '../config/env';
import { useAuthStore } from '../store';

// Create axios instance
const api = axios.create({
  baseURL: env.VITE_SERVER_URL, // Your API base URL
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
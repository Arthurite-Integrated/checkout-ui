import axios from 'axios';
import env from '../config/env';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: env.VITE_SERVER_URL, // your API base URL
});

// Set up an interceptor to add the token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authData');
    console.log(token)

    // If the token exists, attach it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    const navigate = useNavigate(); // For React Router v6
    if (error.response && error.response.status === 401) {
      toast.error('Please login again to continue');
      localStorage.removeItem('authToken');
      navigate('/login'); // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Export axios instance to use throughout the app
export default axiosInstance;

import { create } from 'zustand'
import Server from './../server'
import { Navigate } from 'react-router-dom'

interface Auth {
  data: null | object
  login: (email: string, password: string) => void,
  register: (first_name: string, last_name: string, email: string, password: string) => void,
  isAuthenticated: () => boolean
  logout: () => void
}

// Helper to get data from localStorage
const getStoredData = () => {
  const stored = localStorage.getItem('authData');
  return stored ? JSON.parse(stored) : null;
};

const useAuth = create<Auth>((set) => ({
  data: getStoredData(),
  isAuthenticated: () => !!getStoredData(),
  login: async (email: string, password: string) => {
    const { data, message, status } = await Server.LoginAdmin(email, password);
    if (status !== 'OK') return alert(message);
    localStorage.setItem('authData', JSON.stringify(data));
    set({ data });
    alert('User Logged in ✅');
  },
  register: async (first_name: string, last_name: string, email: string, password: string) => {
    const { data, message, status } = await Server.RegisterAdmin(first_name, last_name, email, password);
    if (status !== 'CREATED') { 
      alert(message);
      return false
    }
    localStorage.setItem('authData', JSON.stringify(data));
    // set({ data });
    return true;
  },
  logout: () => {
    localStorage.removeItem('authData');
    set({ data: null });
  },
}))

export default useAuth
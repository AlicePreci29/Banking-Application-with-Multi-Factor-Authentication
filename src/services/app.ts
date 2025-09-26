import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginuser = (data: { username: string; password: string; pin: string }) =>
  API.post('/auth/login', data);

export const signupuser = (data: { username: string; password: string; pin: string }) =>
  API.post('/auth/signup', data);

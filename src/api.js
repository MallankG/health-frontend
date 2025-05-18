// src/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL + '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('JWT token in interceptor:', token); // Debug log
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// src/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL + '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

export default api;

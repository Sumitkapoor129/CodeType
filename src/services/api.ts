import axios from 'axios';

// Default to localhost for development if no env var
const API_URL = 'https://codetype-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies (auth)
});

export default api;

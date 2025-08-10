import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://chat-app-c4e5.onrender.com/api';

const instance = axios.create({
  baseURL: API
});

export default instance;

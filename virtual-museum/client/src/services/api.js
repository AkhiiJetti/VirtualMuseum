import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // ✅ this must match your server
});

export const fetchExhibits = () => API.get('/exhibits');

import axios from 'axios';

const API_BASE = 'http://https://job-tracker-imch.onrender.com:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Auto-attach token from localStorage
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('hirematUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hirematUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

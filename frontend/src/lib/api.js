// /frontend/src/lib/api.js
import axios from "axios";

// ✅ Get the API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log('[API] Environment:', import.meta.env.MODE);
console.log('[API] Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lpl_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("lpl_token");
      localStorage.removeItem("lpl_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
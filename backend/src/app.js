// /frontend/src/lib/api.js
import axios from "axios";

// ✅ Hardcode the production URL temporarily
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? "https://laxmi-path-lab.onrender.com/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lpl_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
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
// /frontend/src/lib/api.js
import axios from "axios";

// ✅ Explicitly set the base URL for production
const isProduction = import.meta.env.PROD;
const baseURL = isProduction 
  ? "https://laxmi-path-lab.onrender.com/api"
  : "http://localhost:5000/api";

console.log('[API] Environment:', isProduction ? 'Production' : 'Development');
console.log('[API] Base URL:', baseURL);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lpl_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log the full URL
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API] Error:', err.response?.status, err.response?.data);
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
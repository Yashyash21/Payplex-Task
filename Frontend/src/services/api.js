// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/"
});

// ==============================
// 🔐 REQUEST INTERCEPTOR
// ==============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Public APIs (no token needed)
    const publicUrls = ["login", "register"];

    const isPublic = publicUrls.some((url) =>
      config.url.includes(url)
    );

    // Attach token only for protected APIs
    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// 🔁 RESPONSE INTERCEPTOR
// ==============================
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    // 🔴 Handle unauthorized (401)
    if (status === 401) {
      console.log("Unauthorized - token may be invalid or expired");

      // Clear only auth data
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // ❗ DO NOT redirect here (important fix)
      // Let components handle navigation
    }

    return Promise.reject(error);
  }
);

export default API;
// src/services/api.js
import axios from "axios";

// ✅ Usar import.meta.env para Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  },
);

export const searchRFCs = async (rfcs) => {
  const response = await api.post("/search/search", { rfcs });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/search/estatus/stats");
  console.log("Hola soy:" + response.data);
  return response.data;
};

export const searchSingleRFC = async (rfc) => {
  const response = await api.get(`/search/${rfc}`);
  return response.data;
};

export default api;

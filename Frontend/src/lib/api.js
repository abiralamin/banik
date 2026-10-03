import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("banik_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Don't set Content-Type for FormData - let axios set it automatically with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject({ ...error, friendlyMessage: message });
  },
);

export default api;

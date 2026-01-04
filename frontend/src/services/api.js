import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  const msAccessToken = localStorage.getItem("msAccessToken");

  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  if (msAccessToken) {
    config.headers["x-ms-access-token"] = msAccessToken;
  }

  return config;
});

export default api;

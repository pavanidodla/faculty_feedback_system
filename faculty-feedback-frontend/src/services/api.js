import axios from "axios";

const API = axios.create({
  baseURL: "https://faculty-feedback-backend-grqs.onrender.com/api", // deployed backend
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;

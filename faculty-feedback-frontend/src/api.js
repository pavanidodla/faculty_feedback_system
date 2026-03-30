import axios from "axios";

const API = axios.create({
  baseURL: "https://faculty-feedback-backend-grqs.onrender.com", // your Render backend
});

export default API;
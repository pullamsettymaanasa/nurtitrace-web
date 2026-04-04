import axios from "axios";
import { config } from "./config";

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload client with longer timeout (OCR + AI can take 30-60s)
// Do NOT set Content-Type header — axios auto-sets it with the correct
// multipart boundary when FormData is passed as the request body.
const uploadApi = axios.create({
  baseURL: config.apiUrl,
  timeout: 120000,
});

// Request interceptor to add auth token
function addAuthHeader(config: any) {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}

api.interceptors.request.use(addAuthHeader);
uploadApi.interceptors.request.use(addAuthHeader);

// Response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { api, uploadApi };

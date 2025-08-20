import axios from "axios";
import { tokenManager } from "./tokenManager";

// API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3010/api";
const REQUEST_TIMEOUT = 30000; // 30 seconds

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and network errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BAD_REQUEST') {
      console.error('API Network Error:', {
        code: error.code,
        message: error.message,
        baseURL: BASE_URL,
        isProduction: process.env.NODE_ENV === 'production'
      });
      
      // In production, show a more user-friendly error
      if (process.env.NODE_ENV === 'production') {
        error.message = 'Backend service is currently unavailable. Please try again later.';
      }
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenManager.removeToken();
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    if (error.response?.status === 400) {
      console.error('API Bad Request:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        response: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

// API base configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

console.log('🌐 API Configuration:', {
  API_URL,
  environment: import.meta.env.VITE_ENV || 'development',
  mode: import.meta.env.MODE
});

// Create axios instance with defaults
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add tenant context if available
    const currentCompany = localStorage.getItem('current_company');
    if (currentCompany) {
      config.headers['X-Tenant-ID'] = currentCompany;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('current_company');
      window.location.href = '/login';
    }
    
    // Extract error message
    const message = error.response?.data?.error?.message || 
                   error.message || 
                   'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);

// Helper function for API calls
export async function apiCall<T = any>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  data?: any,
  config?: any
): Promise<T> {
  try {
    const response = await api[method](endpoint, data, config);
    return response.data.data || response.data;
  } catch (error) {
    throw error;
  }
}
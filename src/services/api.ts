import axios, { type AxiosResponse, type AxiosError } from 'axios';

// Base API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Access denied. Insufficient permissions.');
    }
    
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  errors?: any;
}
  
export interface ApiError {
  message: string;
  status: number;
  errors?: any;
}

// Helper function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'API request failed');
};

// Helper function to handle API errors
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    return {
      message: (error.response.data as any)?.message || 'An error occurred',
      status: error.response.status,
      errors: (error.response.data as any)?.errors,
    };
  }
  
  if (error.request) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred',
    status: 0,
  };
}; 
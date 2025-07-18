import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types'
import { toast } from '@/hooks/useToast'

// Environment detection
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development'

// API base configuration with smart environment detection
const API_URL = import.meta.env.VITE_API_URL ||
  (isProduction ? 'https://api.forvara.dev/api' : 'http://localhost:4000/api')

const environment = import.meta.env.VITE_ENV ||
  (isProduction ? 'production' : 'development')

console.log('🌐 API Configuration:', {
  API_URL,
  environment,
  mode: import.meta.env.MODE,
  isProduction,
  isDevelopment
})

// Create axios instance with defaults
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable credentials for CORS
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add tenant context if available
    const currentCompany = localStorage.getItem('current_company')

    // Endpoints that support individual mode (no tenant required)
    const individualModeEndpoints = [
      '/auth',
      '/health',
      '/tenants', // GET /tenants lists all user companies
      '/apps', // Apps can work in individual mode
      '/billing', // Billing now supports individual mode
      '/dashboard', // Dashboard works in individual mode
      '/users/me', // User profile works in individual mode
      '/companies' // Company creation works in individual mode
    ]

    const supportsIndividualMode = individualModeEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    )

    if (currentCompany) {
      config.headers['X-Tenant-ID'] = currentCompany
    } else if (!supportsIndividualMode) {
      // Only warn for endpoints that truly require company context
      console.warn('No tenant ID available for request to:', config.url)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status
    const message = error.response?.data?.error?.message ||
                   error.message ||
                   'An unexpected error occurred'

    // Handle different error types
    switch (status) {
      case 401:
        // Unauthorized - clear auth and redirect
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        localStorage.removeItem('current_company')
        toast.error('Sesión expirada', 'Por favor inicia sesión nuevamente')
        setTimeout(() => window.location.href = '/login', 1000)
        break

      case 403:
        // Forbidden
        toast.error('Acceso denegado', message)
        break

      case 404:
        // Not found
        console.warn('Resource not found:', error.config?.url)
        break

      case 429:
        // Rate limited
        toast.warning('Demasiadas solicitudes', 'Por favor espera un momento antes de intentar nuevamente')
        break

      case 500:
      case 502:
      case 503:
        // Server errors
        toast.error('Error del servidor', 'Estamos experimentando problemas técnicos')
        break

      default:
        // Network or other errors
        if (!error.response) {
          toast.error('Error de conexión', 'Verifica tu conexión a internet')
        } else if (status >= 400) {
          toast.error('Error', message)
        }
    }

    return Promise.reject(new Error(message))
  }
)

// Helper function for API calls
export async function apiCall<T = any>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  data?: any,
  config?: any
): Promise<T> {
  const response = await api[method](endpoint, data, config)

  // Handle backend response structure: { data: {...} } or direct data
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data
  }

  return response.data
}

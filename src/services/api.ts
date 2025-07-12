import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { APIResponse } from '@/types'

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null
  private tenantId: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        
        if (this.tenantId) {
          config.headers['X-Tenant-ID'] = this.tenantId
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        // Handle different error types
        if (error.response?.status === 401) {
          // Token expired, clear auth state
          this.setAuth(null, null)
          window.location.href = '/login'
        } else if (error.response?.status === 403) {
          // Forbidden - insufficient permissions
          console.error('Access denied:', error.response.data?.error?.message)
        } else if (error.response?.status >= 500) {
          // Server error
          console.error('Server error:', error.response.data?.error?.message)
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          // Network error
          console.error('Network error - please check your connection')
        }
        
        return Promise.reject(error)
      }
    )
  }

  setAuth(token: string | null, tenantId: string | null = null) {
    this.token = token
    this.tenantId = tenantId
    
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
    
    if (tenantId) {
      localStorage.setItem('tenant_id', tenantId)
    } else {
      localStorage.removeItem('tenant_id')
    }
  }

  getStoredAuth() {
    const token = localStorage.getItem('auth_token')
    const tenantId = localStorage.getItem('tenant_id')
    
    if (token) {
      this.setAuth(token, tenantId)
    }
    
    return { token, tenantId }
  }

  // Generic request method
  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const response = await this.client[method](url, data, config)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message
      throw new Error(errorMessage)
    }
  }

  // Auth endpoints
  async login(identifier: string, password: string): Promise<APIResponse<{ user: any; token: string; companies: any[] }>> {
    return this.request('post', '/api/auth/login', { identifier, password })
  }

  async register(data: {
    email?: string
    phone?: string
    password: string
    full_name: string
    company_name?: string
  }): Promise<APIResponse<{ user: any; token: string; company: any }>> {
    return this.request('post', '/api/auth/register', data)
  }

  async logout(): Promise<APIResponse> {
    return this.request('post', '/api/auth/logout')
  }

  async refreshToken(): Promise<APIResponse<{ token: string }>> {
    return this.request('post', '/api/auth/refresh')
  }

  // User endpoints
  async getProfile(): Promise<APIResponse<any>> {
    return this.request('get', '/api/users/me')
  }

  async updateProfile(data: any): Promise<APIResponse<any>> {
    return this.request('patch', '/api/users/me', data)
  }

  async changePassword(data: { current_password: string; new_password: string }): Promise<APIResponse> {
    return this.request('post', '/api/users/change-password', data)
  }

  // Company/Tenant endpoints
  async getCompanies(): Promise<APIResponse<any[]>> {
    return this.request('get', '/api/tenants')
  }

  async getCompany(id: string): Promise<APIResponse<any>> {
    return this.request('get', `/api/tenants/${id}`)
  }

  async createCompany(data: { name: string; description?: string }): Promise<APIResponse<any>> {
    return this.request('post', '/api/tenants', data)
  }

  async updateCompany(id: string, data: any): Promise<APIResponse<any>> {
    return this.request('patch', `/api/tenants/${id}`, data)
  }

  async getCompanyMembers(companyId: string): Promise<APIResponse<any[]>> {
    return this.request('get', `/api/tenants/${companyId}/members`)
  }

  async inviteUser(companyId: string, data: { email: string; role: string }): Promise<APIResponse> {
    return this.request('post', `/api/tenants/${companyId}/invite`, data)
  }

  // Dashboard endpoints
  async getDashboard(): Promise<APIResponse<any>> {
    return this.request('get', '/api/hub/dashboard')
  }

  async getQuickActions(): Promise<APIResponse<any[]>> {
    return this.request('get', '/api/hub/quick-actions')
  }

  // Apps endpoints
  async getApps(): Promise<APIResponse<any[]>> {
    return this.request('get', '/api/apps')
  }

  async getApp(id: string): Promise<APIResponse<any>> {
    return this.request('get', `/api/apps/${id}`)
  }

  async getInstalledApps(): Promise<APIResponse<any[]>> {
    return this.request('get', '/api/apps/installed')
  }

  async installApp(appId: string, planId: string): Promise<APIResponse> {
    return this.request('post', `/api/apps/${appId}/install`, { planId })
  }

  async uninstallApp(appId: string): Promise<APIResponse> {
    return this.request('post', `/api/apps/${appId}/uninstall`)
  }

  async launchApp(appId: string): Promise<APIResponse<{ url: string }>> {
    return this.request('post', `/api/apps/${appId}/launch`)
  }

  // Subscription endpoints
  async getSubscriptions(): Promise<APIResponse<any[]>> {
    return this.request('get', '/api/subscriptions')
  }

  async getSubscription(id: string): Promise<APIResponse<any>> {
    return this.request('get', `/api/subscriptions/${id}`)
  }

  async cancelSubscription(id: string): Promise<APIResponse> {
    return this.request('post', `/api/subscriptions/${id}/cancel`)
  }

  async upgradeSubscription(id: string, planId: string): Promise<APIResponse> {
    return this.request('post', `/api/subscriptions/${id}/upgrade`, { planId })
  }

  // Activity endpoints
  async getActivities(page = 1, limit = 10): Promise<APIResponse<any[]>> {
    return this.request('get', `/api/activity?page=${page}&limit=${limit}`)
  }

  // Notifications endpoints
  async getNotifications(): Promise<APIResponse<any[]>> {
    return this.request('get', '/api/notifications')
  }

  async markNotificationAsRead(id: string): Promise<APIResponse> {
    return this.request('post', `/api/notifications/${id}/read`)
  }

  async markAllNotificationsAsRead(): Promise<APIResponse> {
    return this.request('post', '/api/notifications/read-all')
  }

  // File endpoints
  async getFiles(page = 1, limit = 20): Promise<APIResponse<any[]>> {
    return this.request('get', `/api/files?page=${page}&limit=${limit}`)
  }

  async uploadFile(file: File): Promise<APIResponse<any>> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.request('post', '/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async deleteFile(id: string): Promise<APIResponse> {
    return this.request('delete', `/api/files/${id}`)
  }

  // Storage endpoints
  async getStorageStats(): Promise<APIResponse<any>> {
    return this.request('get', '/api/files/storage-stats')
  }
}

export const apiClient = new ApiClient()
export default apiClient
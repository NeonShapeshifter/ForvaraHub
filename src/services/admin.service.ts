import { apiCall } from './api'

export interface AdminDashboardOverview {
  total_companies: number;
  total_users: number;
  active_companies: number;
  trial_companies: number;
  revenue_monthly: number;
  revenue_total: number;
}

export interface RecentCompany {
  id: string;
  razon_social: string;
  created_at: string;
  status: string;
}

export interface RecentUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

export interface AdminDashboard {
  overview: AdminDashboardOverview;
  recent_activity: {
    companies: RecentCompany[];
    users: RecentUser[];
  };
  growth: {
    companies_this_month: number;
    users_this_month: number;
  };
}

export const adminService = {
  // Get admin dashboard data
  async getDashboard(): Promise<AdminDashboard> {
    return apiCall<AdminDashboard>('get', '/admin/dashboard')
  },

  // Get companies list
  async getCompanies(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    return apiCall('get', `/admin/companies?${queryParams.toString()}`)
  },

  // Get users list
  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)

    return apiCall('get', `/admin/users?${queryParams.toString()}`)
  }
}

import { apiCall } from './api'
import { User } from '@/types'

export const userService = {
  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiCall<User>('patch', '/auth/me', data)
  },

  // Change password
  async changePassword(data: { current_password: string; new_password: string }): Promise<void> {
    return apiCall<void>('patch', '/auth/password', data)
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiCall<{ avatar_url: string }>('post', '/auth/avatar', formData)
  },

  // Get user settings
  async getSettings(): Promise<any> {
    return apiCall<any>('get', '/auth/settings')
  },

  // Update user settings
  async updateSettings(settings: any): Promise<any> {
    return apiCall<any>('patch', '/auth/settings', settings)
  },

  // Get company members
  async getCompanyMembers(companyId: string): Promise<any[]> {
    try {
      return await apiCall<any[]>('get', `/users/company-members`)
    } catch (error) {
      console.error('Error fetching company members:', error)
      return []
    }
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<any[]> {
    try {
      return await apiCall<any[]>('get', '/admin/users')
    } catch (error) {
      console.error('Error fetching all users:', error)
      return []
    }
  }
}

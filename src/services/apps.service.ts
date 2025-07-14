import { api } from './api'

export interface App {
  id: string
  name: string
  description: string
  category: string
  price: string
  priceType: 'free' | 'monthly' | 'one-time'
  rating?: number
  downloads?: string
  features?: string[]
  status?: 'available' | 'installed' | 'coming-soon'
  featured?: boolean
}

export interface InstalledApp {
  id: string
  name: string
  description: string
  category: string
  status: 'active' | 'trial' | 'suspended' | 'pending'
  subscription: {
    plan: string
    price: string
    billingCycle: 'monthly' | 'yearly' | 'free'
    nextBilling?: string
    trialEnds?: string
  }
  usage: {
    lastAccessed: string
    monthlyActiveUsers: number
    storageUsed: string
    apiCalls: number
  }
  permissions: string[]
  installedDate: string
}

export const appsService = {
  // Get all available apps from marketplace
  async getAvailableApps(): Promise<App[]> {
    try {
      const response = await api.get('/apps')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching available apps:', error)
      return []
    }
  },

  // Get user's installed apps
  async getInstalledApps(): Promise<InstalledApp[]> {
    try {
      const response = await api.get('/apps/installed')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching installed apps:', error)
      return []
    }
  },

  // Get specific app details
  async getApp(appId: string): Promise<App | null> {
    try {
      const response = await api.get(`/apps/${appId}`)
      return response.data.data || null
    } catch (error) {
      console.error('Error fetching app details:', error)
      return null
    }
  },

  // Install an app
  async installApp(appId: string, planId?: string): Promise<any> {
    try {
      const response = await api.post(`/apps/${appId}/install`, { planId })
      return response.data.data
    } catch (error) {
      console.error('Error installing app:', error)
      throw error
    }
  },

  // Uninstall an app
  async uninstallApp(appId: string): Promise<any> {
    try {
      const response = await api.post(`/apps/${appId}/uninstall`)
      return response.data.data
    } catch (error) {
      console.error('Error uninstalling app:', error)
      throw error
    }
  },

  // Launch an app
  async launchApp(appId: string): Promise<{ url: string; message: string }> {
    try {
      const response = await api.post(`/apps/${appId}/launch`)
      return response.data.data
    } catch (error) {
      console.error('Error launching app:', error)
      throw error
    }
  }
}
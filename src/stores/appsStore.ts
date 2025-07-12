import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '@/services/api'

export interface AppPlan {
  id: string
  name: string
  description?: string
  price: number
  billing_interval: 'monthly' | 'yearly'
  is_trial: boolean
  trial_days?: number
  max_users?: number
  features: string[]
}

export interface App {
  id: string
  name: string
  slug: string
  description: string
  icon_url?: string
  category: string
  is_featured: boolean
  is_active: boolean
  status: 'available' | 'installed' | 'trial' | 'disabled'
  last_used?: string
  trial_ends?: string
  current_plan?: string
  installation_date?: string
  plans: AppPlan[]
  rating?: number
  downloads?: number
  developer?: {
    name: string
    email: string
  }
}

interface AppsState {
  apps: App[]
  installedApps: App[]
  favoriteApps: string[]
  isLoading: boolean
  
  // Actions
  loadApps: () => Promise<void>
  installApp: (appId: string, planId?: string) => Promise<void>
  uninstallApp: (appId: string, keepData?: boolean) => Promise<void>
  upgradeApp: (appId: string, newPlanId: string) => Promise<void>
  launchApp: (appId: string) => Promise<void>
  toggleFavorite: (appId: string) => void
  updateLastUsed: (appId: string) => void
  
  // Getters
  getApp: (appId: string) => App | undefined
  getInstalledApps: () => App[]
  getFeaturedApps: () => App[]
  getAppsByCategory: (category: string) => App[]
  isAppInstalled: (appId: string) => boolean
  isAppFavorited: (appId: string) => boolean
}

// Apps store now uses real API data

export const useAppsStore = create<AppsState>()(
  persist(
    (set, get) => ({
      apps: [],
      installedApps: [],
      favoriteApps: [],
      isLoading: false,

      loadApps: async () => {
        try {
          set({ isLoading: true })
          
          // Load all available apps
          const [allAppsResponse, installedAppsResponse] = await Promise.all([
            apiClient.getApps(),
            apiClient.getInstalledApps()
          ])
          
          if (allAppsResponse.data) {
            // Mark apps as installed/trial based on subscriptions
            const installedAppIds = new Set(installedAppsResponse.data?.map((app: any) => app.id) || [])
            const appsWithStatus = allAppsResponse.data.map((app: any) => ({
              ...app,
              status: installedAppIds.has(app.id) ? 'installed' : 'available'
            }))
            
            set({ 
              apps: appsWithStatus,
              installedApps: appsWithStatus.filter(app => app.status === 'installed'),
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Load apps error:', error)
          set({ isLoading: false })
        }
      },

      installApp: async (appId: string, planId?: string) => {
        try {
          set({ isLoading: true })
          
          // Install app via API
          if (planId) {
            await apiClient.installApp(appId, planId)
          } else {
            // Start trial
            await apiClient.installApp(appId, 'trial')
          }
          
          // Reload apps to get updated status
          await get().loadApps()
        } catch (error) {
          console.error('Install app error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      uninstallApp: async (appId: string, keepData = false) => {
        try {
          set({ isLoading: true })
          
          // Uninstall app via API
          await apiClient.uninstallApp(appId)
          
          // Reload apps to get updated status
          await get().loadApps()
        } catch (error) {
          console.error('Uninstall app error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      upgradeApp: async (appId: string, newPlanId: string) => {
        try {
          set({ isLoading: true })
          
          // Upgrade app via API
          await apiClient.upgradeSubscription(appId, newPlanId)
          
          // Reload apps to get updated status
          await get().loadApps()
        } catch (error) {
          console.error('Upgrade app error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      launchApp: async (appId: string) => {
        const app = get().getApp(appId)
        if (!app || !['installed', 'trial'].includes(app.status)) {
          console.error('App not installed:', appId)
          return
        }

        try {
          // Get launch URL from API
          const response = await apiClient.launchApp(appId)
          
          if (response.data?.url) {
            // Update last used
            get().updateLastUsed(appId)
            
            // Open app in new tab
            window.open(response.data.url, '_blank')
          } else {
            console.error('No launch URL received for app:', appId)
          }
        } catch (error) {
          console.error('Failed to launch app:', error)
        }
      },

      toggleFavorite: (appId: string) => {
        const { favoriteApps } = get()
        const isCurrentlyFavorited = favoriteApps.includes(appId)
        
        set({
          favoriteApps: isCurrentlyFavorited
            ? favoriteApps.filter(id => id !== appId)
            : [...favoriteApps, appId]
        })
      },

      updateLastUsed: (appId: string) => {
        const { apps } = get()
        const now = new Date()
        const timeString = now.getHours() < 1 ? 'Just now' : 
                          now.getHours() < 24 ? `${now.getHours()}h ago` : 
                          `${Math.floor(now.getHours() / 24)}d ago`
        
        const updatedApps = apps.map(app => 
          app.id === appId ? { ...app, last_used: timeString } : app
        )
        
        set({ 
          apps: updatedApps,
          installedApps: updatedApps.filter(app => ['installed', 'trial'].includes(app.status))
        })
      },

      // Getters
      getApp: (appId: string) => get().apps.find(app => app.id === appId),
      
      getInstalledApps: () => get().installedApps,
      
      getFeaturedApps: () => get().apps.filter(app => app.is_featured),
      
      getAppsByCategory: (category: string) => 
        category === 'All' 
          ? get().apps 
          : get().apps.filter(app => app.category === category),
      
      isAppInstalled: (appId: string) => {
        const app = get().getApp(appId)
        return app ? ['installed', 'trial'].includes(app.status) : false
      },
      
      isAppFavorited: (appId: string) => get().favoriteApps.includes(appId)
    }),
    {
      name: 'forvara-apps',
      partialize: (state) => ({
        favoriteApps: state.favoriteApps,
        // Don't persist full app data, load fresh from API
      })
    }
  )
)
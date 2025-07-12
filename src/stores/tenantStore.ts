import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// Removed mock data imports - using real APIs
import apiClient from '@/services/api'

interface Tenant {
  id: string
  name: string
  description?: string
  logo_url?: string
  storage_used: number
  storage_limit: number
  user_count: number
  created_at: string
  updated_at: string
  settings?: {
    use_hub_management: boolean
    timezone: string
    locale: string
    features: string[]
  }
}

interface TenantMember {
  id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
  user: {
    id: string
    full_name: string
    email?: string
    avatar_url?: string
  }
}

interface TenantState {
  currentTenant: Tenant | null
  availableTenants: Tenant[]
  members: TenantMember[]
  isLoading: boolean
  
  // Actions
  setCurrentTenant: (tenant: Tenant | null) => void
  setAvailableTenants: (tenants: Tenant[]) => void
  switchTenant: (tenantId: string) => Promise<void>
  loadTenants: () => Promise<void>
  loadMembers: () => Promise<void>
  updateTenant: (updates: Partial<Tenant>) => void
  createTenant: (data: { name: string; description?: string }) => Promise<Tenant>
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      currentTenant: null,
      availableTenants: [],
      members: [],
      isLoading: false,

      setCurrentTenant: (tenant) => {
        set({ currentTenant: tenant })
        if (tenant) {
          apiClient.setAuth(apiClient.getStoredAuth().token, tenant.id)
        }
      },

      setAvailableTenants: (tenants) => set({ availableTenants: tenants }),

      switchTenant: async (tenantId) => {
        const tenant = get().availableTenants.find(t => t.id === tenantId)
        if (tenant) {
          get().setCurrentTenant(tenant)
          // Reload dashboard data for new tenant
          await get().loadMembers()
        }
      },

      loadTenants: async () => {
        try {
          set({ isLoading: true })
          const response = await apiClient.getCompanies()
          
          if (response.data) {
            set({ availableTenants: response.data })
            
            // If no current tenant, set the first one
            const currentTenant = get().currentTenant
            if (!currentTenant && response.data.length > 0) {
              get().setCurrentTenant(response.data[0])
            }
          }
        } catch (error) {
          console.error('Load tenants error:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      loadMembers: async () => {
        const currentTenant = get().currentTenant
        if (!currentTenant) return

        try {
          const response = await apiClient.getCompanyMembers(currentTenant.id)
          if (response.data) {
            set({ members: response.data })
          }
        } catch (error) {
          console.error('Load members error:', error)
        }
      },

      updateTenant: (updates) => {
        const currentTenant = get().currentTenant
        if (currentTenant) {
          const updatedTenant = { ...currentTenant, ...updates }
          set({ currentTenant: updatedTenant })
          
          // Update in available tenants list too
          set({
            availableTenants: get().availableTenants.map(t =>
              t.id === currentTenant.id ? updatedTenant : t
            )
          })
        }
      },

      createTenant: async (data) => {
        try {
          const response = await apiClient.createCompany(data)
          if (response.data) {
            const newTenant = response.data
            set({
              availableTenants: [...get().availableTenants, newTenant],
              currentTenant: newTenant
            })
            return newTenant
          }
          throw new Error('Failed to create tenant')
        } catch (error) {
          console.error('Create tenant error:', error)
          throw error
        }
      }
    }),
    {
      name: 'forvara-tenant',
      partialize: (state) => ({
        currentTenant: state.currentTenant
      })
    }
  )
)
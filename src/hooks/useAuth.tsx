import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useTenantStore } from '@/stores/tenantStore'

interface AuthContextType {
  // From auth store
  user: ReturnType<typeof useAuthStore>['user']
  token: ReturnType<typeof useAuthStore>['token']
  isAuthenticated: ReturnType<typeof useAuthStore>['isAuthenticated']
  isLoading: ReturnType<typeof useAuthStore>['isLoading']
  companies: ReturnType<typeof useAuthStore>['companies']
  login: ReturnType<typeof useAuthStore>['login']
  register: ReturnType<typeof useAuthStore>['register']
  logout: () => Promise<void>
  
  // From tenant store
  currentTenant: ReturnType<typeof useTenantStore>['currentTenant']
  availableTenants: ReturnType<typeof useTenantStore>['availableTenants']
  switchTenant: ReturnType<typeof useTenantStore>['switchTenant']
  
  // Computed
  isOwner: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  
  // Check current user role in tenant
  const currentMember = tenantStore.members.find(m => m.user_id === authStore.user?.id)
  const isOwner = currentMember?.role === 'owner'
  const isAdmin = currentMember?.role === 'admin' || isOwner

  // Initialize auth state on mount
  useEffect(() => {
    authStore.checkAuth()
  }, [])

  // Load tenants when authenticated
  useEffect(() => {
    if (authStore.isAuthenticated && authStore.companies.length > 0) {
      tenantStore.setAvailableTenants(authStore.companies)
      
      // Set initial tenant if none selected
      if (!tenantStore.currentTenant && authStore.companies.length > 0) {
        tenantStore.setCurrentTenant(authStore.companies[0])
      }
    }
  }, [authStore.isAuthenticated, authStore.companies])

  // Load members when tenant changes
  useEffect(() => {
    if (tenantStore.currentTenant) {
      tenantStore.loadMembers()
    }
  }, [tenantStore.currentTenant?.id])

  // Enhanced logout that also clears tenant state
  const logout = async () => {
    await authStore.logout()
    tenantStore.setCurrentTenant(null)
    tenantStore.setAvailableTenants([])
    navigate('/login')
  }

  const value: AuthContextType = {
    // Auth state
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    companies: authStore.companies,
    login: authStore.login,
    register: authStore.register,
    logout,
    
    // Tenant state
    currentTenant: tenantStore.currentTenant,
    availableTenants: tenantStore.availableTenants,
    switchTenant: tenantStore.switchTenant,
    
    // Computed
    isOwner,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
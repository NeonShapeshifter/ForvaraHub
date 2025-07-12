import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '@/services/api'

interface User {
  id: string
  email?: string
  phone?: string
  full_name: string
  avatar_url?: string
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  companies: any[]
  
  // Actions
  login: (identifier: string, password: string) => Promise<void>
  register: (data: {
    email?: string
    phone?: string
    password: string
    full_name: string
    company_name?: string
  }) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setCompanies: (companies: any[]) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      companies: [],

      login: async (identifier, password) => {
        try {
          set({ isLoading: true })
          const response = await apiClient.login(identifier, password)
          
          if (response.data) {
            const { user, token, companies } = response.data
            apiClient.setAuth(token)
            
            set({
              user,
              token,
              companies,
              isAuthenticated: true,
              isLoading: false
            })
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true })
          const response = await apiClient.register(data)
          
          if (response.data) {
            const { user, token, company } = response.data
            apiClient.setAuth(token, company?.id)
            
            set({
              user,
              token,
              companies: company ? [company] : [],
              isAuthenticated: true,
              isLoading: false
            })
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await apiClient.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          apiClient.setAuth(null, null)
          set({
            user: null,
            token: null,
            companies: [],
            isAuthenticated: false
          })
        }
      },

      checkAuth: async () => {
        const { token } = apiClient.getStoredAuth()
        
        if (!token) {
          set({ isAuthenticated: false, isLoading: false })
          return
        }

        try {
          set({ isLoading: true })
          const response = await apiClient.getProfile()
          
          if (response.data) {
            set({
              user: response.data,
              token,
              isAuthenticated: true,
              isLoading: false
            })
          }
        } catch (error) {
          console.error('Auth check error:', error)
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setCompanies: (companies) => set({ companies })
    }),
    {
      name: 'forvara-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        companies: state.companies
      })
    }
  )
)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Company } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  companies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentCompany: (company: Company) => void;
  updateUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      companies: [],
      currentCompany: null,
      isLoading: false,
      error: null,
      
      // Login with email
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            token: response.token,
            companies: response.companies || [],
            currentCompany: response.companies?.[0] || null,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Login with phone
      loginWithPhone: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ phone, password });
          set({
            user: response.user,
            token: response.token,
            companies: response.companies || [],
            currentCompany: response.companies?.[0] || null,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Register
      register: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          set({
            user: response.user,
            token: response.token,
            companies: [],
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Logout
      logout: async () => {
        await authService.logout();
        set({
          user: null,
          token: null,
          companies: [],
          currentCompany: null,
          error: null,
        });
      },
      
      // Set current company
      setCurrentCompany: (company: Company) => {
        set({ currentCompany: company });
        localStorage.setItem('current_company', company.id);
      },
      
      // Update user
      updateUser: (user: User) => {
        set({ user });
        localStorage.setItem('user_data', JSON.stringify(user));
      },
      
      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        companies: state.companies,
        currentCompany: state.currentCompany,
      }),
    }
  )
);
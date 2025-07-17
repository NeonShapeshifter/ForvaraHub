import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Company, RegisterRequest, CreateCompanyRequest } from '@/types';
import { authService } from '@/services/auth.service';
import { companyService } from '@/services/company.service';

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
  register: (data: RegisterRequest) => Promise<void>;
  createCompany: (data: CreateCompanyRequest) => Promise<Company>;
  refreshCompanies: () => Promise<void>;
  logout: () => Promise<void>;
  setCurrentCompany: (company: Company) => void;
  updateUser: (user: User) => void;
  clearError: () => void;
  isIndividualMode: () => boolean;
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
          
          // Set the first company as current if available
          if (response.companies?.[0]) {
            localStorage.setItem('current_company', response.companies[0].id);
          }
          
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
          
          // Set the first company as current if available
          if (response.companies?.[0]) {
            localStorage.setItem('current_company', response.companies[0].id);
          }
          
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
      register: async (data: RegisterRequest) => {
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
        // Store company ID for API interceptor to use as tenant header
        localStorage.setItem('current_company', company.id);
      },
      
      // Update user
      updateUser: (user: User) => {
        set({ user });
        localStorage.setItem('user_data', JSON.stringify(user));
      },
      
      // Create company
      createCompany: async (data: CreateCompanyRequest) => {
        set({ isLoading: true, error: null });
        try {
          const company = await authService.createCompany(data);
          const state = get();
          const updatedCompanies = [...state.companies, company];
          
          // Important: Set the company ID in localStorage for API interceptor
          localStorage.setItem('current_company', company.id);
          
          set({
            companies: updatedCompanies,
            currentCompany: company,
            isLoading: false,
          });
          return company;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Refresh companies
      refreshCompanies: async () => {
        try {
          const companies = await companyService.getUserCompanies();
          const state = get();
          let currentCompany = state.currentCompany;
          
          // Update current company if it exists in the new list
          if (currentCompany) {
            const updatedCurrentCompany = companies.find(c => c.id === currentCompany.id);
            if (updatedCurrentCompany) {
              currentCompany = updatedCurrentCompany;
            }
          }
          
          set({ companies, currentCompany });
        } catch (error: any) {
          console.warn('Failed to refresh companies:', error);
        }
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Check if user is in individual mode (no companies)
      isIndividualMode: () => {
        const state = get();
        return state.user && (!state.companies || state.companies.length === 0);
      },
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
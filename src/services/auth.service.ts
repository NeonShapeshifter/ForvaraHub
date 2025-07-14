import { api, apiCall } from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  CreateCompanyRequest,
  Company 
} from '@/types';

export const authService = {
  // Login with email or phone
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiCall<AuthResponse>('post', '/auth/login', credentials);
    
    // Store auth data
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      // Set first company as current if available
      if (response.companies?.length > 0) {
        localStorage.setItem('current_company', response.companies[0].id);
      }
    }
    
    return response;
  },

  // Register new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiCall<AuthResponse>('post', '/auth/register', data);
    
    // Store auth data
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    return apiCall<User>('get', '/auth/me');
  },

  // Create new company
  async createCompany(data: CreateCompanyRequest): Promise<Company> {
    const company = await apiCall<Company>('post', '/auth/create-company', data);
    
    // Set as current company
    localStorage.setItem('current_company', company.id);
    
    return company;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiCall('post', '/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    }
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('current_company');
    
    // Redirect to login
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  // Get current user from storage
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};
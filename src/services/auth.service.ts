import { api, apiCall } from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  CreateCompanyRequest,
  Company 
} from '@/types';
import { companyService } from './company.service';

export const authService = {
  // Login with email or phone
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login with:', { 
        hasEmail: !!credentials.email, 
        hasPhone: !!credentials.phone,
        apiUrl: api.defaults.baseURL
      });
      
      const response = await apiCall<any>('post', '/auth/login', credentials);
      
      // Handle backend response structure
      let authResponse: AuthResponse;
      
      if (response.token && response.user) {
        // Direct auth response
        authResponse = {
          token: response.token,
          user: response.user,
          companies: response.companies || [],
          session_id: response.session_id,
          message: response.message
        };
      } else if (response.access_token || response.jwt_token) {
        // Alternative token field names
        authResponse = {
          token: response.access_token || response.jwt_token,
          user: response.user || response.profile,
          companies: response.companies || [],
          session_id: response.session_id,
          message: response.message
        };
      } else {
        throw new Error('Invalid login response format');
      }
      
      console.log('✅ Login successful:', { 
        hasToken: !!authResponse.token, 
        userId: authResponse.user?.id,
        companiesCount: authResponse.companies?.length || 0
      });
      
      // Store auth data
      if (authResponse.token) {
        localStorage.setItem('auth_token', authResponse.token);
        localStorage.setItem('user_data', JSON.stringify(authResponse.user));
        
        // Try to fetch user companies if not provided
        if (!authResponse.companies || authResponse.companies.length === 0) {
          try {
            const companies = await companyService.getUserCompanies();
            authResponse.companies = companies;
          } catch (error) {
            console.warn('Could not fetch user companies:', error);
            authResponse.companies = [];
          }
        }
        
        // Set first company as current if available
        if (authResponse.companies?.length > 0) {
          localStorage.setItem('current_company', authResponse.companies[0].id);
        }
      }
      
      return authResponse;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
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

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const updatedUser = await apiCall<User>('patch', '/auth/me', data);
    
    // Update stored user data
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  // Create new company
  async createCompany(data: CreateCompanyRequest): Promise<Company> {
    const company = await companyService.createCompany(data);
    
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
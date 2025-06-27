import { supabase, api } from './client';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  avatarUrl?: string;
  forvara_email?: string;
}

export interface Tenant {
  id: string;
  name: string;
  identifier: string;
  logo_url?: string;
  settings?: any;
}

export interface UserTenant {
  tenant: Tenant;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export const authService = {
  // Sign up with email or phone
  async signUp(credentials: { email?: string; phone?: string; password: string }) {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) throw error;
    return data;
  },

  // Sign in
  async signIn(credentials: { email?: string; phone?: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get extended profile from API
    try {
      const profile = await api.get<User>('/api/users/me');
      return profile;
    } catch {
      // Fallback to Supabase user
      return {
        id: user.id,
        email: user.email,
        phone: user.phone
      };
    }
  },

  // Get user's tenants
  async getUserTenants(): Promise<UserTenant[]> {
    return api.get<UserTenant[]>('/api/tenants');
  }
};

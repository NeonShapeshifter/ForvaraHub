import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, api } from '../lib/api/client';
import { authService, User, Tenant, UserTenant } from '../lib/api/auth';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  loading: boolean;
  error: string | null;
  signIn: (credentials: { email?: string; phone?: string; password: string }) => Promise<void>;
  signUp: (credentials: { email?: string; phone?: string; password: string; fullName?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  selectTenant: (tenantId: string) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN' && session) {
        await loadUserData(session.user);
      } else if (event === 'SIGNED_OUT') {
        clearUserData();
      } else if (event === 'TOKEN_REFRESHED') {
        // Token was refreshed, update our state if needed
        console.log('Token refreshed');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserData(session.user);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError('Failed to initialize authentication');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (supabaseUser: SupabaseUser) => {
    try {
      setSupabaseUser(supabaseUser);

      // Get extended user profile from ForvaraCore
      const profile = await authService.getCurrentUser();
      if (profile) {
        setUser(profile);

        // Get user's tenants
        const userTenants = await authService.getUserTenants();
        const tenantList = userTenants.map(ut => ut.tenant);
        setTenants(tenantList);

        // Select tenant
        const savedTenantId = localStorage.getItem('currentTenantId');
        const tenantToSelect = savedTenantId 
          ? tenantList.find(t => t.id === savedTenantId) 
          : tenantList[0];

        if (tenantToSelect) {
          setCurrentTenant(tenantToSelect);
          // Store tenant in API context for subsequent requests
          api.setCurrentTenant(tenantToSelect.id);
        }
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    }
  };

  const clearUserData = () => {
    setUser(null);
    setSupabaseUser(null);
    setTenants([]);
    setCurrentTenant(null);
    localStorage.removeItem('currentTenantId');
    api.setCurrentTenant(null);
  };

  const signIn = async (credentials: { email?: string; phone?: string; password: string }) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await authService.signIn(credentials);
      
      if (error) throw error;
      
      if (data.user) {
        await loadUserData(data.user);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: { email?: string; phone?: string; password: string; fullName?: string }) => {
    try {
      setError(null);
      setLoading(true);

      // First sign up with Supabase
      const { data, error } = await authService.signUp(credentials);
      
      if (error) throw error;

      // Then create profile in ForvaraCore
      if (data.user && credentials.fullName) {
        try {
          await api.post('/api/users/profile', {
            full_name: credentials.fullName,
            phone: credentials.phone
          });
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue even if profile creation fails
        }
      }

      if (data.user) {
        await loadUserData(data.user);
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
      clearUserData();
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'Failed to sign out');
    }
  };

  const selectTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      localStorage.setItem('currentTenantId', tenantId);
      api.setCurrentTenant(tenantId);
      
      // Refresh user data with new tenant context
      refreshUser();
    }
  };

  const refreshUser = async () => {
    if (supabaseUser) {
      await loadUserData(supabaseUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      supabaseUser,
      tenants,
      currentTenant,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      selectTenant,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

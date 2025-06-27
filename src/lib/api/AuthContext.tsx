import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Tenant } from '@/lib/api/auth';
import { authService } from '@/lib/api/auth';
import { supabase } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  loading: boolean;
  signIn: (credentials: { email?: string; phone?: string; password: string }) => Promise<void>;
  signUp: (credentials: { email?: string; phone?: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  selectTenant: (tenantId: string) => void;
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
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const userTenants = await authService.getUserTenants();
          const tenantList = userTenants.map(ut => ut.tenant);
          setTenants(tenantList);
          
          // Auto-select first tenant
          if (tenantList.length > 0) {
            setCurrentTenant(tenantList[0]);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        const userTenants = await authService.getUserTenants();
        const tenantList = userTenants.map(ut => ut.tenant);
        setTenants(tenantList);
        if (tenantList.length > 0) {
          setCurrentTenant(tenantList[0]);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setTenants([]);
        setCurrentTenant(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (credentials: { email?: string; phone?: string; password: string }) => {
    await authService.signIn(credentials);
  };

  const signUp = async (credentials: { email?: string; phone?: string; password: string }) => {
    await authService.signUp(credentials);
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const selectTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // Store in localStorage for persistence
      localStorage.setItem('currentTenantId', tenantId);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      tenants,
      currentTenant,
      loading,
      signIn,
      signUp,
      signOut,
      selectTenant
    }}>
      {children}
    </AuthContext.Provider>
  );
};

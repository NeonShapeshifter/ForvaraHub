// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { forvaraService } from '../services/forvara';
import { ForvaraUser } from '../lib/forvara-sdk';

interface Tenant {
  id: string;
  nombre: string;
  ruc: string;
  rol: string;
}

interface AuthContextType {
  user: ForvaraUser | null;
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
  const [user, setUser] = useState<ForvaraUser | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();

    // Listen for SDK events
    forvaraService.client.on('auth:login', (event) => {
      console.log('Auth login event:', event);
      loadUserData();
    });

    forvaraService.client.on('auth:logout', () => {
      console.log('Auth logout event');
      clearUserData();
    });

    forvaraService.client.on('auth:tenant-changed', (event) => {
      console.log('Tenant changed event:', event);
      const tenant = user?.tenants.find(t => t.id === event.data.tenantId);
      if (tenant) {
        setCurrentTenant({
          id: tenant.id,
          nombre: tenant.nombre,
          ruc: tenant.ruc,
          rol: tenant.rol
        });
      }
    });
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (forvaraService.isAuthenticated()) {
        await loadUserData();
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError('Failed to initialize authentication');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const currentUser = forvaraService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setTenants(currentUser.tenants.map(t => ({
          id: t.id,
          nombre: t.nombre,
          ruc: t.ruc,
          rol: t.rol
        })));

        // If there's a current tenant in the SDK, use it
        const currentTenantId = forvaraService.getCurrentTenant();
        if (currentTenantId) {
          const tenant = currentUser.tenants.find(t => t.id === currentTenantId);
          if (tenant) {
            setCurrentTenant({
              id: tenant.id,
              nombre: tenant.nombre,
              ruc: tenant.ruc,
              rol: tenant.rol
            });
          }
        } else if (currentUser.tenants.length === 1) {
          // Auto-select if only one tenant
          await selectTenant(currentUser.tenants[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    }
  };

  const clearUserData = () => {
    setUser(null);
    setTenants([]);
    setCurrentTenant(null);
  };

  const signIn = async (credentials: { email?: string; phone?: string; password: string }) => {
    try {
      setError(null);
      setLoading(true);

      const identifier = credentials.email || credentials.phone || '';
      const response = await forvaraService.login(identifier, credentials.password);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to sign in');
      }
      
      // Load user data will be triggered by the auth:login event
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: { 
    email?: string; 
    phone?: string; 
    password: string; 
    fullName?: string 
  }) => {
    try {
      setError(null);
      setLoading(true);

      // Parse full name into nombre and apellido
      const [nombre, ...apellidoParts] = (credentials.fullName || 'Usuario').split(' ');
      const apellido = apellidoParts.join(' ') || 'Nuevo';

      const response = await forvaraService.register({
        nombre,
        apellido,
        telefono: credentials.phone || '',
        email: credentials.email,
        password: credentials.password
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to sign up');
      }

      // After successful registration, log them in
      const identifier = credentials.email || credentials.phone || '';
      await signIn({ 
        email: credentials.email, 
        phone: credentials.phone, 
        password: credentials.password 
      });
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
      await forvaraService.logout();
      // clearUserData will be triggered by the auth:logout event
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'Failed to sign out');
    }
  };

  const selectTenant = async (tenantId: string) => {
    try {
      const success = await forvaraService.selectTenant(tenantId);
      if (success) {
        const tenant = tenants.find(t => t.id === tenantId);
        if (tenant) {
          setCurrentTenant(tenant);
        }
      }
    } catch (err) {
      console.error('Select tenant error:', err);
      setError('Failed to select tenant');
    }
  };

  const refreshUser = async () => {
    await loadUserData();
  };

  return (
    <AuthContext.Provider value={{
      user,
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

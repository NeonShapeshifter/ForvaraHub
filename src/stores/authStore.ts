import { create } from 'zustand';
import { forvaraService } from '../services/forvara';
import { ForvaraUser, Tenant } from '../types/forvara';

interface AuthState {
  // Estado
  user: ForvaraUser | null;
  currentTenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  selectTenant: (tenantId: string) => Promise<boolean>;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial
  user: null,
  currentTenant: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login
  login: async (identifier: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await forvaraService.login(identifier, password);
      
      if (response.success && response.user) {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false
        });

        // Si solo tiene un tenant, seleccionarlo automáticamente
        if (response.user.tenants.length === 1) {
          await get().selectTenant(response.user.tenants[0].id);
        }

        return true;
      } else {
        set({
          error: response.error || 'Error al iniciar sesión',
          isLoading: false
        });
        return false;
      }
    } catch (error) {
      set({
        error: 'Error de conexión',
        isLoading: false
      });
      return false;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await forvaraService.logout();
    } finally {
      set({
        user: null,
        currentTenant: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  },

  // Seleccionar tenant
  selectTenant: async (tenantId: string) => {
    const { user } = get();
    if (!user) return false;

    set({ isLoading: true, error: null });

    try {
      const success = await forvaraService.selectTenant(tenantId);
      
      if (success) {
        const tenant = user.tenants.find(t => t.id === tenantId);
        if (tenant) {
          set({
            currentTenant: {
              id: tenant.id,
              nombre: tenant.nombre,
              ruc: tenant.ruc,
              rol: tenant.rol
            },
            isLoading: false
          });
          return true;
        }
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({
        error: 'Error al seleccionar empresa',
        isLoading: false
      });
      return false;
    }
  },

  // Utilidades
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Verificar autenticación al cargar
  checkAuth: () => {
    const user = forvaraService.getCurrentUser();
    const tenant = forvaraService.getCurrentTenant();
    const isAuthenticated = forvaraService.isAuthenticated();

    if (user && isAuthenticated) {
      const currentTenant = user.tenants.find(t => t.id === tenant) || null;
      set({
        user,
        currentTenant: currentTenant ? {
          id: currentTenant.id,
          nombre: currentTenant.nombre,
          ruc: currentTenant.ruc,
          rol: currentTenant.rol
        } : null,
        isAuthenticated: true
      });
    }
  }
}));

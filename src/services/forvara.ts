// src/services/forvara.ts
import { ForvaraClient } from '../lib/forvara-sdk';

// Crear instancia del cliente Forvara
export const forvaraClient = new ForvaraClient({
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  appId: 'forvara-hub',
  enableOffline: true,
  debug: import.meta.env.DEV,
  // Si usas Supabase directamente desde el Hub también:
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY
});

// Exportar métodos de conveniencia
export const forvaraService = {
  client: forvaraClient,
  login: (identifier: string, password: string) => forvaraClient.login(identifier, password),
  logout: () => forvaraClient.logout(),
  selectTenant: (tenantId: string) => forvaraClient.selectTenant(tenantId),
  getCurrentUser: () => forvaraClient.getCurrentUser(),
  getCurrentTenant: () => forvaraClient.getCurrentTenant(),
  isAuthenticated: () => forvaraClient.isAuthenticated(),
  verifySubscription: (params?: any) => forvaraClient.verifySubscription(params),
  register: (userData: any) => forvaraClient.register(userData),
  getProfile: () => forvaraClient.getProfile(),
  updateProfile: (data: any) => forvaraClient.updateProfile(data)
};

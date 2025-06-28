// src/lib/api/auth.ts
import { supabase, api } from './client';
import { ForvaraUser } from '../../lib/forvara-sdk';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  avatarUrl?: string;
  // Extender con los campos de ForvaraUser
  nombre?: string;
  apellido?: string;
  telefono?: string;
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
  // Los métodos ya no son necesarios aquí porque usamos el SDK
  // Pero los dejamos por compatibilidad temporal
  
  async getCurrentUser(): Promise<User | null> {
    // Usar el SDK en su lugar
    const { forvaraService } = await import('../../services/forvara');
    const user = forvaraService.getCurrentUser();
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      phone: user.telefono,
      fullName: `${user.nombre} ${user.apellido}`,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono
    };
  },

  async getUserTenants(): Promise<UserTenant[]> {
    const { forvaraService } = await import('../../services/forvara');
    const user = forvaraService.getCurrentUser();
    if (!user) return [];
    
    return user.tenants.map(t => ({
      tenant: {
        id: t.id,
        name: t.nombre,
        identifier: t.ruc,
        logo_url: undefined,
        settings: {}
      },
      role: t.rol as any,
      joinedAt: new Date().toISOString()
    }));
  }
};

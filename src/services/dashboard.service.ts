import { apiCall } from './api';
import { DashboardStats, ActivityLog } from '@/types';

export const dashboardService = {
  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    return apiCall<DashboardStats>('get', '/dashboard/stats');
  },

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    return apiCall<ActivityLog[]>('get', `/dashboard/activity?limit=${limit}`);
  },

  // Get quick actions based on user/company state
  async getQuickActions(): Promise<any[]> {
    // For now, return static actions
    return [
      {
        id: 'invite-users',
        title: 'Invitar usuarios',
        description: 'Añade miembros a tu equipo',
        icon: 'user-plus',
        action: '/users',
        category: 'management'
      },
      {
        id: 'explore-apps',
        title: 'Explorar aplicaciones',
        description: 'Descubre nuevas herramientas',
        icon: 'shopping-bag',
        action: '/marketplace',
        category: 'apps'
      },
      {
        id: 'view-analytics',
        title: 'Ver analytics',
        description: 'Analiza el uso de tu empresa',
        icon: 'bar-chart',
        action: '/analytics',
        category: 'analytics'
      },
      {
        id: 'company-settings',
        title: 'Configurar empresa',
        description: 'Actualiza información empresarial',
        icon: 'settings',
        action: '/settings',
        category: 'management'
      }
    ];
  },

  // Get company usage metrics
  async getCompanyUsage(): Promise<any> {
    return apiCall<any>('get', '/dashboard/usage');
  }
};
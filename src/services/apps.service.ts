import { apiCall } from './api'

export interface App {
  id: string
  name: string
  description: string
  category: string
  price: string
  priceType: 'free' | 'monthly' | 'one-time'
  rating?: number
  downloads?: string
  features?: string[]
  status?: 'available' | 'installed' | 'coming-soon'
  featured?: boolean
}

export interface InstalledApp {
  id: string
  name: string
  description: string
  category: string
  status: 'active' | 'trial' | 'suspended' | 'pending'
  subscription: {
    plan: string
    price: string
    billingCycle: 'monthly' | 'yearly' | 'free'
    nextBilling?: string
    trialEnds?: string
  }
  usage: {
    lastAccessed: string
    monthlyActiveUsers: number
    storageUsed: string
    apiCalls: number
  }
  permissions: string[]
  installedDate: string
}

export const appsService = {
  // Get all available apps from marketplace
  async getAvailableApps(): Promise<App[]> {
    try {
      return await apiCall<App[]>('get', '/apps');
    } catch (error) {
      console.error('Error fetching available apps:', error)
      // Return fallback mock data for development
      return [
        {
          id: 'elaris-crm',
          name: 'Elaris CRM',
          description: 'Sistema completo de gestión de relaciones con clientes',
          category: 'CRM & Ventas',
          price: '$29',
          priceType: 'monthly',
          rating: 4.8,
          downloads: '1.2k',
          features: ['Gestión de contactos', 'Pipeline de ventas', 'Reportes avanzados'],
          status: 'available',
          featured: true
        },
        {
          id: 'forcontable',
          name: 'ForContable',
          description: 'Contabilidad y facturación para PyMEs',
          category: 'Contabilidad',
          price: '$39',
          priceType: 'monthly',
          rating: 4.7,
          downloads: '850',
          features: ['Facturación electrónica', 'Estados financieros', 'Declaraciones DGI'],
          status: 'available'
        },
        {
          id: 'forinventario',
          name: 'ForInventario',
          description: 'Control de inventario y almacén',
          category: 'Inventario',
          price: '$25',
          priceType: 'monthly',
          rating: 4.6,
          downloads: '640',
          features: ['Control de stock', 'Alertas de inventario', 'Reportes de movimientos'],
          status: 'available'
        }
      ];
    }
  },

  // Get user's installed apps
  async getInstalledApps(): Promise<InstalledApp[]> {
    try {
      return await apiCall<InstalledApp[]>('get', '/apps/installed');
    } catch (error) {
      console.error('Error fetching installed apps:', error)
      return []
    }
  },

  // Get specific app details
  async getApp(appId: string): Promise<App | null> {
    try {
      return await apiCall<App>('get', `/apps/${appId}`);
    } catch (error) {
      console.error('Error fetching app details:', error)
      return null
    }
  },

  // Install an app
  async installApp(appId: string, planId?: string): Promise<any> {
    try {
      return await apiCall<any>('post', `/apps/${appId}/install`, { planId });
    } catch (error) {
      console.error('Error installing app:', error)
      throw error
    }
  },

  // Uninstall an app
  async uninstallApp(appId: string): Promise<any> {
    try {
      return await apiCall<any>('post', `/apps/${appId}/uninstall`);
    } catch (error) {
      console.error('Error uninstalling app:', error)
      throw error
    }
  },

  // Launch an app
  async launchApp(appId: string): Promise<{ url: string; message: string }> {
    try {
      return await apiCall<{ url: string; message: string }>('post', `/apps/${appId}/launch`);
    } catch (error) {
      console.error('Error launching app:', error)
      throw error
    }
  }
}
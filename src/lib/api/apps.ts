import { api } from './client';

export interface ForvaraApp {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  category: 'business' | 'communication' | 'analytics' | 'productivity';
  status: 'available' | 'coming_soon' | 'beta';
  pricing: {
    monthly: number;
    annual?: number;
    currency: string;
  };
  features: string[];
  addons?: {
    id: string;
    name: string;
    description: string;
    price_monthly: number;
  }[];
}

export interface InstalledApp {
  app: ForvaraApp;
  subscription: {
    status: 'active' | 'trial' | 'canceled';
    plan: string;
    addons: string[];
  };
  usage?: {
    last_accessed?: string;
    total_users?: number;
  };
}

export const appsService = {
  // Get all available Forvara apps
  async getAvailableApps(): Promise<ForvaraApp[]> {
    // For now, return mock data since this would come from a catalog
    return [
      {
        id: 'elaris',
        name: 'elaris',
        displayName: 'Elaris ERP',
        description: 'Complete business management solution',
        icon: 'Package',
        category: 'business',
        status: 'available',
        pricing: { monthly: 50, annual: 500, currency: 'USD' },
        features: [
          '10 users included',
          'Unlimited invoices',
          '3GB cloud storage',
          'API access',
          'Multi-warehouse'
        ],
        addons: [
          {
            id: 'restaurant',
            name: 'Restaurant Module',
            description: 'POS, tables, kitchen display',
            price_monthly: 15
          },
          {
            id: 'logistics',
            name: 'Logistics Module',
            description: 'Route optimization, fleet tracking',
            price_monthly: 20
          }
        ]
      },
      {
        id: 'forvara-mail',
        name: 'forvara-mail',
        displayName: 'Forvara Mail',
        description: 'Team communication and internal messaging',
        icon: 'Mail',
        category: 'communication',
        status: 'available',
        pricing: { monthly: 20, annual: 200, currency: 'USD' },
        features: [
          'Unlimited messages',
          'File attachments',
          'Team channels',
          'Search history'
        ]
      },
      {
        id: 'forvara-analytics',
        name: 'forvara-analytics',
        displayName: 'Forvara Analytics',
        description: 'Business intelligence and reporting',
        icon: 'BarChart3',
        category: 'analytics',
        status: 'coming_soon',
        pricing: { monthly: 35, annual: 350, currency: 'USD' },
        features: [
          'Custom dashboards',
          'Real-time data',
          'Export to PDF/Excel',
          'Scheduled reports'
        ]
      }
    ];
  },

  // Get installed apps for tenant
  async getInstalledApps(tenantId: string): Promise<InstalledApp[]> {
    const subscriptions = await api.get<any[]>(`/api/subscriptions?tenantId=${tenantId}`);
    const availableApps = await this.getAvailableApps();
    
    return subscriptions.map(sub => ({
      app: availableApps.find(app => app.name === sub.app_name)!,
      subscription: {
        status: sub.status,
        plan: sub.plan_name,
        addons: sub.addons || []
      }
    }));
  },

  // Check if app is installed
  async isAppInstalled(tenantId: string, appName: string): Promise<boolean> {
    try {
      const sub = await api.get(`/api/subscription/status?tenantId=${tenantId}&app=${appName}`);
      return sub && ['active', 'trial'].includes(sub.status);
    } catch {
      return false;
    }
  }
};

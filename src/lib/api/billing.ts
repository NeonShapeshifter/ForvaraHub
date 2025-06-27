import { api } from './client';

export interface Subscription {
  id: string;
  tenant_id: string;
  app_name: string;
  plan_name: string;
  status: 'active' | 'trial' | 'past_due' | 'canceled';
  current_period_start: string;
  current_period_end: string;
  features: {
    max_users?: number;
    max_storage_gb?: number;
    max_invoices?: number;
    [key: string]: any;
  };
  addons?: string[];
  price_monthly: number;
}

export interface BillingSummary {
  total_monthly: number;
  subscriptions: Subscription[];
  next_billing_date: string;
  payment_method?: {
    type: 'card';
    last4: string;
    brand: string;
  };
}

export interface UsageStats {
  users: { current: number; limit: number };
  storage: { current_gb: number; limit_gb: number };
  api_calls?: { current: number; limit: number };
  invoices?: { current: number; limit: number };
}

export const billingService = {
  // Get billing summary for current tenant
  async getBillingSummary(tenantId: string): Promise<BillingSummary> {
    return api.get<BillingSummary>(`/api/billing/summary?tenantId=${tenantId}`);
  },

  // Get subscription details
  async getSubscription(tenantId: string, appName: string): Promise<Subscription> {
    return api.get<Subscription>(`/api/subscription/status?tenantId=${tenantId}&app=${appName}`);
  },

  // Get usage statistics
  async getUsageStats(tenantId: string): Promise<UsageStats> {
    return api.get<UsageStats>(`/api/subscription/usage?tenantId=${tenantId}`);
  },

  // Upgrade subscription
  async upgradeSubscription(data: {
    tenantId: string;
    app: string;
    planName: string;
    addons?: string[];
  }) {
    return api.post('/api/subscription/upgrade', data);
  },

  // Add addon
  async addAddon(tenantId: string, app: string, addon: string) {
    return api.post('/api/subscription/addon', { tenantId, app, addon });
  },

  // Cancel subscription
  async cancelSubscription(tenantId: string, app: string) {
    return api.post('/api/subscription/cancel', { tenantId, app });
  }
};

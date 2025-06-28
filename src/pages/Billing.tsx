// src/pages/Billing.tsx
import React, { useState } from 'react';
import { 
  CreditCard, 
  Package, 
  Users, 
  HardDrive, 
  TrendingUp, 
  Calendar,
  Plus,
  Check,
  X,
  AlertCircle,
  Zap,
  Download,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBillingSummary, useUsageStats } from '../hooks/useBilling';
import { useInstalledApps, useAvailableApps } from '../hooks/useApps';

const BillingView = () => {
  const { currentTenant } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'subscriptions' | 'invoices'>('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Fetch real data
  const { data: billingSummary, loading: billingLoading } = useBillingSummary();
  const { data: usageStats, loading: usageLoading } = useUsageStats();
  const { data: installedApps, loading: appsLoading } = useInstalledApps();
  const { data: availableApps } = useAvailableApps();

  const isLoading = billingLoading || usageLoading || appsLoading;

  // Calculate savings vs competitors
  const calculateSavings = () => {
    // Elaris competitors charge ~$110 for 5 users
    // We charge $50 for 10 users
    const competitorMonthly = installedApps?.length ? installedApps.length * 110 : 0;
    const ourMonthly = billingSummary?.total_monthly || 0;
    return Math.max(0, competitorMonthly - ourMonthly);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get available addons (apps not yet installed)
  const availableAddons = availableApps?.filter(app => 
    !installedApps?.some(installed => installed.app.id === app.id)
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-text/60">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-text/60">Please select a company to view billing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-white/10">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold mb-2">Billing & Usage</h1>
          <p className="text-text/70">Manage your subscriptions and track usage across all apps</p>
        </div>
        
        {/* Tabs */}
        <div className="px-8 flex gap-6">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              selectedTab === 'overview' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text/70 hover:text-text'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('subscriptions')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              selectedTab === 'subscriptions' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text/70 hover:text-text'
            }`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setSelectedTab('invoices')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              selectedTab === 'invoices' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text/70 hover:text-text'
            }`}
          >
            Invoices
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Monthly Total */}
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-accent bg-accent/20 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  {formatCurrency(billingSummary?.total_monthly || 0)}
                </h3>
                <p className="text-text/60 text-sm">Monthly total</p>
                {calculateSavings() > 0 && (
                  <div className="mt-4 flex items-center text-sm text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Saving {formatCurrency(calculateSavings())}/mo vs competitors
                  </div>
                )}
              </div>

              {/* Next Billing */}
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">
                  {formatDate(billingSummary?.next_billing_date || null)}
                </h3>
                <p className="text-text/60 text-sm">Next billing date</p>
                {billingSummary?.payment_method && (
                  <div className="mt-4">
                    <p className="text-sm text-text/70">
                      {billingSummary.payment_method.brand} •••• {billingSummary.payment_method.last4}
                    </p>
                  </div>
                )}
              </div>

              {/* Active Apps */}
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  {billingSummary?.subscriptions.length || 0}
                </h3>
                <p className="text-text/60 text-sm">Active applications</p>
                <button 
                  onClick={() => window.location.href = '/apps'}
                  className="mt-4 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  Discover more apps
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Usage Overview */}
            {usageStats && (
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Resource Usage
                </h3>
                <div className="space-y-4">
                  {/* Users */}
                  {usageStats.users && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text/60 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Users
                        </span>
                        <span className="text-text/80">
                          {usageStats.users.current}/{usageStats.users.limit}
                        </span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${getUsagePercentage(usageStats.users.current, usageStats.users.limit)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Storage */}
                  {usageStats.storage && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text/60 flex items-center gap-1">
                          <HardDrive className="w-4 h-4" />
                          Storage
                        </span>
                        <span className="text-text/80">
                          {usageStats.storage.current_gb}/{usageStats.storage.limit_gb} GB
                        </span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${getUsagePercentage(usageStats.storage.current_gb, usageStats.storage.limit_gb)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Available Add-ons */}
            {availableAddons.length > 0 && (
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Available Apps</h3>
                  <span className="text-sm text-text/60">Expand your capabilities</span>
                </div>
                <div className="grid gap-4">
                  {availableAddons.slice(0, 3).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{app.displayName}</h4>
                        <p className="text-sm text-text/60 mt-1">{app.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold">{formatCurrency(app.pricing.monthly)}/mo</p>
                        <button 
                          onClick={() => window.location.href = `/apps/${app.id}`}
                          className="mt-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'subscriptions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-text/70">Manage your active subscriptions and add-ons</p>
              <button 
                onClick={() => window.location.href = '/apps'}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New App
              </button>
            </div>
            
            {billingSummary?.subscriptions && billingSummary.subscriptions.length > 0 ? (
              billingSummary.subscriptions.map(sub => (
                <div key={sub.id} className="bg-surface rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{sub.app_name}</h3>
                      <p className="text-text/60 mb-4">{sub.plan_name} Plan</p>
                      
                      <div className="space-y-2 mb-4">
                        {sub.features && Object.entries(sub.features).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-text/80">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {
                                typeof value === 'number' ? value : 
                                Array.isArray(value) ? value.join(', ') : 
                                String(value)
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {sub.addons && sub.addons.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Active Add-ons:</p>
                          <div className="flex gap-2">
                            {sub.addons.map(addon => (
                              <span key={addon} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                {addon}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-text/60">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {sub.status === 'trial' 
                            ? `Trial ends ${formatDate(sub.current_period_end)}`
                            : `Renews ${formatDate(sub.current_period_end)}`
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold mb-2">{formatCurrency(sub.price_monthly)}</p>
                      <p className="text-sm text-text/60 mb-4">per month</p>
                      <button 
                        onClick={() => window.location.href = `/apps/${sub.app_name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Manage →
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-surface rounded-xl p-12 border border-white/10 text-center">
                <Package className="w-16 h-16 text-text/20 mx-auto mb-4" />
                <p className="text-text/60 mb-4">No active subscriptions</p>
                <button 
                  onClick={() => window.location.href = '/apps'}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
                >
                  Browse Apps
                </button>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'invoices' && (
          <div className="space-y-4">
            <p className="text-text/70 mb-6">Download your billing history and invoices</p>
            
            <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-medium text-text/60">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-text/60">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-text/60">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-text/60">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TODO: Fetch real invoices from API */}
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-text/60">
                      <Download className="w-12 h-12 text-text/20 mx-auto mb-4" />
                      <p>No invoices available yet</p>
                      <p className="text-sm mt-2">Invoices will appear here after your first billing cycle</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingView;

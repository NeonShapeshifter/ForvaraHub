import React, { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';

// Mock data for demonstration
const mockBillingData = {
  total_monthly: 85,
  next_billing_date: '2025-07-27',
  payment_method: {
    type: 'card',
    brand: 'Visa',
    last4: '4242'
  },
  subscriptions: [
    {
      id: '1',
      app_name: 'Elaris ERP',
      plan_name: 'Core',
      status: 'active',
      price_monthly: 50,
      features: {
        max_users: 10,
        max_storage_gb: 3,
        invoices: 'unlimited'
      },
      addons: ['restaurant'],
      usage: {
        users: { current: 7, limit: 10 },
        storage: { current_gb: 1.2, limit_gb: 3 }
      }
    },
    {
      id: '2',
      app_name: 'Forvara Mail',
      plan_name: 'Standard',
      status: 'active',
      price_monthly: 20,
      features: {
        messages: 'unlimited',
        storage_gb: 5
      },
      usage: {
        storage: { current_gb: 0.8, limit_gb: 5 }
      }
    }
  ],
  available_addons: [
    {
      id: 'logistics',
      name: 'Logistics Module',
      app: 'Elaris ERP',
      description: 'Route optimization & fleet tracking',
      price_monthly: 20
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing Module',
      app: 'Elaris ERP',
      description: 'Production planning & quality control',
      price_monthly: 25
    }
  ]
};

const BillingView = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'subscriptions' | 'invoices'>('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Calculate savings vs competitors
  const calculateSavings = () => {
    // Elaris competitors charge ~$110 for 5 users
    // We charge $50 for 10 users
    const elarisCompetitor = 110;
    const ourPrice = 50;
    return elarisCompetitor - ourPrice;
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
                <h3 className="text-3xl font-bold mb-1">{formatCurrency(mockBillingData.total_monthly)}</h3>
                <p className="text-text/60 text-sm">Monthly total</p>
                <div className="mt-4 flex items-center text-sm text-green-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Saving {formatCurrency(calculateSavings())}/mo vs competitors
                </div>
              </div>

              {/* Next Billing */}
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">July 27, 2025</h3>
                <p className="text-text/60 text-sm">Next billing date</p>
                <div className="mt-4">
                  <p className="text-sm text-text/70">
                    {mockBillingData.payment_method.brand} •••• {mockBillingData.payment_method.last4}
                  </p>
                </div>
              </div>

              {/* Active Apps */}
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{mockBillingData.subscriptions.length}</h3>
                <p className="text-text/60 text-sm">Active applications</p>
                <button className="mt-4 text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                  Discover more apps
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Usage Overview */}
            <div className="bg-surface rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Resource Usage
              </h3>
              <div className="space-y-4">
                {mockBillingData.subscriptions.map(sub => (
                  <div key={sub.id} className="space-y-3">
                    <h4 className="font-medium text-sm text-text/80">{sub.app_name}</h4>
                    {sub.usage?.users && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-text/60 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Users
                          </span>
                          <span className="text-text/80">
                            {sub.usage.users.current}/{sub.usage.users.limit}
                          </span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${getUsagePercentage(sub.usage.users.current, sub.usage.users.limit)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {sub.usage?.storage && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-text/60 flex items-center gap-1">
                            <HardDrive className="w-4 h-4" />
                            Storage
                          </span>
                          <span className="text-text/80">
                            {sub.usage.storage.current_gb}/{sub.usage.storage.limit_gb} GB
                          </span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all duration-300"
                            style={{ width: `${getUsagePercentage(sub.usage.storage.current_gb, sub.usage.storage.limit_gb)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Available Add-ons */}
            <div className="bg-surface rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Available Add-ons</h3>
                <span className="text-sm text-text/60">Expand your capabilities</span>
              </div>
              <div className="grid gap-4">
                {mockBillingData.available_addons.map(addon => (
                  <div key={addon.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{addon.name}</h4>
                      <p className="text-sm text-text/60 mt-1">{addon.description}</p>
                      <p className="text-sm text-text/70 mt-2">For {addon.app}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold">{formatCurrency(addon.price_monthly)}/mo</p>
                      <button className="mt-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'subscriptions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-text/70">Manage your active subscriptions and add-ons</p>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                Add New App
              </button>
            </div>
            
            {mockBillingData.subscriptions.map(sub => (
              <div key={sub.id} className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{sub.app_name}</h3>
                    <p className="text-text/60 mb-4">{sub.plan_name} Plan</p>
                    
                    <div className="space-y-2 mb-4">
                      {Object.entries(sub.features).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-text/80">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {sub.addons.length > 0 && (
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
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold mb-2">{formatCurrency(sub.price_monthly)}</p>
                    <p className="text-sm text-text/60 mb-4">per month</p>
                    <button className="text-sm text-primary hover:text-primary/80">
                      Manage →
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                  {[
                    { date: 'Jun 27, 2025', amount: 85, status: 'paid' },
                    { date: 'May 27, 2025', amount: 85, status: 'paid' },
                    { date: 'Apr 27, 2025', amount: 70, status: 'paid' },
                  ].map((invoice, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="p-4">{invoice.date}</td>
                      <td className="p-4">{formatCurrency(invoice.amount)}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-primary hover:text-primary/80 flex items-center gap-1 ml-auto">
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
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

import React from 'react';
import { 
  Package, 
  Mail, 
  BarChart3, 
  Users, 
  Activity,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  DollarSign,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  // Mock data
  const stats = {
    activeUsers: 7,
    totalInvoices: 1247,
    monthlyRevenue: 45280,
    storageUsed: 1.2
  };

  const recentActivity = [
    {
      id: 1,
      type: 'invoice',
      action: 'New invoice created',
      details: 'INV-2025-0142',
      timestamp: '2 minutes ago',
      icon: FileText,
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'user',
      action: 'New team member joined',
      details: 'maria@company.com',
      timestamp: '1 hour ago',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      id: 3,
      type: 'system',
      action: 'Backup completed',
      details: 'All data secured',
      timestamp: '3 hours ago',
      icon: CheckCircle,
      color: 'text-accent'
    },
    {
      id: 4,
      type: 'alert',
      action: 'Storage usage high',
      details: '80% of quota used',
      timestamp: '5 hours ago',
      icon: AlertCircle,
      color: 'text-yellow-400'
    }
  ];

  const quickActions = [
    { label: 'Create Invoice', icon: FileText, color: 'bg-green-500/20 text-green-400' },
    { label: 'Add User', icon: Users, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'View Reports', icon: BarChart3, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Send Mail', icon: Mail, color: 'bg-accent/20 text-accent' }
  ];

  const apps = [
    {
      id: 'elaris',
      name: 'Elaris ERP',
      description: 'Business management',
      status: 'active',
      lastAccessed: '5 min ago',
      users: 7,
      icon: Package,
      primaryStat: '142 invoices this month',
      trend: '+12%'
    },
    {
      id: 'mail',
      name: 'Forvara Mail',
      description: 'Team communication',
      status: 'active',
      lastAccessed: '2 hours ago',
      messages: 384,
      icon: Mail,
      primaryStat: '12 unread messages',
      trend: null
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Business intelligence',
      status: 'coming_soon',
      icon: BarChart3,
      primaryStat: 'Coming in Q3 2025',
      trend: null
    }
  ];

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-text/70">Here's what's happening across your business ecosystem</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-primary/60" />
            <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
              +2 this week
            </span>
          </div>
          <p className="text-2xl font-bold">{stats.activeUsers}/10</p>
          <p className="text-sm text-text/60 mt-1">Active users</p>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-accent/60" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold">{stats.totalInvoices.toLocaleString()}</p>
          <p className="text-sm text-text/60 mt-1">Total invoices</p>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-400/60" />
            <span className="text-xs text-text/60">This month</span>
          </div>
          <p className="text-2xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(1)}k</p>
          <p className="text-sm text-text/60 mt-1">Revenue tracked</p>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-secondary/60" />
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold">99.9%</p>
          <p className="text-sm text-text/60 mt-1">Uptime</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Apps Section - 2 cols */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Apps</h2>
              <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {apps.map(app => (
                <div 
                  key={app.id} 
                  className={`p-4 rounded-lg border transition-all cursor-pointer
                    ${app.status === 'active' 
                      ? 'bg-background border-white/10 hover:border-primary/50' 
                      : 'bg-background/50 border-white/5 opacity-60'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      app.status === 'active' ? 'bg-primary/20' : 'bg-white/5'
                    }`}>
                      <app.icon className={`w-6 h-6 ${
                        app.status === 'active' ? 'text-primary' : 'text-text/40'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {app.name}
                            {app.status === 'coming_soon' && (
                              <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                                Coming Soon
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-text/60 mt-1">{app.description}</p>
                        </div>
                        {app.lastAccessed && (
                          <span className="text-xs text-text/50 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {app.lastAccessed}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-text/80">
                          {app.primaryStat}
                        </p>
                        {app.trend && (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {app.trend}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed - 1 col */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                <Activity className="w-4 h-4 text-text/60" />
              </button>
            </div>

            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-white/5`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-text/60 mt-0.5">{activity.details}</p>
                    <p className="text-xs text-text/40 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium">
              View all activity →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="p-4 rounded-lg bg-background hover:bg-white/5 border border-white/10 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-6 bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary">Pro tip</p>
          <p className="text-sm text-text/80 mt-1">
            You can press <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Cmd+K</kbd> anywhere to quickly search and navigate
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

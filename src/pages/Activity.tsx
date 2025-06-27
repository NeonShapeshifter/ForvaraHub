import React, { useState } from 'react';
import { 
  Shield,
  Monitor,
  Smartphone,
  Globe,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  LogOut,
  Ban,
  RefreshCw,
  Download,
  Filter,
  Search,
  ChevronDown,
  Wifi,
  Chrome,
  AlertTriangle,
  Activity
} from 'lucide-react';

// Mock data
const mockActiveSessions = [
  {
    id: '1',
    device: 'Lenovo Legion 5',
    deviceType: 'Windows 11',
    browser: 'Chrome 120',
    location: 'Panama City, Panama',
    ip: '181.75.33.110',
    startTime: '2025-06-27T11:04:00Z',
    lastActivity: '2 minutes ago',
    current: true
  },
  {
    id: '2',
    device: 'iPhone 13 Pro',
    deviceType: 'iOS 17.5',
    browser: 'Safari Mobile',
    location: 'David, Chiriquí, Panama',
    ip: '181.33.11.215',
    startTime: '2025-06-27T09:30:00Z',
    lastActivity: '1 hour ago',
    current: false
  },
  {
    id: '3',
    device: 'MacBook Pro M2',
    deviceType: 'macOS Sonoma',
    browser: 'Safari 17',
    location: 'San José, Costa Rica',
    ip: '201.192.168.45',
    startTime: '2025-06-26T14:22:00Z',
    lastActivity: '1 day ago',
    current: false
  }
];

const mockActivityLog = [
  {
    id: '1',
    action: 'Successful login',
    device: 'Lenovo Legion 5',
    location: 'Panama City, Panama',
    ip: '181.75.33.110',
    timestamp: '2025-06-27T11:04:00Z',
    status: 'success',
    details: 'Login with email'
  },
  {
    id: '2',
    action: 'Failed login attempt',
    device: 'Unknown Device',
    location: 'Mexico City, Mexico',
    ip: '187.190.38.45',
    timestamp: '2025-06-27T10:45:00Z',
    status: 'failed',
    details: 'Invalid password'
  },
  {
    id: '3',
    action: 'Password changed',
    device: 'iPhone 13 Pro',
    location: 'David, Panama',
    ip: '181.33.11.215',
    timestamp: '2025-06-26T18:30:00Z',
    status: 'warning',
    details: 'Password successfully updated'
  },
  {
    id: '4',
    action: 'New device login',
    device: 'MacBook Pro M2',
    location: 'San José, Costa Rica',
    ip: '201.192.168.45',
    timestamp: '2025-06-26T14:22:00Z',
    status: 'info',
    details: 'First login from this device'
  },
  {
    id: '5',
    action: 'API key generated',
    device: 'Lenovo Legion 5',
    location: 'Panama City, Panama',
    ip: '181.75.33.110',
    timestamp: '2025-06-25T16:15:00Z',
    status: 'success',
    details: 'New API key for Elaris integration'
  }
];

const ActivityPage = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'activity'>('sessions');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType.toLowerCase().includes('windows') || deviceType.toLowerCase().includes('mac')) {
      return Monitor;
    }
    return Smartphone;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'failed':
        return XCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-text/60';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleTerminateSession = (sessionId: string) => {
    console.log('Terminating session:', sessionId);
    // In real app, make API call to terminate session
  };

  const handleTerminateAllSessions = () => {
    console.log('Terminating all sessions');
    // In real app, make API call to terminate all sessions
  };

  const filteredActivity = mockActivityLog.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && activity.status === filterStatus;
  });

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-white/10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Security & Activity</h1>
              <p className="text-text/70">Monitor your account activity and manage active sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Log
              </button>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 flex gap-6">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              activeTab === 'sessions' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text/70 hover:text-text'
            }`}
          >
            Active Sessions
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              activeTab === 'activity' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text/70 hover:text-text'
            }`}
          >
            Activity Log
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {/* Security Alert */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex items-start gap-4">
              <Shield className="w-6 h-6 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Security Tip</h3>
                <p className="text-text/80 text-sm">
                  We'll notify you when someone logs into your account from a new device or location. 
                  Make sure your notification settings are up to date.
                </p>
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Active Sessions ({mockActiveSessions.length})</h2>
                <button 
                  onClick={handleTerminateAllSessions}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Terminate all other sessions
                </button>
              </div>

              <div className="space-y-4">
                {mockActiveSessions.map(session => {
                  const DeviceIcon = getDeviceIcon(session.deviceType);
                  
                  return (
                    <div 
                      key={session.id} 
                      className={`bg-surface rounded-xl p-6 border ${
                        session.current ? 'border-primary/50' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            session.current ? 'bg-primary/20' : 'bg-white/5'
                          }`}>
                            <DeviceIcon className={`w-6 h-6 ${
                              session.current ? 'text-primary' : 'text-text/60'
                            }`} />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold">{session.device}</h3>
                              {session.current && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
                                  Current Session
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-sm text-text/70">
                              <p className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                {session.browser} • {session.deviceType}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {session.location}
                              </p>
                              <p className="flex items-center gap-2">
                                <Wifi className="w-4 h-4" />
                                IP: {session.ip}
                              </p>
                              <p className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Last active: {session.lastActivity}
                              </p>
                            </div>
                          </div>
                        </div>

                        {!session.current && (
                          <button
                            onClick={() => handleTerminateSession(session.id)}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            End Session
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search activity..."
                    className="pl-10 pr-4 py-2 bg-surface rounded-lg border border-white/10 focus:border-primary focus:outline-none text-sm w-80"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-surface rounded-lg border border-white/10 focus:border-primary focus:outline-none text-sm"
                >
                  <option value="all">All Activity</option>
                  <option value="success">Successful</option>
                  <option value="failed">Failed</option>
                  <option value="warning">Warnings</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {/* Activity Log */}
            <div className="space-y-3">
              {filteredActivity.map(activity => {
                const StatusIcon = getStatusIcon(activity.status);
                const statusColor = getStatusColor(activity.status);
                
                return (
                  <div key={activity.id} className="bg-surface rounded-lg p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-white/5`}>
                        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{activity.action}</h4>
                            <p className="text-sm text-text/60 mt-1">{activity.details}</p>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-text/50">
                              <span className="flex items-center gap-1">
                                <Monitor className="w-3 h-3" />
                                {activity.device}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {activity.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Wifi className="w-3 h-3" />
                                {activity.ip}
                              </span>
                            </div>
                          </div>
                          
                          <span className="text-xs text-text/50">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredActivity.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text/60">No activity found matching your filters.</p>
              </div>
            )}

            {/* Load More */}
            <div className="text-center">
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
                Load More Activity
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;

// src/pages/Activity.tsx
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
  Activity,
  Loader2,
  UserX,
  FileText,
  Users,
  Key,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRecentActivity, useActiveSessions, useTerminateSession } from '../hooks/useActivity';
import { ActivityLog, LoginSession } from '../lib/api/activity';

const ActivityPage = () => {
  const { currentTenant } = useAuth();
  const [activeTab, setActiveTab] = useState<'sessions' | 'activity'>('sessions');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);

  // Fetch real data
  const { data: activeSessions, loading: sessionsLoading, refetch: refetchSessions } = useActiveSessions();
  const { data: activityLogs, loading: logsLoading, refetch: refetchLogs } = useRecentActivity(50);
  const { execute: terminateSession } = useTerminateSession();

  const isLoading = sessionsLoading || logsLoading;

  // Get device icon based on device type
  const getDeviceIcon = (device: string) => {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes('mobile') || deviceLower.includes('iphone') || deviceLower.includes('android')) {
      return Smartphone;
    }
    return Monitor;
  };

  // Get action icon and color
  const getActionDetails = (action: string) => {
    const actionMap: Record<string, { icon: any; color: string }> = {
      'LOGIN_SUCCESS': { icon: CheckCircle, color: 'text-green-400' },
      'LOGIN_FAILED': { icon: XCircle, color: 'text-red-400' },
      'LOGOUT': { icon: LogOut, color: 'text-blue-400' },
      'PASSWORD_CHANGED': { icon: Key, color: 'text-yellow-400' },
      'PROFILE_UPDATED': { icon: Users, color: 'text-purple-400' },
      'TENANT_CREATED': { icon: FileText, color: 'text-green-400' },
      'TENANT_SELECTED': { icon: CheckCircle, color: 'text-blue-400' },
      'SUBSCRIPTION_UPDATED': { icon: Settings, color: 'text-purple-400' },
      'API_KEY_GENERATED': { icon: Key, color: 'text-yellow-400' },
      'PERMISSION_CHANGED': { icon: Shield, color: 'text-orange-400' }
    };

    return actionMap[action] || { icon: Activity, color: 'text-text/60' };
  };

  // Format action name for display
  const formatActionName = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Handle session termination
  const handleTerminateSession = async (sessionId: string) => {
    setTerminatingSession(sessionId);
    try {
      await terminateSession(sessionId);
      await refetchSessions();
      // Show success notification
      console.log('Session terminated successfully');
    } catch (error) {
      console.error('Failed to terminate session:', error);
      alert('Failed to terminate session. Please try again.');
    } finally {
      setTerminatingSession(null);
    }
  };

  const handleTerminateAllSessions = async () => {
    if (!confirm('Are you sure you want to terminate all other sessions? You will remain logged in on this device.')) {
      return;
    }

    const otherSessions = activeSessions?.filter(s => !s.current) || [];
    for (const session of otherSessions) {
      await handleTerminateSession(session.id);
    }
  };

  // Filter activity logs
  const filteredActivity = activityLogs?.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.metadata?.device?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.metadata?.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    // Map filter status to action types
    const statusMap: Record<string, string[]> = {
      'success': ['LOGIN_SUCCESS', 'LOGOUT', 'PROFILE_UPDATED', 'TENANT_CREATED'],
      'failed': ['LOGIN_FAILED'],
      'warning': ['PASSWORD_CHANGED', 'PERMISSION_CHANGED'],
      'info': ['TENANT_SELECTED', 'API_KEY_GENERATED']
    };

    const actionsForStatus = statusMap[filterStatus] || [];
    return matchesSearch && actionsForStatus.includes(activity.action);
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-text/60">Loading activity data...</p>
        </div>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-text/60">Please select a company to view activity</p>
        </div>
      </div>
    );
  }

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
              <button 
                onClick={() => refetchSessions()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
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
            {activeSessions && activeSessions.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                {activeSessions.length}
              </span>
            )}
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
                <h2 className="text-xl font-semibold">
                  Active Sessions ({activeSessions?.length || 0})
                </h2>
                {activeSessions && activeSessions.length > 1 && (
                  <button 
                    onClick={handleTerminateAllSessions}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Terminate all other sessions
                  </button>
                )}
              </div>

              {activeSessions && activeSessions.length > 0 ? (
                <div className="space-y-4">
                  {activeSessions.map(session => {
                    const DeviceIcon = getDeviceIcon(session.device);
                    
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
                                  {session.browser}
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
                                  Started: {formatTimestamp(session.started_at)}
                                  {' • '}
                                  Last active: {formatTimestamp(session.last_activity)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {!session.current && (
                            <button
                              onClick={() => handleTerminateSession(session.id)}
                              disabled={terminatingSession === session.id}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:bg-red-500/10 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                              {terminatingSession === session.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Ending...
                                </>
                              ) : (
                                <>
                                  <LogOut className="w-4 h-4" />
                                  End Session
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-surface rounded-xl p-12 border border-white/10 text-center">
                  <Monitor className="w-16 h-16 text-text/20 mx-auto mb-4" />
                  <p className="text-text/60">No active sessions found</p>
                </div>
              )}
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

              <button 
                onClick={() => refetchLogs()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {/* Activity Log */}
            {filteredActivity.length > 0 ? (
              <div className="space-y-3">
                {filteredActivity.map(activity => {
                  const { icon: ActionIcon, color } = getActionDetails(activity.action);
                  
                  return (
                    <div key={activity.id} className="bg-surface rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-white/5`}>
                          <ActionIcon className={`w-5 h-5 ${color}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{formatActionName(activity.action)}</h4>
                              {activity.user_name && (
                                <p className="text-sm text-text/60 mt-1">by {activity.user_name}</p>
                              )}
                              
                              <div className="flex items-center gap-4 mt-2 text-xs text-text/50">
                                {activity.metadata?.device && (
                                  <span className="flex items-center gap-1">
                                    <Monitor className="w-3 h-3" />
                                    {activity.metadata.device}
                                  </span>
                                )}
                                {activity.metadata?.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {activity.metadata.location}
                                  </span>
                                )}
                                {activity.metadata?.ip && (
                                  <span className="flex items-center gap-1">
                                    <Wifi className="w-3 h-3" />
                                    {activity.metadata.ip}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <span className="text-xs text-text/50">
                              {formatTimestamp(activity.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-surface rounded-xl p-12 border border-white/10 text-center">
                <Activity className="w-16 h-16 text-text/20 mx-auto mb-4" />
                <p className="text-text/60">No activity found matching your filters</p>
              </div>
            )}

            {/* Load More */}
            {activityLogs && activityLogs.length >= 50 && (
              <div className="text-center">
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
                  Load More Activity
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;

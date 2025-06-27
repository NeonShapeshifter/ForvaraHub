import { api } from './client'
export interface ActivityLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: {
    device?: string;
    browser?: string;
    location?: string;
    ip?: string;
  };
  created_at: string;
  success: boolean;
}

export interface LoginSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  started_at: string;
  last_activity: string;
  current: boolean;
}

export const activityService = {
  // Get recent activity logs
  async getRecentActivity(tenantId: string, limit = 20): Promise<ActivityLog[]> {
    return api.get<ActivityLog[]>(`/api/activity/recent?tenantId=${tenantId}&limit=${limit}`);
  },

  // Get active sessions
  async getActiveSessions(): Promise<LoginSession[]> {
    return api.get<LoginSession[]>('/api/activity/sessions');
  },

  // Terminate a session
  async terminateSession(sessionId: string): Promise<void> {
    await api.delete(`/api/activity/sessions/${sessionId}`);
  }
};

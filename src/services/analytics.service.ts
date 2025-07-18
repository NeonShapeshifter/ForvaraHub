import { apiCall } from './api'

export interface AnalyticsOverview {
  total_users: number;
  active_users_7d: number;
  total_apps: number;
  active_subscriptions: number;
  monthly_revenue: number;
  storage_used_gb: number;
}

export interface AnalyticsTrends {
  users_growth: number;
  revenue_growth: number;
  apps_growth: number;
}

export interface ActivityData {
  date: string;
  users: number;
  revenue: number;
  apps_used: number;
}

export interface TopApp {
  app_name: string;
  usage_count: number;
  revenue: number;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  trends: AnalyticsTrends;
  activity: ActivityData[];
  top_apps: TopApp[];
}

export const analyticsService = {
  // Get analytics data
  async getAnalytics(range: string = '7d'): Promise<AnalyticsData> {
    return apiCall<AnalyticsData>('get', `/analytics?range=${range}`)
  }
}

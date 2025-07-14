import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { AppManagement } from '@/components/admin/AppManagement'
import { 
  Crown,
  Building,
  Users, 
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Search,
  Filter,
  Eye,
  Settings,
  Package,
  BarChart3
} from 'lucide-react'

interface AdminDashboardData {
  overview: {
    total_companies: number
    total_users: number
    active_companies: number
    trial_companies: number
    revenue_monthly: number
    revenue_total: number
  }
  recent_activity: {
    companies: Array<{
      id: string
      razon_social: string
      created_at: string
      status: string
    }>
    users: Array<{
      id: string
      first_name: string
      last_name: string
      email: string
      created_at: string
    }>
  }
  growth: {
    companies_this_month: number
    users_this_month: number
  }
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'overview' | 'apps' | 'analytics'>('overview')

  // Check if user is admin
  const isAdmin = user?.email === 'ale@forvara.com' || user?.email === 'admin@forvara.com'

  useEffect(() => {
    if (!isAdmin) return

    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard')
        setDashboardData(response.data.data)
      } catch (error: any) {
        setError(error.message || 'Failed to load admin dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this area.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const data = dashboardData!

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            Admin Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, CEO! Here's your empire overview 👑
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeSection === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveSection('overview')}
            className="flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Overview
          </Button>
          <Button
            variant={activeSection === 'apps' ? 'default' : 'outline'}
            onClick={() => setActiveSection('apps')}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            App Store
          </Button>
          <Button
            variant={activeSection === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveSection('analytics')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {data.overview.total_companies}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              +{data.growth.companies_this_month} this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {data.overview.total_users}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              +{data.growth.users_this_month} this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {data.overview.active_companies}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {data.overview.trial_companies} on trial
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              ${data.overview.revenue_monthly.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              ${data.overview.revenue_total.toLocaleString()} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Recent Companies
            </CardTitle>
            <CardDescription>
              Companies registered in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recent_activity.companies.length > 0 ? (
                data.recent_activity.companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{company.razon_social}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(company.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        company.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {company.status}
                      </span>
                      <button className="p-1 hover:bg-muted rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent companies</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Users
            </CardTitle>
            <CardDescription>
              Users registered in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recent_activity.users.length > 0 ? (
                data.recent_activity.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                      <button className="p-1 hover:bg-muted rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent users</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
              <Building className="w-6 h-6 mb-2 text-blue-600" />
              <h3 className="font-medium">Manage Companies</h3>
              <p className="text-sm text-muted-foreground">View and manage all registered companies</p>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
              <Users className="w-6 h-6 mb-2 text-green-600" />
              <h3 className="font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground">Search and manage user accounts</p>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
              <DollarSign className="w-6 h-6 mb-2 text-purple-600" />
              <h3 className="font-medium">Revenue Analytics</h3>
              <p className="text-sm text-muted-foreground">Deep dive into financial metrics</p>
            </button>
          </div>
        </CardContent>
      </Card>
        </>
      )}

      {/* App Store Management Section */}
      {activeSection === 'apps' && (
        <AppManagement />
      )}

      {/* Analytics Section */}
      {activeSection === 'analytics' && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
            <p className="text-muted-foreground">
              Detailed analytics dashboard coming soon...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
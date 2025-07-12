import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAppsStore } from '@/stores/appsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import apiClient from '@/services/api'
import { formatBytes } from '@/lib/utils'
import { 
  Users, 
  Package, 
  HardDrive, 
  Activity, 
  ChevronRight,
  Bell,
  Plus,
  Settings,
  Search,
  UserPlus,
  Upload,
  FolderPlus,
  CreditCard,
  FileText
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DashboardData {
  stats: {
    total_users: number
    active_apps: number
    storage_used: number
    storage_limit: number
  }
  recent_activities: Array<{
    id: string
    type: string
    description: string
    created_at: string
    user: {
      full_name: string
      avatar_url?: string
    }
  }>
  quick_actions: Array<{
    id: string
    title: string
    description: string
    icon: string
    action: string
    url?: string
  }>
}

export default function Dashboard() {
  // TEMP: Using mock data for development
  // const { currentTenant, user } = useAuth()
  const user = { full_name: 'Alex Rodriguez', email: 'alex@forvara.com' }
  const currentTenant = { name: 'Forvara Technologies' }
  const navigate = useNavigate()
  
  // Store connections
  const { getUnreadNotifications, getRecentNotifications } = useNotificationStore()
  const { getInstalledApps, apps } = useAppsStore()
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Get connected data
  const unreadNotifications = getUnreadNotifications()
  const recentNotifications = getRecentNotifications(3)
  const installedApps = getInstalledApps()

  // Action handlers
  const handleQuickAction = (action: any) => {
    switch (action.action) {
      case 'invite_user':
        navigate('/team', { state: { openInviteModal: true } })
        break
      case 'browse_apps':
        navigate('/apps')
        break
      case 'upload_files':
        handleFileUpload()
        break
      case 'view_analytics':
        navigate('/analytics')
        break
      default:
        if (action.url) {
          navigate(action.url)
        }
    }
  }

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        console.log('Uploading files from dashboard:', Array.from(files).map(f => f.name))
        // TODO: Actual upload logic
        navigate('/files')
      }
    }
    input.click()
  }

  const handleGlobalSearch = () => {
    // TODO: Open global search modal
    console.log('Opening global search...')
  }

  const addNewOptions = [
    {
      icon: UserPlus,
      label: 'Invite Team Member',
      action: () => navigate('/team', { state: { openInviteModal: true } })
    },
    {
      icon: Package,
      label: 'Install New App',
      action: () => navigate('/apps')
    },
    {
      icon: Upload,
      label: 'Upload Files',
      action: handleFileUpload
    },
    {
      icon: FolderPlus,
      label: 'Create Folder',
      action: () => navigate('/files', { state: { createFolder: true } })
    },
    {
      icon: CreditCard,
      label: 'Add Payment Method',
      action: () => navigate('/billing', { state: { addPaymentMethod: true } })
    },
    {
      icon: FileText,
      label: 'Create Document',
      action: () => console.log('Create document - integrate with apps')
    }
  ]

  useEffect(() => {
    // TEMP: Using mock data instead of API call
    const loadMockData = () => {
      setTimeout(() => {
        setDashboardData({
          stats: {
            total_users: 12,
            active_apps: 3,
            storage_used: 2147483648,
            storage_limit: 5368709120,
          },
          recent_activities: [
            {
              id: '1',
              type: 'app_install',
              description: 'Installed Elaris ERP application',
              created_at: '2024-01-15T08:30:00Z',
              user: { full_name: 'Alex Rodriguez', avatar_url: null }
            },
            {
              id: '2',
              type: 'user_invite',
              description: 'Invited new team member María García',
              created_at: '2024-01-15T07:45:00Z',
              user: { full_name: 'Alex Rodriguez', avatar_url: null }
            },
            {
              id: '3',
              type: 'file_upload',
              description: 'Uploaded 5 files to shared storage',
              created_at: '2024-01-14T16:20:00Z',
              user: { full_name: 'Carlos Mendoza', avatar_url: null }
            }
          ],
          quick_actions: [
            {
              id: '1',
              title: 'Invite Team Member',
              description: 'Add new people to your workspace',
              icon: 'user-plus',
              action: 'invite_user',
              url: '/team/invite'
            },
            {
              id: '2',
              title: 'Install New App',
              description: 'Browse and install apps from marketplace',
              icon: 'package',
              action: 'browse_apps',
              url: '/apps'
            },
            {
              id: '3',
              title: 'Upload Files',
              description: 'Add files to shared storage',
              icon: 'upload',
              action: 'upload_files',
              url: '/files'
            }
          ]
        })
        setIsLoading(false)
      }, 500) // Simulate loading
    }

    loadMockData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {user?.full_name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with {currentTenant?.name || 'your company'} today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGlobalSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm" onClick={() => console.log('Open notifications panel')}>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {addNewOptions.map((option, index) => (
                <DropdownMenuItem key={index} onClick={option.action}>
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Apps</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_apps || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.active_apps === 1 ? 'app' : 'apps'} installed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(stats?.storage_used || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatBytes(stats?.storage_limit || 5368709120)} used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.recent_activities?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              recent activities
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for your team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData?.quick_actions?.length ? (
              dashboardData.quick_actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleQuickAction(action)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No quick actions available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recent_activities?.length ? (
                dashboardData.recent_activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-1 bg-primary/10 rounded-full">
                      <Activity className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user.full_name} · {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
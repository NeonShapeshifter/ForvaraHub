import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppsStore } from '@/stores/appsStore'
import { useNotificationStore, createNotification } from '@/stores/notificationStore'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Download,
  ExternalLink,
  Package,
  Zap,
  Settings,
  BarChart3,
  Mail,
  Calendar,
  FileText,
  Users,
  CreditCard,
  Shield,
  Trash2,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


const categories = ['All', 'Business', 'Communication', 'Analytics', 'Productivity', 'Finance', 'Sales']

const getAppIcon = (appId: string) => {
  const icons: Record<string, any> = {
    elaris: Package,
    forvaramail: Mail,
    analytics: BarChart3,
    timetracker: Calendar,
    invoicing: CreditCard,
    crm: Users
  }
  return icons[appId] || Package
}

export default function Apps() {
  const {
    apps,
    installedApps,
    favoriteApps,
    isLoading,
    loadApps,
    installApp,
    uninstallApp,
    launchApp,
    toggleFavorite,
    getFeaturedApps,
    getAppsByCategory,
    isAppInstalled,
    isAppFavorited
  } = useAppsStore()
  
  const { addNotification } = useNotificationStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showInstalled, setShowInstalled] = useState(false)
  
  useEffect(() => {
    loadApps()
  }, [])

  const filteredApps = getAppsByCategory(selectedCategory).filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesInstalled = !showInstalled || isAppInstalled(app.id)
    
    return matchesSearch && matchesInstalled
  })

  const featuredApps = getFeaturedApps()

  const handleInstallApp = async (appId: string, planId?: string) => {
    try {
      await installApp(appId, planId)
      const app = apps.find(a => a.id === appId)
      if (app) {
        // Create success notification
        addNotification(createNotification.app(
          `${app.name} Installed`,
          `${app.name} has been successfully ${planId ? 'installed' : 'started as trial'}. You can now launch the app from your dashboard.`,
          '/apps',
          'View Apps'
        ))
        
        alert(`${app.name} has been ${planId ? 'installed' : 'started as trial'}!`)
      }
    } catch (error) {
      console.error('Failed to install app:', error)
      
      // Create error notification
      addNotification(createNotification.error(
        'Installation Failed',
        'Failed to install the app. Please check your connection and try again.',
        '/apps',
        'Retry'
      ))
      
      alert('Failed to install app. Please try again.')
    }
  }

  const handleLaunchApp = (appId: string) => {
    launchApp(appId)
  }

  const handleUninstallApp = async (appId: string) => {
    const app = apps.find(a => a.id === appId)
    if (!app) return

    if (confirm(`Are you sure you want to uninstall ${app.name}? This will remove all app data.`)) {
      try {
        await uninstallApp(appId)
        alert(`${app.name} has been uninstalled.`)
      } catch (error) {
        console.error('Failed to uninstall app:', error)
        alert('Failed to uninstall app. Please try again.')
      }
    }
  }

  const getStatusBadge = (status: string, trialEnds?: string) => {
    switch (status) {
      case 'installed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Installed</span>
      case 'trial':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Trial</span>
      case 'available':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Available</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">App Marketplace</h1>
          <p className="text-gray-600">Discover and manage applications for your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showInstalled ? "default" : "outline"}
            size="sm"
            onClick={() => setShowInstalled(!showInstalled)}
          >
            <Package className="h-4 w-4 mr-2" />
            {showInstalled ? 'Show All' : 'My Apps'}
          </Button>
        </div>
      </div>

      {/* Installed Apps Quick Access */}
      {installedApps.length > 0 && !showInstalled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Launch
            </CardTitle>
            <CardDescription>
              Your installed applications - click to launch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {installedApps.map((app) => {
                const Icon = getAppIcon(app.id)
                return (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchApp(app.id)}
                    className="flex flex-col items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-center">{app.name}</span>
                    <span className="text-xs text-gray-500">{app.last_used}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 text-sm font-medium first:rounded-l-lg last:rounded-r-lg ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700'} rounded-l-lg`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700'} rounded-r-lg`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Apps */}
      {!showInstalled && selectedCategory === 'All' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Apps
            </CardTitle>
            <CardDescription>
              Hand-picked applications recommended for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredApps.slice(0, 3).map((app) => {
                const Icon = getAppIcon(app.id)
                const basicPlan = app.plans.find(p => p.is_trial) || app.plans[0]
                
                return (
                  <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{app.name}</h3>
                          <p className="text-sm text-gray-500">{app.category}</p>
                        </div>
                      </div>
                      {getStatusBadge(app.status, app.trial_ends)}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">${(basicPlan?.price || 0) / 100}</span>
                        <span className="text-sm text-gray-500">/{basicPlan?.billing_interval}</span>
                        {basicPlan?.is_trial && (
                          <span className="text-xs text-green-600 ml-2">Free trial</span>
                        )}
                      </div>
                      {isAppInstalled(app.id) ? (
                        <Button size="sm" onClick={() => handleLaunchApp(app.id)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Launch
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleInstallApp(app.id, basicPlan?.id || '')}>
                          <Download className="h-4 w-4 mr-2" />
                          Install
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apps Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredApps.map((app) => {
          const Icon = getAppIcon(app.id)
          const basicPlan = app.plans.find(p => p.is_trial) || app.plans[0]
          
          if (viewMode === 'list') {
            return (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{app.name}</h3>
                        <p className="text-gray-600 mb-2">{app.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{app.category}</span>
                          <span>•</span>
                          <span>${(basicPlan?.price || 0) / 100}/{basicPlan?.billing_interval}</span>
                          {basicPlan?.is_trial && <span>• Free trial</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(app.status, app.trial_ends)}
                      {isAppInstalled(app.id) ? (
                        <>
                          <Button onClick={() => handleLaunchApp(app.id)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Launch
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log('Configure app:', app.name)}>
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('View billing for:', app.name)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Billing
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleUninstallApp(app.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Uninstall
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      ) : (
                        <Button onClick={() => handleInstallApp(app.id, basicPlan?.id || '')}>
                          <Download className="h-4 w-4 mr-2" />
                          Install
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }

          return (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription>{app.category}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(app.status, app.trial_ends)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{app.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Starting at</span>
                    <div>
                      <span className="font-semibold text-lg">${(basicPlan?.price || 0) / 100}</span>
                      <span className="text-gray-500">/{basicPlan?.billing_interval}</span>
                    </div>
                  </div>
                  
                  {basicPlan?.is_trial && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      🎉 {basicPlan.trial_days}-day free trial available
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {isAppInstalled(app.id) ? (
                      <>
                        <Button className="flex-1" onClick={() => handleLaunchApp(app.id)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Launch
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => console.log('Configure app:', app.name)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('View billing for:', app.name)}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Billing
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleUninstallApp(app.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Uninstall
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <Button className="w-full" onClick={() => handleInstallApp(app.id, basicPlan?.id || '')}>
                        <Download className="h-4 w-4 mr-2" />
                        {basicPlan?.is_trial ? 'Start Free Trial' : 'Install App'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No apps found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
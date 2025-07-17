import React, { useState, useEffect } from 'react'
import { Settings, ExternalLink, Trash2, BarChart3, Users, Calendar, DollarSign, Package, Crown, Clock, CheckCircle, AlertTriangle, Zap, Building2, Calculator, HardDrive, MoreHorizontal, Sparkles, X } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { appsService } from '@/services/apps.service'
import { EmbeddedUserManagement } from '@/components/EmbeddedUserManagement'
import { AppDelegationManagement } from '@/components/AppDelegationManagement'

interface InstalledApp {
  id: string
  name: string
  display_name: string
  description: string
  icon: React.ReactNode
  category: string
  status: 'active' | 'trial' | 'suspended' | 'pending'
  subscription: {
    plan: string
    price: number
    billing_cycle: 'monthly' | 'yearly' | 'free'
    next_billing?: string
    trial_ends?: string
  }
  usage: {
    last_accessed: string
    monthly_active_users: number
    storage_used_gb: number
    api_calls: number
  }
  installed_date: string
}

export default function MyApps() {
  const { currentCompany } = useAuthStore()
  
  const [apps, setApps] = useState<InstalledApp[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'trial' | 'suspended'>('all')
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null)
  const [showAppManagement, setShowAppManagement] = useState(false)

  useEffect(() => {
    loadInstalledApps()
  }, [])

  const loadInstalledApps = async () => {
    try {
      setLoading(true)
      
      // Check if user has a company selected
      if (!currentCompany) {
        console.warn('No company selected, cannot load installed apps')
        setApps([])
        setLoading(false)
        return
      }
      
      const installedApps = await appsService.getInstalledApps()
      
      // Convert service data to UI format
      const convertedApps = installedApps.map(app => ({
        id: app.id,
        name: app.name,
        display_name: app.name,
        description: app.description,
        icon: getAppIcon(app.category),
        category: app.category,
        status: app.status,
        subscription: app.subscription,
        usage: app.usage,
        installed_date: app.installedDate
      }))
      
      setApps(convertedApps)
      setLoading(false)
      
    } catch (error) {
      console.error('Error loading installed apps:', error)
      // Only show fallback if we have a company
      if (currentCompany) {
        setApps([
          {
            id: 'demo-app',
            name: 'demo-app',
            display_name: 'Demo App',
            description: 'Aplicación de demostración',
            icon: <Building2 className="w-8 h-8 text-blue-600" />,
            category: 'Demo',
            status: 'active',
            subscription: {
              plan: 'Free',
              price: 0,
              billing_cycle: 'free'
            },
            usage: {
              last_accessed: new Date().toISOString(),
              monthly_active_users: 1,
              storage_used_gb: 0,
              api_calls: 0
            },
            installed_date: new Date().toISOString()
          }
        ])
      } else {
        setApps([])
      }
      setLoading(false)
    }
  }

  const getAppIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'erp':
        return <Building2 className="w-8 h-8 text-blue-600" />
      case 'finanzas':
      case 'contabilidad':
        return <Calculator className="w-8 h-8 text-green-600" />
      case 'inventario':
        return <Package className="w-8 h-8 text-purple-600" />
      default:
        return <Building2 className="w-8 h-8 text-gray-600" />
    }
  }

  const handleLaunchApp = async (appId: string) => {
    try {
      const result = await appsService.launchApp(appId)
      if (result.url) {
        window.open(result.url, '_blank')
      }
      console.log('Launching app:', appId)
    } catch (error) {
      console.error('Error launching app:', error)
      // For demo purposes, show a message
      alert('App lanzada (demo mode)')
    }
  }

  const handleUninstallApp = async (appId: string) => {
    if (!confirm('¿Estás seguro de que deseas desinstalar esta aplicación?')) {
      return
    }

    try {
      await appsService.uninstallApp(appId)
      setApps(prev => prev.filter(app => app.id !== appId))
    } catch (error) {
      console.error('Error uninstalling app:', error)
      // For demo, still remove from UI
      setApps(prev => prev.filter(app => app.id !== appId))
    }
  }

  const handleConfigureApp = (app: InstalledApp) => {
    setSelectedApp(app)
    setShowAppManagement(true)
  }

  const filteredApps = apps.filter(app => filter === 'all' || app.status === filter)

  const getStatusIndicator = (status: InstalledApp['status']) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'trial':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case 'suspended':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case 'pending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
    }
  }

  const getDaysUntilTrialExpires = (trialEnds?: string) => {
    if (!trialEnds) return 0
    const today = new Date()
    const endDate = new Date(trialEnds)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const getTotalMonthlyCost = () => {
    return apps
      .filter(app => app.subscription.billing_cycle === 'monthly' && app.status === 'active')
      .reduce((total, app) => total + app.subscription.price, 0)
  }

  const getTrialApps = () => {
    return apps.filter(app => app.status === 'trial')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando tus aplicaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Mis Aplicaciones
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Gestiona tus apps instaladas y suscripciones de {currentCompany?.razon_social}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{apps.length}</p>
                <p className="text-sm text-gray-500">Apps instaladas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-500" />
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${getTotalMonthlyCost()}
                </p>
                <p className="text-sm text-gray-500">Costo mensual</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {getTrialApps().length}
                </p>
                <p className="text-sm text-gray-500">En prueba</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-500" />
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {apps.reduce((total, app) => total + app.usage.monthly_active_users, 0)}
                </p>
                <p className="text-sm text-gray-500">Usuarios activos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trial Alerts */}
        {getTrialApps().length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Períodos de prueba activos
                </h3>
                <div className="space-y-3">
                  {getTrialApps().map(app => {
                    const daysLeft = getDaysUntilTrialExpires(app.subscription.trial_ends)
                    return (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          {app.icon}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {app.display_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {daysLeft} días restantes de prueba
                            </p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium">
                          Suscribirse ${app.subscription.price}/mes
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
            {[
              { key: 'all' as const, label: 'Todas', count: apps.length },
              { key: 'active' as const, label: 'Activas', count: apps.filter(a => a.status === 'active').length },
              { key: 'trial' as const, label: 'En prueba', count: apps.filter(a => a.status === 'trial').length },
              { key: 'suspended' as const, label: 'Suspendidas', count: apps.filter(a => a.status === 'suspended').length }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-1.5 rounded-md transition-all text-sm font-medium ${
                  filter === filterOption.key
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {filterOption.label}
                {filterOption.count > 0 && (
                  <span className="ml-1.5 text-xs">({filterOption.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Apps List */}
        {filteredApps.length > 0 ? (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {app.icon}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {app.display_name}
                          </h3>
                          {getStatusIndicator(app.status)}
                          <span className="text-sm text-gray-500">{app.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {app.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Instalado: {new Date(app.installed_date).toLocaleDateString('es-ES')}</span>
                          <span>Último acceso: {new Date(app.usage.last_accessed).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Subscription Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Suscripción
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Plan</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {app.subscription.plan}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Precio</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {app.subscription.price === 0 ? 'Gratis' : `$${app.subscription.price}/mes`}
                          </span>
                        </div>
                        {app.subscription.trial_ends && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Prueba</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {getDaysUntilTrialExpires(app.subscription.trial_ends)} días
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Uso
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Usuarios</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {app.usage.monthly_active_users}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Almacenamiento</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {app.usage.storage_used_gb < 1 
                              ? `${(app.usage.storage_used_gb * 1024).toFixed(0)} MB`
                              : `${app.usage.storage_used_gb.toFixed(1)} GB`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">API calls</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {app.usage.api_calls.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Acciones
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleLaunchApp(app.id)}
                          className="w-full px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Abrir app
                        </button>
                        <button 
                          onClick={() => handleConfigureApp(app)}
                          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Configurar
                        </button>
                        {app.status === 'active' && app.subscription.price > 0 && (
                          <button
                            onClick={() => handleUninstallApp(app.id)}
                            className="w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Desinstalar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {!currentCompany ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Empresa requerida
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Necesitas crear o seleccionar una empresa para acceder a las aplicaciones
                </p>
                <button
                  onClick={() => window.location.href = '/settings'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Building2 className="w-4 h-4" />
                  Crear empresa
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No hay aplicaciones
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  No tienes aplicaciones {filter !== 'all' ? filter === 'trial' ? 'en prueba' : filter : 'instaladas'} en este momento
                </p>
                <button
                  onClick={() => window.location.href = '/marketplace'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  Explorar marketplace
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* App Management Modal */}
      {showAppManagement && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedApp.icon}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Configuración de {selectedApp.display_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Gestiona usuarios y permisos de la aplicación
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAppManagement(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              <EmbeddedUserManagement 
                appId={selectedApp.id} 
                appName={selectedApp.display_name} 
              />
              <AppDelegationManagement 
                appId={selectedApp.id} 
                appName={selectedApp.display_name} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

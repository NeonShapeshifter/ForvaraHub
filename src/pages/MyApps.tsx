import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, ExternalLink, Trash2, BarChart3, Users, Calendar, DollarSign, Package, Crown, Clock, CheckCircle, AlertTriangle, Zap, Building2, Calculator, HardDrive, MoreHorizontal, Sparkles, X, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { EmbeddedUserManagement } from '@/components/EmbeddedUserManagement'
import { AppDelegationManagement } from '@/components/AppDelegationManagement'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useNotifications } from '@/components/ui/notifications'

interface InstalledApp {
  id: string
  name: string
  description: string
  category: string
  status: 'active' | 'trial' | 'suspended' | 'pending'
  subscription: {
    plan: string
    price: string
    billingCycle: 'monthly' | 'yearly' | 'free'
    nextBilling?: string
    trialEnds?: string
  }
  usage: {
    lastAccessed: string
    monthlyActiveUsers: number
    storageUsed: string
    apiCalls: number
  }
  permissions: string[]
  installedDate: string
}

export default function MyApps() {
  const navigate = useNavigate()
  const { currentCompany, isIndividualMode } = useAuthStore()
  const { addNotification } = useNotifications()

  const [apps, setApps] = useState<InstalledApp[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'trial' | 'suspended'>('all')
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null)
  const [showAppManagement, setShowAppManagement] = useState(false)

  useEffect(() => {
    loadInstalledApps()
  }, [])

  const loadInstalledApps = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      // Handle both individual and company mode
      if (!isIndividualMode() && !currentCompany) {
        console.warn('No company selected, cannot load installed apps')
        setApps([])
        return
      }

      // Call the real backend API
      const endpoint = isIndividualMode()
        ? '/apps' // Individual mode - user's personal apps
        : `/companies/${currentCompany?.id}/apps` // Company mode - company's apps

      const response = await api.get(endpoint)
      const installedApps = response.data || []

      console.log('✅ Loaded installed apps from backend:', installedApps)
      setApps(installedApps)

    } catch (error) {
      console.error('❌ Error loading installed apps:', error)

      // Show fallback/demo data if backend fails
      setApps([
        {
          id: 'elaris-contabilidad',
          name: 'Elaris Contabilidad',
          description: 'Módulo de contabilidad empresarial con facturación electrónica',
          category: 'Contabilidad',
          status: 'trial',
          subscription: {
            plan: 'trial',
            price: '$29',
            billingCycle: 'monthly',
            nextBilling: null,
            trialEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          usage: {
            lastAccessed: new Date().toISOString(),
            monthlyActiveUsers: 3,
            storageUsed: '125.3MB',
            apiCalls: 450
          },
          permissions: ['read', 'write'],
          installedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'elaris-inventario',
          name: 'Elaris Inventario',
          description: 'Control de inventario y gestión de almacén',
          category: 'Inventario',
          status: 'active',
          subscription: {
            plan: 'Pro',
            price: '$19',
            billingCycle: 'monthly',
            nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            trialEnds: null
          },
          usage: {
            lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            monthlyActiveUsers: 5,
            storageUsed: '89.7MB',
            apiCalls: 1250
          },
          permissions: ['read', 'write', 'admin'],
          installedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ])

      addNotification({
        type: 'warning',
        title: 'Modo demostración',
        message: 'Se muestran datos de ejemplo. Conectando con el backend...'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
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
      // In production this would call the app launch API
      // For now, show demo notification
      addNotification({
        type: 'info',
        title: 'Lanzando aplicación',
        message: `Abriendo ${apps.find(a => a.id === appId)?.name}...`
      })

      // Simulate app launch with demo URL
      setTimeout(() => {
        window.open('https://demo.forvara.dev/app/' + appId, '_blank')
      }, 500)

    } catch (error) {
      console.error('Error launching app:', error)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo abrir la aplicación'
      })
    }
  }

  const handleUninstallApp = async (appId: string) => {
    const app = apps.find(a => a.id === appId)
    if (!confirm(`¿Estás seguro de que deseas desinstalar ${app?.name}?\n\nEsta acción no se puede deshacer.`)) {
      return
    }

    try {
      const endpoint = isIndividualMode()
        ? `/apps/${appId}` // Individual mode
        : `/companies/${currentCompany?.id}/apps/${appId}` // Company mode

      await api.delete(endpoint)
      setApps(prev => prev.filter(app => app.id !== appId))

      addNotification({
        type: 'success',
        title: 'App desinstalada',
        message: `${app?.name} ha sido desinstalada exitosamente`
      })
    } catch (error) {
      console.error('Error uninstalling app:', error)
      addNotification({
        type: 'error',
        title: 'Error al desinstalar',
        message: 'No se pudo desinstalar la aplicación. Intenta de nuevo.'
      })
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

  const handleRefresh = () => {
    loadInstalledApps(false)
  }

  const getTotalMonthlyCost = () => {
    return apps
      .filter(app => app.subscription.billingCycle === 'monthly' && app.status === 'active')
      .reduce((total, app) => {
        const price = parseFloat(app.subscription.price.replace('$', '')) || 0
        return total + price
      }, 0)
  }

  const getTrialApps = () => {
    return apps.filter(app => app.status === 'trial')
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Mis Aplicaciones"
          description="Gestiona tus apps instaladas y suscripciones"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Cargando tus aplicaciones...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Mis Aplicaciones"
        description={`Gestiona tus apps instaladas y suscripciones${currentCompany ? ` de ${currentCompany.razon_social}` : ''}`}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">{apps.length}</p>
              <p className="text-sm text-gray-500">Apps instaladas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                ${getTotalMonthlyCost()}
              </p>
              <p className="text-sm text-gray-500">Costo mensual</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {getTrialApps().length}
              </p>
              <p className="text-sm text-gray-500">En prueba</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {apps.reduce((total, app) => total + app.usage.monthlyActiveUsers, 0)}
              </p>
              <p className="text-sm text-gray-500">Usuarios activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Alerts */}
      {getTrialApps().length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">
                Períodos de prueba activos
              </h3>
              <div className="space-y-3">
                {getTrialApps().map(app => {
                  const daysLeft = getDaysUntilTrialExpires(app.subscription.trialEnds)
                  return (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        {getAppIcon(app.category)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {app.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {daysLeft} días restantes de prueba
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                        Suscribirse {app.subscription.price}/mes
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
        <div className="inline-flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
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
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
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
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {getAppIcon(app.category)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {app.name}
                        </h3>
                        {getStatusIndicator(app.status)}
                        <span className="text-sm text-gray-500">{app.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {app.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Instalado: {new Date(app.installedDate).toLocaleDateString('es-ES')}</span>
                        <span>Último acceso: {new Date(app.usage.lastAccessed).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Subscription Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Suscripción
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Plan</span>
                        <span className="font-medium text-gray-900">
                          {app.subscription.plan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Precio</span>
                        <span className="font-medium text-gray-900">
                          {app.subscription.price === '$0' ? 'Gratis' : `${app.subscription.price}/mes`}
                        </span>
                      </div>
                      {app.subscription.trialEnds && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Prueba</span>
                          <span className="font-medium text-blue-600">
                            {getDaysUntilTrialExpires(app.subscription.trialEnds)} días
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Uso
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Usuarios</span>
                        <span className="font-medium text-gray-900">
                          {app.usage.monthlyActiveUsers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Almacenamiento</span>
                        <span className="font-medium text-gray-900">
                          {app.usage.storageUsed}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">API calls</span>
                        <span className="font-medium text-gray-900">
                          {app.usage.apiCalls.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Acciones
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleLaunchApp(app.id)}
                        className="w-full px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir app
                      </button>
                      <button
                        onClick={() => handleConfigureApp(app)}
                        className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Configurar
                      </button>
                      {app.status === 'active' && app.subscription.price !== '$0' && (
                        <button
                          onClick={() => handleUninstallApp(app.id)}
                          className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isIndividualMode() ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay aplicaciones instaladas
              </h3>
              <p className="text-gray-500 mb-6">
                Explora nuestro marketplace para instalar aplicaciones
              </p>
              <button
                onClick={() => navigate('/marketplace')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Explorar marketplace
              </button>
            </>
          ) : !currentCompany ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Empresa requerida
              </h3>
              <p className="text-gray-500 mb-6">
                Necesitas crear o seleccionar una empresa para acceder a las aplicaciones
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Building2 className="w-4 h-4" />
                Crear empresa
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay aplicaciones
              </h3>
              <p className="text-gray-500 mb-6">
                No tienes aplicaciones {filter !== 'all' ? filter === 'trial' ? 'en prueba' : filter : 'instaladas'} en este momento
              </p>
              <button
                onClick={() => navigate('/marketplace')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Explorar marketplace
              </button>
            </>
          )}
        </div>
      )}

      {/* App Management Modal */}
      {showAppManagement && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getAppIcon(selectedApp.category)}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Configuración de {selectedApp.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Gestiona usuarios y permisos de la aplicación
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAppManagement(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              <EmbeddedUserManagement
                appId={selectedApp.id}
                appName={selectedApp.name}
              />
              <AppDelegationManagement
                appId={selectedApp.id}
                appName={selectedApp.name}
              />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

import React, { useState, useEffect } from 'react'
import { Building2, Users, Clock, DollarSign, Package, TrendingUp, Calendar, Activity, ChevronRight, AlertCircle, CheckCircle, ArrowRight, Zap } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { dashboardService } from '@/services/dashboard.service'

// Función helper para calcular días restantes
const daysUntil = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

export default function Dashboard() {
  const { user, currentCompany, refreshCompanies, isIndividualMode } = useAuthStore()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [quickActions, setQuickActions] = useState<any[]>([])
  
  const trialDaysLeft = currentCompany?.trial_ends_at 
    ? daysUntil(currentCompany.trial_ends_at)
    : 0
    
  const storageUsedPercent = dashboardData?.stats 
    ? (dashboardData.stats.storage_used_gb / (dashboardData.stats.storage_limit_gb || 5)) * 100
    : 0

  useEffect(() => {
    loadDashboard()
    if (currentCompany) {
      refreshCompanies()
    }
  }, [currentCompany?.id])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      
      // Load quick actions (always available)
      const actions = await dashboardService.getQuickActions()
      setQuickActions(actions)
      
      // Load dashboard stats (works for both individual and company modes)
      try {
        const stats = await dashboardService.getDashboardStats()
        setDashboardData({ stats })
      } catch (error) {
        console.warn('Could not load dashboard stats:', error)
        // Fallback to basic data based on mode
        const fallbackStats = isIndividualMode() ? {
          active_users: 1,
          installed_apps: 0,
          storage_used_gb: 0.5,
          storage_limit_gb: 2,
          api_calls_today: 0,
          total_users: 1,
          total_companies: 0,
          active_subscriptions: 0,
          mrr: 0
        } : {
          active_users: 1,
          installed_apps: 0,
          storage_used_gb: currentCompany?.storage_used_bytes ? (currentCompany.storage_used_bytes / (1024 * 1024 * 1024)) : 0,
          storage_limit_gb: currentCompany?.storage_limit_gb || 5,
          api_calls_today: 0,
          total_users: 1,
          total_companies: 1,
          active_subscriptions: 0,
          mrr: 0
        }
        
        setDashboardData({ stats: fallbackStats })
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando dashboard...</p>
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
            Bienvenido, {user?.first_name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Panel de administración de Forvara Hub
          </p>
          
          {/* Individual Mode Indicator */}
          {isIndividualMode() && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Modo Individual
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Estás usando Forvara sin empresa. Puedes instalar apps personales y crear una empresa cuando quieras.
              </p>
            </div>
          )}
        </div>

        {/* Trial Warning */}
        {currentCompany?.status === 'trial' && trialDaysLeft <= 7 && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Periodo de prueba
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Te quedan {trialDaysLeft} días de prueba. Actualiza tu plan para continuar usando todas las funciones.
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium">
                  Actualizar plan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Company Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                isIndividualMode()
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : currentCompany?.status === 'trial' 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {isIndividualMode() ? 'Individual' : currentCompany?.status === 'trial' ? 'Prueba' : 'Activo'}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {isIndividualMode() ? 'Modo Individual' : currentCompany?.razon_social || 'Sin empresa'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isIndividualMode() ? 'Usuario personal' : `RUC: ${currentCompany?.ruc || 'N/A'}`}
              </p>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {isIndividualMode() ? '1' : dashboardData?.stats?.active_users || 1}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isIndividualMode() ? 'solo tú' : `de ${currentCompany?.slots_limit || 50} usuarios`}
              </p>
            </div>
          </div>

          {/* Storage */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {isIndividualMode() ? '0%' : storageUsedPercent.toFixed(0) + '%'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isIndividualMode() 
                  ? '2 GB gratis para uso personal' 
                  : `${(dashboardData?.stats?.storage_used_gb || 0).toFixed(1)} GB de ${dashboardData?.stats?.storage_limit_gb || 5} GB`
                }
              </p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${isIndividualMode() ? 0 : storageUsedPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Apps */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {dashboardData?.stats?.installed_apps || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Apps instaladas
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isIndividualMode() ? 'Acciones personales' : 'Acciones del equipo'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Individual Mode Actions */}
            {isIndividualMode() && (
              <>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-left hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                      <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Explorar Apps
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Instala apps para uso personal
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/companies')}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-left hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors">
                      <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Crear Empresa
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Upgrade a modo empresa
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/settings')}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-left hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Mi Perfil
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configurar cuenta personal
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
              </>
            )}
            
            {/* Company Mode Actions */}
            {!isIndividualMode() && (
              <>
                <button
                  onClick={() => navigate('/users')}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-left hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Gestionar Equipo
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Invitar y administrar usuarios
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/marketplace')}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-left hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors">
                      <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Apps Empresariales
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Instalar para todo el equipo
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/analytics')}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-left hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors">
                      <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Analytics
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Métricas del equipo
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/settings')}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-left hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800/30 transition-colors">
                      <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Configuración
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ajustes de la empresa
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actividad reciente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Sesión iniciada</span>
                <span className="text-gray-500 ml-auto">Hace 5 minutos</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Empresa creada</span>
                <span className="text-gray-500 ml-auto">Hoy</span>
              </div>
              {dashboardData?.stats?.installed_apps === 0 && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No has instalado ninguna aplicación aún. 
                    <a href="/marketplace" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                      Explorar marketplace
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información de usuario
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre completo</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.email || 'No configurado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.phone || 'No configurado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">País</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.country_code} - {user?.currency_code}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        {dashboardData?.stats?.installed_apps === 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Comienza con Forvara
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Sigue estos pasos para aprovechar al máximo tu experiencia:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Cuenta creada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Empresa configurada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <a href="/marketplace" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Instalar tu primera aplicación
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <a href="/users" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Invitar a tu equipo
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

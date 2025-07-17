import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Activity, ArrowUp, ArrowDown, Building2, ChevronRight, Package, HardDrive, Clock, MoreHorizontal } from 'lucide-react'

// TODO: Importar desde los archivos reales del proyecto
// import { useAuthStore } from '../stores/authStore'
// import { analyticsService } from '../services/analytics.service'
// import { toast } from '../hooks/use-toast'

// Componente para el estado vacío cuando no hay empresa
const NoCompanyState = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tienes una empresa
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Para ver analytics, primero necesitas crear una empresa o ser invitado a una.
        </p>
        <button 
          onClick={() => window.location.href = '/companies'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          Crear mi primera empresa
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Componente para el estado sin permisos
const NoPermissionState = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Sin acceso a Analytics
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Solo los propietarios pueden ver las analíticas de la empresa.
        </p>
      </div>
    </div>
  )
}

// Componente para las métricas
const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'gray',
  suffix = '',
  loading = false,
  trend = 'up'
}: {
  title: string
  value: number | string
  change?: number
  icon: any
  color?: string
  suffix?: string
  loading?: boolean
  trend?: 'up' | 'down'
}) => {
  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-500',
    green: 'text-green-600 dark:text-green-500',
    purple: 'text-purple-600 dark:text-purple-500',
    orange: 'text-orange-600 dark:text-orange-500',
    gray: 'text-gray-600 dark:text-gray-400'
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <Icon className={`w-5 h-5 ${iconColors[color as keyof typeof iconColors]}`} />
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend === 'up' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}{suffix}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  )
}

// Gráfico de barras simple
const SimpleBarChart = ({ data, loading }: { data: any[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="h-48 flex items-end gap-2 px-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-1">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse" 
                 style={{ height: `${Math.random() * 100}%` }}></div>
          </div>
        ))}
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value)) || 1

  return (
    <div className="h-48 flex items-end gap-2 px-4">
      {data.map((day, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div className="w-full relative flex-1 flex items-end">
            <div 
              className="w-full bg-black dark:bg-white rounded-t transition-all duration-500 hover:bg-gray-700 dark:hover:bg-gray-300"
              style={{ height: `${(day.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 mt-2">{day.label}</span>
        </div>
      ))}
    </div>
  )
}

// Componente principal de Analytics
export default function Analytics() {
  // TODO: Obtener desde el store real
  // const { currentCompany, userRole } = useAuthStore()
  
  // Valores temporales para desarrollo
  const currentCompany = { id: 'temp-company' } // TODO: Reemplazar con store real
  const userRole = 'owner' // TODO: Reemplazar con store real
  
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)
  const [timeRange, setTimeRange] = useState('7d')

  // Solo owners pueden ver analytics
  const canViewAnalytics = userRole === 'owner'

  useEffect(() => {
    if (currentCompany && currentCompany.id !== 'no-company' && canViewAnalytics) {
      loadAnalytics()
    } else {
      setLoading(false)
    }
  }, [currentCompany, timeRange, canViewAnalytics])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // TODO: Conectar con el servicio real
      // const data = await analyticsService.getAnalytics(timeRange)
      // setAnalytics(data)
      
      // Simulación temporal
      setTimeout(() => {
        setAnalytics({
          overview: {
            total_users: 0,
            active_users_7d: 0,
            total_apps: 0,
            active_subscriptions: 0,
            monthly_revenue: 0,
            storage_used_gb: 0
          },
          trends: {
            users_growth: 0,
            revenue_growth: 0,
            apps_growth: 0
          },
          activity: [],
          top_apps: []
        })
        setLoading(false)
      }, 1000)
      
    } catch (error) {
      console.error('Error loading analytics:', error)
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '$0'
    }
    return new Intl.NumberFormat('es-PA', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount / 100)
  }

  // Si no hay empresa
  if (!currentCompany || currentCompany.id === 'no-company') {
    return <NoCompanyState />
  }

  // Si no tiene permisos
  if (!canViewAnalytics) {
    return <NoPermissionState />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Métricas y análisis de tu empresa
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
            {[
              { value: '24h', label: '24 horas' },
              { value: '7d', label: '7 días' },
              { value: '30d', label: '30 días' },
              { value: '90d', label: '90 días' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-1.5 rounded-md transition-all text-sm font-medium ${
                  timeRange === option.value
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Usuarios totales"
            value={analytics?.overview.total_users || 0}
            change={analytics?.trends.users_growth}
            icon={Users}
            color="blue"
            loading={loading}
            trend={analytics?.trends.users_growth >= 0 ? 'up' : 'down'}
          />
          <MetricCard
            title="Ingresos mensuales"
            value={formatCurrency(analytics?.overview.monthly_revenue || 0)}
            change={analytics?.trends.revenue_growth}
            icon={DollarSign}
            color="green"
            loading={loading}
            trend={analytics?.trends.revenue_growth >= 0 ? 'up' : 'down'}
          />
          <MetricCard
            title="Apps instaladas"
            value={analytics?.overview.total_apps || 0}
            change={analytics?.trends.apps_growth}
            icon={Package}
            color="purple"
            loading={loading}
            trend={analytics?.trends.apps_growth >= 0 ? 'up' : 'down'}
          />
          <MetricCard
            title="Almacenamiento"
            value={`${analytics?.overview?.storage_used_gb?.toFixed(1) || '0.0'}`}
            suffix=" GB"
            icon={HardDrive}
            color="orange"
            loading={loading}
          />
        </div>

        {/* Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Actividad
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Usuarios activos en los últimos {timeRange === '24h' ? '24 horas' : timeRange === '7d' ? '7 días' : timeRange === '30d' ? '30 días' : '90 días'}
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <SimpleBarChart 
            data={analytics?.activity || [
              { label: 'Lun', value: 0 },
              { label: 'Mar', value: 0 },
              { label: 'Mié', value: 0 },
              { label: 'Jue', value: 0 },
              { label: 'Vie', value: 0 },
              { label: 'Sáb', value: 0 },
              { label: 'Dom', value: 0 }
            ]} 
            loading={loading}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Apps */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Apps más utilizadas
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : analytics?.top_apps?.length > 0 ? (
              <div className="space-y-3">
                {analytics.top_apps.map((app: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.users} usuarios</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(app.revenue)}
                      </p>
                      <p className="text-xs text-gray-500">ingresos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No hay datos disponibles</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resumen rápido
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Usuarios activos (7d)</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics?.overview?.active_users_7d || 0} / {analytics?.overview?.total_users || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Suscripciones activas</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics?.overview?.active_subscriptions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Almacenamiento libre</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(5 - (analytics?.overview?.storage_used_gb || 0)).toFixed(1)} GB
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tasa de retención</span>
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-500">
                    92%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        {!loading && analytics && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Insights y recomendaciones
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {analytics?.trends.users_growth > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                      <span>Tu empresa ha crecido un {analytics?.trends?.users_growth || 0}% en usuarios este mes</span>
                    </li>
                  )}
                  {analytics?.overview.monthly_revenue > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>Los ingresos mensuales son {formatCurrency(analytics?.overview?.monthly_revenue)}</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                    <span>Tienes {(5 - (analytics?.overview?.storage_used_gb || 0)).toFixed(1)} GB de almacenamiento disponible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-0.5">•</span>
                    <span>Considera explorar nuevas apps en el marketplace para expandir funcionalidades</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

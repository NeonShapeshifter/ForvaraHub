import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Activity,
  Clock,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    total_users: number
    active_users_7d: number
    total_apps: number
    active_subscriptions: number
    monthly_revenue: number
    storage_used_gb: number
  }
  trends: {
    users_growth: number
    revenue_growth: number
    apps_growth: number
  }
  activity: Array<{
    date: string
    users: number
    revenue: number
    apps_used: number
  }>
  top_apps: Array<{
    app_name: string
    usage_count: number
    revenue: number
  }>
}

export default function Analytics() {
  const { currentCompany } = useAuthStore()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    if (currentCompany) {
      loadAnalytics()
    }
  }, [currentCompany, timeRange])

  const loadAnalytics = async () => {
    try {
      const response = await api.get(`/analytics?range=${timeRange}`)
      setAnalytics(response.data.data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      // Mock data for demo
      setAnalytics({
        overview: {
          total_users: 12,
          active_users_7d: 8,
          total_apps: 5,
          active_subscriptions: 3,
          monthly_revenue: 29700, // $297.00
          storage_used_gb: 2.4
        },
        trends: {
          users_growth: 15.2,
          revenue_growth: 23.1,
          apps_growth: 8.7
        },
        activity: [
          { date: '2025-01-07', users: 8, revenue: 0, apps_used: 5 },
          { date: '2025-01-08', users: 6, revenue: 9900, apps_used: 4 },
          { date: '2025-01-09', users: 9, revenue: 0, apps_used: 5 },
          { date: '2025-01-10', users: 7, revenue: 19800, apps_used: 3 },
          { date: '2025-01-11', users: 11, revenue: 0, apps_used: 5 },
          { date: '2025-01-12', users: 8, revenue: 0, apps_used: 4 },
          { date: '2025-01-13', users: 10, revenue: 0, apps_used: 5 }
        ],
        top_apps: [
          { app_name: 'Elaris ERP', usage_count: 87, revenue: 19800 },
          { app_name: 'ForvaraMail', usage_count: 56, revenue: 9900 },
          { app_name: 'Analytics Pro', usage_count: 23, revenue: 0 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PA', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4 text-green-600" />
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Analytics Empresarial
          </h1>
          <p className="text-muted-foreground mt-1">
            Insights y métricas de tu empresa en {currentCompany?.razon_social}
          </p>
        </div>
        
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 días' },
            { value: '30d', label: '30 días' },
            { value: '90d', label: '90 días' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                timeRange === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Totales</p>
                <p className="text-2xl font-bold">{analytics?.overview.total_users}</p>
                <div className={`flex items-center text-sm ${getTrendColor(analytics?.trends.users_growth || 0)}`}>
                  {getTrendIcon(analytics?.trends.users_growth || 0)}
                  <span className="ml-1">{formatPercent(analytics?.trends.users_growth || 0)}</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Activos (7d)</p>
                <p className="text-2xl font-bold">{analytics?.overview.active_users_7d}</p>
                <p className="text-sm text-muted-foreground">
                  de {analytics?.overview.total_users} totales
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Apps Instaladas</p>
                <p className="text-2xl font-bold">{analytics?.overview.total_apps}</p>
                <div className={`flex items-center text-sm ${getTrendColor(analytics?.trends.apps_growth || 0)}`}>
                  {getTrendIcon(analytics?.trends.apps_growth || 0)}
                  <span className="ml-1">{formatPercent(analytics?.trends.apps_growth || 0)}</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suscripciones Activas</p>
                <p className="text-2xl font-bold">{analytics?.overview.active_subscriptions}</p>
                <p className="text-sm text-muted-foreground">
                  de {analytics?.overview.total_apps} apps
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(analytics?.overview.monthly_revenue || 0)}
                </p>
                <div className={`flex items-center text-sm ${getTrendColor(analytics?.trends.revenue_growth || 0)}`}>
                  {getTrendIcon(analytics?.trends.revenue_growth || 0)}
                  <span className="ml-1">{formatPercent(analytics?.trends.revenue_growth || 0)}</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Almacenamiento</p>
                <p className="text-2xl font-bold">
                  {analytics?.overview.storage_used_gb.toFixed(1)} GB
                </p>
                <p className="text-sm text-muted-foreground">de 5 GB disponibles</p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Usuarios activos y revenue por día en los últimos {timeRange}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {analytics?.activity.map((day, index) => (
              <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div 
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${(day.users / 12) * 120}px`, minHeight: '4px' }}
                    title={`${day.users} usuarios activos`}
                  />
                  <div 
                    className="w-8 bg-green-500 rounded-b"
                    style={{ height: `${(day.revenue / 30000) * 80}px`, minHeight: day.revenue > 0 ? '4px' : '0px' }}
                    title={`${formatCurrency(day.revenue)} revenue`}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('es-PA', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Usuarios Activos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Revenue</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Apps */}
      <Card>
        <CardHeader>
          <CardTitle>Apps Más Utilizadas</CardTitle>
          <CardDescription>
            Aplicaciones con mayor uso y generación de ingresos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.top_apps.map((app, index) => (
              <div key={app.app_name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{app.app_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {app.usage_count} usos este período
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(app.revenue)}
                  </p>
                  <p className="text-sm text-muted-foreground">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                📈 Insights y Recomendaciones
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-200 space-y-2">
                <p>
                  • Tu empresa ha crecido un <strong>{formatPercent(analytics?.trends.users_growth || 0)}</strong> en usuarios este período
                </p>
                <p>
                  • Los ingresos han aumentado un <strong>{formatPercent(analytics?.trends.revenue_growth || 0)}</strong> 
                </p>
                <p>
                  • Tienes <strong>{((analytics?.overview.active_users_7d || 0) / (analytics?.overview.total_users || 1) * 100).toFixed(0)}%</strong> de tus usuarios activos en los últimos 7 días
                </p>
                <p>
                  • Espacio de almacenamiento utilizado: <strong>{((analytics?.overview.storage_used_gb || 0) / 5 * 100).toFixed(0)}%</strong>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
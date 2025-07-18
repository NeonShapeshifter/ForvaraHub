// ForvaraHub/src/pages/Analytics.tsx

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Activity,
  Calendar,
  Download,
  Filter,
  AlertCircle,
  DollarSign,
  Database
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { analyticsService, type AnalyticsData } from '@/services/analytics.service'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'

// Loading skeleton component
const AnalyticsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="shadow-card">
          <CardContent className="p-6">
            <div className="skeleton h-16 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="skeleton h-64 rounded"></div>
      </CardContent>
    </Card>
  </div>
)

// Empty state component
const EmptyState = () => (
  <Card className="shadow-card">
    <CardContent className="p-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay datos de análisis disponibles
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          Los datos de análisis aparecerán aquí una vez que tu equipo comience a usar las aplicaciones y genere actividad.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Ver guía de inicio
          </Button>
          <Button size="sm" className="gradient-brand" onClick={() => navigate('/marketplace')}>
            <Package className="w-4 h-4 mr-2" />
            Explorar Marketplace
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)

// Metric card component
const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'gray',
  suffix = '',
  trend
}: {
  title: string
  value: number | string
  change?: number
  icon: any
  color?: string
  suffix?: string
  trend?: 'up' | 'down' | 'neutral'
}) => {
  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    gray: 'text-gray-600'
  }

  const getTrendColor = () => {
    if (!trend || trend === 'neutral') return 'text-gray-500'
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Card className="shadow-card hover:shadow-md transition-fast">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Icon className={`w-5 h-5 ${iconColors[color as keyof typeof iconColors]}`} />
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-gradient">
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </CardContent>
    </Card>
  )
}

export default function Analytics() {
  const { currentCompany, isIndividualMode } = useAuthStore()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)
  const [timeRange, setTimeRange] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [currentCompany, timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await analyticsService.getAnalytics(timeRange)
      setAnalyticsData(data)
      // Check if there's meaningful data
      setHasData(
        data.overview.total_users > 0 ||
        data.overview.total_apps > 0 ||
        data.overview.active_subscriptions > 0
      )
    } catch (error) {
      console.error('Error loading analytics:', error)
      showToast({
        title: 'Error',
        description: 'No se pudieron cargar los datos de análisis',
        variant: 'destructive'
      })
      setHasData(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Analytics"
          description="Métricas y análisis de tu empresa"
        />
        <AnalyticsSkeleton />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Métricas y análisis de tu empresa"
        actions={
          hasData && (
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          )
        }
      />

      {/* Time range selector */}
      {hasData && (
        <div className="flex gap-2 mb-6">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-fast ${
                timeRange === range
                  ? 'gradient-brand text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === '24h' && '24 horas'}
              {range === '7d' && '7 días'}
              {range === '30d' && '30 días'}
              {range === '90d' && '90 días'}
            </button>
          ))}
        </div>
      )}

      {/* Contenido principal */}
      {!hasData ? (
        <EmptyState />
      ) : analyticsData && (
        <div className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title={isIndividualMode ? 'Tu cuenta' : 'Usuarios totales'}
              value={analyticsData.overview.total_users}
              change={analyticsData.trends.users_growth}
              trend={analyticsData.trends.users_growth > 0 ? 'up' : analyticsData.trends.users_growth < 0 ? 'down' : 'neutral'}
              icon={Users}
              color="blue"
            />
            <MetricCard
              title="Apps activas"
              value={analyticsData.overview.total_apps}
              change={analyticsData.trends.apps_growth}
              trend={analyticsData.trends.apps_growth > 0 ? 'up' : analyticsData.trends.apps_growth < 0 ? 'down' : 'neutral'}
              icon={Package}
              color="green"
            />
            <MetricCard
              title="Ingresos mensuales"
              value={`$${(analyticsData.overview.monthly_revenue / 100).toFixed(2)}`}
              change={analyticsData.trends.revenue_growth}
              trend={analyticsData.trends.revenue_growth > 0 ? 'up' : analyticsData.trends.revenue_growth < 0 ? 'down' : 'neutral'}
              icon={DollarSign}
              color="purple"
            />
            <MetricCard
              title="Almacenamiento"
              value={`${analyticsData.overview.storage_used_gb.toFixed(1)}`}
              suffix="GB"
              icon={Database}
              color="orange"
            />
          </div>

          {/* Actividad en el tiempo */}
          {analyticsData.activity.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Actividad en el tiempo</CardTitle>
                <CardDescription>Tendencias de uso en los últimos {timeRange === '7d' ? '7 días' : timeRange === '30d' ? '30 días' : '90 días'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData.activity.map((day, index) => {
                    const maxUsers = Math.max(...analyticsData.activity.map(d => d.users))
                    const height = (day.users / maxUsers) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-500"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-500">
                          {new Date(day.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apps más usadas */}
          {analyticsData.top_apps.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Apps más utilizadas</CardTitle>
                <CardDescription>Ranking de aplicaciones por uso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.top_apps.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-fast">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{app.app_name}</p>
                          <p className="text-xs text-gray-500">{app.usage_count} usos</p>
                        </div>
                      </div>
                      {app.revenue > 0 && (
                        <p className="text-sm font-medium text-green-600">
                          ${(app.revenue / 100).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Nota informativa */}
      {!hasData && (
        <div className="mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">¿Sabías que?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Analytics te permite monitorear el uso de aplicaciones, identificar tendencias y optimizar
                    la productividad de tu equipo. Los datos se actualizan en tiempo real.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  )
}

// ForvaraHub/src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { 
  Users, 
  Building, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign,
  Clock,
  AlertCircle,
  Settings,
  Database
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { dashboardService } from '@/services/dashboard.service'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'

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
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    gray: 'text-gray-600'
  }

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-card hover:shadow-md transition-fast">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Icon className={`w-5 h-5 ${iconColors[color as keyof typeof iconColors]}`} />
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-gradient">
          {value}{suffix}
        </div>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </CardContent>
    </Card>
  )
}

// Helper function to format relative time
const formatRelativeTime = (timestamp: string) => {
  const now = new Date()
  const then = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Ahora mismo'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`
  
  return then.toLocaleDateString('es-ES')
}

export default function Dashboard() {
  const { user, currentCompany, isIndividualMode } = useAuthStore()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: 0,
    companies: 1,
    storage: '0%',
    apps: 0,
    apiCalls: 0,
    storageUsed: 0,
    storageLimit: 0
  })
  const [activities, setActivities] = useState<any[]>([])
  const [quickActions, setQuickActions] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [currentCompany, isIndividualMode])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load dashboard stats
      const statsData = await dashboardService.getDashboardStats()
      
      // Calculate storage percentage
      const storagePercentage = ((statsData.storage_used_gb / statsData.storage_limit_gb) * 100).toFixed(1)
      
      setStats({
        users: statsData.active_users || 0,
        companies: 1,
        storage: `${storagePercentage}%`,
        apps: statsData.installed_apps || 0,
        apiCalls: statsData.api_calls_month || 0,
        storageUsed: statsData.storage_used_gb || 0,
        storageLimit: statsData.storage_limit_gb || 0
      })

      // Load recent activity
      const activityData = await dashboardService.getRecentActivity(5)
      setActivities(activityData)

      // Load quick actions
      const actionsData = await dashboardService.getQuickActions()
      setQuickActions(actionsData)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      showToast({
        title: 'Error',
        description: 'No se pudieron cargar los datos del dashboard',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Bienvenido, ${user?.first_name}`}
        description="Panel de administración de Forvara Hub"
      />

      {/* Alert de periodo de prueba */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-900">Período de prueba</h3>
              <p className="text-sm text-orange-700 mt-1">
                Tu período de prueba finaliza en 30 días. Actualiza tu plan para continuar usando todas las funciones.
              </p>
              <button className="mt-2 px-3 py-1.5 gradient-brand text-white text-sm rounded-lg font-medium hover:opacity-90 transition-fast">
                Actualizar plan
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title={isIndividualMode ? "Tu cuenta" : "Usuarios activos"}
          value={stats.users}
          icon={Users}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Apps instaladas"
          value={stats.apps}
          icon={Package}
          color="green"
          loading={loading}
        />
        <MetricCard
          title="Almacenamiento"
          value={`${stats.storageUsed}/${stats.storageLimit}GB`}
          icon={Database}
          color="purple"
          loading={loading}
          change={parseInt(stats.storage)}
          trend={parseInt(stats.storage) > 80 ? 'down' : 'up'}
        />
        <MetricCard
          title="Llamadas API"
          value={stats.apiCalls.toLocaleString()}
          suffix="/mes"
          icon={Activity}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Acciones del equipo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Acciones del equipo</CardTitle>
            <CardDescription>Gestiona tu equipo y aplicaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-xl animate-pulse">
                    <div className="w-5 h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))
              ) : quickActions.length > 0 ? (
                quickActions.slice(0, 4).map((action) => (
                  <button 
                    key={action.id}
                    onClick={() => navigate(action.action)}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-fast text-left"
                  >
                    {action.icon === 'user-plus' && <Users className="w-5 h-5 text-blue-600 mb-2" />}
                    {action.icon === 'shopping-bag' && <Package className="w-5 h-5 text-green-600 mb-2" />}
                    {action.icon === 'bar-chart' && <Activity className="w-5 h-5 text-purple-600 mb-2" />}
                    {action.icon === 'settings' && <Settings className="w-5 h-5 text-orange-600 mb-2" />}
                    <h4 className="font-medium text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </button>
                ))
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/users')}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-fast text-left"
                  >
                    <Users className="w-5 h-5 text-blue-600 mb-2" />
                    <h4 className="font-medium text-sm">Gestionar Equipo</h4>
                    <p className="text-xs text-gray-500">Invitar y administrar usuarios</p>
                  </button>
                  <button 
                    onClick={() => navigate('/marketplace')}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-fast text-left"
                  >
                    <Package className="w-5 h-5 text-green-600 mb-2" />
                    <h4 className="font-medium text-sm">Apps Empresariales</h4>
                    <p className="text-xs text-gray-500">Instalar para todo el equipo</p>
                  </button>
                  <button 
                    onClick={() => navigate('/analytics')}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-fast text-left"
                  >
                    <Activity className="w-5 h-5 text-purple-600 mb-2" />
                    <h4 className="font-medium text-sm">Analytics</h4>
                    <p className="text-xs text-gray-500">Métricas del equipo</p>
                  </button>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-fast text-left"
                  >
                    <Settings className="w-5 h-5 text-orange-600 mb-2" />
                    <h4 className="font-medium text-sm">Configuración</h4>
                    <p className="text-xs text-gray-500">Ajustes de la empresa</p>
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Últimas acciones en tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-fast">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type.includes('login') ? 'bg-green-500' :
                      activity.type.includes('create') ? 'bg-blue-500' :
                      activity.type.includes('update') ? 'bg-yellow-500' :
                      activity.type.includes('delete') ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length >= 5 && (
                  <button 
                    onClick={() => navigate('/analytics')}
                    className="w-full text-center text-xs text-gradient font-medium hover:underline py-2"
                  >
                    Ver toda la actividad
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No hay actividad reciente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer informativo */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          ¿Necesitas ayuda? Visita nuestra{' '}
          <a href="#" className="text-gradient font-medium hover:underline">
            documentación
          </a>{' '}
          o{' '}
          <a href="#" className="text-gradient font-medium hover:underline">
            contacta soporte
          </a>
        </p>
      </div>
    </PageContainer>
  )
}

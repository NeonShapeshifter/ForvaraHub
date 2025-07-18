// ForvaraHub/src/pages/AdminDashboard.tsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Building, 
  DollarSign,
  Package,
  Activity,
  Settings,
  Database,
  Shield,
  TrendingUp,
  AlertCircle,
  CreditCard
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { adminService, type AdminDashboard } from '@/services/admin.service'
import { useToast } from '@/hooks/useToast'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

// Admin tool card component
const AdminToolCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  onClick,
  comingSoon = false
}: {
  title: string
  description: string
  icon: any
  color: string
  onClick?: () => void
  comingSoon?: boolean
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100',
    indigo: 'text-indigo-600 bg-indigo-100'
  }

  return (
    <Card 
      className={`shadow-card hover:shadow-md transition-fast cursor-pointer border-2 border-transparent hover:border-gray-200 ${
        comingSoon ? 'opacity-60' : ''
      }`}
      onClick={!comingSoon ? onClick : undefined}
    >
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        {comingSoon && (
          <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Próximamente
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await adminService.getDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error('Error loading admin dashboard:', error)
      showToast({
        title: 'Error',
        description: 'No se pudieron cargar los datos del dashboard',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const adminTools = [
    {
      title: 'Gestión de Empresas',
      description: 'Ver y administrar todas las empresas',
      icon: Building,
      color: 'blue',
      path: '/admin/companies'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Buscar y administrar cuentas',
      icon: Users,
      color: 'green',
      path: '/admin/users'
    },
    {
      title: 'Análisis de Ingresos',
      description: 'Métricas financieras detalladas',
      icon: DollarSign,
      color: 'purple',
      path: '/admin/revenue'
    },
    {
      title: 'Gestión de Apps',
      description: 'Administrar el marketplace',
      icon: Package,
      color: 'orange',
      path: '/admin/apps',
      comingSoon: true
    },
    {
      title: 'Monitoreo del Sistema',
      description: 'Estado y rendimiento',
      icon: Activity,
      color: 'red',
      path: '/admin/monitoring',
      comingSoon: true
    },
    {
      title: 'Configuración Global',
      description: 'Ajustes del sistema',
      icon: Settings,
      color: 'indigo',
      path: '/admin/settings',
      comingSoon: true
    }
  ]

  const stats = dashboardData ? [
    { 
      label: 'Empresas totales', 
      value: dashboardData.overview.total_companies.toString(), 
      icon: Building, 
      change: `+${dashboardData.growth.companies_this_month} este mes` 
    },
    { 
      label: 'Usuarios totales', 
      value: dashboardData.overview.total_users.toString(), 
      icon: Users, 
      change: `+${dashboardData.growth.users_this_month} este mes` 
    },
    { 
      label: 'Suscripciones activas', 
      value: dashboardData.overview.active_companies.toString(), 
      icon: CreditCard, 
      change: `${dashboardData.overview.trial_companies} en prueba` 
    },
    { 
      label: 'Ingresos mensuales', 
      value: `$${(dashboardData.overview.revenue_monthly / 100).toFixed(2)}`, 
      icon: DollarSign, 
      change: dashboardData.overview.revenue_monthly > 0 ? '+12% vs mes anterior' : 'Sin cambios' 
    }
  ] : []

  return (
    <PageContainer>
      <PageHeader
        title="Centro de comando admin"
        description="Bienvenido, CEO! Aquí está el panorama de tu imperio"
      />

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <stat.icon className="w-5 h-5 text-gray-400" />
                <span className="text-xs text-gray-500">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-gradient">{stat.value}</div>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
            ))}
          </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Empresas recientes</CardTitle>
            <CardDescription>Registradas en los últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData && dashboardData.recent_activity.companies.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent_activity.companies.slice(0, 5).map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-fast">
                    <div>
                      <p className="font-medium text-sm">{company.razon_social}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(company.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.status === 'active' ? 'bg-green-100 text-green-700' :
                      company.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {company.status === 'trial' ? 'Prueba' : company.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay empresas recientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Usuarios recientes</CardTitle>
            <CardDescription>Registrados en los últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData && dashboardData.recent_activity.users.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent_activity.users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-fast">
                    <div>
                      <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay usuarios recientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Tools */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminTools.map((tool) => (
            <AdminToolCard
              key={tool.path}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              color={tool.color}
              onClick={() => !tool.comingSoon && navigate(tool.path)}
              comingSoon={tool.comingSoon}
            />
          ))}
        </div>
      </div>

      {/* Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Panel de administración</h4>
              <p className="text-sm text-blue-700 mt-1">
                Este es el centro de comando para administradores. Desde aquí puedes gestionar todos los aspectos 
                de la plataforma. Las herramientas se irán habilitando gradualmente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </PageContainer>
  )
}

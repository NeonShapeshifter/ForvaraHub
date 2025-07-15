import React, { useState, useEffect } from 'react'
import { Crown, Building2, Users, TrendingUp, DollarSign, Activity, Eye, Package, BarChart3, ChevronRight, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { AppManagement } from '@/components/admin/AppManagement'
import { PageHeader, PageContainer, ContentSection, GridContainer } from '@/components/layout'
import { LoadingState, ErrorState } from '@/components/common'

interface AdminDashboardData {
  overview: {
    total_companies: number
    total_users: number
    active_companies: number
    trial_companies: number
    revenue_monthly: number
    revenue_total: number
  }
  recent_activity: {
    companies: Array<{
      id: string
      razon_social: string
      created_at: string
      status: string
    }>
    users: Array<{
      id: string
      first_name: string
      last_name: string
      email: string
      created_at: string
    }>
  }
  growth: {
    companies_this_month: number
    users_this_month: number
  }
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'overview' | 'apps' | 'analytics'>('overview')

  // Check if user is admin
  const isAdmin = user?.email === 'ale@forvara.com' || user?.email === 'admin@forvara.com'

  useEffect(() => {
    if (!isAdmin) return
    fetchDashboardData()
  }, [isAdmin])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Try to get real data from admin endpoint
      try {
        const response = await api.get('/admin/dashboard')
        setDashboardData(response.data)
        setLoading(false)
      } catch (apiError) {
        console.warn('Admin API not available, using mock data:', apiError)
        
        // Fallback to mock data
        setTimeout(() => {
          setDashboardData({
            overview: {
              total_companies: 1,
              total_users: 1,
              active_companies: 0,
              trial_companies: 1,
              revenue_monthly: 0,
              revenue_total: 0
            },
            recent_activity: {
              companies: [
                {
                  id: '090cff73-f808-427e-b499-938febf403e7',
                  razon_social: 'Forvara S.A.',
                  created_at: '2025-07-13T18:55:10.69804+00:00',
                  status: 'trial'
                }
              ],
              users: [
                {
                  id: '500700cc-0d43-41d1-aea7-353b716a7e30',
                  first_name: 'Alejandro',
                  last_name: 'Forvara',
                  email: 'ale@forvara.com',
                  created_at: '2025-07-13T18:39:35.19163+00:00'
                }
              ]
            },
            growth: {
              companies_this_month: 1,
              users_this_month: 1
            }
          })
          setLoading(false)
        }, 500)
      }
      
    } catch (error: any) {
      setError(error.message || 'Failed to load admin dashboard')
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <PageContainer>
        <ErrorState
          title="Acceso denegado"
          message="Necesitas privilegios de administrador para acceder a esta área"
          variant="page"
          showRetry={false}
        />
      </PageContainer>
    )
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          message="Cargando panel de administración..."
          variant="page"
        />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Error"
          message={error}
          variant="page"
          onRetry={fetchDashboardData}
        />
      </PageContainer>
    )
  }

  const data = dashboardData!

  return (
    <PageContainer>
      <PageHeader
        title="Centro de comando admin"
        description="Bienvenido, CEO! Aquí está el panorama de tu imperio"
        icon={Crown}
      />

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-4 py-1.5 rounded-md transition-all text-sm font-medium flex items-center gap-2 ${
                activeSection === 'overview'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Crown className="w-4 h-4" />
              Resumen
            </button>
            <button
              onClick={() => setActiveSection('apps')}
              className={`px-4 py-1.5 rounded-md transition-all text-sm font-medium flex items-center gap-2 ${
                activeSection === 'apps'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              App Store
            </button>
            <button
              onClick={() => setActiveSection('analytics')}
              className={`px-4 py-1.5 rounded-md transition-all text-sm font-medium flex items-center gap-2 ${
                activeSection === 'analytics'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        {activeSection === 'overview' && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    +{data.growth.companies_this_month} este mes
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {data.overview.total_companies}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Empresas totales
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    +{data.growth.users_this_month} este mes
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {data.overview.total_users}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Usuarios totales
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {data.overview.trial_companies} en prueba
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {data.overview.active_companies}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Suscripciones activas
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${data.overview.revenue_monthly.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Ingresos mensuales
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Total: ${data.overview.revenue_total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Companies */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Empresas recientes
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Registradas en los últimos 30 días
                  </p>
                </div>
                <div className="p-6">
                  {data.recent_activity.companies.length > 0 ? (
                    <div className="space-y-3">
                      {data.recent_activity.companies.map((company) => (
                        <div key={company.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {company.razon_social}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(company.created_at).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              company.status === 'active' ? 'bg-green-500' : 'bg-blue-500'
                            }`}></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {company.status === 'active' ? 'Activo' : 'Prueba'}
                            </span>
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No hay empresas recientes
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Usuarios recientes
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Registrados en los últimos 30 días
                  </p>
                </div>
                <div className="p-6">
                  {data.recent_activity.users.length > 0 ? (
                    <div className="space-y-3">
                      {data.recent_activity.users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">
                              {new Date(user.created_at).toLocaleDateString('es-ES')}
                            </span>
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No hay usuarios recientes
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" />
                Acciones rápidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left group">
                  <Building2 className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Gestionar empresas</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Ver y administrar todas las empresas
                  </p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </button>
                
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left group">
                  <Users className="w-6 h-6 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Gestión de usuarios</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Buscar y administrar cuentas
                  </p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </button>
                
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left group">
                  <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Analytics de ingresos</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Métricas financieras detalladas
                  </p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* App Store Management Section */}
        {activeSection === 'apps' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <AppManagement />
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Analytics avanzado
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Dashboard de analytics detallado próximamente...
            </p>
          </div>
        )}
    </PageContainer>
  )
}

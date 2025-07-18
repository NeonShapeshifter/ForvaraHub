import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, CreditCard, Users, Building2, Package } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useNotifications } from '@/components/ui/notifications'

interface RevenueData {
  monthly_recurring_revenue: number
  annual_recurring_revenue: number
  total_revenue: number
  growth_rate: number
  churn_rate: number
  average_revenue_per_user: number
  active_subscriptions: number
  trial_conversions: number
}

interface MonthlyRevenue {
  month: string
  revenue: number
  subscriptions: number
  new_customers: number
  churned_customers: number
}

export default function AdminRevenue() {
  const { addNotification } = useNotifications()
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'3m' | '6m' | '12m'>('6m')

  useEffect(() => {
    loadRevenueData()
  }, [selectedPeriod])

  const loadRevenueData = async () => {
    try {
      setLoading(true)

      // Demo data - in production would come from API
      const demoRevenueData: RevenueData = {
        monthly_recurring_revenue: 156780, // $1,567.80
        annual_recurring_revenue: 1881360, // $18,813.60
        total_revenue: 234560, // $2,345.60
        growth_rate: 23.5,
        churn_rate: 2.8,
        average_revenue_per_user: 4750, // $47.50
        active_subscriptions: 33,
        trial_conversions: 68.5
      }

      const demoMonthlyData: MonthlyRevenue[] = [
        { month: '2024-01', revenue: 89450, subscriptions: 19, new_customers: 4, churned_customers: 1 },
        { month: '2024-02', revenue: 98230, subscriptions: 21, new_customers: 3, churned_customers: 1 },
        { month: '2024-03', revenue: 112670, subscriptions: 24, new_customers: 5, churned_customers: 2 },
        { month: '2024-04', revenue: 125890, subscriptions: 27, new_customers: 4, churned_customers: 1 },
        { month: '2024-05', revenue: 143250, subscriptions: 30, new_customers: 6, churned_customers: 3 },
        { month: '2024-06', revenue: 156780, subscriptions: 33, new_customers: 5, churned_customers: 2 }
      ]

      setRevenueData(demoRevenueData)
      setMonthlyData(demoMonthlyData)

    } catch (error) {
      console.error('Error loading revenue data:', error)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los datos de ingresos'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getMonthName = (monthStr: string) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const month = new Date(monthStr + '-01').getMonth()
    return months[month]
  }

  const exportRevenueData = () => {
    addNotification({
      type: 'info',
      title: 'Exportando datos',
      message: 'La exportación de datos estará disponible pronto'
    })
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Análisis de Ingresos"
          description="Métricas financieras y análisis de suscripciones"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Cargando datos de ingresos...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!revenueData) return null

  return (
    <PageContainer>
      <PageHeader
        title="Análisis de Ingresos"
        description="Métricas financieras y análisis de suscripciones"
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            >
              <option value="3m">Últimos 3 meses</option>
              <option value="6m">Últimos 6 meses</option>
              <option value="12m">Último año</option>
            </select>
            <button
              onClick={exportRevenueData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-medium">{formatPercentage(revenueData.growth_rate)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.monthly_recurring_revenue)}</div>
          <p className="text-sm text-gray-500">MRR (Ingresos Mensuales Recurrentes)</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-medium">×12</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.annual_recurring_revenue)}</div>
          <p className="text-sm text-gray-500">ARR (Ingresos Anuales Recurrentes)</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <TrendingDown className="w-3 h-3" />
              <span className="text-xs font-medium">{formatPercentage(revenueData.churn_rate)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.average_revenue_per_user)}</div>
          <p className="text-sm text-gray-500">ARPU (Ingresos por Usuario)</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-medium">{formatPercentage(revenueData.trial_conversions)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{revenueData.active_subscriptions}</div>
          <p className="text-sm text-gray-500">Suscripciones Activas</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Evolución de Ingresos</h3>
            <p className="text-sm text-gray-500">Ingresos mensuales recurrentes en los últimos meses</p>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          {monthlyData.map((month, index) => {
            const maxRevenue = Math.max(...monthlyData.map(m => m.revenue))
            const percentage = (month.revenue / maxRevenue) * 100

            return (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-12 text-sm text-gray-500 font-medium">
                  {getMonthName(month.month)}
                </div>
                <div className="flex-1 relative">
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-3"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {formatCurrency(month.revenue)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-500 text-right">
                  {month.subscriptions} subs
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customer Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Clientes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Conversión de Trial</p>
                  <p className="text-xs text-gray-500">Usuarios que se suscriben después del trial</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-green-600">
                {formatPercentage(revenueData.trial_conversions)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Tasa de Churn</p>
                  <p className="text-xs text-gray-500">Porcentaje de clientes que cancelan</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-red-600">
                {formatPercentage(revenueData.churn_rate)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Suscripciones Activas</p>
                  <p className="text-xs text-gray-500">Total de suscripciones pagando</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-blue-600">
                {revenueData.active_subscriptions}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {monthlyData.slice(-3).reverse().map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getMonthName(month.month)} 2024
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>+{month.new_customers} nuevos</span>
                    <span>-{month.churned_customers} cancelaciones</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(month.revenue)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {month.subscriptions} suscripciones
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose de Ingresos por Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Plan Básico</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$580.00</p>
            <p className="text-sm text-gray-500">20 suscripciones × $29</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Plan Pro</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$948.00</p>
            <p className="text-sm text-gray-500">12 suscripciones × $79</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Enterprise</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$39.80</p>
            <p className="text-sm text-gray-500">1 suscripción personalizada</p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

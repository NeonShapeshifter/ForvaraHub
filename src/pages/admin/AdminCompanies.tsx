import React, { useState, useEffect } from 'react'
import { Search, MoreVertical, Building2, Users, Crown, Ban, CheckCircle, Calendar, Filter, DollarSign, Package } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useNotifications } from '@/components/ui/notifications'
import { api } from '@/services/api'

interface AdminCompany {
  id: string
  razon_social: string
  ruc?: string
  status: 'active' | 'trial' | 'suspended' | 'expired'
  plan_type: 'trial' | 'basic' | 'pro' | 'enterprise'
  created_at: string
  trial_ends_at?: string
  owner: {
    first_name: string
    last_name: string
    email: string
  }
  members_count: number
  apps_count: number
  monthly_revenue: number
  storage_used_gb: number
  storage_limit_gb: number
}

export default function AdminCompanies() {
  const { addNotification } = useNotifications()
  const [companies, setCompanies] = useState<AdminCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'suspended' | 'expired'>('all')
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setLoading(true)

      // In production this would call /admin/companies
      // For now showing demo data
      const demoCompanies: AdminCompany[] = [
        {
          id: '1',
          razon_social: 'Forvara S.A.',
          ruc: '155-123-456',
          status: 'active',
          plan_type: 'pro',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          owner: {
            first_name: 'Alejandro',
            last_name: 'Forvara',
            email: 'ale@forvara.com'
          },
          members_count: 5,
          apps_count: 3,
          monthly_revenue: 7900, // $79.00
          storage_used_gb: 2.5,
          storage_limit_gb: 50
        },
        {
          id: '2',
          razon_social: 'Tech Solutions Corp',
          ruc: '123-456-789',
          status: 'trial',
          plan_type: 'trial',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          owner: {
            first_name: 'María',
            last_name: 'González',
            email: 'maria@techsolutions.com'
          },
          members_count: 3,
          apps_count: 2,
          monthly_revenue: 0,
          storage_used_gb: 0.8,
          storage_limit_gb: 5
        },
        {
          id: '3',
          razon_social: 'Comercial El Dorado',
          status: 'active',
          plan_type: 'basic',
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          owner: {
            first_name: 'Carlos',
            last_name: 'Mendoza',
            email: 'carlos@eldorado.com'
          },
          members_count: 8,
          apps_count: 1,
          monthly_revenue: 2900, // $29.00
          storage_used_gb: 12.3,
          storage_limit_gb: 20
        }
      ]

      setCompanies(demoCompanies)

    } catch (error) {
      console.error('Error loading companies:', error)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar las empresas'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCompanyAction = async (companyId: string, action: 'suspend' | 'activate' | 'extend_trial' | 'delete') => {
    const company = companies.find(c => c.id === companyId)
    if (!company) return

    const confirmMessages = {
      suspend: `¿Suspender ${company.razon_social}?`,
      activate: `¿Activar ${company.razon_social}?`,
      extend_trial: `¿Extender trial de ${company.razon_social} por 14 días más?`,
      delete: `¿Eliminar permanentemente ${company.razon_social}? Esta acción no se puede deshacer.`
    }

    if (!confirm(confirmMessages[action])) return

    try {
      setActionLoading(companyId)

      // In production would call API
      if (action === 'delete') {
        setCompanies(prev => prev.filter(c => c.id !== companyId))
        addNotification({
          type: 'success',
          title: 'Empresa eliminada',
          message: `${company.razon_social} ha sido eliminada`
        })
      } else if (action === 'extend_trial') {
        setCompanies(prev => prev.map(c =>
          c.id === companyId ? {
            ...c,
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          } : c
        ))
        addNotification({
          type: 'success',
          title: 'Trial extendido',
          message: `Trial de ${company.razon_social} extendido por 14 días`
        })
      } else {
        setCompanies(prev => prev.map(c =>
          c.id === companyId ? { ...c, status: action === 'suspend' ? 'suspended' : 'active' } : c
        ))
        addNotification({
          type: 'success',
          title: action === 'suspend' ? 'Empresa suspendida' : 'Empresa activada',
          message: `${company.razon_social} ha sido ${action === 'suspend' ? 'suspendida' : 'activada'}`
        })
      }

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo realizar la acción'
      })
    } finally {
      setActionLoading(null)
      setSelectedCompany(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      trial: 'bg-blue-100 text-blue-700 border-blue-200',
      suspended: 'bg-red-100 text-red-700 border-red-200',
      expired: 'bg-gray-100 text-gray-700 border-gray-200'
    }

    const labels = {
      active: 'Activa',
      trial: 'Prueba',
      suspended: 'Suspendida',
      expired: 'Expirada'
    }

    return (
      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles] || styles.active}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const getPlanBadge = (plan: string) => {
    const styles = {
      trial: 'bg-blue-100 text-blue-700',
      basic: 'bg-green-100 text-green-700',
      pro: 'bg-purple-100 text-purple-700',
      enterprise: 'bg-orange-100 text-orange-700'
    }

    const labels = {
      trial: 'Trial',
      basic: 'Básico',
      pro: 'Pro',
      enterprise: 'Enterprise'
    }

    return (
      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${styles[plan as keyof typeof styles] || styles.basic}`}>
        {labels[plan as keyof typeof labels] || plan}
      </span>
    )
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const getDaysUntilTrialExpires = (trialEnds?: string) => {
    if (!trialEnds) return 0
    const today = new Date()
    const endDate = new Date(trialEnds)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm === '' ||
      company.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.ruc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.owner.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || company.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalRevenue = companies.reduce((sum, company) => sum + company.monthly_revenue, 0)
  const totalActiveCompanies = companies.filter(c => c.status === 'active').length
  const totalTrialCompanies = companies.filter(c => c.status === 'trial').length

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Gestión de Empresas"
          description="Administra todas las empresas de la plataforma"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Cargando empresas...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Gestión de Empresas"
        description="Administra todas las empresas de la plataforma"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar empresas por nombre, RUC o email del propietario..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm appearance-none min-w-[150px]"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="trial">En prueba</option>
              <option value="suspended">Suspendidas</option>
              <option value="expired">Expiradas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{companies.length}</p>
              <p className="text-sm text-gray-500">Total empresas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{totalActiveCompanies}</p>
              <p className="text-sm text-gray-500">Activas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{totalTrialCompanies}</p>
              <p className="text-sm text-gray-500">En prueba</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-gray-500">Ingresos/mes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propietario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Métricas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creada
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-white">
                        {company.razon_social.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {company.razon_social}
                      </div>
                      {company.ruc && (
                        <div className="text-xs text-gray-500">
                          RUC: {company.ruc}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="text-gray-900 font-medium">
                      {company.owner.first_name} {company.owner.last_name}
                    </div>
                    <div className="text-gray-500">
                      {company.owner.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPlanBadge(company.plan_type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {getStatusBadge(company.status)}
                    {company.status === 'trial' && company.trial_ends_at && (
                      <div className="text-xs text-gray-500">
                        {getDaysUntilTrialExpires(company.trial_ends_at)} días restantes
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span>{company.members_count} usuarios</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-3 h-3 text-gray-400" />
                      <span>{company.apps_count} apps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span>{formatCurrency(company.monthly_revenue)}/mes</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(company.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="relative">
                    <button
                      onClick={() => setSelectedCompany(selectedCompany === company.id ? null : company.id)}
                      disabled={actionLoading === company.id}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {selectedCompany === company.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        {company.status === 'active' ? (
                          <button
                            onClick={() => handleCompanyAction(company.id, 'suspend')}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            Suspender empresa
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCompanyAction(company.id, 'activate')}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            Activar empresa
                          </button>
                        )}
                        {company.status === 'trial' && (
                          <button
                            onClick={() => handleCompanyAction(company.id, 'extend_trial')}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            Extender trial (+14 días)
                          </button>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => handleCompanyAction(company.id, 'delete')}
                          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          Eliminar empresa
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCompanies.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron empresas
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </PageContainer>
  )
}

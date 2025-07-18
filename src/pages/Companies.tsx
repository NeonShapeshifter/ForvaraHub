import { useState, useEffect } from 'react'
import { Building2, Plus, Users, Calendar, Package, ExternalLink, Crown, Settings, X, ChevronRight, HardDrive, RefreshCw } from 'lucide-react'

import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useNotifications } from '@/components/ui/notifications'

interface Company {
  id: string
  razon_social: string
  slug: string
  description?: string
  logo_url?: string
  storage_used_bytes: number
  status: string
  created_at: string
  updated_at: string
  user_role: string
  joined_at: string
  ruc?: string
}

// Modal de creación de empresa
const CreateCompanyModal = ({ isOpen, onClose, onCreate }: {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: any) => void
}) => {
  const [companyName, setCompanyName] = useState('')
  const [companyRuc, setCompanyRuc] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [creating, setCreating] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!companyName.trim()) return
    setCreating(true)

    try {
      await onCreate({
        razon_social: companyName,
        ruc: companyRuc,
        description: companyDescription
      })

      setCompanyName('')
      setCompanyRuc('')
      setCompanyDescription('')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Crear nueva empresa
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Razón Social *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Mi Empresa S.A."
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              RUC
            </label>
            <input
              type="text"
              value={companyRuc}
              onChange={(e) => setCompanyRuc(e.target.value)}
              placeholder="123456789"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descripción (opcional)
            </label>
            <textarea
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Descripción de tu empresa..."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={creating || !companyName.trim()}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear empresa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Companies() {
  const { setCurrentCompany, user } = useAuthStore()
  const { addNotification } = useNotifications()

  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      // Call the real backend API
      const response = await api.get('/tenants')
      const userCompanies = Array.isArray(response.data) ? response.data : []

      console.log('✅ Loaded user companies from backend:', userCompanies)
      setCompanies(userCompanies)

    } catch (error) {
      console.error('❌ Failed to load companies:', error)

      // Show fallback demo data
      const demoCompanies = [
        {
          id: '1',
          razon_social: 'Forvara S.A.',
          slug: 'forvara-sa',
          description: 'Empresa de tecnología para LATAM',
          logo_url: null,
          storage_used_bytes: 1073741824, // 1GB
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_role: 'owner',
          joined_at: new Date().toISOString(),
          ruc: '155-123-456'
        }
      ]

      setCompanies(demoCompanies)

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

  const createCompany = async (data: any) => {
    try {
      const response = await api.post('/auth/create-company', data)
      const newCompany = response.data

      setCompanies([newCompany, ...companies])
      setCreateModalOpen(false)

      addNotification({
        type: 'success',
        title: 'Empresa creada',
        message: `${data.razon_social} ha sido creada exitosamente`
      })

    } catch (error) {
      console.error('Failed to create company:', error)
      addNotification({
        type: 'error',
        title: 'Error al crear empresa',
        message: 'No se pudo crear la empresa. Intenta de nuevo.'
      })
    }
  }

  const switchCompany = (company: Company) => {
    setCurrentCompany(company)
    console.log('Switching to company:', company)
    window.location.href = '/dashboard'
  }

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return gb < 0.1 ? '< 0.1 GB' : `${gb.toFixed(1)} GB`
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-purple-50 text-purple-700 border-purple-200',
      admin: 'bg-blue-50 text-blue-700 border-blue-200',
      member: 'bg-green-50 text-green-700 border-green-200',
      viewer: 'bg-gray-50 text-gray-700 border-gray-200'
    }

    const labels = {
      owner: 'Propietario',
      admin: 'Administrador',
      member: 'Miembro',
      viewer: 'Visor'
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
        styles[role as keyof typeof styles] || styles.member
      }`}>
        {role === 'owner' && <Crown className="w-3 h-3" />}
        {labels[role as keyof typeof labels] || role}
      </span>
    )
  }

  const handleRefresh = () => {
    loadCompanies(false)
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Mis Empresas"
          description="Administra y cambia entre tus empresas"
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
        title="Mis Empresas"
        description="Administra y cambia entre tus empresas"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Nueva empresa
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{Array.isArray(companies) ? companies.length : 0}</p>
              <p className="text-sm text-gray-500">Empresas totales</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Crown className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {Array.isArray(companies) ? companies.filter(c => c.user_role === 'owner').length : 0}
              </p>
              <p className="text-sm text-gray-500">Como propietario</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {Array.isArray(companies) ? companies.filter(c => ['admin', 'member'].includes(c.user_role)).length : 0}
              </p>
              <p className="text-sm text-gray-500">Como miembro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      {Array.isArray(companies) && companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(companies) ? companies.map((company) => (
            <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                      {company.razon_social.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {company.razon_social}
                      </h3>
                      <div className="mt-1">
                        {getRoleBadge(company.user_role)}
                      </div>
                    </div>
                  </div>
                </div>

                {company.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {company.description}
                  </p>
                )}

                <div className="space-y-3 mb-4">
                  {company.ruc && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">RUC</span>
                      <span className="font-medium text-gray-900">{company.ruc}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Almacenamiento</span>
                    <span className="font-medium text-gray-900">
                      {formatStorage(company.storage_used_bytes)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Estado</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        company.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="font-medium text-gray-900">
                        {company.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Te uniste</span>
                    <span className="font-medium text-gray-900">
                      {new Date(company.joined_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => switchCompany(company)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Cambiar
                  </button>
                  {['owner', 'admin'].includes(company.user_role) && (
                    <button
                      onClick={() => {
                        switchCompany(company)
                        setTimeout(() => window.location.href = '/settings', 100)
                      }}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )) : null}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes empresas
          </h3>
          <p className="text-gray-500 mb-6">
            Crea tu primera empresa para comenzar a usar Forvara
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Crear primera empresa
          </button>
        </div>
      )}

      {/* Create Modal */}
      <CreateCompanyModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={createCompany}
      />
    </PageContainer>
  )
}

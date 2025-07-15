import React, { useState, useEffect } from 'react'
import { Building2, Plus, Users, Calendar, Package, ExternalLink, Crown, Settings, X, ChevronRight, HardDrive } from 'lucide-react'

// TODO: Importar desde los archivos reales del proyecto
// import { useAuthStore } from '../stores/authStore'
// import { api } from '../services/api'
// import { toast } from '../hooks/use-toast'

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
    
    await onCreate({
      razon_social: companyName,
      ruc: companyRuc,
      description: companyDescription
    })
    
    setCreating(false)
    setCompanyName('')
    setCompanyRuc('')
    setCompanyDescription('')
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Crear nueva empresa
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Razón Social *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Mi Empresa S.A."
              required
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              RUC
            </label>
            <input
              type="text"
              value={companyRuc}
              onChange={(e) => setCompanyRuc(e.target.value)}
              placeholder="123456789"
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Descripción (opcional)
            </label>
            <textarea
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Descripción de tu empresa..."
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={creating || !companyName.trim()}
              className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
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
  // TODO: Obtener desde el store real
  // const { setCurrentCompany } = useAuthStore()
  
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      
      // TODO: Conectar con el servicio real
      // const response = await api.get('/tenants/companies')
      // setCompanies(response.data.data || [])
      
      // Datos temporales
      setTimeout(() => {
        setCompanies([
          {
            id: '1',
            razon_social: 'Forvara S.A.',
            slug: 'forvara-sa',
            description: 'Empresa de desarrollo de software',
            storage_used_bytes: 1.2 * 1024 * 1024 * 1024,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_role: 'owner',
            joined_at: new Date().toISOString(),
            ruc: '123456789'
          }
        ])
        setLoading(false)
      }, 1000)
      
    } catch (error) {
      console.error('Failed to load companies:', error)
      setLoading(false)
    }
  }

  const createCompany = async (data: any) => {
    try {
      // TODO: Conectar con el servicio real
      // const response = await api.post('/tenants/companies', data)
      // setCompanies([response.data.data, ...companies])
      
      console.log('Creating company:', data)
      const newCompany: Company = {
        id: Date.now().toString(),
        razon_social: data.razon_social,
        slug: data.razon_social.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        ruc: data.ruc,
        storage_used_bytes: 0,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_role: 'owner',
        joined_at: new Date().toISOString()
      }
      
      setCompanies([newCompany, ...companies])
      setCreateModalOpen(false)
    } catch (error) {
      console.error('Failed to create company:', error)
    }
  }

  const switchCompany = (company: Company) => {
    // TODO: Conectar con el store real
    // setCurrentCompany(company)
    
    console.log('Switching to company:', company)
    window.location.href = '/dashboard'
  }

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return gb < 0.1 ? '< 0.1 GB' : `${gb.toFixed(1)} GB`
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-purple-50 text-purple-700 dark:bg-purple-900/10 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      admin: 'bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      member: 'bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-400 border-green-200 dark:border-green-800',
      viewer: 'bg-gray-50 text-gray-700 dark:bg-gray-900/10 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
    
    const labels = {
      owner: 'Propietario',
      admin: 'Administrador',
      member: 'Miembro',
      viewer: 'Visor'
    }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${styles[role as keyof typeof styles] || styles.member}`}>
        {role === 'owner' && <Crown className="w-3 h-3" />}
        {labels[role as keyof typeof labels] || role}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando empresas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Mis Empresas
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Administra y cambia entre tus empresas
            </p>
          </div>
          
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nueva empresa
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{companies.length}</p>
                <p className="text-sm text-gray-500">Empresas totales</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {companies.filter(c => c.user_role === 'owner').length}
                </p>
                <p className="text-sm text-gray-500">Como propietario</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {companies.filter(c => ['admin', 'member'].includes(c.user_role)).length}
                </p>
                <p className="text-sm text-gray-500">Como miembro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                        {company.razon_social.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {company.razon_social}
                        </h3>
                        <div className="mt-1">
                          {getRoleBadge(company.user_role)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {company.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {company.description}
                    </p>
                  )}
                  
                  <div className="space-y-3 mb-4">
                    {company.ruc && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">RUC</span>
                        <span className="font-medium text-gray-900 dark:text-white">{company.ruc}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Almacenamiento</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatStorage(company.storage_used_bytes)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Estado</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${
                          company.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {company.status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Te uniste</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(company.joined_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => switchCompany(company)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
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
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No tienes empresas
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Crea tu primera empresa para comenzar a usar Forvara
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
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
      </div>
    </div>
  )
}

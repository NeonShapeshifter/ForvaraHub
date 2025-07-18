import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, UserPlus, Mail, Phone, Search, MoreVertical, Shield, Users, User, Eye, ChevronRight, AlertCircle, Building2, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { PageContainer } from '@/components/layout/PageContainer'
import { toast } from '@/hooks/useToast'
import { userService } from '@/services/user.service'

// Componente para el estado individual mode
const IndividualModeState = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Modo Individual
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Estás en modo individual. Para gestionar usuarios del equipo, necesitas crear una empresa.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/settings')}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <Building2 className="w-4 h-4" />
            Crear mi empresa
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente para el estado vacío cuando no hay usuarios
const EmptyUsersState = ({ onInvite, canManage }: { onInvite: () => void, canManage: boolean }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Users className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No hay usuarios en tu equipo
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto text-sm">
        {canManage
          ? 'Invita a miembros de tu equipo para colaborar en Forvara.'
          : 'Aún no hay otros miembros en el equipo.'}
      </p>
      {canManage && (
        <button
          onClick={onInvite}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Invitar usuario
        </button>
      )}
    </div>
  )
}

// Componente para el modal de invitación
const InviteModal = ({ isOpen, onClose, onSubmit }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    role: 'member' as 'admin' | 'member' | 'viewer',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    setLoading(true)
    await onSubmit(formData)
    setLoading(false)
    setFormData({ email: '', phone: '', role: 'member', message: '' })
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invitar nuevo miembro
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
              Email o teléfono
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="correo@ejemplo.com o +507 6000-0000"
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Rol
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              disabled={loading}
            >
              <option value="viewer">Visor - Solo lectura</option>
              <option value="member">Miembro - Acceso estándar</option>
              <option value="admin">Administrador - Gestión completa</option>
            </select>
            <p className="text-xs text-gray-500 mt-1.5">
              {formData.role === 'viewer' && 'Solo puede ver información, sin editar'}
              {formData.role === 'member' && 'Puede usar todas las aplicaciones'}
              {formData.role === 'admin' && 'Puede gestionar usuarios y configuración'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Mensaje (opcional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Añade un mensaje personal..."
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!formData.email && !formData.phone)}
            className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar invitación'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente principal de Usuarios
export default function Users() {
  const navigate = useNavigate()
  const { user, currentCompany, isIndividualMode } = useAuthStore()
  const userRole = user?.role || 'member'

  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const loadingRef = useRef(false)
  const mountedRef = useRef(true)
  const lastLoadedCompanyRef = useRef<string | null>(null)

  // Verificar si el usuario puede gestionar miembros
  const canManageMembers = userRole === 'owner' || userRole === 'admin'

  const loadMembers = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current) {
      console.log('⏳ Users: Already loading, skipping call')
      return
    }

    if (!currentCompany || currentCompany.id === 'no-company') {
      if (mountedRef.current) {
        setLoading(false)
        setMembers([])
      }
      return
    }

    // Prevent repeated calls to the same company within the same session
    if (lastLoadedCompanyRef.current === currentCompany.id) {
      console.log('⏭️ Users: Already loaded for this company, skipping')
      if (mountedRef.current) {
        setLoading(false)
      }
      return
    }

    try {
      console.log('🔄 Users: Loading members for company:', currentCompany.id)
      loadingRef.current = true
      setLoading(true)

      // Connect to real backend service - note: companyId parameter removed since backend uses token context
      const membersList = await userService.getCompanyMembers(currentCompany.id)
      // Ensure membersList is an array
      const safeMembers = Array.isArray(membersList) ? membersList : []
      console.log('✅ Users: Loaded members:', safeMembers.length)

      // Mark this company as loaded (even if empty/error)
      lastLoadedCompanyRef.current = currentCompany.id

      if (mountedRef.current) {
        setMembers(safeMembers)
      }

    } catch (error: any) {
      console.error('❌ Users: Error loading members:', error)
      // Mark this company as loaded even on error to prevent retries
      lastLoadedCompanyRef.current = currentCompany.id
      if (mountedRef.current) {
        setMembers([])
        // Only show toast for non-404 errors to avoid spam
        if (!error.message?.includes('Route not found') && !error.message?.includes('404')) {
          toast({
            type: 'error',
            title: 'Error',
            message: 'No se pudieron cargar los miembros del equipo'
          })
        }
      }
    } finally {
      loadingRef.current = false
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [currentCompany?.id]) // Use only the ID to prevent object reference changes

  useEffect(() => {
    loadMembers()

    // Cleanup function to mark component as unmounted
    return () => {
      mountedRef.current = false
    }
  }, [loadMembers])


  const handleInvite = async (data: any) => {
    try {
      // TODO: Conectar con el servicio real
      // await tenantService.inviteMember(currentCompany!.id, {
      //   email: data.email,
      //   phone: data.phone,
      //   role: data.role,
      //   message: data.message
      // })

      console.log('Invitando usuario:', data)
      setShowInviteModal(false)
      loadMembers()
    } catch (error) {
      console.error('Error inviting member:', error)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      setActionLoading(memberId)

      // TODO: Conectar con el servicio real
      // await tenantService.changeMemberRole(currentCompany!.id, memberId, newRole)

      console.log('Cambiando rol:', memberId, newRole)
      await loadMembers()
    } catch (error) {
      console.error('Error changing role:', error)
    } finally {
      setActionLoading(null)
      setSelectedMember(null)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('¿Estás seguro de eliminar este miembro del equipo?')) return

    try {
      setActionLoading(memberId)

      // TODO: Conectar con el servicio real
      // await tenantService.removeMember(currentCompany!.id, memberId)

      console.log('Eliminando miembro:', memberId)
      await loadMembers()
    } catch (error) {
      console.error('Error removing member:', error)
    } finally {
      setActionLoading(null)
      setSelectedMember(null)
    }
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
      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${styles[role as keyof typeof styles] || styles.member}`}>
        {labels[role as keyof typeof labels] || role}
      </span>
    )
  }

  // Si está en modo individual, mostrar estado individual
  if (isIndividualMode()) {
    return <IndividualModeState />
  }

  // Si está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando miembros...</p>
        </div>
      </div>
    )
  }

  // Filtrar miembros según búsqueda
  const filteredMembers = Array.isArray(members) ? members.filter(member => {
    const searchLower = searchTerm.toLowerCase()
    const user = member.user_data || {}
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower)
    )
  }) : []

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Usuarios
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Administra los miembros de tu equipo y sus permisos
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuarios..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            {canManageMembers && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                Invitar usuario
              </button>
            )}
          </div>
        </div>

        {/* Members List */}
        {filteredMembers.length === 0 ? (
          <EmptyUsersState onInvite={() => setShowInviteModal(true)} canManage={canManageMembers} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Miembro desde
                  </th>
                  {canManageMembers && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.map((member) => {
                  const user = member.user_data || {}
                  const isLoading = actionLoading === member.id

                  return (
                    <tr key={member.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isLoading ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                            ) : (
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {member.user_id?.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm">{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(member.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {member.status === 'active' ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Activo</span>
                            </>
                          ) : member.status === 'pending' ? (
                            <>
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Pendiente</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{member.status}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      {canManageMembers && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {member.role !== 'owner' && (
                            <div className="relative">
                              <button
                                onClick={() => setSelectedMember(
                                  selectedMember === member.id ? null : member.id
                                )}
                                disabled={isLoading}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>

                              {selectedMember === member.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                                  <button
                                    onClick={() => handleRoleChange(member.id, 'admin')}
                                    disabled={member.role === 'admin'}
                                    className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Hacer administrador
                                  </button>
                                  <button
                                    onClick={() => handleRoleChange(member.id, 'member')}
                                    disabled={member.role === 'member'}
                                    className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Hacer miembro
                                  </button>
                                  <button
                                    onClick={() => handleRoleChange(member.id, 'viewer')}
                                    disabled={member.role === 'viewer'}
                                    className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Hacer visor
                                  </button>
                                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                  <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 text-left"
                                  >
                                    Eliminar del equipo
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        {members.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{members.length}</p>
                  <p className="text-sm text-gray-500">Total miembros</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {members.filter(m => m.role === 'admin' || m.role === 'owner').length}
                  </p>
                  <p className="text-sm text-gray-500">Administradores</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                  <Eye className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {members.filter(m => m.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-500">Invitaciones pendientes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInvite}
        />
      </div>
    </PageContainer>
  )
}

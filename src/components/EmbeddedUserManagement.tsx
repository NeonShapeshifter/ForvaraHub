import { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  Eye,
  Edit3,
  X,
  Search,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'

interface EmbeddedUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  avatar_url?: string
  role: string
  permissions: string[]
  access_level: string
  joined_at: string
  app_member_id?: string
}

interface AppPermission {
  id: string
  name: string
  description: string
}

interface EmbeddedUserManagementProps {
  appId: string
  appName: string
  className?: string
}

export function EmbeddedUserManagement({ appId, appName, className = '' }: EmbeddedUserManagementProps) {
  const { isIndividualMode } = useAuthStore()
  const [users, setUsers] = useState<EmbeddedUser[]>([])
  const [availableUsers, setAvailableUsers] = useState<EmbeddedUser[]>([])
  const [permissions, setPermissions] = useState<AppPermission[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<EmbeddedUser | null>(null)
  const [selectedUserMenu, setSelectedUserMenu] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [appId])

  const loadData = async () => {
    try {
      setLoading(true)

      const [usersResponse, availableResponse, permissionsResponse] = await Promise.all([
        api.get(`/embedded-users/${appId}`),
        api.get(`/embedded-users/${appId}/available`),
        api.get(`/embedded-users/${appId}/permissions`)
      ])

      setUsers(usersResponse.data)
      setAvailableUsers(availableResponse.data)
      setPermissions(permissionsResponse.data)
    } catch (error) {
      console.error('Error loading embedded users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInviteUser = async (userData: {
    email: string
    role: string
    permissions: string[]
  }) => {
    try {
      setActionLoading('invite')

      await api.post(`/embedded-users/${appId}/invite`, userData)
      await loadData()
      setShowInviteModal(false)
    } catch (error) {
      console.error('Error inviting user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateUser = async (userId: string, updates: {
    role?: string
    permissions?: string[]
  }) => {
    try {
      setActionLoading(userId)

      await api.patch(`/embedded-users/${appId}/members/${userId}`, updates)
      await loadData()
      setSelectedUserMenu(null)
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRemoveUser = async (userId: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('¿Eliminar acceso de este usuario a la aplicación?')) return

    try {
      setActionLoading(userId)

      await api.delete(`/embedded-users/${appId}/members/${userId}`)
      await loadData()
      setSelectedUserMenu(null)
    } catch (error) {
      console.error('Error removing user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-50 text-red-700 dark:bg-red-900/10 dark:text-red-400 border-red-200 dark:border-red-800',
      member: 'bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      viewer: 'bg-gray-50 text-gray-700 dark:bg-gray-900/10 dark:text-gray-400 border-gray-200 dark:border-gray-800',
      owner: 'bg-purple-50 text-purple-700 dark:bg-purple-900/10 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    }

    return (
      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${styles[role as keyof typeof styles] || styles.member}`}>
        {role}
      </span>
    )
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  })

  // Individual mode - show only current user
  if (isIndividualMode()) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Usuarios de {appName}
          </h3>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Modo Individual - Solo tú tienes acceso a esta aplicación
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
          <span className="ml-2 text-sm text-gray-500">Cargando usuarios...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              Usuarios de {appName}
            </h3>
            <span className="text-sm text-gray-500">({users.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPermissionsModal(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Ver permisos disponibles"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>

            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Invitar
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="p-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay usuarios
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {searchTerm ? 'No se encontraron usuarios con ese término' : 'Aún no hay usuarios con acceso a esta aplicación'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Invitar primer usuario
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  actionLoading === user.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                    ) : (
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {user.first_name[0]}{user.last_name[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.first_name} {user.last_name}
                      </span>
                      {getRoleBadge(user.role)}
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>

                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">
                    {user.permissions.length} permisos
                  </div>

                  {user.role !== 'owner' && (
                    <div className="relative">
                      <button
                        onClick={() => setSelectedUserMenu(
                          selectedUserMenu === user.id ? null : user.id
                        )}
                        disabled={actionLoading === user.id}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>

                      {selectedUserMenu === user.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowPermissionsModal(true)
                              setSelectedUserMenu(null)
                            }}
                            className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                          >
                            <Edit3 className="w-4 h-4 inline mr-2" />
                            Editar permisos
                          </button>

                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                          <button
                            onClick={() => handleRemoveUser(user.id)}
                            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 text-left"
                          >
                            <X className="w-4 h-4 inline mr-2" />
                            Quitar acceso
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteUserModal
          appName={appName}
          availableUsers={availableUsers}
          permissions={permissions}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteUser}
          loading={actionLoading === 'invite'}
        />
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <PermissionsModal
          appName={appName}
          permissions={permissions}
          user={selectedUser}
          onClose={() => {
            setShowPermissionsModal(false)
            setSelectedUser(null)
          }}
          onSubmit={selectedUser ?
            (updates) => handleUpdateUser(selectedUser.id, updates) :
            undefined
          }
          loading={selectedUser ? actionLoading === selectedUser.id : false}
        />
      )}
    </div>
  )
}

// Invite User Modal Component
const InviteUserModal = ({
  appName,
  availableUsers,
  permissions,
  onClose,
  onSubmit,
  loading
}: {
  appName: string
  availableUsers: EmbeddedUser[]
  permissions: AppPermission[]
  onClose: () => void
  onSubmit: (data: { email: string; role: string; permissions: string[] }) => void
  loading: boolean
}) => {
  const [selectedUser, setSelectedUser] = useState('')
  const [role, setRole] = useState('member')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['read'])

  const handleSubmit = () => {
    if (!selectedUser) return

    const user = availableUsers.find(u => u.id === selectedUser)
    if (!user) return

    onSubmit({
      email: user.email,
      role,
      permissions: selectedPermissions
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invitar a {appName}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usuario
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
              disabled={loading}
            >
              <option value="">Seleccionar usuario...</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
              disabled={loading}
            >
              <option value="viewer">Visor</option>
              <option value="member">Miembro</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permisos
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {permissions.map(permission => (
                <label key={permission.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, permission.id])
                      } else {
                        setSelectedPermissions(selectedPermissions.filter(p => p !== permission.id))
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white">{permission.name}</span>
                    <p className="text-xs text-gray-500">{permission.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedUser || selectedPermissions.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Invitando...' : 'Invitar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Permissions Modal Component
const PermissionsModal = ({
  appName,
  permissions,
  user,
  onClose,
  onSubmit,
  loading
}: {
  appName: string
  permissions: AppPermission[]
  user: EmbeddedUser | null
  onClose: () => void
  onSubmit?: (updates: { role: string; permissions: string[] }) => void
  loading: boolean
}) => {
  const [role, setRole] = useState(user?.role || 'member')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user?.permissions || [])

  const handleSubmit = () => {
    if (!onSubmit) return

    onSubmit({
      role,
      permissions: selectedPermissions
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user ? `Permisos de ${user.first_name}` : `Permisos de ${appName}`}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                disabled={loading}
              >
                <option value="viewer">Visor</option>
                <option value="member">Miembro</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permisos disponibles
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-start gap-2 p-2 rounded border border-gray-200 dark:border-gray-700">
                  {user && (
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, permission.id])
                        } else {
                          setSelectedPermissions(selectedPermissions.filter(p => p !== permission.id))
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 mt-0.5"
                      disabled={loading}
                    />
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{permission.name}</span>
                    <p className="text-xs text-gray-500">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {user ? 'Cancelar' : 'Cerrar'}
          </button>
          {user && onSubmit && (
            <button
              onClick={handleSubmit}
              disabled={loading || selectedPermissions.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Search, MoreVertical, UserPlus, Shield, Ban, CheckCircle, X, Mail, Phone, Building2, Calendar, Filter } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useNotifications } from '@/components/ui/notifications'
import { api } from '@/services/api'

interface AdminUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  status: 'active' | 'suspended' | 'pending'
  created_at: string
  last_login_at?: string
  companies_count: number
  auth_method: 'email' | 'phone'
  cedula_panama?: string
  preferred_language: string
  country_code: string
}

export default function AdminUsers() {
  const { addNotification } = useNotifications()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)

      // In production this would call /admin/users
      // For now showing demo data
      const demoUsers: AdminUser[] = [
        {
          id: '1',
          first_name: 'Alejandro',
          last_name: 'Forvara',
          email: 'ale@forvara.com',
          phone: '+507 6000-0000',
          status: 'active',
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
          companies_count: 2,
          auth_method: 'email',
          cedula_panama: '8-123-456',
          preferred_language: 'es',
          country_code: 'PA'
        },
        {
          id: '2',
          first_name: 'María',
          last_name: 'González',
          email: 'maria@empresa.com',
          status: 'active',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          last_login_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          companies_count: 1,
          auth_method: 'email',
          preferred_language: 'es',
          country_code: 'PA'
        },
        {
          id: '3',
          first_name: 'Carlos',
          last_name: 'Mendoza',
          email: 'carlos@tech.com',
          phone: '+507 6111-2222',
          status: 'pending',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          companies_count: 0,
          auth_method: 'phone',
          preferred_language: 'es',
          country_code: 'CR'
        }
      ]

      setUsers(demoUsers)

    } catch (error) {
      console.error('Error loading users:', error)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los usuarios'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    const confirmMessages = {
      suspend: `¿Suspender a ${user.first_name} ${user.last_name}?`,
      activate: `¿Activar a ${user.first_name} ${user.last_name}?`,
      delete: `¿Eliminar permanentemente a ${user.first_name} ${user.last_name}? Esta acción no se puede deshacer.`
    }

    // eslint-disable-next-line no-alert
    if (!window.confirm(confirmMessages[action])) return

    try {
      setActionLoading(userId)

      // In production would call API
      if (action === 'delete') {
        setUsers(prev => prev.filter(u => u.id !== userId))
        addNotification({
          type: 'success',
          title: 'Usuario eliminado',
          message: `${user.first_name} ${user.last_name} ha sido eliminado`
        })
      } else {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, status: action === 'suspend' ? 'suspended' : 'active' } : u
        ))
        addNotification({
          type: 'success',
          title: action === 'suspend' ? 'Usuario suspendido' : 'Usuario activado',
          message: `${user.first_name} ${user.last_name} ha sido ${action === 'suspend' ? 'suspendido' : 'activado'}`
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
      setSelectedUser(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      suspended: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }

    const labels = {
      active: 'Activo',
      suspended: 'Suspendido',
      pending: 'Pendiente'
    }

    return (
      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles] || styles.active}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Gestión de Usuarios"
          description="Administra todos los usuarios de la plataforma"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Cargando usuarios...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra todos los usuarios de la plataforma"
        actions={
          <button
            onClick={() => addNotification({ type: 'info', title: 'Función en desarrollo', message: 'La creación manual de usuarios estará disponible pronto' })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Crear usuario
          </button>
        }
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
              placeholder="Buscar usuarios por nombre, email o teléfono..."
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
              <option value="active">Activos</option>
              <option value="suspended">Suspendidos</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-500">Total usuarios</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-sm text-gray-500">Activos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{users.filter(u => u.status === 'pending').length}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{users.filter(u => u.status === 'suspended').length}</p>
              <p className="text-sm text-gray-500">Suspendidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-900">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{user.companies_count}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="relative">
                    <button
                      onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      disabled={actionLoading === user.id}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {selectedUser === user.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            Suspender usuario
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            Activar usuario
                          </button>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
                          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          Eliminar usuario
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

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron usuarios
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </PageContainer>
  )
}

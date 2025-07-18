import React, { useState, useEffect } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldX,
  User,
  AlertTriangle,
  X,
  Plus,
  Trash2,
  UserCheck
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'

interface SimpleDelegate {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  granted_by: {
    name: string
    email: string
  }
  status: 'active' | 'revoked'
  created_at: string
}

interface AppDelegationManagementProps {
  appId: string
  appName: string
  className?: string
}

export function AppDelegationManagement({ appId, appName, className = '' }: AppDelegationManagementProps) {
  const { isIndividualMode } = useAuthStore()
  const [delegates, setDelegates] = useState<SimpleDelegate[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<any[]>([])

  useEffect(() => {
    if (!isIndividualMode()) {
      loadDelegates()
      loadAvailableUsers()
    }
  }, [appId, isIndividualMode])

  const loadDelegates = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/app-delegates/${appId}/list`)
      setDelegates(response.data)
    } catch (error) {
      console.error('Error loading delegates:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableUsers = async () => {
    try {
      // Load company members who could be delegates
      const response = await api.get('/users/company-members')
      setAvailableUsers(response.data)
    } catch (error) {
      console.error('Error loading available users:', error)
    }
  }

  const handleGrantDelegate = async (userId: string) => {
    try {
      setActionLoading('grant')
      await api.post(`/app-delegates/${appId}/grant`, { userId })
      await loadDelegates()
      setShowGrantModal(false)
    } catch (error) {
      console.error('Error granting delegate:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRevokeDelegate = async (userId: string) => {
    if (!confirm('¿Revocar acceso de delegado? El usuario ya no tendrá permisos de administrador en esta app.')) {
      return
    }

    try {
      setActionLoading(userId)
      await api.post(`/app-delegates/${appId}/revoke`, { userId })
      await loadDelegates()
    } catch (error) {
      console.error('Error revoking delegate:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'revoked') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/10 dark:text-red-400 border border-red-200 dark:border-red-800">
          <ShieldX className="w-3 h-3" />
          Revocado
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-400 border border-green-200 dark:border-green-800">
        <ShieldCheck className="w-3 h-3" />
        Delegado Activo
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Individual mode - show explanation
  if (isIndividualMode()) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Delegación de {appName}
          </h3>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Modo Individual - Solo tienes acceso como propietario de la app
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
          <span className="ml-2 text-sm text-gray-500">Cargando delegaciones...</span>
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
            <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              Delegados de {appName}
            </h3>
            <span className="text-sm text-gray-500">({delegates.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrantModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Asignar delegado
            </button>
          </div>
        </div>
      </div>

      {/* Delegates List */}
      <div className="p-4">
        {delegates.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay delegados
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Aún no has asignado delegados que puedan administrar {appName}
            </p>
            <button
              onClick={() => setShowGrantModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <UserCheck className="w-4 h-4" />
              Asignar primer delegado
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {delegates.map((delegate) => (
              <div
                key={delegate.id}
                className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  actionLoading === delegate.user.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {delegate.user.name}
                        </span>
                        {getStatusBadge(delegate.status)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {delegate.user.email}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Asignado el {formatDate(delegate.created_at)} por {delegate.granted_by.name}
                      </div>
                    </div>
                  </div>

                  {delegate.status === 'active' && (
                    <button
                      onClick={() => handleRevokeDelegate(delegate.user.id)}
                      disabled={actionLoading === delegate.user.id}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                      title="Revocar delegado"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warning Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              Sobre los delegados
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 mt-1">
              Los delegados actúan como administradores de {appName} con acceso completo.
              Solo asigna delegados de confianza.
            </p>
          </div>
        </div>
      </div>

      {/* Grant Delegate Modal */}
      {showGrantModal && (
        <GrantDelegateModal
          appName={appName}
          availableUsers={availableUsers}
          onClose={() => setShowGrantModal(false)}
          onSubmit={handleGrantDelegate}
          loading={actionLoading === 'grant'}
        />
      )}
    </div>
  )
}

// Grant Delegate Modal Component
const GrantDelegateModal = ({
  appName,
  availableUsers,
  onClose,
  onSubmit,
  loading
}: {
  appName: string
  availableUsers: any[]
  onClose: () => void
  onSubmit: (userId: string) => void
  loading: boolean
}) => {
  const [selectedUserId, setSelectedUserId] = useState('')

  const handleSubmit = () => {
    if (!selectedUserId) return
    onSubmit(selectedUserId)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Asignar delegado para {appName}
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
              Seleccionar usuario
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
              disabled={loading}
            >
              <option value="">Seleccionar miembro de la empresa...</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Permisos del delegado:</strong> Acceso completo de administrador dentro de {appName}.
              Podrán realizar todas las acciones como si fueran el propietario.
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
            disabled={loading || !selectedUserId}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Asignando...' : 'Asignar delegado'}
          </button>
        </div>
      </div>
    </div>
  )
}

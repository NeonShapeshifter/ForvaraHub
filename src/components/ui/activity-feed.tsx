// ForvaraHub/src/components/ui/activity-feed.tsx

import React, { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  User,
  Package,
  Building,
  CreditCard,
  Settings,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Clock,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import { Button } from './button'
import { Badge } from './badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { cn } from '@/lib/utils'

// Tipos de actividad
export type ActivityType = 
  | 'user_created' | 'user_updated' | 'user_deleted' | 'user_invited'
  | 'company_created' | 'company_updated' | 'company_deleted'
  | 'app_installed' | 'app_uninstalled' | 'app_updated' | 'app_configured'
  | 'payment_succeeded' | 'payment_failed' | 'subscription_created' | 'subscription_cancelled'
  | 'security_login' | 'security_failed_login' | 'security_password_changed'
  | 'system_backup' | 'system_maintenance' | 'system_error'
  | 'file_uploaded' | 'file_downloaded' | 'file_deleted'
  | 'settings_changed' | 'integration_connected' | 'integration_disconnected'

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description?: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  timestamp: string
  metadata?: Record<string, any>
  severity?: 'low' | 'medium' | 'high' | 'critical'
  category?: 'user' | 'company' | 'app' | 'payment' | 'security' | 'system'
}

interface ActivityFeedProps {
  activities?: ActivityItem[]
  loading?: boolean
  showFilters?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  onActivityClick?: (activity: ActivityItem) => void
  className?: string
}

// Configuración de iconos y colores por tipo de actividad
const activityConfig: Record<ActivityType, {
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  category: string
}> = {
  // Usuario
  user_created: { icon: User, color: 'text-green-600', bgColor: 'bg-green-100', category: 'user' },
  user_updated: { icon: Edit, color: 'text-blue-600', bgColor: 'bg-blue-100', category: 'user' },
  user_deleted: { icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-100', category: 'user' },
  user_invited: { icon: Plus, color: 'text-purple-600', bgColor: 'bg-purple-100', category: 'user' },
  
  // Empresa
  company_created: { icon: Building, color: 'text-green-600', bgColor: 'bg-green-100', category: 'company' },
  company_updated: { icon: Edit, color: 'text-blue-600', bgColor: 'bg-blue-100', category: 'company' },
  company_deleted: { icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-100', category: 'company' },
  
  // Apps
  app_installed: { icon: Package, color: 'text-green-600', bgColor: 'bg-green-100', category: 'app' },
  app_uninstalled: { icon: Minus, color: 'text-red-600', bgColor: 'bg-red-100', category: 'app' },
  app_updated: { icon: RefreshCw, color: 'text-blue-600', bgColor: 'bg-blue-100', category: 'app' },
  app_configured: { icon: Settings, color: 'text-purple-600', bgColor: 'bg-purple-100', category: 'app' },
  
  // Pagos
  payment_succeeded: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', category: 'payment' },
  payment_failed: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', category: 'payment' },
  subscription_created: { icon: CreditCard, color: 'text-green-600', bgColor: 'bg-green-100', category: 'payment' },
  subscription_cancelled: { icon: CreditCard, color: 'text-red-600', bgColor: 'bg-red-100', category: 'payment' },
  
  // Seguridad
  security_login: { icon: Shield, color: 'text-green-600', bgColor: 'bg-green-100', category: 'security' },
  security_failed_login: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', category: 'security' },
  security_password_changed: { icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-100', category: 'security' },
  
  // Sistema
  system_backup: { icon: Download, color: 'text-blue-600', bgColor: 'bg-blue-100', category: 'system' },
  system_maintenance: { icon: Settings, color: 'text-yellow-600', bgColor: 'bg-yellow-100', category: 'system' },
  system_error: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', category: 'system' },
  
  // Archivos
  file_uploaded: { icon: Upload, color: 'text-green-600', bgColor: 'bg-green-100', category: 'system' },
  file_downloaded: { icon: Download, color: 'text-blue-600', bgColor: 'bg-blue-100', category: 'system' },
  file_deleted: { icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-100', category: 'system' },
  
  // Configuración
  settings_changed: { icon: Settings, color: 'text-blue-600', bgColor: 'bg-blue-100', category: 'system' },
  integration_connected: { icon: Plus, color: 'text-green-600', bgColor: 'bg-green-100', category: 'system' },
  integration_disconnected: { icon: Minus, color: 'text-red-600', bgColor: 'bg-red-100', category: 'system' },
}

// Datos de ejemplo para simular actividad en tiempo real
const generateMockActivity = (): ActivityItem => {
  const activities: Partial<ActivityItem>[] = [
    {
      type: 'user_created',
      title: 'Nuevo usuario registrado',
      description: 'María García se registró en la plataforma',
      user: { name: 'Sistema', email: 'system@forvara.com' },
      severity: 'low'
    },
    {
      type: 'app_installed',
      title: 'App instalada',
      description: 'Se instaló Elaris ERP en la empresa',
      user: { name: 'Carlos Ruiz', email: 'carlos@empresa.com' },
      severity: 'low'
    },
    {
      type: 'payment_succeeded',
      title: 'Pago procesado',
      description: 'Suscripción mensual renovada exitosamente',
      user: { name: 'Sistema de Pagos', email: 'billing@forvara.com' },
      severity: 'medium'
    },
    {
      type: 'security_login',
      title: 'Inicio de sesión',
      description: 'Usuario autenticado desde IP: 192.168.1.100',
      user: { name: 'Ana López', email: 'ana@empresa.com' },
      severity: 'low'
    },
    {
      type: 'company_updated',
      title: 'Empresa actualizada',
      description: 'Se actualizó la información de la empresa',
      user: { name: 'Luis Mendoza', email: 'luis@empresa.com' },
      severity: 'low'
    },
    {
      type: 'app_configured',
      title: 'App configurada',
      description: 'Se configuraron las integraciones de ForvaraMail',
      user: { name: 'Admin', email: 'admin@empresa.com' },
      severity: 'low'
    },
    {
      type: 'security_failed_login',
      title: 'Intento de login fallido',
      description: 'Múltiples intentos fallidos desde IP: 203.0.113.45',
      user: { name: 'Sistema de Seguridad', email: 'security@forvara.com' },
      severity: 'high'
    },
    {
      type: 'system_backup',
      title: 'Backup completado',
      description: 'Backup automático de datos completado exitosamente',
      user: { name: 'Sistema', email: 'system@forvara.com' },
      severity: 'low'
    }
  ]

  const baseActivity = activities[Math.floor(Math.random() * activities.length)]
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    category: activityConfig[baseActivity.type!].category as any,
    ...baseActivity
  } as ActivityItem
}

export function ActivityFeed({
  activities = [],
  loading = false,
  showFilters = true,
  autoRefresh = false,
  refreshInterval = 30000,
  onActivityClick,
  className
}: ActivityFeedProps) {
  const [feedItems, setFeedItems] = useState<ActivityItem[]>(activities)
  const [filteredItems, setFilteredItems] = useState<ActivityItem[]>(activities)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [isLive, setIsLive] = useState(autoRefresh)
  const [newItemsCount, setNewItemsCount] = useState(0)

  // Simular actividad en tiempo real
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const newActivity = generateMockActivity()
        setFeedItems(prev => [newActivity, ...prev.slice(0, 49)]) // Mantener máximo 50 items
        setNewItemsCount(prev => prev + 1)
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [isLive, refreshInterval])

  // Filtrar actividades
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredItems(feedItems)
    } else {
      setFilteredItems(feedItems.filter(item => 
        activityConfig[item.type].category === activeFilter
      ))
    }
  }, [feedItems, activeFilter])

  // Actualizar cuando cambian las actividades prop
  useEffect(() => {
    setFeedItems(activities)
  }, [activities])

  const handleShowNewItems = () => {
    setNewItemsCount(0)
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const filterOptions = [
    { value: 'all', label: 'Todas', count: feedItems.length },
    { value: 'user', label: 'Usuarios', count: feedItems.filter(i => activityConfig[i.type].category === 'user').length },
    { value: 'company', label: 'Empresas', count: feedItems.filter(i => activityConfig[i.type].category === 'company').length },
    { value: 'app', label: 'Apps', count: feedItems.filter(i => activityConfig[i.type].category === 'app').length },
    { value: 'payment', label: 'Pagos', count: feedItems.filter(i => activityConfig[i.type].category === 'payment').length },
    { value: 'security', label: 'Seguridad', count: feedItems.filter(i => activityConfig[i.type].category === 'security').length },
    { value: 'system', label: 'Sistema', count: feedItems.filter(i => activityConfig[i.type].category === 'system').length },
  ]

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-32 rounded"></div>
          <div className="flex gap-2">
            <div className="skeleton h-8 w-20 rounded"></div>
            <div className="skeleton h-8 w-20 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="skeleton w-10 h-10 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded"></div>
                <div className="skeleton h-3 w-1/2 rounded"></div>
              </div>
              <div className="skeleton h-3 w-16 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">En vivo</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={isLive ? 'bg-green-50 border-green-200' : ''}
          >
            {isLive ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                En vivo
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Manual
              </>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFeedItems([])}>
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar historial
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsLive(!isLive)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {isLive ? 'Pausar' : 'Activar'} tiempo real
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* New items notification */}
      {newItemsCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700">
              {newItemsCount} nueva{newItemsCount > 1 ? 's' : ''} actividad{newItemsCount > 1 ? 'es' : ''}
            </span>
          </div>
          <Button
            onClick={handleShowNewItems}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver
          </Button>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg overflow-x-auto">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-fast whitespace-nowrap',
                activeFilter === option.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {option.label}
              <Badge variant="secondary" className="text-xs">
                {option.count}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No hay actividad reciente</p>
            <p className="text-sm text-gray-400">
              {activeFilter === 'all' 
                ? 'Cuando ocurran eventos, aparecerán aquí'
                : `No hay actividad en la categoría "${filterOptions.find(f => f.value === activeFilter)?.label}"`
              }
            </p>
          </div>
        ) : (
          filteredItems.map((activity, index) => {
            const config = activityConfig[activity.type]
            const Icon = config.icon
            const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: es })
            
            return (
              <div
                key={activity.id}
                onClick={() => onActivityClick?.(activity)}
                className={cn(
                  'group flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all duration-200',
                  onActivityClick && 'cursor-pointer',
                  index < newItemsCount && 'ring-2 ring-blue-200 bg-blue-50'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                  config.bgColor
                )}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {activity.user.name}
                        </span>
                        <span className="text-xs text-gray-400">"</span>
                        <span className="text-xs text-gray-500">
                          {timeAgo}
                        </span>
                        {activity.severity && (
                          <>
                            <span className="text-xs text-gray-400">"</span>
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              getSeverityColor(activity.severity)
                            )}></div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(activity.timestamp).toLocaleTimeString('es', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Load more button */}
      {filteredItems.length >= 50 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => {/* Load more logic */}}>
            Cargar más actividades
          </Button>
        </div>
      )}
    </div>
  )
}

// Hook para gestionar actividades
export function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    setActivities(prev => [newActivity, ...prev])
  }

  const clearActivities = () => {
    setActivities([])
  }

  const fetchActivities = async () => {
    setLoading(true)
    try {
      // Aquí conectarías con tu API
      // const response = await api.get('/activities')
      // setActivities(response.data)
      
      // Por ahora, simulamos con datos mock
      const mockActivities = Array.from({ length: 10 }, () => generateMockActivity())
      setActivities(mockActivities)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    activities,
    loading,
    addActivity,
    clearActivities,
    fetchActivities
  }
}
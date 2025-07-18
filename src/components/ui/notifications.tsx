// ForvaraHub/src/components/ui/notifications.tsx

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

// Tipos de notificaciones
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Context
interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Provider
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

// Hook
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    // Fallback gracioso para producción - no crashear
    console.warn('useNotifications used outside NotificationProvider - using fallback')
    return {
      notifications: [],
      addNotification: (notification: Omit<Notification, 'id'>) => {
        console.log('Fallback notification:', notification)
      },
      removeNotification: (id: string) => {
        console.log('Fallback remove notification:', id)
      }
    }
  }
  return context
}

// Notification Toast Component
function NotificationToast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }

  const colors = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    warning: 'border-orange-200 bg-orange-50',
    info: 'border-blue-200 bg-blue-50'
  }

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-blue-600'
  }

  const Icon = icons[notification.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border ${colors[notification.type]} shadow-lg`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColors[notification.type]}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${iconColors[notification.type]}`}>
              {notification.title}
            </p>
            {notification.message && (
              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>
            )}
            {notification.action && (
              <div className="mt-3">
                <button
                  onClick={notification.action.onClick}
                  className={`text-sm font-medium ${iconColors[notification.type]} hover:underline`}
                >
                  {notification.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Container for notifications
function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {notifications.map(notification => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Utility functions for easy use
export const notify = {
  success: (title: string, options?: Partial<Notification>) => {
    const { addNotification } = useNotifications()
    addNotification({ type: 'success', title, ...options })
  },
  error: (title: string, options?: Partial<Notification>) => {
    const { addNotification } = useNotifications()
    addNotification({ type: 'error', title, ...options })
  },
  warning: (title: string, options?: Partial<Notification>) => {
    const { addNotification } = useNotifications()
    addNotification({ type: 'warning', title, ...options })
  },
  info: (title: string, options?: Partial<Notification>) => {
    const { addNotification } = useNotifications()
    addNotification({ type: 'info', title, ...options })
  }
}

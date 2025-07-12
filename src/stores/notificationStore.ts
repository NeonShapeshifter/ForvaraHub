import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '@/services/api'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'system' | 'billing' | 'team' | 'app' | 'security'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionText?: string
  priority?: 'low' | 'medium' | 'high'
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  
  // Actions
  loadNotifications: () => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  
  // Getters
  getUnreadNotifications: () => Notification[]
  getNotificationsByCategory: (category: string) => Notification[]
  getRecentNotifications: (limit?: number) => Notification[]
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    category: 'billing',
    title: 'Trial Ending Soon',
    message: 'Your Smart Invoicing trial expires in 3 days. Upgrade now to continue using premium features.',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    actionUrl: '/billing',
    actionText: 'Upgrade Plan',
    priority: 'high'
  },
  {
    id: '2',
    type: 'success',
    category: 'team',
    title: 'New Team Member',
    message: 'María García has joined your team and been assigned to the Sales department.',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    actionUrl: '/team',
    actionText: 'View Team',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'info',
    category: 'app',
    title: 'App Update Available',
    message: 'Elaris ERP v2.1.0 is now available with new inventory features and bug fixes.',
    timestamp: '2024-01-15T08:45:00Z',
    read: false,
    actionUrl: '/apps',
    actionText: 'Update App',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'error',
    category: 'security',
    title: 'Failed Login Attempt',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100. Account temporarily locked.',
    timestamp: '2024-01-14T16:20:00Z',
    read: true,
    actionUrl: '/settings',
    actionText: 'Security Settings',
    priority: 'high'
  },
  {
    id: '5',
    type: 'success',
    category: 'billing',
    title: 'Payment Successful',
    message: 'Your payment of $74.00 for January 2024 has been processed successfully.',
    timestamp: '2024-01-14T14:10:00Z',
    read: true,
    actionUrl: '/billing',
    actionText: 'View Invoice',
    priority: 'low'
  },
  {
    id: '6',
    type: 'info',
    category: 'system',
    title: 'Maintenance Scheduled',
    message: 'System maintenance is scheduled for tonight from 2:00 AM to 4:00 AM UTC. Some features may be temporarily unavailable.',
    timestamp: '2024-01-14T12:00:00Z',
    read: true,
    actionUrl: '/status',
    actionText: 'System Status',
    priority: 'medium'
  },
  {
    id: '7',
    type: 'success',
    category: 'app',
    title: 'ForvaraMail Connected',
    message: 'ForvaraMail has been successfully installed and configured for your team.',
    timestamp: '2024-01-14T10:30:00Z',
    read: true,
    actionUrl: '/apps',
    actionText: 'Launch App',
    priority: 'low'
  }
]

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,

      loadNotifications: async () => {
        try {
          set({ isLoading: true })
          
          const response = await apiClient.getNotifications()
          
          if (response.data) {
            set({ 
              notifications: response.data,
              unreadCount: response.data.filter((n: Notification) => !n.read).length,
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Load notifications error:', error)
          set({ isLoading: false })
        }
      },

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        }
        
        const { notifications } = get()
        const updatedNotifications = [newNotification, ...notifications]
        
        set({ 
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.read).length
        })
      },

      markAsRead: async (notificationId) => {
        try {
          await apiClient.markNotificationAsRead(notificationId)
          
          const { notifications } = get()
          const updatedNotifications = notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
          
          set({ 
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter(n => !n.read).length
          })
        } catch (error) {
          console.error('Mark notification as read error:', error)
        }
      },

      markAllAsRead: async () => {
        try {
          await apiClient.markAllNotificationsAsRead()
          
          const { notifications } = get()
          const updatedNotifications = notifications.map(notification => ({
            ...notification,
            read: true
          }))
          
          set({ 
            notifications: updatedNotifications,
            unreadCount: 0
          })
        } catch (error) {
          console.error('Mark all notifications as read error:', error)
        }
      },

      deleteNotification: (notificationId) => {
        const { notifications } = get()
        const updatedNotifications = notifications.filter(n => n.id !== notificationId)
        
        set({ 
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.read).length
        })
      },

      clearAllNotifications: () => {
        set({ 
          notifications: [],
          unreadCount: 0
        })
      },

      // Getters
      getUnreadNotifications: () => {
        return get().notifications.filter(n => !n.read)
      },

      getNotificationsByCategory: (category) => {
        return get().notifications.filter(n => n.category === category)
      },

      getRecentNotifications: (limit = 10) => {
        return get().notifications
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit)
      }
    }),
    {
      name: 'forvara-notifications',
      partialize: (state) => ({
        notifications: state.notifications.filter(n => !n.read), // Only persist unread notifications
      })
    }
  )
)

// Utility functions for creating notifications
export const createNotification = {
  success: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    type: 'success' as const,
    category: 'system' as const,
    title,
    message,
    actionUrl,
    actionText,
    priority: 'medium' as const
  }),

  error: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    type: 'error' as const,
    category: 'system' as const,
    title,
    message,
    actionUrl,
    actionText,
    priority: 'high' as const
  }),

  warning: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    type: 'warning' as const,
    category: 'system' as const,
    title,
    message,
    actionUrl,
    actionText,
    priority: 'high' as const
  }),

  info: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    type: 'info' as const,
    category: 'system' as const,
    title,
    message,
    actionUrl,
    actionText,
    priority: 'low' as const
  }),

  billing: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    type: 'info' as const,
    category: 'billing' as const,
    title,
    message,
    actionUrl,
    actionText,
    priority: 'medium' as const
  }),

  team: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    type: 'info' as const,
    category: 'team' as const,
    title,
    message,
    actionUrl,
    actionText,
    priority: 'medium' as const
  }),

  app: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    type: 'info' as const,
    category: 'app' as const,
    title,
    message,
    actionUrl,
    actionText,
    priority: 'medium' as const
  }),

  security: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    type: 'error' as const,
    category: 'security' as const,
    title,
    message,
    actionUrl,
    actionText,
    priority: 'high' as const
  })
}
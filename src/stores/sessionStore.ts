import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '@/services/api'

export interface Session {
  id: string
  device_name: string
  device_type: 'desktop' | 'mobile' | 'tablet'
  browser: string
  operating_system: string
  ip_address: string
  location: {
    city: string
    country: string
    region: string
  }
  is_current: boolean
  created_at: string
  last_activity: string
  user_agent: string
}

interface SessionState {
  sessions: Session[]
  currentSession: Session | null
  isLoading: boolean
  
  // Actions
  loadSessions: () => Promise<void>
  revokeSession: (sessionId: string) => Promise<void>
  revokeAllOtherSessions: () => Promise<void>
  getCurrentSessionInfo: () => Session
  
  // Getters
  getActiveSessions: () => Session[]
  getSessionsByDevice: (deviceType: string) => Session[]
}

// Mock data for sessions
const mockSessions: Session[] = [
  {
    id: 'current-session',
    device_name: 'Alex\'s MacBook Pro',
    device_type: 'desktop',
    browser: 'Chrome 120.0.6099.199',
    operating_system: 'macOS 14.2.1',
    ip_address: '192.168.1.105',
    location: {
      city: 'San Francisco',
      country: 'United States',
      region: 'California'
    },
    is_current: true,
    created_at: '2024-01-15T08:30:00Z',
    last_activity: '2024-01-15T14:25:00Z',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  {
    id: 'session-mobile',
    device_name: 'Alex\'s iPhone 15 Pro',
    device_type: 'mobile',
    browser: 'Safari Mobile',
    operating_system: 'iOS 17.2',
    ip_address: '172.20.10.3',
    location: {
      city: 'San Francisco',
      country: 'United States',
      region: 'California'
    },
    is_current: false,
    created_at: '2024-01-15T07:45:00Z',
    last_activity: '2024-01-15T12:15:00Z',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'session-office',
    device_name: 'Office Desktop - Windows',
    device_type: 'desktop',
    browser: 'Microsoft Edge 120.0.2210.91',
    operating_system: 'Windows 11',
    ip_address: '10.0.0.45',
    location: {
      city: 'San Francisco',
      country: 'United States',
      region: 'California'
    },
    is_current: false,
    created_at: '2024-01-14T09:00:00Z',
    last_activity: '2024-01-14T18:30:00Z',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91'
  },
  {
    id: 'session-tablet',
    device_name: 'Alex\'s iPad Air',
    device_type: 'tablet',
    browser: 'Safari Mobile',
    operating_system: 'iPadOS 17.2',
    ip_address: '192.168.1.108',
    location: {
      city: 'San Francisco',
      country: 'United States',
      region: 'California'
    },
    is_current: false,
    created_at: '2024-01-13T19:20:00Z',
    last_activity: '2024-01-13T22:45:00Z',
    user_agent: 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'session-old',
    device_name: 'Unknown Chrome Browser',
    device_type: 'desktop',
    browser: 'Chrome 119.0.6045.199',
    operating_system: 'Linux',
    ip_address: '203.0.113.42',
    location: {
      city: 'New York',
      country: 'United States',
      region: 'New York'
    },
    is_current: false,
    created_at: '2024-01-10T14:30:00Z',
    last_activity: '2024-01-11T09:15:00Z',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  }
]

// Helper function to detect current session info from browser
const getCurrentSessionFromBrowser = (): Session => {
  const userAgent = navigator.userAgent
  const platform = navigator.platform
  
  // Simple device detection
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent)
  const isTablet = /iPad|Tablet/i.test(userAgent)
  const deviceType: 'desktop' | 'mobile' | 'tablet' = 
    isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'
  
  // Simple browser detection
  let browser = 'Unknown'
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome'
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari'
  } else if (userAgent.includes('Edg')) {
    browser = 'Microsoft Edge'
  }
  
  // Simple OS detection
  let os = 'Unknown'
  if (userAgent.includes('Windows')) {
    os = 'Windows'
  } else if (userAgent.includes('Mac OS X')) {
    os = 'macOS'
  } else if (userAgent.includes('Linux')) {
    os = 'Linux'
  } else if (userAgent.includes('iPhone OS')) {
    os = 'iOS'
  } else if (userAgent.includes('Android')) {
    os = 'Android'
  }
  
  return {
    id: 'current-browser',
    device_name: `Current ${deviceType}`,
    device_type: deviceType,
    browser: browser,
    operating_system: os,
    ip_address: 'Detecting...', // Would come from API
    location: {
      city: 'Detecting...',
      country: 'Detecting...',
      region: 'Detecting...'
    },
    is_current: true,
    created_at: new Date().toISOString(),
    last_activity: new Date().toISOString(),
    user_agent: userAgent
  }
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      isLoading: false,

      loadSessions: async () => {
        try {
          set({ isLoading: true })
          
          // Load sessions from API - need to add this endpoint to apiClient
          const response = await fetch('/api/users/sessions', {
            headers: {
              'Authorization': `Bearer ${apiClient.getStoredAuth().token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            set({ 
              sessions: data.data || [],
              currentSession: data.data?.find((s: Session) => s.is_current) || null,
              isLoading: false 
            })
          } else {
            throw new Error('Failed to load sessions')
          }
        } catch (error) {
          console.error('Load sessions error:', error)
          set({ isLoading: false })
        }
      },

      revokeSession: async (sessionId: string) => {
        try {
          set({ isLoading: true })
          
          // Revoke session via API
          const response = await fetch(`/api/users/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${apiClient.getStoredAuth().token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            // Reload sessions to get updated list
            await get().loadSessions()
          } else {
            throw new Error('Failed to revoke session')
          }
        } catch (error) {
          console.error('Revoke session error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      revokeAllOtherSessions: async () => {
        try {
          set({ isLoading: true })
          
          // Revoke all other sessions via API
          const response = await fetch('/api/users/sessions/others', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${apiClient.getStoredAuth().token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            // Reload sessions to get updated list
            await get().loadSessions()
          } else {
            throw new Error('Failed to revoke sessions')
          }
        } catch (error) {
          console.error('Revoke all sessions error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      getCurrentSessionInfo: () => {
        return getCurrentSessionFromBrowser()
      },

      // Getters
      getActiveSessions: () => {
        const now = new Date()
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        
        return get().sessions.filter(session => {
          const lastActivity = new Date(session.last_activity)
          return lastActivity > oneDayAgo
        })
      },

      getSessionsByDevice: (deviceType: string) => {
        return get().sessions.filter(session => session.device_type === deviceType)
      }
    }),
    {
      name: 'forvara-sessions',
      partialize: (state) => ({
        // Don't persist sessions, always load fresh for security
      })
    }
  )
)
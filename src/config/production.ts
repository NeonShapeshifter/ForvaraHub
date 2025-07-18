// Production configuration and error handling

export const PRODUCTION_CONFIG = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'https://api.forvara.dev',
  API_TIMEOUT: 10000, // 10 seconds

  // Error handling
  ENABLE_ERROR_LOGGING: true,
  FALLBACK_TO_DEMO_DATA: true,

  // Features
  ENABLE_OAUTH: false, // OAuth not implemented yet
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,

  // Debug settings
  DEBUG_MODE: import.meta.env.DEV,
  LOG_LEVEL: import.meta.env.DEV ? 'debug' : 'error'
}

// Safe array helper
export const ensureArray = <T>(data: any, fallback: T[] = []): T[] => {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && data.data && Array.isArray(data.data)) return data.data
  return fallback
}

// Safe API response helper
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  fallback: T,
  errorMessage: string = 'API call failed'
): Promise<T> => {
  try {
    const result = await apiCall()
    return result
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    if (PRODUCTION_CONFIG.ENABLE_ERROR_LOGGING) {
      // Log to external service in production
      console.error('Production error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        url: window.location.href
      })
    }
    return fallback
  }
}

// Demo data fallbacks
export const DEMO_DATA = {
  apps: [
    {
      id: 'elaris-contabilidad',
      name: 'Elaris Contabilidad',
      description: 'Módulo de contabilidad empresarial con facturación electrónica',
      category: 'Contabilidad',
      status: 'trial',
      subscription: {
        plan: 'trial',
        price: '$29',
        billingCycle: 'monthly',
        nextBilling: null,
        trialEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      usage: {
        lastAccessed: new Date().toISOString(),
        monthlyActiveUsers: 3,
        storageUsed: '125.3MB',
        apiCalls: 450
      },
      permissions: ['read', 'write'],
      installedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  members: [
    {
      id: 'user-1',
      user_id: 'user-1',
      role: 'owner',
      status: 'active',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      user_data: {
        first_name: 'Alejandro',
        last_name: 'Forvara',
        email: 'ale@forvara.com',
        phone: '+507 6000-0000',
        avatar_url: null
      }
    }
  ],

  stats: {
    users: 1,
    companies: 1,
    apps: 2,
    apiCalls: 450,
    storageUsed: 0.5,
    storageLimit: 5,
    storage: '10%'
  }
}

// Safe API service with fallbacks and error handling
import { DEMO_DATA } from '@/config/production'

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

// Safe API call with fallbacks
export async function safeApiCall<T>(
  url: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<ApiResponse<T>> {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.forvara.dev'
    const fullUrl = `${baseUrl}${url}`

    console.log(`🔍 API Call: ${fullUrl}`)

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON')
    }

    const data = await response.json()

    return {
      data,
      success: true
    }
  } catch (error) {
    console.error(`❌ API Error for ${url}:`, error)

    // Return fallback data if available
    if (fallbackData !== undefined) {
      console.log(`🔄 Using fallback data for ${url}`)
      return {
        data: fallbackData,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }

    // Return empty/safe defaults based on URL
    const safeFallback = getSafeFallback<T>(url)
    return {
      data: safeFallback,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Get safe fallback data based on URL pattern
function getSafeFallback<T>(url: string): T {
  if (url.includes('/apps')) {
    return DEMO_DATA.apps as T
  }

  if (url.includes('/members') || url.includes('/users')) {
    return DEMO_DATA.members as T
  }

  if (url.includes('/stats') || url.includes('/dashboard')) {
    return DEMO_DATA.stats as T
  }

  // Default fallbacks
  if (url.includes('/companies')) {
    return [] as T
  }

  // Generic fallback
  return (Array.isArray(DEMO_DATA.apps) ? [] : {}) as T
}

// Safe services with fallbacks
export const safeServices = {
  // Apps
  async getApps() {
    return safeApiCall('/apps', {}, DEMO_DATA.apps)
  },

  async getCompanyApps(companyId: string) {
    return safeApiCall(`/companies/${companyId}/apps`, {}, DEMO_DATA.apps)
  },

  // Members
  async getCompanyMembers(companyId: string) {
    return safeApiCall(`/companies/${companyId}/members`, {}, DEMO_DATA.members)
  },

  // Stats
  async getDashboardStats() {
    return safeApiCall('/dashboard/stats', {}, DEMO_DATA.stats)
  },

  // Companies
  async getCompanies() {
    return safeApiCall('/companies', {}, [])
  },

  // Generic GET
  async get<T>(url: string, fallback?: T) {
    return safeApiCall<T>(url, {}, fallback)
  },

  // Generic POST
  async post<T>(url: string, data: any, fallback?: T) {
    return safeApiCall<T>(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }, fallback)
  }
}

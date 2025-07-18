import React, { createContext, useContext, useEffect, useState } from 'react'

interface ConfigContextType {
  apiUrl: string
  env: string
  isProduction: boolean
  debugMode: boolean
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ConfigContextType>({
    apiUrl: 'https://api.forvara.dev', // Hardcoded fallback
    env: 'production',
    isProduction: true,
    debugMode: false
  })

  useEffect(() => {
    // Try to get from environment variables, fallback to hardcoded
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api.forvara.dev'
    const env = import.meta.env.VITE_ENV || 'production'
    const isProduction = import.meta.env.PROD || true
    const debugMode = import.meta.env.DEV || false

    setConfig({
      apiUrl,
      env,
      isProduction,
      debugMode
    })

    // Debug log
    console.log('🔧 Config loaded:', {
      apiUrl,
      env,
      isProduction,
      debugMode,
      allEnvVars: import.meta.env
    })
  }, [])

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    // Fallback gracioso
    console.warn('useConfig used outside ConfigProvider - using fallback')
    return {
      apiUrl: 'https://api.forvara.dev',
      env: 'production',
      isProduction: true,
      debugMode: false
    }
  }
  return context
}
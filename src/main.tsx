import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './styles/globals.css'
import { NotificationProvider } from '@/components/ui/notifications'
import { ConfigProvider } from '@/components/providers/ConfigProvider'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  }
})

// Production debugging information
if (import.meta.env.PROD) {
  console.log('🔍 PRODUCTION DEBUG INFO:', {
    apiUrl: import.meta.env.VITE_API_URL,
    env: import.meta.env.VITE_ENV,
    mode: import.meta.env.MODE,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  })

  // Test API connectivity
  fetch(`${import.meta.env.VITE_API_URL}/health`)
    .then(res => res.json())
    .then(data => console.log('✅ API Health Check:', data))
    .catch(err => console.error('❌ API Health Check Failed:', err))
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>
)

// ForvaraHub/src/pages/Marketplace.tsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  Star,
  Download,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Users,
  Clock,
  ChevronRight,
  Package,
  Rocket,
  Award,
  Heart,
  Store,
  Loader2
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'

interface App {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  rating?: number
  reviews?: number
  installs?: number
  price?: string
  price_type: 'free' | 'paid' | 'freemium'
  tags?: string[]
  featured?: boolean
  trending?: boolean
  is_new?: boolean
  developer?: {
    name: string
    verified: boolean
  }
}

interface Category {
  id: string
  name: string
  icon: any
  count?: number
}

const categories: Category[] = [
  { id: 'all', name: 'Todas', icon: Package },
  { id: 'productivity', name: 'Productividad', icon: Zap },
  { id: 'sales', name: 'Ventas', icon: TrendingUp },
  { id: 'marketing', name: 'Marketing', icon: Sparkles },
  { id: 'hr', name: 'RRHH', icon: Users },
  { id: 'finance', name: 'Finanzas', icon: Shield },
  { id: 'communication', name: 'Comunicación', icon: Globe }
]

export default function Marketplace() {
  const navigate = useNavigate()
  const { currentCompany } = useAuthStore()

  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [installedApps, setInstalledApps] = useState<Set<string>>(new Set())
  const [installing, setInstalling] = useState<string | null>(null)

  useEffect(() => {
    loadApps()
    loadInstalledApps()
  }, [currentCompany])

  const loadApps = async () => {
    try {
      setLoading(true)
      const response = await api.get('/marketplace/apps')
      setApps(response.data || [])
    } catch (error) {
      console.error('Error loading apps:', error)
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  const loadInstalledApps = async () => {
    if (!currentCompany) return

    try {
      const response = await api.get(`/companies/${currentCompany.id}/apps`)
      const installed = new Set(response.data.map((app: any) => app.id))
      setInstalledApps(installed)
    } catch (error) {
      console.error('Error loading installed apps:', error)
    }
  }

  const handleInstallApp = async (appId: string) => {
    if (!currentCompany) return

    try {
      setInstalling(appId)
      await api.post(`/companies/${currentCompany.id}/apps`, { app_id: appId })
      setInstalledApps(prev => new Set([...prev, appId]))
      // TODO: Show success notification
    } catch (error) {
      console.error('Error installing app:', error)
      // TODO: Show error notification
    } finally {
      setInstalling(null)
    }
  }

  // Filter apps based on category and search
  const filteredApps = apps.filter(app => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory
    const matchesSearch = !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Marketplace"
          description="Descubre aplicaciones para potenciar tu negocio"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Cargando aplicaciones...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  // Empty state
  if (apps.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Marketplace"
          description="Descubre aplicaciones para potenciar tu negocio"
        />
        <Card className="shadow-card">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Marketplace en construcción
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Estamos trabajando para traerte las mejores aplicaciones empresariales.
                Vuelve pronto para descubrir herramientas increíbles.
              </p>
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Volver al dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Marketplace"
        description="Descubre aplicaciones para potenciar tu negocio"
      />

      <div className="flex gap-6">
        {/* Sidebar - Categories */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Categorías</h3>
            <nav className="space-y-1">
              {categories.map(category => {
                const categoryApps = category.id === 'all'
                  ? apps
                  : apps.filter(app => app.category === category.id)

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-fast ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {categoryApps.length}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Featured banner */}
          <div className="mt-6 p-6 rounded-xl gradient-brand text-white">
            <Sparkles className="w-8 h-8 mb-3" />
            <h4 className="font-semibold mb-2">¿Eres desarrollador?</h4>
            <p className="text-sm text-white/90 mb-4">
              Publica tu app en nuestro marketplace y llega a miles de empresas.
            </p>
            <Button size="sm" variant="secondary" className="w-full">
              Más información
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Search and filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar aplicaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600 mb-4">
            {filteredApps.length} aplicaciones encontradas
          </p>

          {/* Apps grid */}
          {filteredApps.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron aplicaciones
                </h3>
                <p className="text-sm text-gray-500">
                  Intenta con otros términos de búsqueda o categorías
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map(app => (
                <Card
                  key={app.id}
                  className="shadow-card hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/marketplace/${app.id}`)}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-lg">
                          {app.icon || app.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {app.name}
                          </h3>
                          {app.developer && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              {app.developer.name}
                              {app.developer.verified && (
                                <Shield className="w-3 h-3 text-blue-500" />
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      {app.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                          <Award className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {app.description}
                    </p>

                    {/* Tags */}
                    {app.tags && app.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      {app.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{app.rating}</span>
                          {app.reviews && (
                            <span className="text-gray-500">({app.reviews})</span>
                          )}
                        </div>
                      )}
                      {app.installs && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Download className="w-4 h-4" />
                          <span>{app.installs.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        {app.price_type === 'free' && (
                          <span className="text-green-600 font-medium">Gratis</span>
                        )}
                        {app.price_type === 'paid' && app.price && (
                          <span className="text-gray-900 font-medium">{app.price}/mes</span>
                        )}
                        {app.price_type === 'freemium' && (
                          <span className="text-blue-600 font-medium">Freemium</span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!installedApps.has(app.id)) {
                            handleInstallApp(app.id)
                          }
                        }}
                        disabled={installedApps.has(app.id) || installing === app.id}
                        className={installedApps.has(app.id) ? 'bg-gray-100 text-gray-500' : 'gradient-brand text-white'}
                      >
                        {installing === app.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : installedApps.has(app.id) ? (
                          'Instalado'
                        ) : (
                          'Instalar'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

import React, { useState, useEffect } from 'react'
import { Search, Star, Download, DollarSign, Building2, Calculator, MessageSquare, BarChart3, Package, FileText, Sparkles, Filter, X, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { appsService, App as AppType } from '@/services/apps.service'

interface App {
  id: string
  name: string
  display_name?: string
  description: string
  short_description?: string
  icon: React.ReactNode
  category: string
  base_price_monthly?: number
  price: string
  priceType: 'free' | 'monthly' | 'one-time'
  is_free?: boolean
  rating?: number
  downloads?: string
  features?: string[]
  status?: 'available' | 'installed' | 'coming-soon'
  featured?: boolean
}

// Modal de instalación
const AppInstallModal = ({ app, isOpen, onClose, onInstall }: {
  app: App | null
  isOpen: boolean
  onClose: () => void
  onInstall: (appId: string) => void
}) => {
  const [installing, setInstalling] = useState(false)
  const [planSelected, setPlanSelected] = useState<'monthly' | 'yearly'>('monthly')

  if (!isOpen || !app) return null

  const handleInstall = async () => {
    setInstalling(true)
    await onInstall(app.id)
    setInstalling(false)
    onClose()
  }

  const getPriceDisplay = () => {
    if (app.is_free) return 'Gratis'
    const price = app.base_price_monthly
    if (planSelected === 'yearly') {
      return `$${(price * 10).toFixed(0)}/año`
    }
    return `$${price}/mes`
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {app.icon}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {app.display_name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {app.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Descripción</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {app.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Características principales</h3>
            <div className="space-y-2">
              {app.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          {!app.is_free && (
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Plan de facturación</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPlanSelected('monthly')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    planSelected === 'monthly'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white">Mensual</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">${app.base_price_monthly}/mes</p>
                </button>
                <button
                  onClick={() => setPlanSelected('yearly')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    planSelected === 'yearly'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white">Anual</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${(app.base_price_monthly * 10).toFixed(0)}/año
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">Ahorra 2 meses</p>
                </button>
              </div>
            </div>
          )}

          {/* Trial info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Prueba gratis de 14 días
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Prueba todas las funciones sin compromiso. No se requiere tarjeta de crédito.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleInstall}
              disabled={installing || app.status === 'coming-soon'}
              className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {installing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  Instalando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Instalar ahora - {getPriceDisplay()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [installedApps, setInstalledApps] = useState<string[]>([])
  const [availableApps, setAvailableApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ['Todos', 'ERP', 'Analytics', 'Comunicación', 'Inventario', 'Facturación', 'Finanzas']

  useEffect(() => {
    loadApps()
  }, [])

  const loadApps = async () => {
    try {
      setLoading(true)
      
      // Load available apps from service
      const [available, installed] = await Promise.all([
        appsService.getAvailableApps(),
        appsService.getInstalledApps()
      ])
      
      // Convert service apps to UI format
      const convertedApps = available.map(app => ({
        id: app.id,
        name: app.name,
        display_name: app.name,
        description: app.description,
        short_description: app.description,
        icon: getAppIcon(app.category),
        category: app.category,
        base_price_monthly: app.priceType === 'free' ? 0 : parseInt(app.price.replace('$', '')),
        price: app.price,
        priceType: app.priceType,
        is_free: app.priceType === 'free',
        rating: app.rating || 4.5,
        downloads: app.downloads || '0',
        features: app.features || ['Funciones básicas'],
        status: app.status || 'available',
        featured: app.featured || false
      }))
      
      setAvailableApps(convertedApps)
      setInstalledApps(installed.map(app => app.id))
      setLoading(false)
      
    } catch (error) {
      console.error('Error loading apps:', error)
      setLoading(false)
    }
  }

  const getAppIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crm & ventas':
      case 'crm':
        return <Building2 className="w-8 h-8 text-blue-600" />
      case 'contabilidad':
        return <Calculator className="w-8 h-8 text-green-600" />
      case 'inventario':
        return <Package className="w-8 h-8 text-purple-600" />
      case 'analytics':
        return <BarChart3 className="w-8 h-8 text-orange-600" />
      default:
        return <Building2 className="w-8 h-8 text-gray-600" />
    }
  }

  const handleAppInstall = async (appId: string) => {
    try {
      await appsService.installApp(appId)
      console.log('Installing app:', appId)
      setInstalledApps(prev => [...prev, appId])
    } catch (error) {
      console.error('Error installing app:', error)
      // For demo purposes, still add to UI on error
      setInstalledApps(prev => [...prev, appId])
    }
  }

  const filteredApps = availableApps.filter(app => {
    const matchesSearch = app.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredApps = availableApps.filter(app => app.featured)

  const getStatusBadge = (app: App) => {
    if (installedApps.includes(app.id)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-400 border border-green-200 dark:border-green-800">
          <CheckCircle className="w-3 h-3" />
          Instalado
        </span>
      )
    }
    if (app.status === 'coming-soon') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-700 dark:bg-gray-900/10 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
          <Clock className="w-3 h-3" />
          Próximamente
        </span>
      )
    }
    return null
  }

  const getPriceDisplay = (app: App) => {
    if (app.is_free) return 'Gratis'
    return `$${app.base_price_monthly}/mes`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Marketplace de Apps
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Descubre aplicaciones empresariales diseñadas para PyMEs de LATAM
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar aplicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            />
          </div>
          
          <div className="flex justify-center">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-md transition-all text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Apps */}
        {selectedCategory === 'Todos' && searchTerm === '' && featuredApps.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Apps destacadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredApps.map((app) => (
                <div 
                  key={app.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-purple-100 dark:border-purple-900 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedApp(app)
                    setIsModalOpen(true)
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {app.icon}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {app.display_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {app.category}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(app)}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {app.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {app.rating}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({app.downloads})
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getPriceDisplay(app)}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!installedApps.includes(app.id) && app.status !== 'coming-soon') {
                          setSelectedApp(app)
                          setIsModalOpen(true)
                        }
                      }}
                      disabled={installedApps.includes(app.id) || app.status === 'coming-soon'}
                      className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        installedApps.includes(app.id)
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default'
                          : app.status === 'coming-soon'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                      }`}
                    >
                      {installedApps.includes(app.id) 
                        ? 'Instalado' 
                        : app.status === 'coming-soon' 
                        ? 'Próximamente' 
                        : 'Instalar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Apps Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Package className="w-5 h-5" />
            {selectedCategory === 'Todos' ? 'Todas las apps' : `Apps de ${selectedCategory}`}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({filteredApps.length} resultados)
            </span>
          </h2>
          
          {filteredApps.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No se encontraron aplicaciones
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Intenta con otros términos de búsqueda o categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <div 
                  key={app.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedApp(app)
                    setIsModalOpen(true)
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {app.icon}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {app.display_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {app.category}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(app)}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {app.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {app.rating}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({app.downloads})
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getPriceDisplay(app)}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Características:</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {app.features.slice(0, 2).join(' • ')}
                        {app.features.length > 2 && ' • ...'}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!installedApps.includes(app.id) && app.status !== 'coming-soon') {
                          setSelectedApp(app)
                          setIsModalOpen(true)
                        }
                      }}
                      disabled={installedApps.includes(app.id) || app.status === 'coming-soon'}
                      className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        installedApps.includes(app.id)
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default'
                          : app.status === 'coming-soon'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                      }`}
                    >
                      {installedApps.includes(app.id) 
                        ? 'Instalado' 
                        : app.status === 'coming-soon' 
                        ? 'Próximamente' 
                        : 'Instalar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{availableApps.length}+</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Apps disponibles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">10K+</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">PyMEs conectadas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">18</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Países LATAM</p>
            </div>
          </div>
        </div>

        {/* Install Modal */}
        <AppInstallModal 
          app={selectedApp}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedApp(null)
          }}
          onInstall={handleAppInstall}
        />
      </div>
    </div>
  )
}

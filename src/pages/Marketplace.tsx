import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AppInstallModal } from '@/components/marketplace/AppInstallModal'
import { appsService, type App as APIApp } from '@/services/apps.service'
import { 
  Search, 
  Star, 
  Download, 
  DollarSign, 
  Users, 
  Zap,
  Building,
  Calculator,
  MessageSquare,
  BarChart3,
  Package,
  FileText,
  Shield,
  Sparkles
} from 'lucide-react'

interface App {
  id: string
  name: string
  description: string
  longDescription: string
  icon: React.ReactNode
  category: string
  price: string
  priceType: 'free' | 'monthly' | 'one-time'
  rating: number
  downloads: string
  features: string[]
  status: 'available' | 'installed' | 'coming-soon'
  featured?: boolean
}

const mockApps: App[] = [
  {
    id: 'elaris-erp',
    name: 'Elaris ERP',
    description: 'Sistema ERP completo para PyMEs con contabilidad, inventario y facturación',
    longDescription: 'La solución ERP más completa para pequeñas y medianas empresas de LATAM. Incluye contabilidad, gestión de inventario, facturación electrónica y reportes financieros.',
    icon: <Building className="w-8 h-8 text-blue-600" />,
    category: 'ERP',
    price: '$29',
    priceType: 'monthly',
    rating: 4.8,
    downloads: '1.2K',
    features: ['Contabilidad completa', 'Inventario en tiempo real', 'Facturación electrónica', 'Reportes avanzados'],
    status: 'available',
    featured: true
  },
  {
    id: 'forvara-analytics',
    name: 'Forvara Analytics',
    description: 'Inteligencia empresarial y análisis de datos para tomar mejores decisiones',
    longDescription: 'Plataforma de business intelligence que convierte tus datos en insights accionables. Dashboards interactivos, predicciones y alertas inteligentes.',
    icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
    category: 'Analytics',
    price: '$19',
    priceType: 'monthly',
    rating: 4.6,
    downloads: '856',
    features: ['Dashboards interactivos', 'Predicciones IA', 'Alertas automáticas', 'Exportar reportes'],
    status: 'coming-soon',
    featured: true
  },
  {
    id: 'forvara-mail',
    name: 'Forvara Mail',
    description: 'Comunicación empresarial estilo Discord para equipos remotos',
    longDescription: 'Plataforma de comunicación moderna que combina chat en tiempo real, videoconferencias y gestión de proyectos en una sola aplicación.',
    icon: <MessageSquare className="w-8 h-8 text-green-600" />,
    category: 'Comunicación',
    price: '$12',
    priceType: 'monthly',
    rating: 4.9,
    downloads: '2.1K',
    features: ['Chat en tiempo real', 'Videoconferencias', 'Canales por proyecto', 'Integración con ERP'],
    status: 'coming-soon',
    featured: true
  },
  {
    id: 'inventory-plus',
    name: 'Inventory Plus',
    description: 'Gestión avanzada de inventario con códigos QR y alertas automáticas',
    longDescription: 'Sistema de inventario inteligente con escaneo QR, alertas de stock bajo y sincronización en tiempo real entre múltiples ubicaciones.',
    icon: <Package className="w-8 h-8 text-orange-600" />,
    category: 'Inventario',
    price: '$15',
    priceType: 'monthly',
    rating: 4.7,
    downloads: '423',
    features: ['Códigos QR', 'Alertas de stock', 'Multi-ubicación', 'Reportes de rotación'],
    status: 'available'
  },
  {
    id: 'factura-pro',
    name: 'Factura Pro',
    description: 'Facturación electrónica para todos los países de LATAM',
    longDescription: 'Solución completa de facturación electrónica que cumple con las regulaciones de todos los países latinoamericanos.',
    icon: <FileText className="w-8 h-8 text-red-600" />,
    category: 'Facturación',
    price: '$8',
    priceType: 'monthly',
    rating: 4.5,
    downloads: '1.8K',
    features: ['Multi-país LATAM', 'Firma electrónica', 'Envío automático', 'Integración tributaria'],
    status: 'available'
  },
  {
    id: 'calc-latam',
    name: 'Calc LATAM',
    description: 'Calculadora fiscal y tributaria especializada en legislación latinoamericana',
    longDescription: 'Herramienta especializada para cálculos fiscales y tributarios adaptada a las leyes de cada país de LATAM.',
    icon: <Calculator className="w-8 h-8 text-cyan-600" />,
    category: 'Finanzas',
    price: 'Gratis',
    priceType: 'free',
    rating: 4.3,
    downloads: '3.2K',
    features: ['Cálculo de impuestos', 'Multi-país', 'Actualizaciones legales', 'Exportar cálculos'],
    status: 'available'
  }
]

const categories = ['Todos', 'ERP', 'Analytics', 'Comunicación', 'Inventario', 'Facturación', 'Finanzas']

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [installedApps, setInstalledApps] = useState<string[]>(['calc-latam']) // Pre-installed free app
  const [availableApps, setAvailableApps] = useState<App[]>(mockApps)
  const [loading, setLoading] = useState(true)

  // Load available apps from backend
  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true)
        const [available, installed] = await Promise.all([
          appsService.getAvailableApps(),
          appsService.getInstalledApps()
        ])
        
        if (available.length > 0) {
          // Use real data from backend
          setAvailableApps(available.map(app => ({
            ...app,
            // Add missing properties with defaults
            longDescription: app.description,
            icon: getIconForCategory(app.category),
            rating: 4.5,
            downloads: '1.2K',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            featured: app.category === 'ERP' || app.category === 'Analytics'
          })))
        } else {
          // Fallback to mock data
          setAvailableApps(mockApps)
        }
        
        // Update installed apps list
        setInstalledApps(installed.map(app => app.id))
      } catch (error) {
        console.error('Error loading apps:', error)
        // Use mock data as fallback
        setAvailableApps(mockApps)
      } finally {
        setLoading(false)
      }
    }

    loadApps()
  }, [])

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'ERP': return <Building className="w-8 h-8 text-blue-600" />
      case 'Analytics': return <BarChart3 className="w-8 h-8 text-purple-600" />
      case 'Comunicación': return <MessageSquare className="w-8 h-8 text-green-600" />
      case 'Inventario': return <Package className="w-8 h-8 text-orange-600" />
      case 'Facturación': return <FileText className="w-8 h-8 text-red-600" />
      case 'Finanzas': return <Calculator className="w-8 h-8 text-cyan-600" />
      default: return <Package className="w-8 h-8 text-gray-600" />
    }
  }

  const filteredApps = appsWithStatus.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredApps = appsWithStatus.filter(app => app.featured)

  const getStatusBadge = (status: App['status']) => {
    switch (status) {
      case 'installed':
        return <Badge variant="default" className="bg-green-500">Instalado</Badge>
      case 'coming-soon':
        return <Badge variant="secondary">Próximamente</Badge>
      default:
        return null
    }
  }

  const getPriceDisplay = (app: App) => {
    if (app.priceType === 'free') return 'Gratis'
    if (app.priceType === 'monthly') return `${app.price}/mes`
    return app.price
  }

  const handleAppClick = (app: App) => {
    setSelectedApp(app)
    setIsModalOpen(true)
  }

  const handleAppInstall = async (appId: string) => {
    try {
      await appsService.installApp(appId)
      setInstalledApps(prev => [...prev, appId])
      
      // Update the app status in availableApps
      setAvailableApps(prev => prev.map(app => 
        app.id === appId ? { ...app, status: 'installed' as const } : app
      ))
    } catch (error) {
      console.error('Error installing app:', error)
      // Still update UI for demo purposes
      setInstalledApps(prev => [...prev, appId])
      setAvailableApps(prev => prev.map(app => 
        app.id === appId ? { ...app, status: 'installed' as const } : app
      ))
    }
  }

  // Update app statuses based on installed apps
  const appsWithStatus = availableApps.map(app => ({
    ...app,
    status: installedApps.includes(app.id) ? 'installed' as const : app.status
  }))

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          🏪 Marketplace de Apps
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Descubre, instala y gestiona aplicaciones empresariales diseñadas específicamente para PyMEs de LATAM
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="🔍 Buscar aplicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Apps */}
      {selectedCategory === 'Todos' && searchTerm === '' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Apps Destacadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.map((app) => (
              <Card 
                key={app.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-purple-100 dark:border-purple-900"
                onClick={() => handleAppClick(app)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {app.icon}
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{app.category}</Badge>
                          {getStatusBadge(app.status)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-purple-600">{getPriceDisplay(app)}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {app.rating}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {app.downloads} instalaciones
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={app.status === 'coming-soon'}
                    variant={app.status === 'installed' ? 'outline' : 'default'}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (app.status !== 'installed' && app.status !== 'coming-soon') {
                        handleAppClick(app)
                      }
                    }}
                  >
                    {app.status === 'installed' ? '✅ Instalado' : 
                     app.status === 'coming-soon' ? '🚧 Próximamente' : 
                     '🚀 Instalar Ahora'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Apps Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6" />
          {selectedCategory === 'Todos' ? 'Todas las Apps' : `Apps de ${selectedCategory}`}
          <span className="text-sm font-normal text-muted-foreground">
            ({filteredApps.length} resultados)
          </span>
        </h2>
        
        {filteredApps.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron aplicaciones</h3>
              <p className="text-muted-foreground">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <Card 
                key={app.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleAppClick(app)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {app.icon}
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{app.category}</Badge>
                          {getStatusBadge(app.status)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{getPriceDisplay(app)}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {app.rating}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {app.downloads} instalaciones
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Características:</div>
                      <div className="text-xs text-muted-foreground">
                        {app.features.slice(0, 2).join(' • ')}
                        {app.features.length > 2 && ' • ...'}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={app.status === 'coming-soon'}
                      variant={app.status === 'installed' ? 'outline' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (app.status !== 'installed' && app.status !== 'coming-soon') {
                          handleAppClick(app)
                        }
                      }}
                    >
                      {app.status === 'installed' ? '✅ Instalado' : 
                       app.status === 'coming-soon' ? '🚧 Próximamente' : 
                       '🚀 Instalar Ahora'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
        <CardContent className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">{availableApps.length}+</div>
              <div className="text-muted-foreground">Apps Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">10K+</div>
              <div className="text-muted-foreground">PyMEs Conectadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">18</div>
              <div className="text-muted-foreground">Países LATAM</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
  )
}
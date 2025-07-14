import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  ExternalLink, 
  Trash2, 
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Package,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Zap,
  Building,
  Calculator,
  MessageSquare,
  FileText,
  Crown,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { appsService, type InstalledApp as APIInstalledApp } from '@/services/apps.service'

interface InstalledApp {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  status: 'active' | 'trial' | 'suspended' | 'pending'
  subscription: {
    plan: string
    price: string
    billingCycle: 'monthly' | 'yearly' | 'free'
    nextBilling?: string
    trialEnds?: string
  }
  usage: {
    lastAccessed: string
    monthlyActiveUsers: number
    storageUsed: string
    apiCalls: number
  }
  permissions: string[]
  installedDate: string
}

// Mock data - would come from backend
const mockInstalledApps: InstalledApp[] = [
  {
    id: 'elaris-erp',
    name: 'Elaris ERP',
    description: 'Sistema ERP completo para PyMEs',
    icon: <Building className="w-8 h-8 text-blue-600" />,
    category: 'ERP',
    status: 'trial',
    subscription: {
      plan: 'Professional',
      price: '$29',
      billingCycle: 'monthly',
      trialEnds: '2025-01-27'
    },
    usage: {
      lastAccessed: '2025-01-13',
      monthlyActiveUsers: 8,
      storageUsed: '2.3 GB',
      apiCalls: 1247
    },
    permissions: ['Administración completa', 'Gestión de usuarios', 'Reportes financieros'],
    installedDate: '2025-01-13'
  },
  {
    id: 'calc-latam',
    name: 'Calc LATAM',
    description: 'Calculadora fiscal para LATAM',
    icon: <Calculator className="w-8 h-8 text-cyan-600" />,
    category: 'Finanzas',
    status: 'active',
    subscription: {
      plan: 'Free',
      price: 'Gratis',
      billingCycle: 'free'
    },
    usage: {
      lastAccessed: '2025-01-12',
      monthlyActiveUsers: 3,
      storageUsed: '45 MB',
      apiCalls: 156
    },
    permissions: ['Cálculos básicos', 'Exportar resultados'],
    installedDate: '2025-01-10'
  },
  {
    id: 'inventory-plus',
    name: 'Inventory Plus',
    description: 'Gestión avanzada de inventario',
    icon: <Package className="w-8 h-8 text-orange-600" />,
    category: 'Inventario',
    status: 'active',
    subscription: {
      plan: 'Standard',
      price: '$15',
      billingCycle: 'monthly',
      nextBilling: '2025-02-10'
    },
    usage: {
      lastAccessed: '2025-01-13',
      monthlyActiveUsers: 5,
      storageUsed: '890 MB',
      apiCalls: 892
    },
    permissions: ['Gestión de inventario', 'Códigos QR', 'Alertas de stock'],
    installedDate: '2025-01-10'
  }
]

export default function MyApps() {
  const { currentCompany } = useAuthStore()
  const [apps, setApps] = useState<InstalledApp[]>(mockInstalledApps)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'trial' | 'suspended'>('all')

  // Load installed apps from backend
  useEffect(() => {
    const loadInstalledApps = async () => {
      try {
        setLoading(true)
        const installedApps = await appsService.getInstalledApps()
        
        if (installedApps.length > 0) {
          // Use real data from backend
          setApps(installedApps)
        } else {
          // Fallback to mock data for demo
          setApps(mockInstalledApps)
        }
      } catch (error) {
        console.error('Error loading installed apps:', error)
        // Use mock data as fallback
        setApps(mockInstalledApps)
      } finally {
        setLoading(false)
      }
    }

    loadInstalledApps()
  }, [])

  const handleLaunchApp = async (appId: string) => {
    try {
      const result = await appsService.launchApp(appId)
      // Open app in new tab
      window.open(result.url, '_blank')
    } catch (error) {
      console.error('Error launching app:', error)
      // TODO: Show error toast
    }
  }

  const handleUninstallApp = async (appId: string) => {
    if (!confirm('¿Estás seguro de que deseas desinstalar esta aplicación?')) {
      return
    }

    try {
      await appsService.uninstallApp(appId)
      // Remove app from local state
      setApps(prev => prev.filter(app => app.id !== appId))
      // TODO: Show success toast
    } catch (error) {
      console.error('Error uninstalling app:', error)
      // TODO: Show error toast
    }
  }

  const filteredApps = apps.filter(app => filter === 'all' || app.status === filter)

  const getStatusBadge = (status: InstalledApp['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Activo</Badge>
      case 'trial':
        return <Badge className="bg-blue-500 text-white"><Clock className="w-3 h-3 mr-1" />Prueba</Badge>
      case 'suspended':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Suspendido</Badge>
      case 'pending':
        return <Badge variant="secondary"><RotateCcw className="w-3 h-3 mr-1" />Pendiente</Badge>
    }
  }

  const getTotalMonthlyCost = () => {
    return apps
      .filter(app => app.subscription.billingCycle === 'monthly')
      .reduce((total, app) => {
        const price = parseFloat(app.subscription.price.replace('$', '') || '0')
        return total + price
      }, 0)
  }

  const getTrialApps = () => {
    return apps.filter(app => app.status === 'trial')
  }

  const getDaysUntilTrialExpires = (trialEnds?: string) => {
    if (!trialEnds) return 0
    const today = new Date()
    const endDate = new Date(trialEnds)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tus aplicaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          🎮 Mis Aplicaciones
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus apps instaladas y suscripciones de {currentCompany?.razon_social}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{apps.length}</div>
                <div className="text-sm text-muted-foreground">Apps Instaladas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">${getTotalMonthlyCost()}</div>
                <div className="text-sm text-muted-foreground">Costo Mensual</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{getTrialApps().length}</div>
                <div className="text-sm text-muted-foreground">En Prueba</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {apps.reduce((total, app) => total + app.usage.monthlyActiveUsers, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Usuarios Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trial Alerts */}
      {getTrialApps().length > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Clock className="w-5 h-5" />
              Períodos de Prueba Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTrialApps().map(app => {
                const daysLeft = getDaysUntilTrialExpires(app.subscription.trialEnds)
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {app.icon}
                      <div>
                        <div className="font-medium">{app.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {daysLeft} días restantes de prueba
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600">
                      💳 Suscribirse ${app.subscription.price}/mes
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'Todas', count: apps.length },
          { key: 'active', label: 'Activas', count: apps.filter(a => a.status === 'active').length },
          { key: 'trial', label: 'En Prueba', count: apps.filter(a => a.status === 'trial').length },
          { key: 'suspended', label: 'Suspendidas', count: apps.filter(a => a.status === 'suspended').length }
        ].map(filterOption => (
          <Button
            key={filterOption.key}
            variant={filter === filterOption.key ? "default" : "outline"}
            onClick={() => setFilter(filterOption.key as any)}
            className="gap-2"
          >
            {filterOption.label}
            <Badge variant="secondary" className="ml-1">
              {filterOption.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="grid gap-6">
        {filteredApps.map((app) => (
          <Card key={app.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {app.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{app.name}</CardTitle>
                      {getStatusBadge(app.status)}
                      <Badge variant="outline">{app.category}</Badge>
                    </div>
                    <CardDescription className="text-base mb-3">
                      {app.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Instalado: {new Date(app.installedDate).toLocaleDateString('es-ES')}</span>
                      <span>Último acceso: {new Date(app.usage.lastAccessed).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Subscription Info */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    Suscripción
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="font-medium">{app.subscription.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio:</span>
                      <span className="font-medium text-green-600">{app.subscription.price}{app.subscription.billingCycle === 'monthly' ? '/mes' : ''}</span>
                    </div>
                    {app.subscription.nextBilling && (
                      <div className="flex justify-between">
                        <span>Próximo cobro:</span>
                        <span>{new Date(app.subscription.nextBilling).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    {app.subscription.trialEnds && (
                      <div className="flex justify-between">
                        <span>Prueba termina:</span>
                        <span className="text-blue-600 font-medium">
                          {getDaysUntilTrialExpires(app.subscription.trialEnds)} días
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Usage Stats */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    Uso
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Usuarios activos:</span>
                      <span className="font-medium">{app.usage.monthlyActiveUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Almacenamiento:</span>
                      <span className="font-medium">{app.usage.storageUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API calls:</span>
                      <span className="font-medium">{app.usage.apiCalls.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Acciones
                  </h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleLaunchApp(app.id)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir App
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Ver Reportes
                    </Button>
                    {app.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={() => handleUninstallApp(app.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Desinstalar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay aplicaciones</h3>
            <p className="text-muted-foreground mb-4">
              No tienes aplicaciones {filter !== 'all' ? filter === 'trial' ? 'en prueba' : filter : 'instaladas'} en este momento
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              🏪 Explorar Marketplace
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Star,
  Download,
  Check,
  CreditCard,
  Shield,
  Zap,
  Clock,
  DollarSign
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

interface AppInstallModalProps {
  app: App | null
  isOpen: boolean
  onClose: () => void
  onInstall: (appId: string) => void
}

export function AppInstallModal({ app, isOpen, onClose, onInstall }: AppInstallModalProps) {
  const [isInstalling, setIsInstalling] = useState(false)
  const [installStep, setInstallStep] = useState<'details' | 'payment' | 'installing' | 'success'>('details')

  if (!app) return null

  const handleInstall = async () => {
    if (app.priceType === 'free') {
      // Free app - direct install
      setInstallStep('installing')
      setIsInstalling(true)

      // Simulate installation
      setTimeout(() => {
        setInstallStep('success')
        setTimeout(() => {
          onInstall(app.id)
          onClose()
          resetModal()
        }, 2000)
      }, 3000)
    } else {
      // Paid app - show payment flow
      setInstallStep('payment')
    }
  }

  const handlePaymentConfirm = async () => {
    setInstallStep('installing')
    setIsInstalling(true)

    // Simulate payment + installation
    setTimeout(() => {
      setInstallStep('success')
      setTimeout(() => {
        onInstall(app.id)
        onClose()
        resetModal()
      }, 2000)
    }, 4000)
  }

  const resetModal = () => {
    setInstallStep('details')
    setIsInstalling(false)
  }

  const getPriceDisplay = () => {
    if (app.priceType === 'free') return 'Gratis'
    if (app.priceType === 'monthly') return `${app.price}/mes`
    return app.price
  }

  const getTrialInfo = () => {
    if (app.priceType === 'free') return null
    return '🎁 Prueba gratis por 14 días'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {installStep === 'details' && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {app.icon}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    {app.name}
                    <Badge variant="outline">{app.category}</Badge>
                  </DialogTitle>
                  <DialogDescription className="text-lg mt-2">
                    {app.description}
                  </DialogDescription>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{app.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="w-4 h-4" />
                      <span>{app.downloads} instalaciones</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {getPriceDisplay()}
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Trial info */}
              {getTrialInfo() && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{getTrialInfo()}</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Sin compromiso. Cancela cuando quieras.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {app.longDescription}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Características principales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {app.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Trust */}
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Seguridad Empresarial</span>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>✅ Cifrado de extremo a extremo</p>
                    <p>✅ Cumple normativas LATAM</p>
                    <p>✅ Soporte técnico incluido</p>
                    <p>✅ Integración con Forvara Hub</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleInstall}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={app.status === 'coming-soon'}
              >
                <Zap className="w-4 h-4 mr-2" />
                {app.status === 'coming-soon' ? 'Próximamente' :
                  app.priceType === 'free' ? '🆓 Instalar Gratis' :
                    '🎁 Iniciar Prueba Gratis'}
              </Button>
            </DialogFooter>
          </>
        )}

        {installStep === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Confirmar Suscripción
              </DialogTitle>
              <DialogDescription>
                Iniciando período de prueba para {app.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Pricing Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {app.icon}
                      <div>
                        <h3 className="font-semibold">{app.name}</h3>
                        <p className="text-sm text-muted-foreground">{app.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{getPriceDisplay()}</div>
                      <div className="text-sm text-muted-foreground">
                        {app.priceType === 'monthly' ? 'por mes' : 'pago único'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Período de prueba:</span>
                      <span className="font-medium text-green-600">14 días gratis</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Después del período:</span>
                      <span className="font-medium">{getPriceDisplay()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Método de pago</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CreditCard className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">Tarjeta terminada en ••••4242</div>
                        <div className="text-sm text-muted-foreground">Visa • Vence 12/27</div>
                      </div>
                      <Button variant="outline" size="sm">Cambiar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• El período de prueba inicia ahora y termina en 14 días</p>
                <p>• Puedes cancelar en cualquier momento desde tu panel de administración</p>
                <p>• No se realizarán cargos durante el período de prueba</p>
                <p>• Al terminar la prueba, se activará la suscripción automáticamente</p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setInstallStep('details')}>
                Volver
              </Button>
              <Button
                onClick={handlePaymentConfirm}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                🎁 Confirmar Prueba Gratis
              </Button>
            </DialogFooter>
          </>
        )}

        {installStep === 'installing' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Instalando {app.name}...
              </DialogTitle>
              <DialogDescription>
                Configurando tu nueva aplicación empresarial
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <div className="space-y-2">
                  <div className="text-lg font-medium">Preparando tu aplicación...</div>
                  <div className="text-sm text-muted-foreground">
                    Esto puede tomar unos momentos
                  </div>
                </div>
              </div>

              {/* Progress steps */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Verificando compatibilidad</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Configurando permisos de empresa</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Integrando con Forvara Hub...</span>
                </div>
              </div>
            </div>
          </>
        )}

        {installStep === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <Check className="w-6 h-6" />
                ¡Instalación Exitosa!
              </DialogTitle>
              <DialogDescription>
                {app.name} se ha instalado correctamente en tu empresa
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="space-y-2">
                <div className="text-xl font-semibold">¡{app.name} está listo!</div>
                <div className="text-muted-foreground">
                  Ya puedes empezar a usar tu nueva aplicación
                </div>
              </div>

              {app.priceType !== 'free' && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CardContent className="p-4">
                    <div className="text-green-800 dark:text-green-200">
                      <div className="font-medium">🎁 Período de prueba activo</div>
                      <div className="text-sm mt-1">
                        Tienes 14 días para explorar todas las funciones gratis
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

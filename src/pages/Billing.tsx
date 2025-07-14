import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Settings
} from 'lucide-react'

interface BillingInfo {
  customer_id?: string
  subscriptions: Subscription[]
  payment_methods: PaymentMethod[]
  invoices: Invoice[]
  usage: {
    storage_used_gb: number
    storage_limit_gb: number
    users_count: number
    apps_installed: number
  }
}

interface Subscription {
  id: string
  app_name: string
  plan_name: string
  status: string
  current_period_start: string
  current_period_end: string
  amount: number
  currency: string
  billing_cycle: string
  trial_end?: string
}

interface PaymentMethod {
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  is_default: boolean
}

interface Invoice {
  id: string
  amount_paid: number
  currency: string
  status: string
  created: number
  invoice_pdf?: string
  description: string
}

export default function Billing() {
  const { currentCompany } = useAuthStore()
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingPortal, setLoadingPortal] = useState(false)

  useEffect(() => {
    if (currentCompany) {
      loadBillingInfo()
    }
  }, [currentCompany])

  const loadBillingInfo = async () => {
    try {
      const response = await api.get('/billing/info')
      setBillingInfo(response.data.data)
    } catch (error) {
      console.error('Failed to load billing info:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async () => {
    setLoadingPortal(true)
    try {
      const response = await api.post('/billing/portal', {
        return_url: window.location.href
      })
      window.open(response.data.data.portal_url, '_blank')
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to open billing portal')
    } finally {
      setLoadingPortal(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      past_due: { className: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
      canceled: { className: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
      trialing: { className: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
      incomplete: { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle },
      paid: { className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      open: { className: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
      void: { className: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
    }
    
    const variant = variants[status] || variants.active
    const IconComponent = variant.icon
    
    return (
      <Badge className={`${variant.className} border flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        <span className="capitalize">{status.replace('_', ' ')}</span>
      </Badge>
    )
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-PA', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (timestamp: string | number) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000)
    return date.toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información de facturación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-blue-600" />
            Facturación y Pagos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus suscripciones, métodos de pago y historial de facturación
          </p>
        </div>
        
        <Button onClick={openCustomerPortal} disabled={loadingPortal} className="bg-blue-600 hover:bg-blue-700">
          <Settings className="w-4 h-4 mr-2" />
          {loadingPortal ? 'Abriendo...' : 'Portal de Cliente'}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {billingInfo?.subscriptions.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Suscripciones Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {billingInfo?.usage.storage_used_gb.toFixed(1) || '0.0'}GB
                </p>
                <p className="text-sm text-muted-foreground">
                  de {billingInfo?.usage.storage_limit_gb || 5}GB usados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {billingInfo?.usage.users_count || 0}
                </p>
                <p className="text-sm text-muted-foreground">Usuarios en equipo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {billingInfo?.usage.apps_installed || 0}
                </p>
                <p className="text-sm text-muted-foreground">Apps Instaladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Suscripciones Activas</CardTitle>
          <CardDescription>
            Tus planes y suscripciones actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingInfo?.subscriptions.length ? (
            <div className="space-y-4">
              {billingInfo.subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                      {subscription.app_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{subscription.app_name}</h3>
                        {getStatusBadge(subscription.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Plan: {subscription.plan_name}</span>
                        <span>•</span>
                        <span>
                          {formatCurrency(subscription.amount, subscription.currency)}
                          /{subscription.billing_cycle === 'monthly' ? 'mes' : 'año'}
                        </span>
                        <span>•</span>
                        <span>Próximo cobro: {formatDate(subscription.current_period_end)}</span>
                      </div>
                      {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
                        <div className="text-sm text-blue-600 mt-1">
                          🎉 Trial hasta {formatDate(subscription.trial_end)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {formatCurrency(subscription.amount, subscription.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {subscription.billing_cycle === 'monthly' ? 'Mensual' : 'Anual'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes suscripciones activas</p>
              <p className="text-sm text-muted-foreground mt-1">
                Visita el marketplace para suscribirte a aplicaciones
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
          <CardDescription>
            Tarjetas y métodos de pago configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingInfo?.payment_methods.length ? (
            <div className="space-y-3">
              {billingInfo.payment_methods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {method.card?.brand} •••• {method.card?.last4}
                        </span>
                        {method.is_default && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Principal
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expira {method.card?.exp_month}/{method.card?.exp_year}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay métodos de pago configurados</p>
              <Button className="mt-4" onClick={openCustomerPortal}>
                Agregar Método de Pago
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Facturación</CardTitle>
          <CardDescription>
            Tus facturas e historial de pagos recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingInfo?.invoices.length ? (
            <div className="space-y-3">
              {billingInfo.invoices.slice(0, 10).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {invoice.description || `Factura ${invoice.id.slice(-8)}`}
                        </span>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(invoice.created)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(invoice.amount_paid, invoice.currency)}
                      </p>
                    </div>
                    {invoice.invoice_pdf && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay facturas disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Contact */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ExternalLink className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                ¿Necesitas ayuda con tu facturación?
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta sobre 
                facturación, suscripciones o pagos.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                  Contactar Soporte
                </Button>
                <Button onClick={openCustomerPortal} className="bg-blue-600 hover:bg-blue-700">
                  Portal de Cliente
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
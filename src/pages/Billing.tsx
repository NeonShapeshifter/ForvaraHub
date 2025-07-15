import React, { useState, useEffect } from 'react'
import { CreditCard, FileText, Download, Calendar, ChevronRight, Building2, AlertCircle, CheckCircle, Package, Users, HardDrive, ExternalLink, Plus, X, MoreHorizontal, DollarSign } from 'lucide-react'

// TODO: Importar desde los archivos reales del proyecto
// import { useAuthStore } from '../stores/authStore'
// import { billingService } from '../services/billing.service'
// import { toast } from '../hooks/use-toast'

// Estado vacío cuando no hay empresa
const NoCompanyState = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tienes una empresa
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Para gestionar facturación, primero necesitas crear una empresa.
        </p>
        <button 
          onClick={() => window.location.href = '/companies'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          Crear mi primera empresa
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Estado sin permisos
const NoPermissionState = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Sin acceso a Facturación
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Solo los propietarios pueden gestionar la facturación.
        </p>
      </div>
    </div>
  )
}

// Componente de suscripción
const SubscriptionCard = ({ subscription }: { subscription: any }) => {
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'trialing': return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case 'canceled': return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('es-PA', {
      style: 'currency',
      currency: currency
    }).format(amount / 100)
  }

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {subscription.app_name}
              </h4>
              {getStatusIndicator(subscription.status)}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{subscription.plan_name}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{formatCurrency(subscription.amount, subscription.currency)}/{subscription.billing_cycle === 'monthly' ? 'mes' : 'año'}</span>
              {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
                <span className="text-blue-600 dark:text-blue-400">
                  Prueba hasta {new Date(subscription.trial_end).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

// Componente de método de pago
const PaymentMethodCard = ({ method }: { method: any }) => {
  const cardBrands = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover'
  }

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {cardBrands[method.brand as keyof typeof cardBrands] || method.brand} •••• {method.last4}
            </p>
            <p className="text-xs text-gray-500">
              Expira {method.exp_month}/{method.exp_year}
            </p>
          </div>
        </div>
        {method.is_default && (
          <span className="text-xs text-gray-500">Por defecto</span>
        )}
      </div>
    </div>
  )
}

// Componente principal de Billing
export default function Billing() {
  // TODO: Obtener desde el store real
  // const { currentCompany, userRole } = useAuthStore()
  
  // Valores temporales para desarrollo
  const currentCompany = { id: 'temp-company' } // TODO: Reemplazar con store real
  const userRole = 'owner' // TODO: Reemplazar con store real
  
  const [loading, setLoading] = useState(true)
  const [billingInfo, setBillingInfo] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Solo owners pueden ver billing
  const canViewBilling = userRole === 'owner'

  useEffect(() => {
    if (currentCompany && currentCompany.id !== 'no-company' && canViewBilling) {
      loadBillingInfo()
    } else {
      setLoading(false)
    }
  }, [currentCompany, canViewBilling])

  const loadBillingInfo = async () => {
    try {
      setLoading(true)
      
      // TODO: Conectar con el servicio real
      // const info = await billingService.getBillingInfo()
      // setBillingInfo(info)
      
      // Simulación temporal
      setTimeout(() => {
        setBillingInfo({
          current_plan: null,
          subscriptions: [],
          payment_methods: [],
          invoices: [],
          usage: {
            storage_used_gb: 0,
            storage_limit_gb: 5,
            users_count: 0,
            apps_installed: 0
          }
        })
        setLoading(false)
      }, 1000)
      
    } catch (error) {
      console.error('Error loading billing info:', error)
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('es-PA', {
      style: 'currency',
      currency: currency
    }).format(amount / 100)
  }

  const handlePortalAccess = async () => {
    try {
      // TODO: Conectar con el servicio real
      // const { portal_url } = await billingService.createCustomerPortalSession()
      // window.open(portal_url, '_blank')
      
      console.log('Abriendo portal de Stripe...')
    } catch (error) {
      console.error('Error opening billing portal:', error)
    }
  }

  // Si no hay empresa
  if (!currentCompany || currentCompany.id === 'no-company') {
    return <NoCompanyState />
  }

  // Si no tiene permisos
  if (!canViewBilling) {
    return <NoPermissionState />
  }

  // Si está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando información de facturación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Facturación
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Gestiona tus suscripciones, métodos de pago y facturas
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-500" />
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(billingInfo?.subscriptions?.reduce((sum: number, sub: any) => 
                    sum + (sub.status === 'active' ? sub.amount : 0), 0
                  ) || 0)}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Gasto mensual</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {billingInfo?.subscriptions?.length || 0}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Suscripciones</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-500" />
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {billingInfo?.usage?.users_count || 0}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Usuarios</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-orange-600 dark:text-orange-500" />
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {billingInfo?.usage?.storage_used_gb?.toFixed(1) || 0} GB
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Almacenamiento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
            {[
              { value: 'overview', label: 'Resumen' },
              { value: 'subscriptions', label: 'Suscripciones' },
              { value: 'invoices', label: 'Facturas' },
              { value: 'payment', label: 'Métodos de pago' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 rounded-md transition-all text-sm font-medium ${
                  activeTab === tab.value
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Plan actual
              </h3>
              {billingInfo?.current_plan ? (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Plan activo</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No tienes un plan activo</p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium">
                    Ver planes disponibles
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Portal de cliente
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Accede al portal de Stripe para gestionar tu facturación, actualizar métodos de pago y descargar facturas.
                  </p>
                  <button 
                    onClick={handlePortalAccess}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    Abrir portal de cliente
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suscripciones activas
              </h3>
            </div>
            {billingInfo?.subscriptions?.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {billingInfo.subscriptions.map((sub: any) => (
                  <SubscriptionCard key={sub.id} subscription={sub} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-1">No tienes suscripciones activas</p>
                <p className="text-sm text-gray-400 mb-4">Visita el marketplace para suscribirte a aplicaciones</p>
                <button 
                  onClick={() => window.location.href = '/marketplace'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Explorar marketplace
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Historial de facturas
              </h3>
            </div>
            {billingInfo?.invoices?.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {billingInfo.invoices.map((invoice: any) => (
                  <div key={invoice.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Factura #{invoice.id.slice(-8)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(invoice.created).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(invoice.amount_paid, invoice.currency)}
                        </span>
                        {invoice.invoice_pdf && (
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No hay facturas disponibles</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Métodos de pago
                </h3>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Añadir método
                </button>
              </div>
            </div>
            {billingInfo?.payment_methods?.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {billingInfo.payment_methods.map((method: any) => (
                  <PaymentMethodCard key={method.id} method={method} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No hay métodos de pago configurados</p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Añadir tarjeta
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

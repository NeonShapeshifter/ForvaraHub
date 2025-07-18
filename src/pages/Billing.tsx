// ForvaraHub/src/pages/Billing.tsx

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import {
  CreditCard,
  Package,
  Receipt,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'

// Loading skeleton
const BillingSkeleton = () => (
  <div className="space-y-6">
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="skeleton h-32 rounded mb-4"></div>
        <div className="skeleton h-10 rounded w-32"></div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="skeleton h-48 rounded"></div>
        </CardContent>
      </Card>
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="skeleton h-48 rounded"></div>
        </CardContent>
      </Card>
    </div>
  </div>
)

// Empty state
const EmptyBillingState = () => (
  <div className="space-y-6">
    {/* Estado actual */}
    <Card className="shadow-card border-orange-200 bg-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-900">Período de prueba activo</h3>
            <p className="text-sm text-orange-700 mt-1">
              Estás en el período de prueba gratuito. Tienes acceso completo a todas las funciones.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div>
                <p className="text-xs text-orange-600">Días restantes</p>
                <p className="text-2xl font-bold text-orange-900">30</p>
              </div>
              <div className="h-12 w-px bg-orange-300"></div>
              <div>
                <p className="text-xs text-orange-600">Finaliza el</p>
                <p className="text-sm font-medium text-orange-900">16 de febrero, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Planes disponibles */}
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Elige tu plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan Básico */}
        <Card className="shadow-card hover:shadow-md transition-fast">
          <CardHeader>
            <CardTitle className="text-lg">Básico</CardTitle>
            <CardDescription>Para equipos pequeños</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gradient">$29</span>
              <span className="text-gray-500">/mes</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Hasta 10 usuarios</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>50 GB de almacenamiento</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Soporte por email</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">
              Seleccionar plan
            </Button>
          </CardContent>
        </Card>

        {/* Plan Pro - Recomendado */}
        <Card className="shadow-card hover:shadow-md transition-fast border-2 border-blue-500 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 gradient-brand text-white text-xs font-medium rounded-full">
            Recomendado
          </div>
          <CardHeader>
            <CardTitle className="text-lg">Pro</CardTitle>
            <CardDescription>Para empresas en crecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gradient">$79</span>
              <span className="text-gray-500">/mes</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Hasta 50 usuarios</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>500 GB de almacenamiento</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Soporte prioritario 24/7</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>API access</span>
              </li>
            </ul>
            <Button className="w-full gradient-brand">
              Seleccionar plan
            </Button>
          </CardContent>
        </Card>

        {/* Plan Enterprise */}
        <Card className="shadow-card hover:shadow-md transition-fast">
          <CardHeader>
            <CardTitle className="text-lg">Enterprise</CardTitle>
            <CardDescription>Para grandes organizaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-2xl font-bold text-gradient">Personalizado</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Usuarios ilimitados</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Almacenamiento ilimitado</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Soporte dedicado</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>SLA personalizado</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">
              Contactar ventas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Información adicional */}
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Información de facturación</CardTitle>
        <CardDescription>Configura tu método de pago para cuando finalice el período de prueba</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay métodos de pago configurados</p>
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Agregar método de pago
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function Billing() {
  const { currentCompany } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentCompany])

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Facturación"
          description="Gestiona tu suscripción y métodos de pago"
        />
        <BillingSkeleton />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Facturación"
        description="Gestiona tu suscripción y métodos de pago"
        actions={
          <Button variant="outline" size="sm">
            <Receipt className="w-4 h-4 mr-2" />
            Ver facturas
          </Button>
        }
      />

      <EmptyBillingState />
    </PageContainer>
  )
}

import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Users, Clock, DollarSign } from 'lucide-react'
import { formatCurrency, daysUntil } from '@/lib/utils'

export default function Dashboard() {
  const { user, currentCompany } = useAuthStore()
  
  const trialDaysLeft = currentCompany?.trial_ends_at 
    ? daysUntil(currentCompany.trial_ends_at)
    : 0
    
  const storageUsedPercent = currentCompany 
    ? (currentCompany.storage_used_bytes / (currentCompany.storage_limit_gb * 1024 * 1024 * 1024)) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenido, {user?.first_name}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Panel de administración de Forvara Hub
        </p>
      </div>

      {/* Trial Warning */}
      {currentCompany?.status === 'trial' && trialDaysLeft <= 7 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
              <Clock className="w-5 h-5 mr-2" />
              Periodo de prueba
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Te quedan {trialDaysLeft} días de prueba. Actualiza tu plan para continuar.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Company Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empresa Actual
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCompany?.razon_social || 'Sin empresa'}</div>
            <p className="text-xs text-muted-foreground">
              RUC: {currentCompany?.ruc || 'N/A'}
            </p>
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              de {currentCompany?.slots_limit || 50} slots disponibles
            </p>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Almacenamiento
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUsedPercent.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {currentCompany?.storage_limit_gb || 5} GB disponibles
            </p>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${
              currentCompany?.status === 'trial' ? 'text-orange-600' :
              currentCompany?.status === 'active' ? 'text-green-600' :
              'text-gray-600'
            }`}>
              {currentCompany?.status || 'Inactivo'}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentCompany?.status === 'trial' && `${trialDaysLeft} días restantes`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas comunes de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Gestionar usuarios
            </div>
            <div className="text-sm text-muted-foreground">
              • Configurar aplicaciones
            </div>
            <div className="text-sm text-muted-foreground">
              • Ver reportes
            </div>
            <div className="text-sm text-muted-foreground">
              • Administrar facturación
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Usuario</CardTitle>
            <CardDescription>
              Detalles de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium">Nombre Completo</div>
              <div className="text-sm text-muted-foreground">
                {user?.first_name} {user?.last_name}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm text-muted-foreground">
                {user?.email || 'No configurado'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Teléfono</div>
              <div className="text-sm text-muted-foreground">
                {user?.phone || 'No configurado'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">País</div>
              <div className="text-sm text-muted-foreground">
                {user?.country_code} - {user?.currency_code}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
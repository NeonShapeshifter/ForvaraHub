import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { 
  Building2, 
  Plus, 
  Users, 
  Calendar, 
  Package,
  ExternalLink,
  Crown,
  Settings
} from 'lucide-react'

interface Company {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  storage_used_bytes: number
  status: string
  created_at: string
  updated_at: string
  user_role: string
  joined_at: string
}

export default function Companies() {
  const { setCurrentCompany } = useAuthStore()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  
  // Create company form
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      const response = await api.get('/tenants')
      setCompanies(response.data.data || [])
    } catch (error) {
      console.error('Failed to load companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    
    try {
      const response = await api.post('/tenants', {
        name: companyName,
        description: companyDescription
      })
      
      setCompanies([response.data.data, ...companies])
      setCompanyName('')
      setCompanyDescription('')
      setCreateModalOpen(false)
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to create company')
    } finally {
      setCreating(false)
    }
  }

  const switchCompany = (company: Company) => {
    setCurrentCompany(company)
    // Optionally redirect to dashboard
    window.location.href = '/dashboard'
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      owner: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      admin: 'bg-blue-100 text-blue-800 border-blue-200',
      member: 'bg-green-100 text-green-800 border-green-200',
      viewer: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    return (
      <Badge className={`${variants[role] || variants.member} border`}>
        {role === 'owner' && <Crown className="w-3 h-3 mr-1" />}
        <span className="capitalize">{role}</span>
      </Badge>
    )
  }

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return gb < 0.1 ? '< 0.1 GB' : `${gb.toFixed(1)} GB`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando empresas...</p>
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
            <Building2 className="w-8 h-8 text-blue-600" />
            Mis Empresas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y cambia entre tus empresas
          </p>
        </div>
        
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Empresa</DialogTitle>
              <DialogDescription>
                Crea una nueva empresa para gestionar tu equipo y aplicaciones
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={createCompany} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Empresa</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Mi Empresa S.A."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción (Opcional)</label>
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="Descripción de tu empresa..."
                  className="w-full p-2 border border-input rounded-md bg-background min-h-[80px] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={creating}
                  className="flex-1"
                >
                  {creating ? 'Creando...' : 'Crear Empresa'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{companies.length}</p>
                <p className="text-sm text-muted-foreground">Empresas Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {companies.filter(c => c.user_role === 'owner').length}
                </p>
                <p className="text-sm text-muted-foreground">Como Owner</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {companies.filter(c => ['admin', 'member'].includes(c.user_role)).length}
                </p>
                <p className="text-sm text-muted-foreground">Como Miembro</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-lg">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleBadge(company.user_role)}
                    </div>
                  </div>
                </div>
              </div>
              {company.description && (
                <CardDescription className="mt-2">
                  {company.description}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Almacenamiento:</span>
                  <span className="font-medium">{formatStorage(company.storage_used_bytes)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge className={
                    company.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }>
                    {company.status === 'active' ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Te uniste:</span>
                  <span className="font-medium">
                    {new Date(company.joined_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-2 pt-3">
                  <Button 
                    onClick={() => switchCompany(company)}
                    className="flex-1"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Cambiar
                  </Button>
                  {['owner', 'admin'].includes(company.user_role) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        switchCompany(company)
                        setTimeout(() => window.location.href = '/settings', 100)
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tienes empresas</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primera empresa para comenzar a usar Forvara
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Empresa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
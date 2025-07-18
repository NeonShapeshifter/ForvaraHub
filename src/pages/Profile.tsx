// ForvaraHub/src/pages/Profile.tsx

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  MapPin,
  Globe,
  Briefcase,
  Award,
  Activity,
  Edit3,
  Share2,
  MoreVertical,
  Star,
  TrendingUp,
  Package,
  Users,
  Clock,
  Shield,
  Loader2,
  Camera
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { dashboardService } from '@/services/dashboard.service'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface ProfileUser {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  bio?: string
  avatar_url?: string
  role?: string
  company_count?: number
  created_at: string
  last_seen?: string
}

interface ProfileStats {
  companies: number
  apps_installed: number
  team_members: number
  storage_used: number
}

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'companies'>('overview')
  
  const isOwnProfile = !userId || userId === currentUser?.id

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Load user profile
      const userResponse = userId && userId !== currentUser?.id
        ? await api.get(`/users/${userId}`)
        : { data: currentUser }
      
      setProfileUser(userResponse.data)
      
      // Load stats (only for own profile or if public)
      if (isOwnProfile) {
        const statsResponse = await api.get('/user/stats')
        setStats(statsResponse.data)
        
        // Load recent activity
        const activityData = await dashboardService.getRecentActivity(10)
        setActivities(activityData)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      // Redirect to 404 or show error
      navigate('/404')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!profileUser) {
    return (
      <PageContainer>
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Usuario no encontrado
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              El perfil que buscas no existe o no tienes permisos para verlo.
            </p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Volver al dashboard
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const userInitials = `${profileUser.first_name?.charAt(0) || ''}${profileUser.last_name?.charAt(0) || ''}`

  return (
    <PageContainer>
      {/* Profile Header */}
      <Card className="shadow-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {profileUser.avatar_url ? (
                  <img 
                    src={profileUser.avatar_url} 
                    alt={`${profileUser.first_name} ${profileUser.last_name}`}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl gradient-brand flex items-center justify-center text-white font-bold text-2xl">
                    {userInitials}
                  </div>
                )}
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileUser.first_name} {profileUser.last_name}
                </h1>
                {profileUser.role && (
                  <Badge className="mt-2" variant="secondary">
                    {profileUser.role}
                  </Badge>
                )}
                <p className="text-gray-500 mt-2">
                  {profileUser.bio || 'Sin biografía'}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Miembro desde {new Date(profileUser.created_at).toLocaleDateString('es')}
                  </span>
                  {profileUser.last_seen && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Última vez {formatDistanceToNow(new Date(profileUser.last_seen), { locale: es, addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <Button onClick={() => navigate('/settings')}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar perfil
                </Button>
              ) : (
                <>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Mensaje
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats (only for own profile) */}
          {isOwnProfile && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.companies}</div>
                <div className="text-sm text-gray-500">Empresas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.apps_installed}</div>
                <div className="text-sm text-gray-500">Apps instaladas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.team_members}</div>
                <div className="text-sm text-gray-500">Miembros del equipo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(stats.storage_used / 1024 / 1024 / 1024).toFixed(1)} GB
                </div>
                <div className="text-sm text-gray-500">Almacenamiento usado</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {['overview', 'activity', 'companies'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-fast ${
              activeTab === tab
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab === 'overview' && 'Vista general'}
            {tab === 'activity' && 'Actividad'}
            {tab === 'companies' && 'Empresas'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileUser.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{isOwnProfile ? profileUser.email : '••••••@•••••.com'}</span>
                  </div>
                )}
                {profileUser.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{isOwnProfile ? profileUser.phone : '••••••••••'}</span>
                  </div>
                )}
                {!profileUser.email && !profileUser.phone && (
                  <p className="text-sm text-gray-500">No hay información de contacto disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Actividad reciente</CardTitle>
              </CardHeader>
              <CardContent>
                {isOwnProfile && activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-fast">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type.includes('login') ? 'bg-green-500' :
                          activity.type.includes('create') ? 'bg-blue-500' :
                          activity.type.includes('update') ? 'bg-yellow-500' :
                          activity.type.includes('delete') ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(activity.timestamp), { 
                              addSuffix: true, 
                              locale: es 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {activities.length > 5 && (
                      <div className="text-center pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab('activity')}
                        >
                          Ver toda la actividad
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      {isOwnProfile 
                        ? 'Tu actividad aparecerá aquí'
                        : 'No hay actividad pública disponible'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            {isOwnProfile && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Acciones rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/companies')}>
                    <Building className="w-4 h-4 mr-2" />
                    Gestionar empresas
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/my-apps')}>
                    <Package className="w-4 h-4 mr-2" />
                    Mis aplicaciones
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/settings')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Seguridad
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Badges/Achievements placeholder */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Logros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Los logros estarán disponibles pronto
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Historial de actividad</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-fast border border-gray-100">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${
                      activity.type.includes('login') ? 'bg-green-500' :
                      activity.type.includes('create') ? 'bg-blue-500' :
                      activity.type.includes('update') ? 'bg-yellow-500' :
                      activity.type.includes('delete') ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Badge variant={
                          activity.type.includes('login') ? 'default' :
                          activity.type.includes('create') ? 'secondary' :
                          activity.type.includes('update') ? 'outline' :
                          'destructive'
                        }>
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sin actividad registrada
                </h3>
                <p className="text-sm text-gray-500">
                  Tu actividad aparecerá aquí cuando interactúes con la plataforma
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'companies' && (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Empresas
            </h3>
            <p className="text-sm text-gray-500">
              {isOwnProfile 
                ? 'Aquí verás las empresas en las que participas'
                : 'Las empresas públicas aparecerán aquí'}
            </p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}

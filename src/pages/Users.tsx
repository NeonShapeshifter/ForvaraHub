import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { PhoneInputField } from '@/components/ui/phone-input'
import { usePhoneValidation } from '@/hooks/usePhoneValidation'
import { 
  Users as UsersIcon, 
  UserPlus, 
  Mail, 
  Phone, 
  Crown, 
  Shield, 
  Eye, 
  User,
  MoreVertical,
  Trash2,
  Edit,
  Clock
} from 'lucide-react'

interface Member {
  id: string
  role: string
  status: string
  joined_at: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
    avatar_url?: string
  }
}

interface Invitation {
  id: string
  invite_email?: string
  invite_phone?: string
  role: string
  status: string
  created_at: string
  expires_at: string
  inviter: {
    id: string
    name: string
    email: string
  }
}

export default function Users() {
  const { currentCompany } = useAuthStore()
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  
  // Invite form state
  const [inviteMethod, setInviteMethod] = useState<'email' | 'phone'>('email')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviteLoading, setInviteLoading] = useState(false)

  const phoneValidation = usePhoneValidation({
    value: inviteMethod === 'phone' ? invitePhone : undefined,
    required: inviteMethod === 'phone'
  })

  useEffect(() => {
    if (currentCompany) {
      loadMembers()
      loadInvitations()
    }
  }, [currentCompany])

  const loadMembers = async () => {
    try {
      const response = await api.get(`/tenants/${currentCompany?.id}/members`)
      setMembers(response.data.data || [])
    } catch (error) {
      console.error('Failed to load members:', error)
    }
  }

  const loadInvitations = async () => {
    try {
      const response = await api.get(`/tenants/${currentCompany?.id}/invitations`)
      setInvitations(response.data.data || [])
    } catch (error) {
      console.error('Failed to load invitations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inviteMethod === 'phone' && !phoneValidation.isValid) return

    setInviteLoading(true)
    try {
      const payload = {
        role: inviteRole,
        ...(inviteMethod === 'email' ? { email: inviteEmail } : { phone: phoneValidation.e164Format || invitePhone })
      }

      await api.post(`/tenants/${currentCompany?.id}/invite`, payload)
      
      // Reset form
      setInviteEmail('')
      setInvitePhone('')
      setInviteRole('member')
      setInviteModalOpen(false)
      
      // Reload data
      loadInvitations()
    } catch (error: any) {
      console.error('Failed to invite user:', error)
      alert(error.response?.data?.error?.message || 'Failed to invite user')
    } finally {
      setInviteLoading(false)
    }
  }

  const changeRole = async (memberId: string, newRole: string) => {
    try {
      await api.patch(`/tenants/${currentCompany?.id}/members/${memberId}/role`, { role: newRole })
      loadMembers()
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to change role')
    }
  }

  const removeMember = async (memberId: string) => {
    if (!confirm('¿Estás seguro de que quieres remover este miembro?')) return
    
    try {
      await api.delete(`/tenants/${currentCompany?.id}/members/${memberId}`)
      loadMembers()
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to remove member')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin': return <Shield className="w-4 h-4 text-blue-600" />
      case 'viewer': return <Eye className="w-4 h-4 text-gray-600" />
      default: return <User className="w-4 h-4 text-green-600" />
    }
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
        {getRoleIcon(role)}
        <span className="ml-1 capitalize">{role}</span>
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando equipo...</p>
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
            <UsersIcon className="w-8 h-8 text-blue-600" />
            Gestión de Equipo
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los miembros de tu empresa y sus permisos
          </p>
        </div>
        
        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Invitar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Invita a un nuevo miembro a tu empresa por email o teléfono
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleInvite} className="space-y-4">
              {/* Method Toggle */}
              <div className="flex rounded-lg border-2 border-muted/20 p-1 bg-muted/5">
                <button
                  type="button"
                  onClick={() => setInviteMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    inviteMethod === 'email'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setInviteMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    inviteMethod === 'phone'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Teléfono
                </button>
              </div>

              {/* Contact Input */}
              {inviteMethod === 'email' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email del Usuario</label>
                  <Input
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <PhoneInputField
                  label="Teléfono del Usuario"
                  value={invitePhone}
                  onChange={(value) => setInvitePhone(value || '')}
                  error={phoneValidation.error || undefined}
                  placeholder="Ingresa el número de teléfono"
                  required
                />
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol del Usuario</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="viewer">👁️ Viewer - Solo lectura</option>
                  <option value="member">👤 Member - Acceso estándar</option>
                  <option value="admin">🛡️ Admin - Gestión de equipo</option>
                  <option value="owner">👑 Owner - Control total</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={inviteLoading || (inviteMethod === 'phone' && !phoneValidation.isValid)}
                  className="flex-1"
                >
                  {inviteLoading ? 'Invitando...' : 'Enviar Invitación'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-muted-foreground">Miembros Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invitations.length}</p>
                <p className="text-sm text-muted-foreground">Invitaciones Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {members.filter(m => ['owner', 'admin'].includes(m.role)).length}
                </p>
                <p className="text-sm text-muted-foreground">Administradores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>
            Gestiona los roles y permisos de los miembros de tu empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                    {member.user.first_name?.charAt(0) || member.user.email?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{member.user.first_name && member.user.last_name ? `${member.user.first_name} ${member.user.last_name}` : member.user.email || 'Sin nombre'}</h3>
                      {getRoleBadge(member.role)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {member.user.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.user.email}
                        </span>
                      )}
                      {member.user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {member.user.phone}
                        </span>
                      )}
                      <span>Desde {new Date(member.joined_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={member.role}
                    onChange={(e) => changeRole(member.id, e.target.value)}
                    className="text-sm border border-input rounded px-2 py-1 bg-background"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invitaciones Pendientes</CardTitle>
            <CardDescription>
              Invitaciones que están esperando respuesta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {invitation.invite_email || invitation.invite_phone}
                        </span>
                        {getRoleBadge(invitation.role)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Invitado por {invitation.inviter.first_name} {invitation.inviter.last_name} • Expira {new Date(invitation.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
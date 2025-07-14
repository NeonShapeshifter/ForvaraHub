import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { 
  User, 
  Key, 
  Bell, 
  Save,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

export default function Settings() {
  const { currentCompany, user, updateUser } = useAuthStore()
  
  // Company settings
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [companyLogoUrl, setCompanyLogoUrl] = useState('')
  const [companySaving, setCompanySaving] = useState(false)
  
  // User settings
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userSaving, setUserSaving] = useState(false)
  
  // Password settings
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [notificationsSaving, setNotificationsSaving] = useState(false)

  useEffect(() => {
    if (currentCompany) {
      setCompanyName(currentCompany.razon_social || '')
      setCompanyDescription(currentCompany.description || '')
      setCompanyLogoUrl(currentCompany.logo_url || '')
    }
  }, [currentCompany])

  useEffect(() => {
    if (user) {
      setUserName(`${user.first_name} ${user.last_name}` || '')
      setUserEmail(user.email || '')
      setUserPhone(user.phone || '')
    }
  }, [user])

  const saveCompanySettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCompany) return

    setCompanySaving(true)
    try {
      const response = await api.patch(`/tenants/${currentCompany.id}`, {
        name: companyName,
        description: companyDescription,
        logo_url: companyLogoUrl
      })
      
      // Update local state if needed
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to update company')
    } finally {
      setCompanySaving(false)
    }
  }

  const saveUserSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUserSaving(true)
    try {
      const response = await api.patch(`/users/${user.id}`, {
        name: userName,
        email: userEmail,
        phone: userPhone
      })
      
      updateUser(response.data.data)
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to update profile')
    } finally {
      setUserSaving(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    
    if (newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setPasswordSaving(true)
    try {
      await api.patch('/auth/password', {
        current_password: currentPassword,
        new_password: newPassword
      })
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      alert('Contraseña actualizada correctamente')
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  const saveNotificationSettings = async () => {
    setNotificationsSaving(true)
    try {
      await api.patch('/users/notifications', {
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        marketing_emails: marketingEmails
      })
      alert('Preferencias de notificación actualizadas')
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to update notifications')
    } finally {
      setNotificationsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          Configuración
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra la configuración de tu empresa y perfil personal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Configuración de Empresa
            </CardTitle>
            <CardDescription>
              Información y configuración de tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveCompanySettings} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Empresa</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nombre de tu empresa"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="Descripción de tu empresa"
                  className="w-full p-2 border border-input rounded-md bg-background min-h-[80px] resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo URL</label>
                <Input
                  type="url"
                  value={companyLogoUrl}
                  onChange={(e) => setCompanyLogoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/logo.png"
                />
              </div>
              
              <Button type="submit" disabled={companySaving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {companySaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Perfil Personal
            </CardTitle>
            <CardDescription>
              Tu información personal y de contacto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveUserSettings} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre Completo</label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+507 1234-5678"
                />
              </div>
              
              <Button type="submit" disabled={userSaving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {userSaving ? 'Guardando...' : 'Actualizar Perfil'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-orange-600" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>
              Actualiza tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={changePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña Actual</label>
                <div className="relative">
                  <Input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Tu contraseña actual"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nueva Contraseña</label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña (mín. 8 caracteres)"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Nueva Contraseña</label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPasswords ? 'Ocultar' : 'Mostrar'} contraseñas
                </button>
              </div>
              
              <Button type="submit" disabled={passwordSaving} className="w-full">
                <Key className="w-4 h-4 mr-2" />
                {passwordSaving ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Preferencias de Notificación
            </CardTitle>
            <CardDescription>
              Controla cómo y cuándo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificaciones por Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones importantes por email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificaciones SMS</h4>
                  <p className="text-sm text-muted-foreground">
                    Recibir alertas críticas por SMS
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Emails de Marketing</h4>
                  <p className="text-sm text-muted-foreground">
                    Recibir noticias y promociones de Forvara
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <Button onClick={saveNotificationSettings} disabled={notificationsSaving} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              {notificationsSaving ? 'Guardando...' : 'Guardar Preferencias'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Zona de Peligro
          </CardTitle>
          <CardDescription>
            Acciones irreversibles que afectarán tu cuenta o empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-medium text-red-600 mb-2">Eliminar Empresa</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Esta acción eliminará permanentemente tu empresa y todos los datos asociados. 
                Esta acción no se puede deshacer.
              </p>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Eliminar Empresa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
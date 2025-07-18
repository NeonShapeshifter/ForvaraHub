// ForvaraHub/src/pages/Settings.tsx

import React, { useState, useEffect } from 'react'
import {
  User,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Building,
  Palette,
  Moon,
  Sun,
  Monitor,
  Key,
  Mail,
  Phone,
  Camera,
  Save,
  AlertCircle,
  Check,
  ChevronRight,
  LogOut,
  Trash2,
  Download,
  Upload
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/authStore'
import { PhoneInputField } from '@/components/ui/phone-input'
import { usePhoneValidation } from '@/hooks/usePhoneValidation'
import { useNotifications } from '@/components/ui/notifications'
import { api } from '@/services/api'

type SettingsTab = 'profile' | 'account' | 'notifications' | 'security' | 'appearance' | 'billing'

interface UserSettings {
  // Profile
  first_name: string
  last_name: string
  email: string
  phone: string
  avatar_url?: string
  bio?: string

  // Preferences
  language: 'es' | 'en' | 'pt'
  timezone: string

  // Notifications
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  marketing_emails: boolean

  // Security
  two_factor_enabled: boolean

  // Appearance
  theme: 'light' | 'dark' | 'system'
}

export default function Settings() {
  const { user, updateUser } = useAuthStore()
  const { addNotification } = useNotifications()

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [settings, setSettings] = useState<UserSettings>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: user?.preferred_language || 'es',
    timezone: user?.timezone || 'America/Panama',
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    two_factor_enabled: false,
    theme: 'system'
  })

  const phoneValidation = usePhoneValidation({
    value: settings.phone,
    required: false
  })

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'account', label: 'Cuenta', icon: Building },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'billing', label: 'Facturación', icon: CreditCard }
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/user/settings')
      setSettings(prev => ({ ...prev, ...response.data }))
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      await api.put('/user/settings', settings)

      // Update local user data
      updateUser({
        first_name: settings.first_name,
        last_name: settings.last_name,
        email: settings.email,
        phone: settings.phone,
        preferred_language: settings.language,
        timezone: settings.timezone
      })

      addNotification({
        type: 'success',
        title: 'Configuración guardada',
        message: 'Tus cambios han sido guardados exitosamente'
      })

      setHasChanges(false)
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error al guardar',
        message: 'No se pudieron guardar los cambios. Intenta de nuevo.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Avatar upload functionality would go here
    console.log('Avatar upload clicked - feature to be implemented')
    addNotification({
      type: 'info',
      title: 'Función en desarrollo',
      message: 'La carga de avatar estará disponible pronto'
    })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>
                Actualiza tu información de perfil y cómo otros te ven
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl gradient-brand flex items-center justify-center text-white font-bold text-2xl">
                    {settings.first_name.charAt(0)}{settings.last_name.charAt(0)}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Foto de perfil</h3>
                  <p className="text-sm text-gray-500">JPG, GIF o PNG. Máximo 1MB.</p>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input
                    id="first_name"
                    value={settings.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    value={settings.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <PhoneInputField
                label="Teléfono"
                value={settings.phone}
                onChange={(value) => handleInputChange('phone', value)}
                error={phoneValidation.error}
              />

              <div>
                <Label htmlFor="bio">Biografía</Label>
                <textarea
                  id="bio"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cuéntanos sobre ti..."
                  value={settings.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 'notifications':
        return (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Preferencias de notificaciones</CardTitle>
              <CardDescription>
                Controla cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_notifications">Notificaciones por email</Label>
                    <p className="text-sm text-gray-500">
                      Recibe actualizaciones importantes en tu correo
                    </p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push_notifications">Notificaciones push</Label>
                    <p className="text-sm text-gray-500">
                      Recibe notificaciones en tu navegador
                    </p>
                  </div>
                  <Switch
                    id="push_notifications"
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => handleInputChange('push_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms_notifications">Notificaciones SMS</Label>
                    <p className="text-sm text-gray-500">
                      Recibe alertas críticas por mensaje de texto
                    </p>
                  </div>
                  <Switch
                    id="sms_notifications"
                    checked={settings.sms_notifications}
                    onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing_emails">Emails de marketing</Label>
                    <p className="text-sm text-gray-500">
                      Recibe noticias y ofertas especiales
                    </p>
                  </div>
                  <Switch
                    id="marketing_emails"
                    checked={settings.marketing_emails}
                    onCheckedChange={(checked) => handleInputChange('marketing_emails', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Seguridad de la cuenta</CardTitle>
                <CardDescription>
                  Mantén tu cuenta segura con estas opciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Cambiar contraseña</h4>
                      <p className="text-sm text-gray-500">Última actualización hace 3 meses</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Cambiar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Autenticación de dos factores</h4>
                      <p className="text-sm text-gray-500">
                        {settings.two_factor_enabled ? 'Activado' : 'Añade una capa extra de seguridad'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.two_factor_enabled}
                    onCheckedChange={(checked) => handleInputChange('two_factor_enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Descargar mis datos</h4>
                      <p className="text-sm text-gray-500">Obtén una copia de toda tu información</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Descargar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Zona de peligro</CardTitle>
                <CardDescription className="text-red-700">
                  Acciones irreversibles. Procede con precaución.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                  <Trash2 className="w-4 h-4" />
                  Eliminar mi cuenta permanentemente
                </button>
              </CardContent>
            </Card>
          </div>
        )

      case 'appearance':
        return (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Personalización</CardTitle>
              <CardDescription>
                Ajusta la apariencia de Forvara Hub a tu gusto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-4 block">Tema de la aplicación</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Claro', icon: Sun },
                    { value: 'dark', label: 'Oscuro', icon: Moon },
                    { value: 'system', label: 'Sistema', icon: Monitor }
                  ].map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => handleInputChange('theme', theme.value as any)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.theme === theme.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <theme.icon className={`w-8 h-8 mx-auto mb-2 ${
                        settings.theme === theme.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        settings.theme === theme.value ? 'text-blue-900' : 'text-gray-700'
                      }`}>
                        {theme.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div>
                <Label htmlFor="timezone">Zona horaria</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="America/Panama">América/Panamá (GMT-5)</option>
                  <option value="America/Mexico_City">América/Ciudad de México (GMT-6)</option>
                  <option value="America/Bogota">América/Bogotá (GMT-5)</option>
                  <option value="America/Lima">América/Lima (GMT-5)</option>
                  <option value="America/Buenos_Aires">América/Buenos Aires (GMT-3)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Configuración"
        description="Gestiona tu cuenta y preferencias"
      />

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-fast ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                  activeTab === tab.id ? 'rotate-90' : ''
                }`} />
              </button>
            ))}
          </nav>

          {/* Quick actions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Acciones rápidas</h4>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                Exportar datos
              </button>
              <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <LogOut className="w-4 h-4 inline mr-2" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Cargando configuración...</p>
              </div>
            </div>
          ) : (
            <>
              {renderTabContent()}

              {/* Save button */}
              {hasChanges && (
                <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-700">Tienes cambios sin guardar</span>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="gradient-brand text-white"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

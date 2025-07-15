import React, { useState, useEffect } from 'react'
import { Building2, User, Shield, Bell, Globe, CreditCard, ChevronRight, Mail, Phone, Camera, Save, AlertCircle, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { companyService } from '@/services/company.service'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import { useNavigate } from 'react-router-dom'

// Componente para el estado vacío cuando no hay empresa
const NoCompanyState = () => {
  const navigate = useNavigate()
  
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
          Para acceder a configuración, primero necesitas crear una empresa.
        </p>
        <button 
          onClick={() => navigate('/companies')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          Crear mi primera empresa
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Componente de navegación lateral
const SettingsSidebar = ({ activeSection, onSectionChange }: { 
  activeSection: string
  onSectionChange: (section: string) => void 
}) => {
  const sections = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'company', label: 'Empresa', icon: Building2 },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'preferences', label: 'Preferencias', icon: Globe }
  ]

  return (
    <nav className="space-y-1">
      {sections.map(section => {
        const Icon = section.icon
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeSection === section.id
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{section.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

// Sección de Perfil
const ProfileSection = () => {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    cedula_panama: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        cedula_panama: user.cedula_panama || '',
        avatar_url: user.avatar_url || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedUser = await userService.updateProfile(formData)
      updateUser(updatedUser)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      // Show error to user
      alert('Error al guardar el perfil. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Información personal
        </h3>
        <p className="text-sm text-gray-500">
          Actualiza tu información personal y de contacto
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          {formData.avatar_url ? (
            <img src={formData.avatar_url} alt="" className="w-20 h-20 rounded-full" />
          ) : (
            <User className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Cambiar foto
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Apellido
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Teléfono
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+507 6000-0000"
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Cédula (Panamá)
          </label>
          <input
            type="text"
            value={formData.cedula_panama}
            onChange={(e) => setFormData({ ...formData, cedula_panama: e.target.value })}
            placeholder="8-123-4567"
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {loading ? (
            <>Guardando...</>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Sección de Empresa
const CompanySection = () => {
  const { currentCompany, setCurrentCompany } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    razon_social: '',
    ruc: '',
    phone: '',
    contact_email: '',
    address: '',
    industry_type: '',
    company_size: 'pequena'
  })

  useEffect(() => {
    if (currentCompany) {
      setFormData({
        razon_social: currentCompany.razon_social || '',
        ruc: currentCompany.ruc || '',
        phone: currentCompany.phone || '',
        contact_email: currentCompany.contact_email || '',
        address: currentCompany.address || '',
        industry_type: currentCompany.industry_type || '',
        company_size: currentCompany.company_size || 'pequena'
      })
    }
  }, [currentCompany])

  // TODO: Verificar permisos reales
  const canEdit = true // Solo owner y admin pueden editar

  const handleSave = async () => {
    if (!currentCompany) return
    
    setLoading(true)
    try {
      const updatedCompany = await companyService.updateCompany(currentCompany.id, formData)
      setCurrentCompany(updatedCompany)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving company:', error)
      alert('Error al guardar la información de la empresa. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Información de la empresa
        </h3>
        <p className="text-sm text-gray-500">
          Detalles y configuración de tu empresa
        </p>
      </div>

      {!canEdit && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Solo los administradores pueden editar la información de la empresa.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Razón Social
          </label>
          <input
            type="text"
            value={formData.razon_social}
            onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            RUC
          </label>
          <input
            type="text"
            value={formData.ruc}
            onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email de contacto
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Teléfono
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm disabled:opacity-50"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Dirección
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={!canEdit}
            rows={2}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Industria
          </label>
          <select
            value={formData.industry_type}
            onChange={(e) => setFormData({ ...formData, industry_type: e.target.value })}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm disabled:opacity-50"
          >
            <option value="">Seleccionar industria</option>
            <option value="tecnologia">Tecnología</option>
            <option value="retail">Retail</option>
            <option value="servicios">Servicios</option>
            <option value="manufactura">Manufactura</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Tamaño de empresa
          </label>
          <select
            value={formData.company_size}
            onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
            disabled={!canEdit}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm disabled:opacity-50"
          >
            <option value="micro">Micro (1-10 empleados)</option>
            <option value="pequena">Pequeña (11-50 empleados)</option>
            <option value="mediana">Mediana (51-200 empleados)</option>
            <option value="grande">Grande (200+ empleados)</option>
          </select>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {loading ? (
              <>Guardando...</>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Guardado
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// Sección de Seguridad
const SecuritySection = () => {
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Seguridad
        </h3>
        <p className="text-sm text-gray-500">
          Gestiona tu contraseña y configuración de seguridad
        </p>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Cambiar contraseña
        </h4>
        
        {!changingPassword ? (
          <button
            onClick={() => setChangingPassword(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            <Shield className="w-4 h-4" />
            Cambiar contraseña
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contraseña actual
              </label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium">
                Actualizar contraseña
              </button>
              <button
                onClick={() => {
                  setChangingPassword(false)
                  setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Autenticación de dos factores
            </h4>
            <p className="text-sm text-gray-500">
              Añade una capa extra de seguridad a tu cuenta
            </p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            Próximamente
          </span>
        </div>
      </div>
    </div>
  )
}

// Componente principal de Settings
export default function Settings() {
  const { currentCompany, user } = useAuthStore()
  
  const [activeSection, setActiveSection] = useState('profile')

  // Si no hay empresa
  if (!currentCompany) {
    return <NoCompanyState />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Configuración
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Gestiona tu cuenta y preferencias
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <SettingsSidebar 
                activeSection={activeSection} 
                onSectionChange={setActiveSection} 
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {activeSection === 'profile' && <ProfileSection />}
              {activeSection === 'company' && <CompanySection />}
              {activeSection === 'security' && <SecuritySection />}
              {activeSection === 'notifications' && (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Configuración de notificaciones próximamente</p>
                </div>
              )}
              {activeSection === 'preferences' && (
                <div className="text-center py-12">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Preferencias regionales próximamente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

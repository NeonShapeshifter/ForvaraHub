// ForvaraHub/src/pages/Register.tsx

import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  Building,
  Users,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInputField } from '@/components/ui/phone-input'
import { usePhoneValidation } from '@/hooks/usePhoneValidation'

type Step = 'contact' | 'personal' | 'workspace' | 'password'
type WorkspaceType = 'individual' | 'new_company' | 'join_company'

export default function Register() {
  const [currentStep, setCurrentStep] = useState<Step>('contact')
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')

  // Form data
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>('individual')
  const [companyName, setCompanyName] = useState('')
  const [ruc, setRuc] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()

  const phoneValidation = usePhoneValidation({
    value: contactMethod === 'phone' ? phone : '',
    required: contactMethod === 'phone'
  })

  useEffect(() => {
    clearError()
  }, [currentStep, clearError])

  const steps: Step[] = ['contact', 'personal', 'workspace', 'password']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNextStep = () => {
    const stepIndex = steps.indexOf(currentStep)
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1])
    }
  }

  const handlePrevStep = () => {
    const stepIndex = steps.indexOf(currentStep)
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return
    }

    try {
      await register({
        email: contactMethod === 'email' ? email : undefined,
        phone: contactMethod === 'phone' ? phone : undefined,
        password,
        first_name: firstName,
        last_name: lastName
        // TODO: Add company data based on workspaceType
      })
      navigate('/dashboard')
    } catch (error) {
      // Error is handled by the store
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 'contact':
        return (contactMethod === 'email' && email) ||
               (contactMethod === 'phone' && phoneValidation.isValid)
      case 'personal':
        return firstName && lastName
      case 'workspace':
        if (workspaceType === 'new_company') return companyName && ruc
        if (workspaceType === 'join_company') return inviteCode
        return true
      case 'password':
        return password && confirmPassword && password === confirmPassword && agreedToTerms
      default:
        return false
    }
  }

  const passwordStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    return strength
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full">
          {/* Logo and header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-brand flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-pulse-glow">
              F
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Crea tu cuenta
            </h2>
            <p className="mt-2 text-gray-600">
              Únete a miles de empresas que confían en Forvara
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Paso {currentStepIndex + 1} de {steps.length}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="gradient-brand h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStepIndex
                ? 'gradient-brand text-white'
                : 'bg-gray-200 text-gray-500'
              }
                `}>
                  {index < currentStepIndex ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-1 mx-2
                    ${index < currentStepIndex ? 'gradient-brand' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Form content */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Contact */}
            {currentStep === 'contact' && (
              <div className="space-y-6 animate-slide-up">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Cómo prefieres que te contactemos?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Usaremos esto para crear tu cuenta y mantenerte informado
                  </p>

                  {/* Contact method selector */}
                  <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
                    <button
                      type="button"
                      onClick={() => setContactMethod('email')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        contactMethod === 'email'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMethod('phone')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        contactMethod === 'phone'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      Teléfono
                    </button>
                  </div>

                  {contactMethod === 'email' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          placeholder="tu@ejemplo.com"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <PhoneInputField
                      label="Número de teléfono"
                      value={phone}
                      onChange={setPhone}
                      error={phoneValidation.error}
                      required
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Personal info */}
            {currentStep === 'personal' && (
              <div className="space-y-6 animate-slide-up">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cuéntanos sobre ti
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Necesitamos algunos datos básicos para personalizar tu experiencia
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                          placeholder="Juan"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10"
                          placeholder="Pérez"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Workspace */}
            {currentStep === 'workspace' && (
              <div className="space-y-6 animate-slide-up">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Cómo usarás Forvara?
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Esto nos ayuda a configurar tu espacio de trabajo
                  </p>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setWorkspaceType('individual')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        workspaceType === 'individual'
                          ? 'border-[#004AAD] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <User className={`w-5 h-5 ${workspaceType === 'individual' ? 'text-[#004AAD]' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Uso personal</p>
                          <p className="text-sm text-gray-600">Para proyectos individuales</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWorkspaceType('new_company')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        workspaceType === 'new_company'
                          ? 'border-[#004AAD] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Building className={`w-5 h-5 ${workspaceType === 'new_company' ? 'text-[#004AAD]' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Crear empresa</p>
                          <p className="text-sm text-gray-600">Configura un nuevo espacio de trabajo</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWorkspaceType('join_company')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        workspaceType === 'join_company'
                          ? 'border-[#004AAD] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Users className={`w-5 h-5 ${workspaceType === 'join_company' ? 'text-[#004AAD]' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Unirse a empresa</p>
                          <p className="text-sm text-gray-600">Tienes un código de invitación</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Additional fields based on workspace type */}
                  {workspaceType === 'new_company' && (
                    <div className="mt-6 space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la empresa
                        </label>
                        <Input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Mi Empresa S.A."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RUC (opcional)
                        </label>
                        <Input
                          type="text"
                          value={ruc}
                          onChange={(e) => setRuc(e.target.value)}
                          placeholder="12345678-1-123456"
                        />
                      </div>
                    </div>
                  )}

                  {workspaceType === 'join_company' && (
                    <div className="mt-6 animate-fade-in">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código de invitación
                      </label>
                      <Input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Password */}
            {currentStep === 'password' && (
              <div className="space-y-6 animate-slide-up">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Asegura tu cuenta
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Crea una contraseña segura para proteger tu información
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password strength indicator */}
                      {password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  i < passwordStrength()
                                    ? passwordStrength() <= 2 ? 'bg-orange-500' : 'bg-green-500'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">
                            Fortaleza: {
                              passwordStrength() === 0 ? 'Muy débil' :
                                passwordStrength() === 1 ? 'Débil' :
                                  passwordStrength() === 2 ? 'Media' :
                                    passwordStrength() === 3 ? 'Fuerte' : 'Muy fuerte'
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-600 mt-1">Las contraseñas no coinciden</p>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-1 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">
                          Acepto los{' '}
                          <Link to="/terms" className="text-gradient hover:underline">
                            términos y condiciones
                          </Link>
                          {' '}y la{' '}
                          <Link to="/privacy" className="text-gradient hover:underline">
                            política de privacidad
                          </Link>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 animate-shake">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex gap-3">
              {currentStep !== 'contact' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}

              {currentStep !== 'password' ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isStepValid()}
                  className="flex-1 gradient-brand text-white"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStepValid() || isLoading}
                  className="flex-1 gradient-brand text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    <>
                      Crear cuenta
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-gradient hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Benefits showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#004AAD] to-[#CB6CE6] p-12 relative overflow-hidden">
        <div className="max-w-lg text-white relative z-10">
          <h1 className="text-4xl font-bold mb-6">
            Comienza gratis hoy mismo
          </h1>
          <p className="text-xl mb-8 text-white/90">
            30 días de prueba gratuita. Sin tarjeta de crédito. Cancela cuando quieras.
          </p>

          {/* Benefits */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p>Acceso completo a todas las funciones</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p>Soporte 24/7 en español</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p>Migración gratuita de datos</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p>Capacitación para tu equipo incluida</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 p-6 bg-white/10 backdrop-blur rounded-2xl">
            <div className="text-center">
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-white/80">Usuarios activos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-white/80">Empresas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-sm text-white/80">Uptime</p>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Floating icons */}
        <div className="absolute top-20 left-20 animate-float">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white/80" />
          </div>
        </div>
        <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white/80" />
          </div>
        </div>
        <div className="absolute top-1/3 right-40 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, Mail, Phone, User, Building, Shield, Zap, CheckCircle, Users, Briefcase, AlertCircle } from 'lucide-react'
import { LogoAuto } from '@/components/ui/logo'
import { PhoneInputField } from '@/components/ui/phone-input'
import { usePhoneValidation, getCountryInfo } from '@/hooks/usePhoneValidation'

export default function Register() {
  const [step, setStep] = useState<'contact' | 'password' | 'workspace'>('contact')
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  
  // Form data
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [workspaceType, setWorkspaceType] = useState<'individual' | 'new_company' | 'join_company'>('individual')
  const [companyName, setCompanyName] = useState('')
  const [ruc, setRuc] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  
  const { register, isLoading, error, clearError } = useAuthStore()
  
  // Phone validation hook
  const phoneValidation = usePhoneValidation({
    value: contactMethod === 'phone' ? phone : undefined,
    required: false // Let user type, validate when needed
  })

  // Smooth entrance animation
  useEffect(() => {
    setIsAnimating(true)
  }, [])

  // Password validation
  const isPasswordValid = password.length >= 8
  const doPasswordsMatch = password === confirmPassword && password !== ''

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (step === 'contact') {
      // Validate contact information
      if (contactMethod === 'email' && !email.trim()) return
      if (contactMethod === 'phone' && (!phone || !phoneValidation.isValid)) return
      if (!firstName.trim() || !lastName.trim()) return
      
      setStep('password')
    } else if (step === 'password') {
      // Validate password
      if (!isPasswordValid || !doPasswordsMatch) return
      
      setStep('workspace')
    } else if (step === 'workspace') {
      // Submit registration
      handleRegister()
    }
  }

  const handleRegister = async () => {
    try {
      const registrationData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: contactMethod === 'email' ? email.trim() : undefined,
        phone: contactMethod === 'phone' ? (phoneValidation.e164Format || phone) : undefined,
        password,
        // Company data only if creating new company
        company_name: workspaceType === 'new_company' ? companyName.trim() : undefined,
        ruc: workspaceType === 'new_company' ? ruc.trim() : undefined,
        // Invite code if joining company
        invite_code: workspaceType === 'join_company' ? inviteCode.trim() : undefined,
        auth_method: contactMethod,
        country_code: contactMethod === 'phone' ? phoneValidation.countryCode : 'PA',
        workspace_type: workspaceType,
      }
      
      await register(registrationData)
      // Success animation before navigation
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (error) {
      // Error is handled by the store
    }
  }

  const goBack = () => {
    if (step === 'password') setStep('contact')
    else if (step === 'workspace') setStep('password')
  }

  const getStepProgress = () => {
    if (step === 'contact') return 33
    if (step === 'password') return 66
    return 100
  }

  const getWorkspaceStepTitle = () => {
    if (workspaceType === 'individual') return '👤 Espacio Individual'
    if (workspaceType === 'new_company') return '🏢 Crear Nueva Empresa'
    return '🤝 Unirse a Empresa'
  }

  const getWorkspaceStepDescription = () => {
    if (workspaceType === 'individual') return 'Úsalo para proyectos personales o freelancing'
    if (workspaceType === 'new_company') return 'Configura tu empresa y empieza a invitar tu equipo'
    return 'Únete al espacio de trabajo de tu empresa'
  }

  // Form validation
  const canProceed = () => {
    if (step === 'contact') {
      const contactValid = contactMethod === 'email' ? email.trim() : (phone && phoneValidation.isValid)
      return firstName.trim() && lastName.trim() && contactValid
    }
    if (step === 'password') {
      return isPasswordValid && doPasswordsMatch
    }
    if (step === 'workspace') {
      if (workspaceType === 'individual') return true
      if (workspaceType === 'new_company') return companyName.trim()
      if (workspaceType === 'join_company') return inviteCode.trim()
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-200/20 dark:bg-purple-500/10 rounded-full animate-pulse" />
        <div className="absolute top-1/4 -left-8 w-24 h-24 bg-blue-200/30 dark:bg-blue-500/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Registration Card */}
      <div className={`w-full max-w-lg transform transition-all duration-1000 ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="text-center mb-8">
          <LogoAuto size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            🚀 Únete a Forvara
          </h1>
          <p className="text-muted-foreground">
            Herramientas profesionales para individuos y equipos
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">
              {step === 'contact' && '📝 Tu Información Personal'}
              {step === 'password' && '🔐 Crear Contraseña Segura'}
              {step === 'workspace' && getWorkspaceStepTitle()}
            </CardTitle>
            <CardDescription className="text-sm">
              {step === 'contact' && 'Cuéntanos sobre ti y cómo prefieres que te contactemos'}
              {step === 'password' && 'Elige una contraseña segura para proteger tu cuenta'}
              {step === 'workspace' && getWorkspaceStepDescription()}
            </CardDescription>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getStepProgress()}%` }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleStepSubmit} className="space-y-5">
              
              {/* Step 1: Contact Information */}
              {step === 'contact' && (
                <>
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Nombre *
                      </label>
                      <Input
                        placeholder="Tu nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Apellido *
                      </label>
                      <Input
                        placeholder="Tu apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Contact Method Toggle */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-center text-muted-foreground">
                      💡 ¿Cómo prefieres que te contactemos?
                    </p>
                    <div className="flex rounded-xl border-2 border-muted/20 p-1 bg-muted/5">
                      <button
                        type="button"
                        onClick={() => setContactMethod('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          contactMethod === 'email'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-[0.98]'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                         Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setContactMethod('phone')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          contactMethod === 'phone'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-[0.98]'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                         Teléfono
                      </button>
                    </div>
                  </div>

                  {/* Contact Field */}
                  <div className="space-y-2">
                    {contactMethod === 'email' ? (
                      <>
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Tu Email *
                        </label>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="✉️ tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-11 pl-4"
                          />
                          {email && email.includes('@') && email.includes('.') && (
                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                          )}
                        </div>
                      </>
                    ) : (
                      <PhoneInputField
                        label="🌎 Tu Teléfono *"
                        value={phone}
                        onChange={(value) => setPhone(value || '')}
                        error={phone && phoneValidation.error ? phoneValidation.error : undefined}
                        placeholder="Ingresa tu número de teléfono"
                        className={`transition-all duration-300`}
                        labelClassName="text-sm font-medium text-foreground flex items-center gap-2"
                      />
                    )}
                  </div>

                  {/* Show country info for phone */}
                  {contactMethod === 'phone' && phoneValidation.isValid && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      {getCountryInfo(phoneValidation.countryCode).flag} {getCountryInfo(phoneValidation.countryCode).name} - {phoneValidation.formattedNumber}
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Password */}
              {step === 'password' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="h-11 pr-10 border-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all pl-4"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className={`text-xs flex items-center gap-1 ${isPasswordValid ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPasswordValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {isPasswordValid ? 'Contraseña válida' : 'Mínimo 8 caracteres'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirma tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="h-11 pr-10 border-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all pl-4"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <div className={`text-xs flex items-center gap-1 ${doPasswordsMatch ? 'text-emerald-600' : 'text-red-600'}`}>
                        {doPasswordsMatch ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {doPasswordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 3: Workspace Setup */}
              {step === 'workspace' && (
                <>
                  {/* Workspace Type Selection */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-center text-muted-foreground">
                      ¿Cómo vas a usar Forvara?
                    </p>
                    
                    <div className="space-y-3">
                      {/* Individual */}
                      <button
                        type="button"
                        onClick={() => setWorkspaceType('individual')}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                          workspaceType === 'individual'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-muted hover:border-purple-300 hover:bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 mt-0.5 text-purple-600" />
                          <div>
                            <h4 className="font-medium text-foreground">Uso Personal</h4>
                            <p className="text-sm text-muted-foreground">Para proyectos individuales, freelancing o uso personal</p>
                          </div>
                        </div>
                      </button>

                      {/* New Company */}
                      <button
                        type="button"
                        onClick={() => setWorkspaceType('new_company')}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                          workspaceType === 'new_company'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-muted hover:border-blue-300 hover:bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Building className="w-5 h-5 mt-0.5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-foreground">Crear Mi Empresa</h4>
                            <p className="text-sm text-muted-foreground">Soy dueño/administrador y quiero configurar mi empresa</p>
                          </div>
                        </div>
                      </button>

                      {/* Join Company */}
                      <button
                        type="button"
                        onClick={() => setWorkspaceType('join_company')}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                          workspaceType === 'join_company'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-muted hover:border-emerald-300 hover:bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 mt-0.5 text-emerald-600" />
                          <div>
                            <h4 className="font-medium text-foreground">Unirme a Empresa</h4>
                            <p className="text-sm text-muted-foreground">Trabajo para una empresa que ya usa Forvara</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic fields based on workspace type */}
                  {workspaceType === 'new_company' && (
                    <div className="space-y-4 pt-4 border-t border-muted/20">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Nombre de la Empresa *
                        </label>
                        <Input
                          placeholder="🏢 Mi Empresa S.A."
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          RUC (Opcional)
                        </label>
                        <Input
                          placeholder="📄 123-456-789"
                          value={ruc}
                          onChange={(e) => setRuc(e.target.value)}
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                          Puedes agregarlo después en configuración
                        </p>
                      </div>
                    </div>
                  )}

                  {workspaceType === 'join_company' && (
                    <div className="space-y-4 pt-4 border-t border-muted/20">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Código de Invitación *
                        </label>
                        <Input
                          placeholder="🎫 ABC123XYZ"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                          required
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tu administrador te debe haber dado este código
                        </p>
                      </div>
                    </div>
                  )}

                  {workspaceType === 'individual' && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-purple-800 dark:text-purple-200 mb-2">
                        <Briefcase className="w-5 h-5" />
                        <span className="font-medium">✨ Perfecto para empezar</span>
                      </div>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Puedes crear o unirte a una empresa más tarde desde tu panel de control.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30 rounded-md p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {step !== 'contact' && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    className="flex-1 h-11"
                    disabled={isLoading}
                  >
                    ← Atrás
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  className={`${step === 'contact' ? 'w-full' : 'flex-1'} h-11 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-60`}
                  disabled={!canProceed() || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creando cuenta...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {step === 'workspace' ? (
                        <>
                          <Zap className="w-4 h-4" />
                          ¡Crear Cuenta! 🎉
                        </>
                      ) : (
                        <>
                          Continuar →
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              ¿Ya tienes cuenta?{' '}
              <Link 
                to="/login" 
                className="font-medium text-primary hover:underline transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

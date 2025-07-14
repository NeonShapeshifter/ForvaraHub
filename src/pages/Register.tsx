import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, Mail, Phone, User, Building, Shield, Zap, CheckCircle } from 'lucide-react'
import { LogoAuto } from '@/components/ui/logo'
import { PhoneInputField } from '@/components/ui/phone-input'
import { usePhoneValidation, getCountryInfo } from '@/hooks/usePhoneValidation'

export default function Register() {
  const [step, setStep] = useState<'contact' | 'password' | 'company'>('contact')
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  
  // Form data
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [ruc, setRuc] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  
  const { register, isLoading, error, clearError } = useAuthStore()
  
  // Phone validation hook
  const phoneValidation = usePhoneValidation({
    value: contactMethod === 'phone' ? phone : undefined,
    required: contactMethod === 'phone'
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
      if (contactMethod === 'email' && !email) return
      if (contactMethod === 'phone' && (!phone || !phoneValidation.isValid)) return
      if (!firstName || !lastName) return
      
      setStep('password')
    } else if (step === 'password') {
      // Validate password
      if (!isPasswordValid || !doPasswordsMatch) return
      
      setStep('company')
    } else if (step === 'company') {
      // Submit registration
      handleRegister()
    }
  }

  const handleRegister = async () => {
    try {
      const registrationData = {
        first_name: firstName,
        last_name: lastName,
        email: contactMethod === 'email' ? email : undefined,
        phone: contactMethod === 'phone' ? (phoneValidation.e164Format || phone) : undefined,
        password,
        company_name: companyName,
        ruc,
        auth_method: contactMethod,
        country_code: contactMethod === 'phone' ? phoneValidation.countryCode : 'PA',
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
    else if (step === 'company') setStep('password')
  }

  const getStepProgress = () => {
    if (step === 'contact') return 33
    if (step === 'password') return 66
    return 100
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
            Crea tu cuenta empresarial en LATAM
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold text-foreground">
              {step === 'contact' && '📝 Información de Contacto'}
              {step === 'password' && '🔐 Crear Contraseña Segura'}
              {step === 'company' && '🏢 Información de la Empresa'}
            </CardTitle>
            <CardDescription className="text-sm">
              {step === 'contact' && 'Ingresa tus datos personales y método de contacto'}
              {step === 'password' && 'Elige una contraseña segura para tu cuenta'}
              {step === 'company' && 'Configura los datos de tu empresa'}
            </CardDescription>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getStepProgress()}%` }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleStepSubmit} className="space-y-4">
              
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
                        📧 Email
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
                        📱 Teléfono
                      </button>
                    </div>
                  </div>

                  {/* Contact Field */}
                  <div className="space-y-2">
                    {contactMethod === 'email' ? (
                      <>
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Tu Email Empresarial *
                        </label>
                        <Input
                          type="email"
                          placeholder="✉️ tu@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11"
                        />
                      </>
                    ) : (
                      <PhoneInputField
                        label="📱 Tu Teléfono *"
                        value={phone}
                        onChange={(value) => setPhone(value || '')}
                        error={phoneValidation.error || undefined}
                        placeholder="Ingresa tu número de teléfono"
                        required
                        className={`transition-all duration-300 ${
                          phoneValidation.isValid && phone ? 'valid' : ''
                        } ${
                          phoneValidation.error ? 'error' : ''
                        }`}
                        labelClassName="text-sm font-medium text-foreground flex items-center gap-2"
                      />
                    )}
                  </div>

                  {/* Show country info for phone */}
                  {contactMethod === 'phone' && phoneValidation.isValid && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
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
                        placeholder="🔒 Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 pr-10"
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
                      <div className={`text-xs ${isPasswordValid ? 'text-green-600' : 'text-red-600'}`}>
                        {isPasswordValid ? '✅ Contraseña válida' : '❌ Mínimo 8 caracteres'}
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
                        placeholder="🔒 Confirma tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-11 pr-10"
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
                      <div className={`text-xs ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                        {doPasswordsMatch ? '✅ Las contraseñas coinciden' : '❌ Las contraseñas no coinciden'}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 3: Company */}
              {step === 'company' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Razón Social de la Empresa *
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
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
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
                  className={`${step === 'contact' ? 'w-full' : 'flex-1'} h-11 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100`}
                  disabled={
                    isLoading || 
                    (step === 'contact' && contactMethod === 'phone' && !phoneValidation.isValid && phone !== '') ||
                    (step === 'password' && (!isPasswordValid || !doPasswordsMatch)) ||
                    (step === 'company' && !companyName)
                  }
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creando cuenta...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {step === 'company' ? (
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
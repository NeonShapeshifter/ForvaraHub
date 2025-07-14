import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, Mail, Phone, Sparkles, Shield, Zap } from 'lucide-react'
import { LogoAuto } from '@/components/ui/logo'
import { PhoneInputField } from '@/components/ui/phone-input'
import { usePhoneValidation } from '@/hooks/usePhoneValidation'

export default function Login() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  
  const { login, loginWithPhone, isLoading, error, clearError } = useAuthStore()
  
  // Phone validation hook (only for phone auth method)
  const phoneValidation = usePhoneValidation({
    value: authMethod === 'phone' ? identifier : undefined,
    required: authMethod === 'phone'
  })

  // Smooth entrance animation
  useEffect(() => {
    setIsAnimating(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    // Additional validation for phone numbers
    if (authMethod === 'phone' && !phoneValidation.isValid) {
      return // Don't submit if phone is invalid
    }
    
    try {
      if (authMethod === 'email') {
        await login(identifier, password)
      } else {
        // Use E.164 format for phone login if available
        const phoneToUse = phoneValidation.e164Format || identifier
        await loginWithPhone(phoneToUse, password)
      }
      // Small success animation before navigation
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (error) {
      // Error is handled by the store
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/30 dark:bg-blue-500/10 rounded-full animate-pulse" />
        <div className="absolute top-1/3 -left-8 w-16 h-16 bg-cyan-200/40 dark:bg-cyan-500/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-purple-200/20 dark:bg-purple-500/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className={`w-full max-w-md transform transition-all duration-1000 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <LogoAuto variant="icon" size="lg" className="drop-shadow-lg" />
          </div>
          <div className="mb-4">
            <LogoAuto variant="full" size="xl" className="mx-auto drop-shadow-lg" />
          </div>
          <p className="text-muted-foreground text-lg">
            Centro de Administración Enterprise
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Seguro</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Rápido</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>LATAM</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Bienvenido de vuelta
            </CardTitle>
            <CardDescription className="text-base">
              Accede a tu panel de administración empresarial
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Auth Method Toggle */}
            <div className="relative">
              <p className="text-sm font-medium mb-3 text-center text-muted-foreground">
                Elige tu método de acceso preferido
              </p>
              <div className="flex rounded-xl border-2 border-muted/20 p-1 bg-muted/5">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    authMethod === 'email'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transform scale-[0.98]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    authMethod === 'phone'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transform scale-[0.98]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Teléfono
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                {authMethod === 'email' ? (
                  <>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Empresarial
                    </label>
                    <Input
                      type="email"
                      placeholder="tu@empresa.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-12 text-base border-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                    />
                  </>
                ) : (
                  <PhoneInputField
                    label="Teléfono"
                    value={identifier}
                    onChange={(value) => setIdentifier(value || '')}
                    error={phoneValidation.error || undefined}
                    placeholder="Ingresa tu número de teléfono"
                    required
                    className={`transition-all duration-300 ${
                      phoneValidation.isValid && identifier ? 'border-green-500' : ''
                    } ${
                      phoneValidation.error ? 'border-red-500' : ''
                    }`}
                    labelClassName="text-sm font-medium text-foreground flex items-center gap-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-12 text-base pr-12 border-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-600 transition-colors p-1 rounded"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100" 
                disabled={isLoading || (authMethod === 'phone' && !phoneValidation.isValid && identifier !== '')}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Acceder
                  </div>
                )}
              </Button>

              {/* Forgot Password */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const contact = authMethod === 'email' ? identifier : phoneValidation.e164Format || identifier
                    if (contact) {
                      // Simple password reset for now
                      alert(`Funcionalidad de recuperación próximamente. Contacta soporte con: ${contact}`)
                    } else {
                      alert('Por favor ingresa tu email o teléfono primero')
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="text-center pt-6 border-t border-muted/20">
              <p className="text-sm text-muted-foreground mb-3">
                ¿Primera vez en Forvara?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/register')}
                className="text-sm font-medium border-2 hover:bg-blue-50 hover:border-blue-200 transition-all"
              >
                Crear cuenta empresarial gratis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span>© 2025 Forvara.</span>
            <span className="font-medium text-blue-600">Hecho para PyMEs de LATAM</span>
          </p>
          <p className="mt-2 text-xs opacity-75">
            Desde Panamá para toda Latinoamérica
          </p>
        </div>
      </div>
    </div>
  )
}
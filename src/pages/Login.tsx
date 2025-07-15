import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, Mail, Phone, Sparkles, Shield, Zap, AlertCircle, CheckCircle2 } from 'lucide-react'
import { LogoAuto } from '@/components/ui/logo'
import { PhoneInputField } from '@/components/ui/phone-input'
import { usePhoneValidation } from '@/hooks/usePhoneValidation'

export default function Login() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const navigate = useNavigate()
  
  const { login, loginWithPhone, isLoading, error, clearError } = useAuthStore()
  
  // Phone validation hook (only for phone auth method)
  const phoneValidation = usePhoneValidation({
    value: authMethod === 'phone' ? identifier : undefined,
    required: false // Don't require immediately, let user type
  })

  // Smooth entrance animation
  useEffect(() => {
    setIsAnimating(true)
  }, [])

  // Clear errors when switching auth methods
  useEffect(() => {
    clearError()
    setIdentifier('')
  }, [authMethod, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    // Validation
    if (!identifier.trim() || !password.trim()) {
      return
    }
    
    // For phone: only validate if user has typed something
    if (authMethod === 'phone' && identifier && !phoneValidation.isValid) {
      return
    }
    
    try {
      if (authMethod === 'email') {
        await login(identifier.trim(), password)
      } else {
        // Use E.164 format for phone login if available, fallback to raw input
        const phoneToUse = phoneValidation.e164Format || identifier
        await loginWithPhone(phoneToUse, password)
      }
      // Success feedback
      setTimeout(() => navigate('/dashboard'), 300)
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleForgotPassword = async () => {
    if (!identifier.trim()) {
      clearError()
      // Use a subtle error instead of alert
      return
    }

    setForgotPasswordLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setForgotPasswordLoading(false)
      setShowForgotPassword(true)
      // In real app, this would trigger email/SMS
    }, 1500)
  }

  // Form validation
  const canSubmit = identifier.trim() && password.trim() && 
    (authMethod === 'email' || !identifier || phoneValidation.isValid) && !isLoading

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
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Bienvenido de vuelta
            </CardTitle>
            <CardDescription className="text-base">
              Accede a tu panel de administración empresarial
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                {authMethod === 'email' ? (
                  <>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Empresarial
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="tu@empresa.com"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        autoComplete="email"
                        className="h-12 text-base border-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all pl-4"
                      />
                      {identifier && identifier.includes('@') && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  </>
                ) : (
                  <PhoneInputField
                    label="Teléfono"
                    value={identifier}
                    onChange={(value) => setIdentifier(value || '')}
                    error={identifier && phoneValidation.error ? phoneValidation.error : undefined}
                    placeholder="Ingresa tu número de teléfono"
                    className={`transition-all duration-300`}
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
                    className="h-12 text-base pr-12 border-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all pl-4"
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
                <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30 rounded-md p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-60" 
                disabled={!canSubmit}
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
                {!showForgotPassword ? (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={!identifier.trim() || forgotPasswordLoading}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotPasswordLoading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      '¿Olvidaste tu contraseña?'
                    )}
                  </button>
                ) : (
                  <div className="text-sm text-emerald-600 bg-emerald-50/50 border border-emerald-200/50 rounded-md p-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instrucciones enviadas a tu {authMethod === 'email' ? 'email' : 'teléfono'}</span>
                  </div>
                )}
                {!identifier.trim() && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ingresa tu {authMethod === 'email' ? 'email' : 'teléfono'} primero
                  </p>
                )}
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
                className="text-sm font-medium border-2 hover:bg-blue-50 hover:border-blue-200 transition-all h-10"
              >
                Crear cuenta gratis
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Para uso individual o empresarial
              </p>
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

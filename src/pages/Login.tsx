// ForvaraHub/src/pages/Login.tsx

import React, { useState, useEffect } from 'react'
import React, { useNavigate, Link } from 'react-router-dom'
import React, { useAuthStore } from '@/stores/authStore'
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  Building,
  Users,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import React, { Button } from '@/components/ui/button'
import React, { Input } from '@/components/ui/input'
import React, { PhoneInputField } from '@/components/ui/phone-input'
import React, { usePhoneValidation } from '@/hooks/usePhoneValidation'

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()

  const phoneValidation = usePhoneValidation({
    value: loginMethod === 'phone' ? phone : '',
    required: loginMethod === 'phone'
  })

  useEffect(() => {
    clearError()
  }, [loginMethod, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loginMethod === 'phone' && !phoneValidation.isValid) {
      return
    }

    try {
      await login({
        email: loginMethod === 'email' ? email : undefined,
        phone: loginMethod === 'phone' ? phone : undefined,
        password
      })
      navigate('/dashboard')
    } catch (error) {
      // Error is handled by the store
    }
  }

  const isFormValid = password && (
    (loginMethod === 'email' && email) ||
    (loginMethod === 'phone' && phoneValidation.isValid)
  )

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl gradient-brand flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-pulse-glow">
              F
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Bienvenido de vuelta
            </h2>
            <p className="mt-2 text-gray-600">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {/* Login Method Selector */}
          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4" />
              Teléfono
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Email/Phone Input */}
              {loginMethod === 'email' ? (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
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

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
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
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gradient hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 animate-shake">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full gradient-brand text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Ingresando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Ingresar</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o continúa con</span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {/* TODO: Google login */}}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {/* TODO: Microsoft login */}}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                Microsoft
              </Button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-medium text-gradient hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Feature showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#004AAD] to-[#CB6CE6] p-12">
        <div className="max-w-lg text-white">
          <h1 className="text-4xl font-bold mb-6">
            Potencia tu empresa con Forvara Hub
          </h1>
          <p className="text-xl mb-8 text-white/90">
            La plataforma todo-en-uno para gestionar tu equipo, aplicaciones y crecer sin límites.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Gestión de equipos</h3>
                <p className="text-white/80 text-sm">
                  Administra usuarios, permisos y colabora en tiempo real
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Apps empresariales</h3>
                <p className="text-white/80 text-sm">
                  Marketplace con las mejores herramientas para tu negocio
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Seguridad garantizada</h3>
                <p className="text-white/80 text-sm">
                  Encriptación de nivel empresarial y backups automáticos
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur rounded-2xl">
            <p className="text-white/90 italic mb-4">
              "Forvara Hub transformó completamente la forma en que gestionamos nuestro equipo.
              La productividad aumentó un 40% en solo 2 meses."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">María González</p>
                <p className="text-sm text-white/70">CEO, TechCorp Panamá</p>
              </div>
            </div>
          </div>

          {/* Animated elements */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-40 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  )
}

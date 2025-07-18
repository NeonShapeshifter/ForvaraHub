// ForvaraHub/src/components/ui/empty-states.tsx

import React from 'react'
import { Users, BarChart3, Package, CreditCard, Building } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  onAction?: () => void
  actionLabel?: string
}

// Empty State para Usuarios
export const EmptyUsersState = ({ onAction, actionLabel = 'Invitar usuario' }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
    <div className="w-64 h-64 mb-8 relative">
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Fondo con círculos flotantes */}
        <circle cx="80" cy="80" r="40" fill="#E0E7FF" className="animate-float" style={{ animationDelay: '0s' }} />
        <circle cx="320" cy="100" r="30" fill="#DDD6FE" className="animate-float" style={{ animationDelay: '1s' }} />
        <circle cx="200" cy="250" r="35" fill="#EDE9FE" className="animate-float" style={{ animationDelay: '2s' }} />

        {/* Personas estilizadas */}
        <g className="animate-slide-up">
          {/* Persona 1 */}
          <circle cx="120" cy="150" r="25" fill="#004AAD" />
          <path d="M95 180 Q120 170 145 180 L145 220 Q120 230 95 220 Z" fill="#004AAD" />

          {/* Persona 2 */}
          <circle cx="200" cy="140" r="28" fill="#CB6CE6" />
          <path d="M170 175 Q200 165 230 175 L230 220 Q200 230 170 220 Z" fill="#CB6CE6" />

          {/* Persona 3 */}
          <circle cx="280" cy="160" r="23" fill="#5B7FFF" />
          <path d="M258 188 Q280 178 302 188 L302 225 Q280 235 258 225 Z" fill="#5B7FFF" />
        </g>

        {/* Líneas de conexión */}
        <path d="M145 165 L170 155" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5,5" className="animate-draw-line" />
        <path d="M230 155 L258 170" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5,5" className="animate-draw-line" style={{ animationDelay: '0.5s' }} />
      </svg>
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay usuarios en tu equipo</h3>
    <p className="text-gray-500 text-center max-w-md mb-6">
      Invita a miembros de tu equipo para colaborar en Forvara. Podrán acceder a las aplicaciones y trabajar juntos.
    </p>

    <Button onClick={onAction} className="gradient-brand">
      <Users className="w-4 h-4 mr-2" />
      {actionLabel}
    </Button>
  </div>
)

// Empty State para Analytics
export const EmptyAnalyticsState = ({ onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
    <div className="w-64 h-64 mb-8 relative">
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Grid de fondo */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#grid)" opacity="0.5" />

        {/* Barras del gráfico animadas */}
        <g className="animate-slide-up">
          <rect x="80" y="200" width="40" height="0" fill="#004AAD" className="animate-grow-bar" style={{ animationDelay: '0.2s' }} />
          <rect x="140" y="150" width="40" height="0" fill="#CB6CE6" className="animate-grow-bar" style={{ animationDelay: '0.4s' }} />
          <rect x="200" y="100" width="40" height="0" fill="#5B7FFF" className="animate-grow-bar" style={{ animationDelay: '0.6s' }} />
          <rect x="260" y="120" width="40" height="0" fill="#10B981" className="animate-grow-bar" style={{ animationDelay: '0.8s' }} />
        </g>

        {/* Línea de tendencia */}
        <path d="M 100 180 Q 160 120 220 80 T 320 60"
          stroke="#CB6CE6"
          strokeWidth="3"
          fill="none"
          strokeDasharray="400"
          className="animate-draw-line" />

        {/* Puntos en la línea */}
        <circle cx="100" cy="180" r="5" fill="#CB6CE6" className="animate-pulse-dot" style={{ animationDelay: '1s' }} />
        <circle cx="220" cy="80" r="5" fill="#CB6CE6" className="animate-pulse-dot" style={{ animationDelay: '1.2s' }} />
        <circle cx="320" cy="60" r="5" fill="#CB6CE6" className="animate-pulse-dot" style={{ animationDelay: '1.4s' }} />
      </svg>
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no hay datos para mostrar</h3>
    <p className="text-gray-500 text-center max-w-md mb-6">
      Los análisis aparecerán aquí cuando tu equipo comience a usar las aplicaciones. Podrás ver métricas detalladas y tendencias.
    </p>

    <div className="flex gap-3">
      <Button variant="outline" onClick={() => window.location.href = '/marketplace'}>
        <Package className="w-4 h-4 mr-2" />
        Explorar Apps
      </Button>
      <Button onClick={onAction} className="gradient-brand">
        <BarChart3 className="w-4 h-4 mr-2" />
        Ver demo
      </Button>
    </div>
  </div>
)

// Empty State para Facturación
export const EmptyBillingState = ({ onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
    <div className="w-64 h-64 mb-8 relative">
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Monedas flotantes */}
        <g className="animate-float">
          <circle cx="100" cy="100" r="30" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          <text x="100" y="108" textAnchor="middle" fill="#FFA500" fontSize="24" fontWeight="bold">$</text>
        </g>

        <g className="animate-float" style={{ animationDelay: '1s' }}>
          <circle cx="300" cy="80" r="25" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          <text x="300" y="87" textAnchor="middle" fill="#FFA500" fontSize="20" fontWeight="bold">$</text>
        </g>

        <g className="animate-float" style={{ animationDelay: '2s' }}>
          <circle cx="200" cy="120" r="35" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          <text x="200" y="130" textAnchor="middle" fill="#FFA500" fontSize="28" fontWeight="bold">$</text>
        </g>

        {/* Tarjeta de crédito */}
        <g className="animate-slide-up">
          <rect x="120" y="180" width="160" height="100" rx="10" fill="#004AAD" />
          <rect x="140" y="200" width="120" height="8" rx="4" fill="#5B7FFF" />
          <rect x="140" y="220" width="80" height="8" rx="4" fill="#5B7FFF" />
          <circle cx="240" cy="250" r="15" fill="#CB6CE6" opacity="0.5" />
          <circle cx="260" cy="250" r="15" fill="#FFD700" opacity="0.5" />
        </g>
      </svg>
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">Configura tu método de pago</h3>
    <p className="text-gray-500 text-center max-w-md mb-6">
      Agrega un método de pago para activar tu suscripción cuando termine el período de prueba.
    </p>

    <Button onClick={onAction} className="gradient-brand">
      <CreditCard className="w-4 h-4 mr-2" />
      Agregar método de pago
    </Button>
  </div>
)

// Empty State para Empresas
export const EmptyCompaniesState = ({ onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
    <div className="w-64 h-64 mb-8 relative">
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Edificios con animación de construcción */}
        <g className="animate-slide-up">
          {/* Edificio 1 */}
          <rect x="60" y="150" width="80" height="120" fill="#004AAD" className="animate-grow-building" />
          <rect x="70" y="160" width="15" height="20" fill="#5B7FFF" className="animate-fade-in" style={{ animationDelay: '0.5s' }} />
          <rect x="95" y="160" width="15" height="20" fill="#5B7FFF" className="animate-fade-in" style={{ animationDelay: '0.6s' }} />
          <rect x="115" y="160" width="15" height="20" fill="#5B7FFF" className="animate-fade-in" style={{ animationDelay: '0.7s' }} />

          {/* Edificio 2 */}
          <rect x="160" y="100" width="100" height="170" fill="#CB6CE6" className="animate-grow-building" style={{ animationDelay: '0.3s' }} />
          <rect x="175" y="115" width="20" height="25" fill="#E4A0F7" className="animate-fade-in" style={{ animationDelay: '0.8s' }} />
          <rect x="205" y="115" width="20" height="25" fill="#E4A0F7" className="animate-fade-in" style={{ animationDelay: '0.9s' }} />
          <rect x="235" y="115" width="20" height="25" fill="#E4A0F7" className="animate-fade-in" style={{ animationDelay: '1s' }} />

          {/* Edificio 3 */}
          <rect x="280" y="180" width="70" height="90" fill="#5B7FFF" className="animate-grow-building" style={{ animationDelay: '0.6s' }} />
          <rect x="290" y="195" width="15" height="20" fill="#8DA4FF" className="animate-fade-in" style={{ animationDelay: '1.1s' }} />
          <rect x="315" y="195" width="15" height="20" fill="#8DA4FF" className="animate-fade-in" style={{ animationDelay: '1.2s' }} />
        </g>

        {/* Base/Suelo */}
        <rect x="0" y="270" width="400" height="30" fill="#E5E7EB" />

        {/* Nubes */}
        <ellipse cx="100" cy="50" rx="30" ry="15" fill="#F3F4F6" className="animate-float" />
        <ellipse cx="300" cy="40" rx="40" ry="20" fill="#F3F4F6" className="animate-float" style={{ animationDelay: '2s' }} />
      </svg>
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin empresas registradas</h3>
    <p className="text-gray-500 text-center max-w-md mb-6">
      Crea tu primera empresa para comenzar a gestionar equipos, aplicaciones y recursos de manera organizada.
    </p>

    <Button onClick={onAction} className="gradient-brand">
      <Building className="w-4 h-4 mr-2" />
      Crear empresa
    </Button>
  </div>
)

// Empty State genérico para Apps
export const EmptyAppsState = ({ onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
    <div className="w-64 h-64 mb-8 relative">
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Cajas cayendo */}
        <g className="animate-bounce-fall">
          <rect x="80" y="50" width="60" height="60" rx="10" fill="#004AAD" transform="rotate(15 110 80)" />
          <rect x="90" y="60" width="40" height="8" rx="4" fill="#5B7FFF" transform="rotate(15 110 80)" />
        </g>

        <g className="animate-bounce-fall" style={{ animationDelay: '0.3s' }}>
          <rect x="180" y="30" width="70" height="70" rx="10" fill="#CB6CE6" transform="rotate(-10 215 65)" />
          <rect x="195" y="45" width="40" height="8" rx="4" fill="#E4A0F7" transform="rotate(-10 215 65)" />
        </g>

        <g className="animate-bounce-fall" style={{ animationDelay: '0.6s' }}>
          <rect x="280" y="60" width="55" height="55" rx="10" fill="#5B7FFF" transform="rotate(20 307 87)" />
          <rect x="290" y="75" width="35" height="6" rx="3" fill="#8DA4FF" transform="rotate(20 307 87)" />
        </g>

        {/* Plataforma */}
        <rect x="50" y="200" width="300" height="15" rx="7" fill="#E5E7EB" />

        {/* Sparkles */}
        <g className="animate-sparkle">
          <path d="M 150 150 l 5 0 l -5 5 l -5 -5 l 5 0 l 0 -5 l 5 5 l -5 0 z" fill="#FFD700" />
          <path d="M 250 130 l 3 0 l -3 3 l -3 -3 l 3 0 l 0 -3 l 3 3 l -3 0 z" fill="#FFD700" />
          <path d="M 320 170 l 4 0 l -4 4 l -4 -4 l 4 0 l 0 -4 l 4 4 l -4 0 z" fill="#FFD700" />
        </g>
      </svg>
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes aplicaciones instaladas</h3>
    <p className="text-gray-500 text-center max-w-md mb-6">
      Explora el marketplace y descubre aplicaciones que potenciarán la productividad de tu equipo.
    </p>

    <Button onClick={onAction} className="gradient-brand">
      <Package className="w-4 h-4 mr-2" />
      Explorar Marketplace
    </Button>
  </div>
)

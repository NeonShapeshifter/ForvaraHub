// ForvaraHub/src/components/ui/onboarding-tour.tsx

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react'
import { Button } from './button'

interface TourStep {
  id: string
  title: string
  content: string
  target: string // CSS selector
  placement?: 'top' | 'bottom' | 'left' | 'right'
  action?: {
    label: string
    onClick: () => void
  }
}

interface OnboardingTourProps {
  steps: TourStep[]
  onComplete?: () => void
  onSkip?: () => void
}

export function OnboardingTour({ steps, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const tourRef = useRef<HTMLDivElement>(null)

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  useEffect(() => {
    if (currentStepData?.target) {
      const element = document.querySelector(currentStepData.target)
      if (element) {
        const rect = element.getBoundingClientRect()
        setTargetRect(rect)

        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Add highlight class
        element.classList.add('tour-highlight')

        return () => {
          element.classList.remove('tour-highlight')
        }
      }
    }
  }, [currentStep, currentStepData])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    onComplete?.()
  }

  const handleSkip = () => {
    setIsVisible(false)
    onSkip?.()
  }

  if (!isVisible || !targetRect) return null

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const placement = currentStepData.placement || 'bottom'
    const tooltipWidth = 320
    const tooltipHeight = 200
    const offset = 20

    let top = 0
    let left = 0

    switch (placement) {
      case 'top':
        top = targetRect.top - tooltipHeight - offset
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)
        break
      case 'bottom':
        top = targetRect.bottom + offset
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)
        break
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2)
        left = targetRect.left - tooltipWidth - offset
        break
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2)
        left = targetRect.right + offset
        break
    }

    // Keep tooltip within viewport
    const padding = 20
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding))
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding))

    return { top, left }
  }

  const tooltipPosition = getTooltipPosition()

  return createPortal(
    <>
      {/* Backdrop with spotlight */}
      <div className="fixed inset-0 z-[9998]">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm">
          {/* Spotlight cutout */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="spotlight">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={targetRect.left - 8}
                  y={targetRect.top - 8}
                  width={targetRect.width + 16}
                  height={targetRect.height + 16}
                  rx="8"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="black"
              fillOpacity="0.5"
              mask="url(#spotlight)"
            />
          </svg>
        </div>

        {/* Highlight border */}
        <div
          className="absolute border-2 border-white/50 rounded-lg animate-pulse-glow"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        ref={tourRef}
        className="fixed z-[9999] w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-slide-up"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`
        }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full gradient-brand transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white flex-shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentStepData.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Paso {currentStep + 1} de {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            {currentStepData.content}
          </p>

          {/* Custom action */}
          {currentStepData.action && (
            <div className="mb-4">
              <Button
                onClick={currentStepData.action.onClick}
                className="w-full gradient-brand text-white"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                {currentStepData.action.label}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Omitir tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="gradient-brand text-white"
                size="sm"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Finalizar
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20" />
      </div>
    </>,
    document.body
  )
}

// Welcome modal component
export function WelcomeModal({
  userName,
  onStart,
  onSkip
}: {
  userName: string
  onStart: () => void
  onSkip: () => void
}) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Gradient header */}
        <div className="h-2 gradient-brand" />

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-brand flex items-center justify-center text-white animate-pulse-glow">
            <Sparkles className="w-10 h-10" />
          </div>

          {/* Welcome message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {userName}! 🎉
          </h2>
          <p className="text-gray-600 mb-8">
            Estamos emocionados de tenerte aquí. Te mostraremos cómo sacar el máximo provecho de Forvara Hub en solo 2 minutos.
          </p>

          {/* Features preview */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Tour guiado</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600">Tips rápidos</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Configuración</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setIsVisible(false)
                onSkip()
              }}
              variant="outline"
              className="flex-1"
            >
              Explorar solo
            </Button>
            <Button
              onClick={() => {
                setIsVisible(false)
                onStart()
              }}
              className="flex-1 gradient-brand text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Iniciar tour
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20" />
      </div>
    </div>,
    document.body
  )
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    return localStorage.getItem('forvara_onboarding_completed') === 'true'
  })

  const completeTour = () => {
    setHasSeenTour(true)
    localStorage.setItem('forvara_onboarding_completed', 'true')
  }

  const resetTour = () => {
    setHasSeenTour(false)
    localStorage.removeItem('forvara_onboarding_completed')
  }

  return {
    hasSeenTour,
    completeTour,
    resetTour
  }
}

// CSS for tour highlight
const tourStyles = `
  .tour-highlight {
    position: relative;
    z-index: 9997 !important;
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    50% {
      box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0);
    }
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-out infinite;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = tourStyles
  document.head.appendChild(style)
}

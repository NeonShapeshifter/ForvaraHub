import React from 'react'
import PhoneInput, { Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { Label } from './label'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

// LATAM countries + Sweden prioritized (Panama first)
const SUPPORTED_COUNTRIES: Country[] = [
  'PA', 'MX', 'CO', 'CR', 'GT', 'HN', 'NI', 'SV', 'BZ', 'BR', 'AR', 'CL', 'PE', 'UY', 'EC', 'BO', 'PY', 'VE', 'GY', 'SR', 'SE', 'US', 'CA', 'ES'
]

interface PhoneInputProps {
  id?: string
  name?: string
  label?: string
  value?: string
  onChange: (value: string | undefined) => void
  onBlur?: () => void
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  labelClassName?: string
}

export function PhoneInputField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder = 'Ingresa tu número de teléfono',
  disabled = false,
  required = false,
  className,
  labelClassName,
  ...props
}: PhoneInputProps) {
  const inputId = id || name
  const hasValue = value && value.length > 0
  const isValid = hasValue && !error

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium text-gray-700 dark:text-gray-300',
            required && "after:content-['*'] after:ml-0.5 after:text-red-500",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        <PhoneInput
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          defaultCountry="PA"
          limitMaxLength={true}
          smartCaret={true}
          countries={SUPPORTED_COUNTRIES}
          countryCallingCodeEditable={false}
          international={true}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'phone-input-container relative',
            className
          )}
          style={{
            '--PhoneInputCountryFlag-aspectRatio': '1.5',
            '--PhoneInputCountryFlag-height': '1em',
            '--PhoneInputCountrySelectArrow-color': '#6b7280',
            '--PhoneInputCountrySelectArrow-opacity': '0.8'
          } as React.CSSProperties}
          numberInputProps={{
            className: cn(
              // Base styles - matching other inputs exactly
              'flex h-12 w-full rounded-lg border-2 bg-background px-3 py-2 text-base',
              'ring-offset-background placeholder:text-muted-foreground/60',
              'transition-all duration-200 ease-in-out',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'pl-20', // Space for country selector

              // Normal state
              'border-gray-200 dark:border-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',

              // Valid state (subtle green)
              isValid && 'border-emerald-300 dark:border-emerald-600 bg-emerald-50/30 dark:bg-emerald-900/10',
              isValid && 'focus:border-emerald-500 focus:ring-emerald-500/20',

              // Error state (softer red)
              error && 'border-red-300 dark:border-red-600 bg-red-50/30 dark:bg-red-900/10',
              error && 'focus:border-red-400 focus:ring-red-500/20',

              // Disabled state
              disabled && 'bg-muted/50 text-muted-foreground cursor-not-allowed border-muted'
            ),
            placeholder: placeholder,
            disabled: disabled,
            autoComplete: 'tel'
          }}
          countrySelectProps={{
            className: cn(
              // Country selector - integrated design
              'absolute left-3 top-1/2 transform -translate-y-1/2 z-10',
              'flex items-center space-x-2 text-sm font-medium',
              'border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'hover:bg-muted/30 rounded-md px-1.5 py-1 transition-colors duration-200',
              disabled && 'cursor-not-allowed opacity-50'
            )
          }}
          {...props}
        />

        {/* Status icon */}
        {hasValue && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : error ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : null}
          </div>
        )}
      </div>

      {/* Error message - much more subtle */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30 rounded-md p-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-80" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Success feedback - ONLY when valid, more subtle */}
      {isValid && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Número válido</span>
        </div>
      )}

      {/* Helpful hint when empty */}
      {!hasValue && !error && !disabled && (
        <p className="text-xs text-muted-foreground/80 leading-relaxed">
          Selecciona tu país e ingresa tu número. Soporte completo para LATAM y otros países.
        </p>
      )}
    </div>
  )
}

export default PhoneInputField

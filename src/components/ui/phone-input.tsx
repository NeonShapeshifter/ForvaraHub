import React from 'react'
import PhoneInput, { Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { Label } from './label'

// LATAM countries prioritized (Panama first)
const LATAM_COUNTRIES: Country[] = [
  'PA', // Panama (default)
  'MX', // Mexico
  'CO', // Colombia
  'CR', // Costa Rica
  'GT', // Guatemala
  'BR', // Brazil
  'AR', // Argentina
  'CL', // Chile
  'PE', // Peru
  'UY', // Uruguay
  'EC', // Ecuador
  'BO', // Bolivia
  'PY', // Paraguay
  'VE', // Venezuela
  'HN', // Honduras
  'NI', // Nicaragua
  'SV', // El Salvador
  'BZ', // Belize
  'SR', // Suriname
  'GY', // Guyana
  'US', // United States (for LATAM diaspora)
  'CA', // Canada (for LATAM diaspora)
  'ES', // Spain (for business connections)
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
  placeholder = "Ingresa tu número de teléfono",
  disabled = false,
  required = false,
  className,
  labelClassName,
  ...props
}: PhoneInputProps) {
  const inputId = id || name

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium text-gray-700 dark:text-gray-300",
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
          countries={LATAM_COUNTRIES}
          countryCallingCodeEditable={false}
          international={true}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            // Container styles
            "phone-input-container",
            className
          )}
          style={{
            // Custom CSS variables for consistent theming
            '--PhoneInputCountryFlag-aspectRatio': '1.5',
            '--PhoneInputCountryFlag-height': '1em',
            '--PhoneInputCountrySelectArrow-color': '#6b7280',
            '--PhoneInputCountrySelectArrow-opacity': '0.8',
          } as React.CSSProperties}
          numberInputProps={{
            className: cn(
              // Input field styles matching your design system
              "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              "pl-16", // Space for country selector
              error && "border-red-500 focus-visible:ring-red-500",
              disabled && "bg-gray-50 text-gray-500 cursor-not-allowed"
            ),
            placeholder: placeholder,
            disabled: disabled,
          }}
          countrySelectProps={{
            className: cn(
              // Country selector styles
              "absolute left-3 top-1/2 transform -translate-y-1/2 z-10",
              "flex items-center space-x-1 text-sm",
              "border-0 bg-transparent focus:outline-none focus:ring-0",
              disabled && "cursor-not-allowed opacity-50"
            ),
          }}
          {...props}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Help text for LATAM users */}
      {!error && !disabled && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          🌎 Selecciona tu país y ingresa tu número. Formato automático para LATAM.
        </p>
      )}
    </div>
  )
}

// Export default for easier imports
export default PhoneInputField
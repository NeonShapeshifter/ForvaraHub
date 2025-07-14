import { useState, useEffect } from 'react'
import { parsePhoneNumber, isValidPhoneNumber, formatPhoneNumber } from 'react-phone-number-input'

// LATAM phone number format specifications
interface CountryPhoneSpec {
  code: string
  name: string
  flag: string
  callingCode: string
  mobilePattern: RegExp
  landlinePattern?: RegExp
  digitCount: number
  format: string
  example: string
}

const LATAM_PHONE_SPECS: Record<string, CountryPhoneSpec> = {
  PA: {
    code: 'PA',
    name: 'Panamá',
    flag: '🇵🇦',
    callingCode: '+507',
    mobilePattern: /^[6][0-9]{7}$/,
    landlinePattern: /^[2-5][0-9]{6,7}$/,
    digitCount: 8,
    format: 'XXXX-XXXX',
    example: '6123-4567'
  },
  CO: {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    callingCode: '+57',
    mobilePattern: /^[3][0-9]{9}$/,
    digitCount: 10,
    format: '3XX XXX XXXX',
    example: '312 345 6789'
  },
  MX: {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    callingCode: '+52',
    mobilePattern: /^1[0-9]{10}$/,
    digitCount: 11,
    format: '1 XXX XXX XXXX',
    example: '1 555 123 4567'
  },
  AR: {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    callingCode: '+54',
    mobilePattern: /^9[0-9]{10}$/,
    digitCount: 11,
    format: '9 XX XXXX-XXXX',
    example: '9 11 1234-5678'
  },
  CL: {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    callingCode: '+56',
    mobilePattern: /^9[0-9]{8}$/,
    digitCount: 9,
    format: '9 XXXX XXXX',
    example: '9 1234 5678'
  },
  BR: {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    callingCode: '+55',
    mobilePattern: /^[0-9]{2}9[0-9]{8}$/,
    digitCount: 11,
    format: 'XX 9XXXX-XXXX',
    example: '11 91234-5678'
  },
  PE: {
    code: 'PE',
    name: 'Perú',
    flag: '🇵🇪',
    callingCode: '+51',
    mobilePattern: /^9[0-9]{8}$/,
    digitCount: 9,
    format: '9XX XXX XXX',
    example: '912 345 678'
  },
  EC: {
    code: 'EC',
    name: 'Ecuador',
    flag: '🇪🇨',
    callingCode: '+593',
    mobilePattern: /^9[0-9]{8}$/,
    digitCount: 9,
    format: '9X XXX XXXX',
    example: '99 123 4567'
  },
  CR: {
    code: 'CR',
    name: 'Costa Rica',
    flag: '🇨🇷',
    callingCode: '+506',
    mobilePattern: /^[6-8][0-9]{7}$/,
    digitCount: 8,
    format: 'XXXX-XXXX',
    example: '8123-4567'
  },
  SV: {
    code: 'SV',
    name: 'El Salvador',
    flag: '🇸🇻',
    callingCode: '+503',
    mobilePattern: /^[67][0-9]{7}$/,
    digitCount: 8,
    format: 'XXXX-XXXX',
    example: '7123-4567'
  },
  GT: {
    code: 'GT',
    name: 'Guatemala',
    flag: '🇬🇹',
    callingCode: '+502',
    mobilePattern: /^[45][0-9]{7}$/,
    digitCount: 8,
    format: 'XXXX XXXX',
    example: '5123 4567'
  },
  HN: {
    code: 'HN',
    name: 'Honduras',
    flag: '🇭🇳',
    callingCode: '+504',
    mobilePattern: /^[9][0-9]{7}$/,
    digitCount: 8,
    format: 'XXXX-XXXX',
    example: '9123-4567'
  },
  NI: {
    code: 'NI',
    name: 'Nicaragua',
    flag: '🇳🇮',
    callingCode: '+505',
    mobilePattern: /^[8][0-9]{7}$/,
    digitCount: 8,
    format: 'XXXX XXXX',
    example: '8123 4567'
  },
  BZ: {
    code: 'BZ',
    name: 'Belice',
    flag: '🇧🇿',
    callingCode: '+501',
    mobilePattern: /^[6][0-9]{6}$/,
    digitCount: 7,
    format: 'XXX-XXXX',
    example: '612-3456'
  },
  UY: {
    code: 'UY',
    name: 'Uruguay',
    flag: '🇺🇾',
    callingCode: '+598',
    mobilePattern: /^9[0-9]{7}$/,
    digitCount: 8,
    format: '9X XXX XXX',
    example: '91 234 567'
  },
  PY: {
    code: 'PY',
    name: 'Paraguay',
    flag: '🇵🇾',
    callingCode: '+595',
    mobilePattern: /^9[0-9]{8}$/,
    digitCount: 9,
    format: '9XX XXX XXX',
    example: '961 234 567'
  },
  BO: {
    code: 'BO',
    name: 'Bolivia',
    flag: '🇧🇴',
    callingCode: '+591',
    mobilePattern: /^[67][0-9]{7}$/,
    digitCount: 8,
    format: 'XXXX XXXX',
    example: '7123 4567'
  },
  VE: {
    code: 'VE',
    name: 'Venezuela',
    flag: '🇻🇪',
    callingCode: '+58',
    mobilePattern: /^4[0-9]{9}$/,
    digitCount: 10,
    format: '4XX XXX XXXX',
    example: '412 345 6789'
  },
  GY: {
    code: 'GY',
    name: 'Guyana',
    flag: '🇬🇾',
    callingCode: '+592',
    mobilePattern: /^[6][0-9]{6}$/,
    digitCount: 7,
    format: 'XXX XXXX',
    example: '612 3456'
  },
  SR: {
    code: 'SR',
    name: 'Surinam',
    flag: '🇸🇷',
    callingCode: '+597',
    mobilePattern: /^[678][0-9]{6}$/,
    digitCount: 7,
    format: 'XXX-XXXX',
    example: '712-3456'
  },
  SE: {
    code: 'SE',
    name: 'Suecia',
    flag: '🇸🇪',
    callingCode: '+46',
    mobilePattern: /^7[0-9]{8}$/,
    digitCount: 9,
    format: '7X XXX XX XX',
    example: '70 123 45 67'
  }
}

interface UsePhoneValidationProps {
  value?: string
  required?: boolean
  allowedCountries?: string[]
}

interface UsePhoneValidationReturn {
  isValid: boolean
  isValidating: boolean
  error: string | null
  formattedNumber: string | null
  countryCode: string | null
  nationalNumber: string | null
  internationalFormat: string | null
  e164Format: string | null
  countrySpec: CountryPhoneSpec | null
  formatHint: string | null
}

export function usePhoneValidation({
  value,
  required = false,
  allowedCountries = []
}: UsePhoneValidationProps): UsePhoneValidationReturn {
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formattedNumber, setFormattedNumber] = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [nationalNumber, setNationalNumber] = useState<string | null>(null)
  const [internationalFormat, setInternationalFormat] = useState<string | null>(null)
  const [e164Format, setE164Format] = useState<string | null>(null)
  const [countrySpec, setCountrySpec] = useState<CountryPhoneSpec | null>(null)
  const [formatHint, setFormatHint] = useState<string | null>(null)

  useEffect(() => {
    const resetState = () => {
      setFormattedNumber(null)
      setCountryCode(null)
      setNationalNumber(null)
      setInternationalFormat(null)
      setE164Format(null)
      setCountrySpec(null)
      setFormatHint(null)
    }

    if (!value) {
      if (required) {
        setError('El número de teléfono es obligatorio')
        setIsValid(false)
      } else {
        setError(null)
        setIsValid(true)
      }
      resetState()
      return
    }

    setIsValidating(true)
    
    const timeoutId = setTimeout(() => {
      try {
        // Basic phone number validation
        const valid = isValidPhoneNumber(value)
        
        if (!valid) {
          setError('Formato de número inválido')
          setIsValid(false)
          resetState()
          setIsValidating(false)
          return
        }

        // Parse the phone number
        const phoneNumber = parsePhoneNumber(value)
        
        if (!phoneNumber) {
          setError('No se pudo procesar el número')
          setIsValid(false)
          resetState()
          setIsValidating(false)
          return
        }

        const country = phoneNumber.country
        const nationalNum = phoneNumber.nationalNumber
        
        // Check if country is allowed
        if (allowedCountries.length > 0 && !allowedCountries.includes(country || '')) {
          setError(`País no soportado: ${country || 'desconocido'}`)
          setIsValid(false)
          resetState()
          setIsValidating(false)
          return
        }

        // Get country-specific validation rules
        const spec = country ? LATAM_PHONE_SPECS[country] : null
        
        if (spec) {
          // Validate against LATAM + Sweden specific rules
          const cleanNumber = nationalNum.replace(/\D/g, '')
          
          // Check patterns first, then digit count based on pattern
          const isMobile = spec.mobilePattern.test(cleanNumber)
          const isLandline = spec.landlinePattern ? spec.landlinePattern.test(cleanNumber) : false
          
          if (!isMobile && !isLandline) {
            setError(`Número no válido para ${spec.name}`)
            setIsValid(false)
            resetState()
            setFormatHint(`Formato: ${spec.callingCode} ${spec.format} (ej: ${spec.example})`)
            setCountrySpec(spec)
            setIsValidating(false)
            return
          }
          
          // For mobile numbers, always check digit count
          if (isMobile && cleanNumber.length !== spec.digitCount) {
            setError(`Número móvil debe tener ${spec.digitCount} dígitos para ${spec.name}`)
            setIsValid(false)
            resetState()
            setFormatHint(`Formato: ${spec.callingCode} ${spec.format} (ej: ${spec.example})`)
            setCountrySpec(spec)
            setIsValidating(false)
            return
          }
          
          // For landlines, digit count already validated by regex pattern
          
          setCountrySpec(spec)
          setFormatHint(`${spec.flag} ${spec.name} - Formato válido`)
        }

        // All validations passed
        setError(null)
        setIsValid(true)
        setFormattedNumber(phoneNumber.formatInternational())
        setCountryCode(country || null)
        setNationalNumber(phoneNumber.formatNational())
        setInternationalFormat(phoneNumber.formatInternational())
        setE164Format(phoneNumber.format('E.164'))
        
      } catch (err) {
        console.error('Phone validation error:', err)
        setError('Error al validar el número')
        setIsValid(false)
        resetState()
      } finally {
        setIsValidating(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value, required, allowedCountries])

  return {
    isValid,
    isValidating,
    error,
    formattedNumber,
    countryCode,
    nationalNumber,
    internationalFormat,
    e164Format,
    countrySpec,
    formatHint,
  }
}

// Helper function to get country info for LATAM + Sweden
export function getCountryInfo(countryCode: string | null) {
  if (!countryCode) {
    return { name: null, flag: null, code: null }
  }
  
  const spec = LATAM_PHONE_SPECS[countryCode]
  if (spec) {
    return {
      name: spec.name,
      flag: spec.flag,
      code: spec.code,
      callingCode: spec.callingCode,
      format: spec.format,
      example: spec.example
    }
  }
  
  // Fallback for other supported countries
  const fallbackNames: Record<string, string> = {
    US: 'Estados Unidos',
    CA: 'Canadá',
    ES: 'España',
    FR: 'Francia',
    IT: 'Italia',
    DE: 'Alemania',
    GB: 'Reino Unido'
  }
  
  const fallbackFlags: Record<string, string> = {
    US: '🇺🇸',
    CA: '🇨🇦', 
    ES: '🇪🇸',
    FR: '🇫🇷',
    IT: '🇮🇹',
    DE: '🇩🇪',
    GB: '🇬🇧'
  }
  
  return {
    name: fallbackNames[countryCode] || countryCode,
    flag: fallbackFlags[countryCode] || '🌍',
    code: countryCode
  }
}

// Helper to check if a country is in LATAM
export function isLATAMCountry(countryCode: string | null): boolean {
  return countryCode ? Object.keys(LATAM_PHONE_SPECS).includes(countryCode) : false
}

// Get all supported LATAM countries for dropdown
export function getSupportedLATAMCountries() {
  return Object.values(LATAM_PHONE_SPECS)
}

// Validate phone number format for a specific country
export function validateCountryPhoneFormat(phoneNumber: string, countryCode: string): {
  isValid: boolean
  error?: string
  suggestion?: string
} {
  const spec = LATAM_PHONE_SPECS[countryCode]
  if (!spec) {
    return { isValid: false, error: `País no soportado: ${countryCode}` }
  }
  
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  if (cleanNumber.length !== spec.digitCount) {
    return {
      isValid: false,
      error: `Debe tener ${spec.digitCount} dígitos`,
      suggestion: `Ejemplo: ${spec.callingCode} ${spec.example}`
    }
  }
  
  if (!spec.mobilePattern.test(cleanNumber)) {
    if (spec.landlinePattern && spec.landlinePattern.test(cleanNumber)) {
      return { isValid: true }
    }
    return {
      isValid: false,
      error: `Formato no válido para ${spec.name}`,
      suggestion: `Formato móvil: ${spec.callingCode} ${spec.example}`
    }
  }
  
  return { isValid: true }
}
import { useState, useEffect } from 'react'
import { parsePhoneNumber, isValidPhoneNumber, formatPhoneNumber } from 'react-phone-number-input'

interface UsePhoneValidationProps {
  value?: string
  required?: boolean
  countries?: string[]
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
}

export function usePhoneValidation({
  value,
  required = false,
  countries = []
}: UsePhoneValidationProps): UsePhoneValidationReturn {
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formattedNumber, setFormattedNumber] = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [nationalNumber, setNationalNumber] = useState<string | null>(null)
  const [internationalFormat, setInternationalFormat] = useState<string | null>(null)
  const [e164Format, setE164Format] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      // Handle empty value
      if (required) {
        setError('Número de teléfono es requerido')
        setIsValid(false)
      } else {
        setError(null)
        setIsValid(true)
      }
      setFormattedNumber(null)
      setCountryCode(null)
      setNationalNumber(null)
      setInternationalFormat(null)
      setE164Format(null)
      return
    }

    setIsValidating(true)
    
    // Use setTimeout to debounce validation (simulate async validation)
    const timeoutId = setTimeout(() => {
      try {
        // Check if the number is valid
        const valid = isValidPhoneNumber(value)
        
        if (!valid) {
          setError('Número de teléfono inválido')
          setIsValid(false)
          setFormattedNumber(null)
          setCountryCode(null)
          setNationalNumber(null)
          setInternationalFormat(null)
          setE164Format(null)
          setIsValidating(false)
          return
        }

        // Parse the phone number for additional info
        const phoneNumber = parsePhoneNumber(value)
        
        if (!phoneNumber) {
          setError('No se pudo analizar el número')
          setIsValid(false)
          setFormattedNumber(null)
          setCountryCode(null)
          setNationalNumber(null)
          setInternationalFormat(null)
          setE164Format(null)
          setIsValidating(false)
          return
        }

        // Check if country is in allowed list
        if (countries.length > 0 && !countries.includes(phoneNumber.country || '')) {
          setError(`País no soportado. Países permitidos: ${countries.join(', ')}`)
          setIsValid(false)
          setFormattedNumber(null)
          setCountryCode(null)
          setNationalNumber(null)
          setInternationalFormat(null)
          setE164Format(null)
          setIsValidating(false)
          return
        }

        // All validations passed
        setError(null)
        setIsValid(true)
        setFormattedNumber(phoneNumber.formatInternational())
        setCountryCode(phoneNumber.country || null)
        setNationalNumber(phoneNumber.formatNational())
        setInternationalFormat(phoneNumber.formatInternational())
        setE164Format(phoneNumber.format('E.164'))
        
      } catch (err) {
        console.error('Phone validation error:', err)
        setError('Error validando número de teléfono')
        setIsValid(false)
        setFormattedNumber(null)
        setCountryCode(null)
        setNationalNumber(null)
        setInternationalFormat(null)
        setE164Format(null)
      } finally {
        setIsValidating(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [value, required, countries])

  return {
    isValid,
    isValidating,
    error,
    formattedNumber,
    countryCode,
    nationalNumber,
    internationalFormat,
    e164Format,
  }
}

// Helper function to get country info for LATAM
export function getCountryInfo(countryCode: string | null) {
  const countryNames: Record<string, string> = {
    PA: 'Panamá',
    MX: 'México',
    CO: 'Colombia',
    CR: 'Costa Rica',
    GT: 'Guatemala',
    BR: 'Brasil',
    AR: 'Argentina',
    CL: 'Chile',
    PE: 'Perú',
    UY: 'Uruguay',
    EC: 'Ecuador',
    BO: 'Bolivia',
    PY: 'Paraguay',
    VE: 'Venezuela',
    HN: 'Honduras',
    NI: 'Nicaragua',
    SV: 'El Salvador',
    BZ: 'Belice',
    SR: 'Surinam',
    GY: 'Guyana',
    US: 'Estados Unidos',
    CA: 'Canadá',
    ES: 'España',
  }

  const countryFlags: Record<string, string> = {
    PA: '🇵🇦',
    MX: '🇲🇽',
    CO: '🇨🇴',
    CR: '🇨🇷',
    GT: '🇬🇹',
    BR: '🇧🇷',
    AR: '🇦🇷',
    CL: '🇨🇱',
    PE: '🇵🇪',
    UY: '🇺🇾',
    EC: '🇪🇨',
    BO: '🇧🇴',
    PY: '🇵🇾',
    VE: '🇻🇪',
    HN: '🇭🇳',
    NI: '🇳🇮',
    SV: '🇸🇻',
    BZ: '🇧🇿',
    SR: '🇸🇷',
    GY: '🇬🇾',
    US: '🇺🇸',
    CA: '🇨🇦',
    ES: '🇪🇸',
  }

  return {
    name: countryCode ? countryNames[countryCode] || countryCode : null,
    flag: countryCode ? countryFlags[countryCode] || '🌍' : null,
    code: countryCode,
  }
}

// Helper to check if a country is in LATAM
export function isLATAMCountry(countryCode: string | null): boolean {
  const latamCountries = [
    'PA', 'MX', 'CO', 'CR', 'GT', 'BR', 'AR', 'CL', 'PE', 'UY',
    'EC', 'BO', 'PY', 'VE', 'HN', 'NI', 'SV', 'BZ', 'SR', 'GY'
  ]
  return countryCode ? latamCountries.includes(countryCode) : false
}
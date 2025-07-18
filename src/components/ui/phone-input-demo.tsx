import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { PhoneInputField } from './phone-input'
import { usePhoneValidation, getCountryInfo, isLATAMCountry } from '@/hooks/usePhoneValidation'
import { Badge } from './badge'
import { CheckCircle, AlertCircle, Phone, Globe } from 'lucide-react'

export function PhoneInputDemo() {
  const [phone1, setPhone1] = useState('')
  const [phone2, setPhone2] = useState('+50712345678') // Pre-filled Panama number
  const [phone3, setPhone3] = useState('')

  const validation1 = usePhoneValidation({ value: phone1, required: true })
  const validation2 = usePhoneValidation({ value: phone2, required: false })
  const validation3 = usePhoneValidation({
    value: phone3,
    required: true,
    countries: ['PA', 'MX', 'CO'] // Restricted to specific countries
  })

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">📱 Phone Input Component Demo</h1>
        <p className="text-muted-foreground">
          Professional LATAM phone number input with real-time validation
        </p>
      </div>

      {/* Basic Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Basic Phone Input
          </CardTitle>
          <CardDescription>
            Standard phone input with LATAM countries prioritized and real-time validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PhoneInputField
            label="Your Phone Number"
            value={phone1}
            onChange={setPhone1}
            error={validation1.error || undefined}
            placeholder="Enter your phone number"
            required
          />

          {phone1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Validation Status:</h4>
                <div className={`flex items-center gap-2 ${validation1.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation1.isValid ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {validation1.isValid ? 'Valid number' : 'Invalid number'}
                </div>
                {validation1.isValidating && (
                  <div className="text-blue-600">
                    🔄 Validating...
                  </div>
                )}
              </div>

              {validation1.isValid && (
                <div className="space-y-2">
                  <h4 className="font-medium">Parsed Information:</h4>
                  <div className="space-y-1 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <div><strong>Country:</strong> {getCountryInfo(validation1.countryCode).flag} {getCountryInfo(validation1.countryCode).name}</div>
                    <div><strong>National:</strong> {validation1.nationalNumber}</div>
                    <div><strong>International:</strong> {validation1.internationalFormat}</div>
                    <div><strong>E.164:</strong> {validation1.e164Format}</div>
                    <div className="flex items-center gap-2">
                      <strong>LATAM:</strong>
                      {isLATAMCountry(validation1.countryCode) ? (
                        <Badge className="bg-green-100 text-green-800">Yes 🌎</Badge>
                      ) : (
                        <Badge variant="secondary">No 🌍</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pre-filled Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Pre-filled Valid Number
          </CardTitle>
          <CardDescription>
            Example with a pre-filled Panama number showing successful validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PhoneInputField
            label="Pre-filled Panama Number"
            value={phone2}
            onChange={setPhone2}
            error={validation2.error || undefined}
            placeholder="This field is pre-filled"
            className={validation2.isValid ? 'valid' : ''}
          />

          {validation2.isValid && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">✅ Valid LATAM Number Detected!</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
                <div>
                  <strong>Country:</strong> {getCountryInfo(validation2.countryCode).flag} {getCountryInfo(validation2.countryCode).name}
                </div>
                <div>
                  <strong>Format:</strong> {validation2.formattedNumber}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restricted Countries Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Country-Restricted Input
          </CardTitle>
          <CardDescription>
            Phone input restricted to specific countries (Panama, Mexico, Colombia only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PhoneInputField
            label="Restricted to PA, MX, CO"
            value={phone3}
            onChange={setPhone3}
            error={validation3.error || undefined}
            placeholder="Try numbers from different countries"
            required
          />

          <div className="text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              🔒 Allowed Countries:
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-blue-100 text-blue-800">🇵🇦 Panama</Badge>
              <Badge className="bg-blue-100 text-blue-800">🇲🇽 Mexico</Badge>
              <Badge className="bg-blue-100 text-blue-800">🇨🇴 Colombia</Badge>
            </div>
          </div>

          {phone3 && validation3.error && (
            <div className="text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-200">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {validation3.error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>🌟 Component Features</CardTitle>
          <CardDescription>
            Everything included in this professional phone input component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">🌎 LATAM First</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Panama default country</li>
                <li>• 20+ LATAM countries prioritized</li>
                <li>• Real country flags</li>
                <li>• Cultural awareness</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">⚡ Smart Validation</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Real-time format checking</li>
                <li>• Country-specific validation</li>
                <li>• E.164 format output</li>
                <li>• Debounced validation</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-purple-600">🎨 Professional UI</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Stripe-inspired design</li>
                <li>• Dark mode support</li>
                <li>• Accessibility compliant</li>
                <li>• Mobile responsive</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">🔧 Developer Friendly</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• React Hook Form compatible</li>
                <li>• TypeScript support</li>
                <li>• Custom validation hooks</li>
                <li>• Error boundary safe</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-pink-600">🚀 Performance</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Optimized rendering</li>
                <li>• Lazy country loading</li>
                <li>• Memory efficient</li>
                <li>• Bundle size optimized</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-indigo-600">🔒 Enterprise Ready</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Country restrictions</li>
                <li>• Audit trail support</li>
                <li>• Format standardization</li>
                <li>• Security focused</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Code Examples</CardTitle>
          <CardDescription>
            How to use the PhoneInputField component in your forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Basic Usage:</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                {`<PhoneInputField
  label="Phone Number"
  value={phone}
  onChange={setPhone}
  error={error}
  placeholder="Enter your phone number"
  required
/>`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">With Validation Hook:</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                {`const phoneValidation = usePhoneValidation({
  value: phone,
  required: true,
  countries: ['PA', 'MX', 'CO'] // Optional restriction
})

<PhoneInputField
  value={phone}
  onChange={setPhone}
  error={phoneValidation.error}
  className={phoneValidation.isValid ? 'valid' : ''}
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

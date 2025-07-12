import React, { useState } from 'react'
import {
  Building2,
  Settings,
  Users,
  Shield,
  Package,
  Save,
  AlertTriangle,
  CheckCircle,
  Info,
  Globe,
  Clock,
  Language
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTenantStore } from '@/stores/tenantStore'

export default function CompanySettings() {
  const { currentTenant, updateTenant } = useTenantStore()
  const [formData, setFormData] = useState({
    name: currentTenant?.name || '',
    description: currentTenant?.description || '',
    use_hub_management: currentTenant?.settings?.use_hub_management ?? false,
    timezone: currentTenant?.settings?.timezone || 'UTC-5',
    locale: currentTenant?.settings?.locale || 'en-US'
  })

  // Update form data when tenant changes
  React.useEffect(() => {
    if (currentTenant) {
      setFormData({
        name: currentTenant.name || '',
        description: currentTenant.description || '',
        use_hub_management: currentTenant.settings?.use_hub_management ?? false,
        timezone: currentTenant.settings?.timezone || 'UTC-5',
        locale: currentTenant.settings?.locale || 'en-US'
      })
    }
  }, [currentTenant])
  const [isSaving, setIsSaving] = useState(false)
  const [showHubWarning, setShowHubWarning] = useState(false)

  const handleHubManagementToggle = (enabled: boolean) => {
    setFormData({ ...formData, use_hub_management: enabled })
    
    // Show warning when disabling hub management
    if (!enabled && formData.use_hub_management) {
      setShowHubWarning(true)
    } else {
      setShowHubWarning(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // TODO: API call to update company settings
      console.log('Updating company settings:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      if (currentTenant) {
        updateTenant({
          name: formData.name,
          description: formData.description,
          settings: {
            ...currentTenant.settings,
            use_hub_management: formData.use_hub_management,
            timezone: formData.timezone,
            locale: formData.locale
          }
        })
      }
      
      setShowHubWarning(false)
    } catch (error) {
      console.error('Failed to update company settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const timezones = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
    { value: 'UTC-6', label: 'Central Time (UTC-6)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC+0', label: 'GMT (UTC+0)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
    { value: 'UTC+2', label: 'Eastern European Time (UTC+2)' }
  ]

  const locales = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Español' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'pt-BR', label: 'Português (BR)' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="text-gray-600">Configure your company profile and management preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Company Information</span>
            </CardTitle>
            <CardDescription>
              Basic details about your company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Company Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company ID</label>
                <Input
                  value={currentTenant?.id || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your company..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Management Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Management Mode</span>
            </CardTitle>
            <CardDescription>
              Choose how you want to manage your team and apps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Hub Management Option */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id="hub_management"
                    name="management_mode"
                    checked={formData.use_hub_management}
                    onChange={() => handleHubManagementToggle(true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="hub_management" className="font-medium cursor-pointer flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Hub Management (Recommended)</span>
                      <Badge className="bg-blue-100 text-blue-800">Advanced</Badge>
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Use ForvaraHub to manage team members, create app-specific delegates, and control access centrally.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Features:</strong> Delegates, Advanced roles, Centralized user management, App-specific permissions
                    </div>
                  </div>
                </div>
              </div>

              {/* Standalone Option */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id="standalone_management"
                    name="management_mode"
                    checked={!formData.use_hub_management}
                    onChange={() => handleHubManagementToggle(false)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="standalone_management" className="font-medium cursor-pointer flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-600" />
                      <span>Standalone Apps</span>
                      <Badge variant="outline">Simple</Badge>
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage users directly within each app. Simple owner/admin/member roles without advanced delegation.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Features:</strong> Basic roles, App-level management, Simple permissions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning when disabling hub management */}
            {showHubWarning && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Warning: Disabling Hub Management</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Switching to standalone mode will:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Remove all delegate permissions</li>
                      <li>Simplify roles to owner/admin/member</li>
                      <li>Disable centralized user management</li>
                      <li>Move app management to individual apps</li>
                    </ul>
                    <p className="text-sm text-yellow-700 mt-2">
                      <strong>This action cannot be easily undone.</strong> You can re-enable hub management later, but you'll need to reconfigure delegates and permissions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Current mode info */}
            {!showHubWarning && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Current Mode: {formData.use_hub_management ? 'Hub Management' : 'Standalone Apps'}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {formData.use_hub_management 
                        ? 'You are using advanced hub management with delegate support.'
                        : 'You are using simple standalone app management.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Localization</span>
            </CardTitle>
            <CardDescription>
              Configure timezone and language preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Timezone
                </label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Language className="w-4 h-4 inline mr-1" />
                  Language
                </label>
                <Select value={formData.locale} onValueChange={(value) => setFormData({ ...formData, locale: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locales.map(locale => (
                      <SelectItem key={locale.value} value={locale.value}>{locale.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
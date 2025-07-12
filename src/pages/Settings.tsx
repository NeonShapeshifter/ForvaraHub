import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useTenantStore } from '@/stores/tenantStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import ActiveSessions from './settings/ActiveSessions'
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  CreditCard,
  Palette,
  HardDrive,
  Users,
  Key,
  Globe,
  Mail,
  Phone,
  Camera,
  Save,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Settings2,
  Wifi
} from 'lucide-react'

// Mock user data
const mockUser = {
  id: '1',
  full_name: 'Alex Rodriguez',
  email: 'alex@forvara.com',
  phone: '+1 (555) 123-4567',
  avatar_url: null,
  two_factor_enabled: false,
  created_at: '2024-01-01',
  last_login: '2024-01-15T10:30:00Z'
}

// Mock company data
const mockCompany = {
  id: '1',
  name: 'Forvara Technologies',
  slug: 'forvara-tech',
  description: 'Building the future of business software',
  logo_url: null,
  storage_used: 2147483648, // 2GB
  storage_limit: 5368709120, // 5GB
  member_count: 12,
  settings: {
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    notifications_enabled: true
  }
}

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function SettingsMain() {
  const { currentTenant, updateTenant } = useTenantStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [userForm, setUserForm] = useState(mockUser)
  const [companyForm, setCompanyForm] = useState(mockCompany)
  const [theme, setTheme] = useState('system')
  const [isLoading, setIsLoading] = useState(false)
  const [showModeWarning, setShowModeWarning] = useState(false)

  // Check if we should open company tab automatically
  useEffect(() => {
    const shouldOpenCompanyTab = localStorage.getItem('openCompanyTab')
    if (shouldOpenCompanyTab === 'true') {
      setActiveTab('company')
      localStorage.removeItem('openCompanyTab') // Clean up
    }
  }, [])

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'company', name: 'Company', icon: Building2 },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ]

  const handleSave = async (section: string) => {
    setIsLoading(true)
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Saving ${section}...`)
    setIsLoading(false)
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                className="h-20 w-20 rounded-full border-4 border-gray-200"
                src={userForm.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userForm.full_name)}&background=6366f1&color=fff&size=80`}
                alt="Profile"
              />
              <button className="absolute -bottom-1 -right-1 p-1 bg-primary text-white rounded-full hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold">{userForm.full_name}</h3>
              <p className="text-sm text-gray-500">Member since {new Date(userForm.created_at).getFullYear()}</p>
              <p className="text-xs text-gray-400">Last login: {new Date(userForm.last_login).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={userForm.full_name}
                  onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Button onClick={() => handleSave('profile')} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderCompanyTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Manage your company details and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-lg border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                {companyForm.logo_url ? (
                  <img src={companyForm.logo_url} alt="Company logo" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <Building2 className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 p-1 bg-primary text-white rounded-full hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold">{companyForm.name}</h3>
              <p className="text-sm text-gray-500">@{companyForm.slug}</p>
              <p className="text-xs text-gray-400">{companyForm.member_count} team members</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={companyForm.name}
                onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Slug</label>
              <Input
                value={companyForm.slug}
                onChange={(e) => setCompanyForm({...companyForm, slug: e.target.value})}
                placeholder="company-name"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={companyForm.description || ''}
                onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                placeholder="What does your company do?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={companyForm.settings.timezone}
                onChange={(e) => setCompanyForm({
                  ...companyForm, 
                  settings: {...companyForm.settings, timezone: e.target.value}
                })}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Madrid">Madrid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={companyForm.settings.currency}
                onChange={(e) => setCompanyForm({
                  ...companyForm, 
                  settings: {...companyForm.settings, currency: e.target.value}
                })}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>

          <Button onClick={() => handleSave('company')} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Management Mode Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Management Mode
          </CardTitle>
          <CardDescription>
            Choose how your company manages team and app access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">
                {currentTenant?.settings?.use_hub_management ? 'Hub Management' : 'Standalone Mode'}
              </h4>
              <p className="text-sm text-gray-500">
                {currentTenant?.settings?.use_hub_management 
                  ? 'Advanced delegation and role management with complex hierarchies'
                  : 'Simple owner/admin/member roles without delegates'
                }
              </p>
            </div>
            <Switch
              checked={currentTenant?.settings?.use_hub_management ?? false}
              onCheckedChange={(checked) => {
                if (currentTenant) {
                  updateTenant({
                    ...currentTenant,
                    settings: {
                      ...currentTenant.settings,
                      use_hub_management: checked
                    }
                  })
                }
              }}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Management Modes</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <strong>Standalone Mode:</strong> Simple three-tier system (Owner → Admin → Member) with direct app assignments
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <strong>Hub Management:</strong> Advanced delegation system with app-specific admin rights and complex hierarchies
                </div>
              </div>
            </div>
          </div>

          {currentTenant?.settings?.use_hub_management === false && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Currently in Standalone Mode</span>
              </div>
              <p className="text-sm text-orange-700">
                Your team is using simplified role management. Enable Hub Management to access advanced delegation features.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
          <CardDescription>
            Monitor your company's storage consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Used Storage</span>
              <span className="text-sm text-gray-500">
                {formatBytes(companyForm.storage_used)} of {formatBytes(companyForm.storage_limit)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${(companyForm.storage_used / companyForm.storage_limit) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              {((companyForm.storage_used / companyForm.storage_limit) * 100).toFixed(1)}% of total storage used
            </div>
            <Button variant="outline" size="sm">
              Upgrade Storage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>
            Manage your password and two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">
                    {mockUser.two_factor_enabled ? 'Enabled' : 'Not enabled - recommended for security'}
                  </p>
                </div>
              </div>
              <Button variant={mockUser.two_factor_enabled ? "outline" : "default"} size="sm">
                {mockUser.two_factor_enabled ? 'Disable' : 'Enable'} 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Monitor and manage where you're signed in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Session Management</h3>
            <p className="text-gray-600 mb-4">View and manage all active sessions across your devices.</p>
            <Button onClick={() => setActiveTab('sessions')}>
              Manage Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Preferences</CardTitle>
          <CardDescription>
            Customize the appearance of your ForvaraHub interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="text-sm font-medium">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'light', name: 'Light', icon: Sun },
                { id: 'dark', name: 'Dark', icon: Moon },
                { id: 'system', name: 'System', icon: Monitor }
              ].map((themeOption) => {
                const Icon = themeOption.icon
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${
                      theme === themeOption.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{themeOption.name}</span>
                  </button>
                )
              })}
            </div>
            <Button onClick={() => handleSave('theme')} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save Theme
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'company':
        return renderCompanyTab()
      case 'security':
        return renderSecurityTab()
      case 'appearance':
        return renderAppearanceTab()
      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        )
      case 'billing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscriptions</CardTitle>
              <CardDescription>
                Manage your billing information and active subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Access billing and subscription management from the main dashboard.</p>
                <Button asChild>
                  <Link to="/billing">Go to Billing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 'sessions':
        return <ActiveSessions />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and company preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default function Settings() {
  return <SettingsMain />
}
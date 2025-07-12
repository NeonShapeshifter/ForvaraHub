import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Bell, 
  Clock, 
  HardDrive,
  Activity,
  AlertTriangle,
  CheckCircle,
  Server,
  Key,
  Save
} from 'lucide-react'

// Mock system configuration data
const mockSystemConfig = {
  general: {
    platform_name: 'Forvara',
    platform_url: 'https://forvara.com',
    support_email: 'support@forvara.com',
    max_file_size_mb: 100,
    session_timeout_hours: 24,
    maintenance_mode: false
  },
  email: {
    smtp_host: 'smtp.sendgrid.net',
    smtp_port: 587,
    smtp_username: 'apikey',
    smtp_encryption: 'tls',
    from_email: 'noreply@forvara.com',
    from_name: 'Forvara Platform'
  },
  security: {
    enforce_2fa: false,
    password_min_length: 8,
    session_security: true,
    ip_whitelist_enabled: false,
    rate_limiting_enabled: true,
    login_attempts_limit: 5
  },
  features: {
    user_registration: true,
    company_creation: true,
    app_marketplace: true,
    file_sharing: true,
    analytics_tracking: true,
    notification_system: true
  },
  storage: {
    default_quota_gb: 5,
    max_quota_gb: 1000,
    cleanup_inactive_files_days: 90,
    backup_retention_days: 30
  }
}

const mockSystemHealth = {
  database: { status: 'healthy', response_time_ms: 12, uptime: '99.9%' },
  redis: { status: 'healthy', response_time_ms: 3, uptime: '99.8%' },
  storage: { status: 'healthy', response_time_ms: 45, uptime: '99.9%' },
  email: { status: 'healthy', response_time_ms: 120, uptime: '99.7%' },
  api: { status: 'healthy', response_time_ms: 28, uptime: '99.9%' }
}

export default function SystemSettings() {
  const [config, setConfig] = useState(mockSystemConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'features', name: 'Features', icon: Globe },
    { id: 'storage', name: 'Storage', icon: HardDrive },
    { id: 'health', name: 'System Health', icon: Activity }
  ]

  const handleSave = async (section: string) => {
    setIsLoading(true)
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`Saving ${section} settings...`)
    setIsLoading(false)
  }

  const getHealthStatusIcon = (status: string) => {
    return status === 'healthy' ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-red-600" />
    )
  }

  const getHealthStatusBadge = (status: string) => {
    return status === 'healthy' ? (
      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
    ) : (
      <Badge variant="destructive">Error</Badge>
    )
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>
            Configure basic platform information and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Name</label>
              <Input
                value={config.general.platform_name}
                onChange={(e) => setConfig({
                  ...config,
                  general: { ...config.general, platform_name: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform URL</label>
              <Input
                value={config.general.platform_url}
                onChange={(e) => setConfig({
                  ...config,
                  general: { ...config.general, platform_url: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Support Email</label>
              <Input
                type="email"
                value={config.general.support_email}
                onChange={(e) => setConfig({
                  ...config,
                  general: { ...config.general, support_email: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max File Size (MB)</label>
              <Input
                type="number"
                value={config.general.max_file_size_mb}
                onChange={(e) => setConfig({
                  ...config,
                  general: { ...config.general, max_file_size_mb: parseInt(e.target.value) }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Timeout (Hours)</label>
              <Input
                type="number"
                value={config.general.session_timeout_hours}
                onChange={(e) => setConfig({
                  ...config,
                  general: { ...config.general, session_timeout_hours: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Maintenance Mode</h4>
              <p className="text-sm text-gray-500">
                Enable to show maintenance page to all users
              </p>
            </div>
            <Switch
              checked={config.general.maintenance_mode}
              onCheckedChange={(checked) => setConfig({
                ...config,
                general: { ...config.general, maintenance_mode: checked }
              })}
            />
          </div>

          <Button onClick={() => handleSave('general')} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save General Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderEmailTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
          <CardDescription>
            Configure email delivery settings for the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Host</label>
              <Input
                value={config.email.smtp_host}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, smtp_host: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Port</label>
              <Input
                type="number"
                value={config.email.smtp_port}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, smtp_port: parseInt(e.target.value) }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={config.email.smtp_username}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, smtp_username: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Encryption</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={config.email.smtp_encryption}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, smtp_encryption: e.target.value }
                })}
              >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">From Email</label>
              <Input
                type="email"
                value={config.email.from_email}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, from_email: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">From Name</label>
              <Input
                value={config.email.from_name}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, from_name: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleSave('email')} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Email Settings'}
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Test Email
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
          <CardTitle>Security Policies</CardTitle>
          <CardDescription>
            Configure security settings and authentication policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Enforce Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">
                  Require all users to enable 2FA
                </p>
              </div>
              <Switch
                checked={config.security.enforce_2fa}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  security: { ...config.security, enforce_2fa: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Session Security</h4>
                <p className="text-sm text-gray-500">
                  Enhanced session validation and tracking
                </p>
              </div>
              <Switch
                checked={config.security.session_security}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  security: { ...config.security, session_security: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Rate Limiting</h4>
                <p className="text-sm text-gray-500">
                  Protect against API abuse and brute force attacks
                </p>
              </div>
              <Switch
                checked={config.security.rate_limiting_enabled}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  security: { ...config.security, rate_limiting_enabled: checked }
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Password Length</label>
              <Input
                type="number"
                value={config.security.password_min_length}
                onChange={(e) => setConfig({
                  ...config,
                  security: { ...config.security, password_min_length: parseInt(e.target.value) }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Login Attempts Limit</label>
              <Input
                type="number"
                value={config.security.login_attempts_limit}
                onChange={(e) => setConfig({
                  ...config,
                  security: { ...config.security, login_attempts_limit: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>

          <Button onClick={() => handleSave('security')} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Security Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderHealthTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Health Monitor</CardTitle>
          <CardDescription>
            Real-time status of platform components and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(mockSystemHealth).map(([service, health]) => (
              <div key={service} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getHealthStatusIcon(health.status)}
                  <div>
                    <h4 className="font-medium capitalize">{service}</h4>
                    <p className="text-sm text-gray-500">
                      Response: {health.response_time_ms}ms • Uptime: {health.uptime}
                    </p>
                  </div>
                </div>
                {getHealthStatusBadge(health.status)}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">All Systems Operational</span>
            </div>
            <p className="text-sm text-green-700">
              All platform services are running normally with optimal performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab()
      case 'email': return renderEmailTab()
      case 'security': return renderSecurityTab()
      case 'health': return renderHealthTab()
      case 'features':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Feature toggles coming soon...</p>
            </CardContent>
          </Card>
        )
      case 'storage':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Storage Configuration</CardTitle>
              <CardDescription>Manage storage quotas and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Storage management coming soon...</p>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure platform-wide settings and monitor system health</p>
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
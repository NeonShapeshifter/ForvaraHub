import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { api } from '@/services/api'
import {
  Crown,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Star,
  StarOff,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Package,
  Save,
  X,
  AlertTriangle
} from 'lucide-react'

interface App {
  id: string
  name: string
  display_name: string
  slug: string
  description: string
  short_description: string
  category: string
  is_active: boolean
  is_featured: boolean
  is_free: boolean
  base_price_monthly: number
  version: string
  icon_url?: string
  screenshots: string[]
  supported_countries: string[]
  created_at: string
  updated_at: string
  stats?: {
    total_installations: number
    active_installations: number
    trial_installations: number
  }
}

const categories = [
  'ERP', 'CRM', 'Accounting', 'HR', 'Marketing', 'Sales',
  'Inventory', 'Analytics', 'Communication', 'Productivity', 'Other'
]

const countries = [
  { code: 'PA', name: 'Panama' },
  { code: 'MX', name: 'Mexico' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PE', name: 'Peru' },
  { code: 'EC', name: 'Ecuador' }
]

export function AppManagement() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingApp, setEditingApp] = useState<App | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    short_description: '',
    category: '',
    base_price_monthly: 0,
    is_free: false,
    is_featured: false,
    icon_url: '',
    screenshots: [''],
    supported_countries: ['PA', 'MX', 'CO'],
    version: '1.0.0'
  })

  const fetchApps = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter) params.append('category', categoryFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await api.get(`/admin/apps?${params.toString()}`)
      setApps(response.data.data.apps)
    } catch (error: any) {
      setError(error.message || 'Failed to load apps')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApps()
  }, [searchTerm, categoryFilter, statusFilter])

  const handleCreateApp = async () => {
    setSaving(true)
    try {
      await api.post('/admin/apps', {
        ...formData,
        screenshots: formData.screenshots.filter(url => url.trim() !== '')
      })

      setShowCreateForm(false)
      resetForm()
      fetchApps()
    } catch (error: any) {
      setError(error.message || 'Failed to create app')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateApp = async () => {
    if (!editingApp) return

    setSaving(true)
    try {
      await api.put(`/admin/apps/${editingApp.id}`, {
        ...formData,
        screenshots: formData.screenshots.filter(url => url.trim() !== '')
      })

      setEditingApp(null)
      resetForm()
      fetchApps()
    } catch (error: any) {
      setError(error.message || 'Failed to update app')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this app? This action cannot be undone.')) {
      return
    }

    try {
      await api.delete(`/admin/apps/${appId}`)
      fetchApps()
    } catch (error: any) {
      setError(error.message || 'Failed to delete app')
    }
  }

  const handleToggleFeatured = async (appId: string, featured: boolean) => {
    try {
      await api.post(`/admin/apps/${appId}/feature`, { featured })
      fetchApps()
    } catch (error: any) {
      setError(error.message || 'Failed to update featured status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      description: '',
      short_description: '',
      category: '',
      base_price_monthly: 0,
      is_free: false,
      is_featured: false,
      icon_url: '',
      screenshots: [''],
      supported_countries: ['PA', 'MX', 'CO'],
      version: '1.0.0'
    })
  }

  const startEdit = (app: App) => {
    setEditingApp(app)
    setFormData({
      name: app.name,
      display_name: app.display_name,
      description: app.description,
      short_description: app.short_description,
      category: app.category,
      base_price_monthly: app.base_price_monthly,
      is_free: app.is_free,
      is_featured: app.is_featured,
      icon_url: app.icon_url || '',
      screenshots: app.screenshots.length > 0 ? app.screenshots : [''],
      supported_countries: app.supported_countries,
      version: app.version
    })
    setShowCreateForm(true)
  }

  const addScreenshotUrl = () => {
    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, '']
    }))
  }

  const removeScreenshotUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }))
  }

  const updateScreenshotUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.map((url, i) => i === index ? value : url)
    }))
  }

  const toggleCountry = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      supported_countries: prev.supported_countries.includes(countryCode)
        ? prev.supported_countries.filter(c => c !== countryCode)
        : [...prev.supported_countries, countryCode]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Crown className="w-8 h-8 text-blue-500 animate-spin mr-2" />
        <span>Loading apps...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" />
            App Store Management
          </h2>
          <p className="text-muted-foreground">
            👑 EMPEROR CONTROLS: Create, edit, and manage all marketplace apps
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setEditingApp(null)
            setShowCreateForm(true)
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create App
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingApp ? 'Edit App' : 'Create New App'}
            </CardTitle>
            <CardDescription>
              {editingApp ? 'Update app details and settings' : 'Add a new app to the marketplace'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name (Internal)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="my-awesome-app"
                />
              </div>
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="My Awesome App"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                placeholder="Brief one-line description..."
              />
            </div>

            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the app..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="1.0.0"
                />
              </div>
              <div>
                <Label htmlFor="base_price_monthly">Monthly Price ($)</Label>
                <Input
                  id="base_price_monthly"
                  type="number"
                  value={formData.base_price_monthly}
                  onChange={(e) => setFormData(prev => ({ ...prev, base_price_monthly: Number(e.target.value) }))}
                  disabled={formData.is_free}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="icon_url">Icon URL</Label>
              <Input
                id="icon_url"
                value={formData.icon_url}
                onChange={(e) => setFormData(prev => ({ ...prev, icon_url: e.target.value }))}
                placeholder="https://example.com/icon.png"
              />
            </div>

            {/* Screenshot URLs */}
            <div>
              <Label>Screenshot URLs</Label>
              <div className="space-y-2">
                {formData.screenshots.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateScreenshotUrl(index, e.target.value)}
                      placeholder="https://example.com/screenshot.png"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeScreenshotUrl(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addScreenshotUrl}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Screenshot
                </Button>
              </div>
            </div>

            {/* Supported Countries */}
            <div>
              <Label>Supported Countries</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {countries.map(country => (
                  <Button
                    key={country.code}
                    type="button"
                    variant={formData.supported_countries.includes(country.code) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleCountry(country.code)}
                  >
                    {country.code} - {country.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    is_free: e.target.checked,
                    base_price_monthly: e.target.checked ? 0 : prev.base_price_monthly
                  }))}
                />
                <span>Free App</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                />
                <span>Featured App ⭐</span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={editingApp ? handleUpdateApp : handleCreateApp}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : editingApp ? 'Update App' : 'Create App'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingApp(null)
                  resetForm()
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Apps List */}
      <div className="grid gap-4">
        {apps.map(app => (
          <Card key={app.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {/* App Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {app.icon_url ? (
                      <img src={app.icon_url} alt={app.display_name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      app.display_name.charAt(0)
                    )}
                  </div>

                  {/* App Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{app.display_name}</h3>
                      {app.is_featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant={app.is_active ? 'default' : 'secondary'}>
                        {app.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {app.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {app.short_description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {app.is_free ? 'Free' : `$${app.base_price_monthly}/mo`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {app.stats?.active_installations || 0} active
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {app.supported_countries.length} countries
                      </span>
                      <span>v{app.version}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleFeatured(app.id, !app.is_featured)}
                    title={app.is_featured ? 'Remove from featured' : 'Add to featured'}
                  >
                    {app.is_featured ? (
                      <StarOff className="w-4 h-4" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => startEdit(app)}
                    title="Edit app"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteApp(app.id)}
                    title="Delete app"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apps.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No apps found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter || statusFilter
                ? 'Try adjusting your filters or search term.'
                : 'Create your first app to get started.'}
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First App
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

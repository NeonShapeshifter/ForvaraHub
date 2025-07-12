import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  Download,
  DollarSign,
  Users,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data for admin apps management
const mockAppsAdmin = [
  {
    id: '1',
    name: 'Elaris ERP',
    slug: 'elaris-erp',
    description: 'Complete enterprise resource planning solution',
    category: 'Business Management',
    status: 'published',
    is_featured: true,
    downloads: 1250,
    revenue: 36250,
    rating: 4.8,
    reviews_count: 127,
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
    developer: {
      name: 'Forvara Team',
      email: 'dev@forvara.com'
    },
    plans: [
      { id: '1', name: 'Basic', price: 2900, active_subscriptions: 45 },
      { id: '2', name: 'Pro', price: 5900, active_subscriptions: 23 }
    ]
  },
  {
    id: '2',
    name: 'ForvaraMail',
    slug: 'forvara-mail',
    description: 'Team communication platform',
    category: 'Communication',
    status: 'published',
    is_featured: true,
    downloads: 2180,
    revenue: 17440,
    rating: 4.9,
    reviews_count: 89,
    created_at: '2024-01-01',
    updated_at: '2024-01-14',
    developer: {
      name: 'Forvara Team',
      email: 'dev@forvara.com'
    },
    plans: [
      { id: '3', name: 'Team', price: 800, active_subscriptions: 76 }
    ]
  },
  {
    id: '3',
    name: 'ProjectFlow',
    slug: 'project-flow',
    description: 'Project management and collaboration',
    category: 'Productivity',
    status: 'pending_review',
    is_featured: false,
    downloads: 0,
    revenue: 0,
    rating: 0,
    reviews_count: 0,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    developer: {
      name: 'External Developer',
      email: 'dev@projectflow.com'
    },
    plans: [
      { id: '4', name: 'Basic', price: 1500, active_subscriptions: 0 }
    ]
  },
  {
    id: '4',
    name: 'InvoiceBot',
    slug: 'invoice-bot',
    description: 'Automated invoicing solution',
    category: 'Finance',
    status: 'rejected',
    is_featured: false,
    downloads: 0,
    revenue: 0,
    rating: 0,
    reviews_count: 0,
    created_at: '2024-01-10',
    updated_at: '2024-01-12',
    developer: {
      name: 'Invoice Solutions Inc',
      email: 'dev@invoicebot.com'
    },
    plans: [
      { id: '5', name: 'Pro', price: 2500, active_subscriptions: 0 }
    ]
  }
]

function AppsList() {
  const [apps, setApps] = useState(mockAppsAdmin)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const navigate = useNavigate()

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      published: { variant: 'default' as const, label: 'Published', icon: CheckCircle },
      pending_review: { variant: 'outline' as const, label: 'Pending Review', icon: Clock },
      rejected: { variant: 'destructive' as const, label: 'Rejected', icon: XCircle },
      draft: { variant: 'secondary' as const, label: 'Draft', icon: Edit }
    }
    const config = variants[status as keyof typeof variants] || variants.draft
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const handleStatusChange = (appId: string, newStatus: string) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ))
  }

  const categories = [...new Set(apps.map(app => app.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apps Management</h1>
          <p className="text-gray-600">Manage marketplace applications and approvals</p>
        </div>
        <Button asChild>
          <Link to="new">
            <Plus className="w-4 h-4 mr-2" />
            Add New App
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apps.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {apps.filter(app => app.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {apps.filter(app => app.status === 'pending_review').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(apps.reduce((sum, app) => sum + app.revenue, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Apps Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            Manage and review all marketplace applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div key={app.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{app.name}</h3>
                        {app.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{app.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{app.category}</span>
                        <span>•</span>
                        <span>by {app.developer.name}</span>
                        <span>•</span>
                        <span>{app.downloads.toLocaleString()} downloads</span>
                        {app.rating > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                              <span>{app.rating} ({app.reviews_count})</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-sm">
                          <span className="font-medium">{formatCurrency(app.revenue)}</span>
                          <span className="text-gray-500"> revenue</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">
                            {app.plans.reduce((sum, plan) => sum + plan.active_subscriptions, 0)}
                          </span>
                          <span className="text-gray-500"> active subscriptions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(app.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`${app.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`${app.id}/edit`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit App
                        </DropdownMenuItem>
                        {app.status === 'pending_review' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(app.id, 'published')}
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EditAppForm({ appId }: { appId: string }) {
  const navigate = useNavigate()
  const app = mockAppsAdmin.find(a => a.id === appId)
  
  const [formData, setFormData] = useState({
    name: app?.name || '',
    slug: app?.slug || '',
    description: app?.description || '',
    category: app?.category || '',
    status: app?.status || 'draft',
    is_featured: app?.is_featured || false,
    plans: app?.plans || []
  })

  const [isLoading, setIsLoading] = useState(false)

  const addPlan = () => {
    setFormData({
      ...formData,
      plans: [
        ...formData.plans,
        {
          id: String(Date.now()),
          name: 'New Plan',
          price: 0,
          active_subscriptions: 0
        }
      ]
    })
  }

  const updatePlan = (planId: string, updates: any) => {
    setFormData({
      ...formData,
      plans: formData.plans.map(plan =>
        plan.id === planId ? { ...plan, ...updates } : plan
      )
    })
  }

  const removePlan = (planId: string) => {
    setFormData({
      ...formData,
      plans: formData.plans.filter(plan => plan.id !== planId)
    })
  }

  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Updating app:', formData)
      alert('App updated successfully!')
      navigate('/admin/apps')
    } catch (error) {
      console.error('Failed to update app:', error)
      alert('Failed to update app. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!app) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">App not found</h2>
        <p className="text-gray-600 mb-4">The app you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/admin/apps')}>Back to Apps</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit {app.name}</h1>
          <p className="text-gray-600">Modify app details, plans, and pricing</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/apps')}>Back to Apps</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>App Information</CardTitle>
            <CardDescription>Basic details about the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">App Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter app name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">App Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="app-slug"
                  required
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
                placeholder="Describe what this app does..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Business Management">Business Management</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm">Featured app</label>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pricing Plans</CardTitle>
                <CardDescription>Configure subscription plans and pricing</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addPlan}>
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.plans.map((plan, index) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Plan {index + 1}</h4>
                    {formData.plans.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removePlan(plan.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Plan Name</label>
                      <Input
                        value={plan.name}
                        onChange={(e) => updatePlan(plan.id, { name: e.target.value })}
                        placeholder="e.g., Basic, Pro, Enterprise"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (cents)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) => updatePlan(plan.id, { price: parseInt(e.target.value) || 0 })}
                          className="pl-10"
                          placeholder="2900"
                          min="0"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatCurrency(plan.price)} per month
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Active Subscriptions</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          value={plan.active_subscriptions}
                          onChange={(e) => updatePlan(plan.id, { active_subscriptions: parseInt(e.target.value) || 0 })}
                          className="pl-10"
                          placeholder="0"
                          min="0"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Read-only (managed by system)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.plans.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pricing plans</h3>
                  <p className="text-gray-600 mb-4">Add at least one pricing plan for this app</p>
                  <Button type="button" onClick={addPlan}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Plan
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* App Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>App Statistics</CardTitle>
            <CardDescription>Current performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Download className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{app.downloads.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Downloads</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{formatCurrency(app.revenue)}</div>
                <div className="text-sm text-green-700">Revenue</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-900">{app.rating}</div>
                <div className="text-sm text-yellow-700">Rating ({app.reviews_count} reviews)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">
                  {app.plans.reduce((sum, plan) => sum + plan.active_subscriptions, 0)}
                </div>
                <div className="text-sm text-purple-700">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/apps')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function NewAppForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: '',
    icon_url: '',
    is_featured: false,
    plans: [
      { name: 'Basic', price: 0, billing_interval: 'monthly', is_trial: false, trial_days: 0 }
    ]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating new app:', formData)
    // TODO: Implement app creation
    navigate('/admin/apps')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New App</h1>
          <p className="text-gray-600">Create a new application for the marketplace</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/apps')}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>App Information</CardTitle>
          <CardDescription>
            Basic information about the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">App Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter app name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">App Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="app-slug"
                  required
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
                placeholder="Describe what this app does..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Business Management">Business Management</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon URL (optional)</label>
                <Input
                  value={formData.icon_url}
                  onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                  placeholder="https://example.com/icon.png"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm">Featured app</label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/apps')}>
                Cancel
              </Button>
              <Button type="submit">
                Create App
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function EditAppWrapper() {
  const { id } = useParams<{ id: string }>()
  return <EditAppForm appId={id || ''} />
}

export default function AppsManagement() {
  return (
    <Routes>
      <Route path="/" element={<AppsList />} />
      <Route path="/new" element={<NewAppForm />} />
      <Route path="/:id" element={<div>App details coming soon...</div>} />
      <Route path="/:id/edit" element={<EditAppWrapper />} />
    </Routes>
  )
}
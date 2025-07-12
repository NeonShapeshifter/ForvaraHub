import React, { useState } from 'react'
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar,
  Building2,
  Crown,
  Eye,
  Edit,
  Trash2
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

// Mock data for users and tenants
const mockUsers = [
  {
    id: '1',
    full_name: 'Alex Rodriguez',
    email: 'alex@forvara.com',
    phone: '+1234567890',
    created_at: '2024-01-01',
    last_login: '2024-01-15T09:00:00Z',
    is_active: true,
    role: 'admin',
    tenants: [
      { id: '1', name: 'Forvara Technologies', role: 'owner' },
      { id: '2', name: 'Demo Company', role: 'admin' }
    ]
  },
  {
    id: '2',
    full_name: 'María García',
    email: 'maria@company.com',
    phone: null,
    created_at: '2024-01-05',
    last_login: '2024-01-14T15:30:00Z',
    is_active: true,
    role: 'user',
    tenants: [
      { id: '3', name: 'García Consulting', role: 'owner' }
    ]
  },
  {
    id: '3',
    full_name: 'Carlos Mendoza',
    email: 'carlos@techstart.com',
    phone: '+9876543210',
    created_at: '2024-01-10',
    last_login: '2024-01-13T10:15:00Z',
    is_active: true,
    role: 'user',
    tenants: [
      { id: '4', name: 'TechStart Solutions', role: 'owner' },
      { id: '1', name: 'Forvara Technologies', role: 'member' }
    ]
  },
  {
    id: '4',
    full_name: 'Ana López',
    email: 'ana@disabled.com',
    phone: null,
    created_at: '2024-01-03',
    last_login: '2024-01-08T12:00:00Z',
    is_active: false,
    role: 'user',
    tenants: []
  }
]

const mockTenants = [
  {
    id: '1',
    name: 'Forvara Technologies',
    description: 'Leading software development company',
    created_at: '2024-01-01',
    user_count: 12,
    storage_used: 2147483648,
    storage_limit: 5368709120,
    subscription_status: 'active',
    monthly_revenue: 24890,
    owner: 'Alex Rodriguez'
  },
  {
    id: '2',
    name: 'Demo Company',
    description: 'Demo company for testing',
    created_at: '2024-01-10',
    user_count: 5,
    storage_used: 536870912,
    storage_limit: 5368709120,
    subscription_status: 'trial',
    monthly_revenue: 0,
    owner: 'Alex Rodriguez'
  },
  {
    id: '3',
    name: 'García Consulting',
    description: 'Business consulting services',
    created_at: '2024-01-05',
    user_count: 8,
    storage_used: 1073741824,
    storage_limit: 5368709120,
    subscription_status: 'active',
    monthly_revenue: 15600,
    owner: 'María García'
  },
  {
    id: '4',
    name: 'TechStart Solutions',
    description: 'Technology startup',
    created_at: '2024-01-10',
    user_count: 3,
    storage_used: 268435456,
    storage_limit: 5368709120,
    subscription_status: 'active',
    monthly_revenue: 8900,
    owner: 'Carlos Mendoza'
  }
]

export default function UsersManagement() {
  const [activeTab, setActiveTab] = useState<'users' | 'tenants'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active)
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tenant.subscription_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: { variant: 'default' as const, label: 'Admin', icon: Shield },
      user: { variant: 'secondary' as const, label: 'User', icon: Users },
      owner: { variant: 'outline' as const, label: 'Owner', icon: Crown }
    }
    const config = variants[role as keyof typeof variants] || variants.user
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string | boolean, type: 'user' | 'tenant' = 'user') => {
    if (type === 'user') {
      return status ? (
        <Badge className="bg-green-100 text-green-800">
          <UserCheck className="w-3 h-3 mr-1" />
          Active
        </Badge>
      ) : (
        <Badge variant="destructive">
          <UserX className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    } else {
      const variants = {
        active: { variant: 'default' as const, label: 'Active' },
        trial: { variant: 'outline' as const, label: 'Trial' },
        suspended: { variant: 'destructive' as const, label: 'Suspended' },
        cancelled: { variant: 'secondary' as const, label: 'Cancelled' }
      }
      const config = variants[status as keyof typeof variants] || variants.active
      return <Badge variant={config.variant}>{config.label}</Badge>
    }
  }

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(1)} GB`
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Tenants</h1>
          <p className="text-gray-600">Manage user accounts and tenant organizations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users ({mockUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('tenants')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tenants'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tenants ({mockTenants.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder={`Search ${activeTab}...`}
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
            {activeTab === 'users' ? (
              <>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        {activeTab === 'users' && (
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeTab === 'users' ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUsers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockUsers.filter(u => u.is_active).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {mockUsers.filter(u => u.role === 'admin').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {mockUsers.filter(u => new Date(u.created_at).getMonth() === new Date().getMonth()).length}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Tenants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTenants.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockTenants.filter(t => t.subscription_status === 'active').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(mockTenants.reduce((sum, t) => sum + t.monthly_revenue, 0))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {mockTenants.reduce((sum, t) => sum + t.user_count, 0)}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>{activeTab === 'users' ? 'Users' : 'Tenants'}</CardTitle>
          <CardDescription>
            {activeTab === 'users' 
              ? 'Manage user accounts and permissions'
              : 'Manage tenant organizations and subscriptions'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTab === 'users' ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {user.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{user.full_name}</h3>
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.is_active)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div>📱 {user.phone}</div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Joined {formatDate(user.created_at)}
                            </div>
                            <div>Last login: {formatLastLogin(user.last_login)}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span>
                              {user.tenants.length} {user.tenants.length === 1 ? 'company' : 'companies'}
                            </span>
                            {user.tenants.slice(0, 2).map(tenant => (
                              <Badge key={tenant.id} variant="outline" className="text-xs">
                                {tenant.name} ({tenant.role})
                              </Badge>
                            ))}
                            {user.tenants.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.tenants.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className={user.is_active ? "text-red-600" : "text-green-600"}>
                          {user.is_active ? (
                            <>
                              <UserX className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              filteredTenants.map((tenant) => (
                <div key={tenant.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{tenant.name}</h3>
                          {getStatusBadge(tenant.subscription_status, 'tenant')}
                        </div>
                        <p className="text-gray-600 mb-2">{tenant.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Owner:</span>
                            <div className="font-medium">{tenant.owner}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Users:</span>
                            <div className="font-medium">{tenant.user_count}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Storage:</span>
                            <div className="font-medium">
                              {formatBytes(tenant.storage_used)} / {formatBytes(tenant.storage_limit)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Revenue:</span>
                            <div className="font-medium">{formatCurrency(tenant.monthly_revenue)}/mo</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Created {formatDate(tenant.created_at)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Tenant
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" />
                          Manage Users
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
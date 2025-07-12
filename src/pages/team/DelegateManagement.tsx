import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Shield,
  Users,
  Package,
  Crown,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Settings,
  UserCheck,
  Building2,
  MessageSquare,
  BarChart3
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
import { useRoleStore } from '@/stores/roleStore'
import { useTenantStore } from '@/stores/tenantStore'

// Mock data for available apps
const availableApps = [
  {
    id: 'elaris',
    name: 'Elaris ERP',
    icon: Building2,
    category: 'Business Management',
    description: 'Complete enterprise resource planning solution'
  },
  {
    id: 'forvaramail',
    name: 'ForvaraMail',
    icon: MessageSquare,
    category: 'Communication',
    description: 'Team communication and collaboration platform'
  },
  {
    id: 'analytics',
    name: 'Analytics Pro',
    icon: BarChart3,
    category: 'Analytics',
    description: 'Business intelligence and analytics platform'
  }
]

function DelegatesList() {
  const { members, removeDelegate } = useRoleStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [appFilter, setAppFilter] = useState('all')

  const delegates = members.filter(m => m.delegate_permissions.length > 0)
  
  const filteredDelegates = delegates.filter(delegate => {
    const matchesSearch = delegate.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         delegate.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesApp = appFilter === 'all' || 
                      delegate.delegate_permissions.some(p => p.app_id === appFilter)
    
    return matchesSearch && matchesApp
  })

  const handleRemoveDelegate = async (userId: string, appId: string) => {
    try {
      await removeDelegate(userId, appId)
    } catch (error) {
      console.error('Failed to remove delegate:', error)
    }
  }

  const getDelegateApps = (delegate: any) => {
    return delegate.delegate_permissions.map((perm: any) => {
      const app = availableApps.find(a => a.id === perm.app_id)
      return {
        ...perm,
        app: app || { id: perm.app_id, name: perm.app_id, icon: Package }
      }
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search delegates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={appFilter} onValueChange={setAppFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by app" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Apps</SelectItem>
            {availableApps.map(app => (
              <SelectItem key={app.id} value={app.id}>{app.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Delegates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            App Delegates ({filteredDelegates.length})
            <Button asChild>
              <Link to="new">
                <Plus className="w-4 h-4 mr-2" />
                Create Delegate
              </Link>
            </Button>
          </CardTitle>
          <CardDescription>
            Users with administrative permissions for specific apps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDelegates.map((delegate) => {
              const delegateApps = getDelegateApps(delegate)
              
              return (
                <div key={delegate.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {delegate.user.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{delegate.user.full_name}</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Delegate
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{delegate.user.email}</p>
                        
                        {/* Delegated Apps */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Manages Apps:</h4>
                          <div className="space-y-2">
                            {delegateApps.map((delegateApp) => (
                              <div key={delegateApp.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <delegateApp.app.icon className="w-5 h-5 text-gray-600" />
                                  <div>
                                    <p className="font-medium text-sm">{delegateApp.app.name}</p>
                                    <p className="text-xs text-gray-500">
                                      Since {formatDate(delegateApp.granted_at)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs text-gray-500">
                                    {Object.entries(delegateApp.permissions)
                                      .filter(([_, value]) => value)
                                      .map(([key, _]) => key.replace('_', ' '))
                                      .join(', ')}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveDelegate(delegate.user_id, delegateApp.app_id)}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
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
                        <DropdownMenuItem asChild>
                          <Link to={`${delegate.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`edit/${delegate.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Permissions
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove All Permissions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredDelegates.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No delegates found</h3>
              <p className="text-gray-600 mb-4">
                {delegates.length === 0 
                  ? "Create your first delegate to manage app-specific permissions"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              <Button asChild>
                <Link to="new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Delegate
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CreateDelegate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedUserId = searchParams.get('user')
  
  const { members, createDelegate } = useRoleStore()
  const [selectedUser, setSelectedUser] = useState(preselectedUserId || '')
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [permissions, setPermissions] = useState({
    user_management: true,
    app_configuration: true,
    role_assignment: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter out owners and existing delegates for the selected apps
  const eligibleMembers = members.filter(member => {
    if (member.role === 'owner') return false
    if (!selectedApps.length) return true
    
    // Check if user is already a delegate for any of the selected apps
    return !selectedApps.some(appId => 
      member.delegate_permissions.some(perm => perm.app_id === appId)
    )
  })

  const handleAppToggle = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    )
  }

  const handlePermissionToggle = (permission: string) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission as keyof typeof prev]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser || selectedApps.length === 0) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await createDelegate(selectedUser, selectedApps, permissions)
      navigate('/team/delegates')
    } catch (error) {
      console.error('Failed to create delegate:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Create New Delegate</h2>
          <p className="text-gray-600">Grant app-specific administrative permissions</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/team/delegates')}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delegate Configuration</CardTitle>
          <CardDescription>
            Select a user and configure their app management permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team member" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleMembers.map(member => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      <div className="flex items-center space-x-2">
                        <span>{member.user.full_name}</span>
                        <span className="text-gray-500 text-sm">({member.user.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {eligibleMembers.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No eligible members available. All members are either owners or already delegates.
                </p>
              )}
            </div>

            {/* App Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Apps to Manage</label>
              <div className="space-y-2">
                {availableApps.map(app => (
                  <div key={app.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      id={`app-${app.id}`}
                      checked={selectedApps.includes(app.id)}
                      onChange={() => handleAppToggle(app.id)}
                      className="rounded"
                    />
                    <app.icon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <label htmlFor={`app-${app.id}`} className="font-medium cursor-pointer">
                        {app.name}
                      </label>
                      <p className="text-sm text-gray-500">{app.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium mb-2">Delegate Permissions</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="user_management"
                    checked={permissions.user_management}
                    onChange={() => handlePermissionToggle('user_management')}
                    className="rounded"
                  />
                  <div>
                    <label htmlFor="user_management" className="font-medium cursor-pointer">
                      User Management
                    </label>
                    <p className="text-sm text-gray-500">
                      Assign and revoke app access for team members
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="app_configuration"
                    checked={permissions.app_configuration}
                    onChange={() => handlePermissionToggle('app_configuration')}
                    className="rounded"
                  />
                  <div>
                    <label htmlFor="app_configuration" className="font-medium cursor-pointer">
                      App Configuration
                    </label>
                    <p className="text-sm text-gray-500">
                      Configure app settings and features
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="role_assignment"
                    checked={permissions.role_assignment}
                    onChange={() => handlePermissionToggle('role_assignment')}
                    className="rounded"
                  />
                  <div>
                    <label htmlFor="role_assignment" className="font-medium cursor-pointer">
                      Role Assignment
                    </label>
                    <p className="text-sm text-gray-500">
                      Create and assign roles within the app
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            {selectedUser && selectedApps.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Summary</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    <strong>{eligibleMembers.find(m => m.user_id === selectedUser)?.user.full_name}</strong> will become a delegate for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    {selectedApps.map(appId => {
                      const app = availableApps.find(a => a.id === appId)
                      return <li key={appId}>{app?.name}</li>
                    })}
                  </ul>
                  <p className="mt-2">
                    With permissions: {Object.entries(permissions)
                      .filter(([_, value]) => value)
                      .map(([key, _]) => key.replace('_', ' '))
                      .join(', ')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={!selectedUser || selectedApps.length === 0 || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Create Delegate
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/team/delegates')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DelegateManagement() {
  return (
    <Routes>
      <Route path="/" element={<DelegatesList />} />
      <Route path="/new" element={<CreateDelegate />} />
      <Route path="/:id" element={<div>Delegate details coming soon...</div>} />
      <Route path="/edit/:id" element={<div>Edit delegate coming soon...</div>} />
    </Routes>
  )
}
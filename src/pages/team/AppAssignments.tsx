import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Package,
  Users,
  Search,
  Filter,
  Plus,
  Minus,
  Crown,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  Building2
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
import { useRoleStore } from '@/stores/roleStore'
import { useTenantStore } from '@/stores/tenantStore'

// Mock data for installed apps with licensing info
const installedApps = [
  {
    id: 'elaris',
    name: 'Elaris ERP',
    icon: Building2,
    category: 'Business Management',
    subscription: {
      plan: 'Pro Plan',
      max_users: 10,
      price_per_user: 29,
      total_cost: 290
    },
    status: 'active'
  },
  {
    id: 'forvaramail',
    name: 'ForvaraMail',
    icon: MessageSquare,
    category: 'Communication',
    subscription: {
      plan: 'Team Plan',
      max_users: 25,
      price_per_user: 8,
      total_cost: 200
    },
    status: 'active'
  },
  {
    id: 'analytics',
    name: 'Analytics Pro',
    icon: BarChart3,
    category: 'Analytics',
    subscription: {
      plan: 'Professional',
      max_users: 5,
      price_per_user: 49,
      total_cost: 245
    },
    status: 'trial'
  }
]

export default function AppAssignments() {
  const [searchParams] = useSearchParams()
  const selectedUserId = searchParams.get('user')
  
  const { members, assignUserToApp, revokeUserFromApp, isOwner, isDelegate, getAvailableLicenses } = useRoleStore()
  const { currentTenant } = useTenantStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [appFilter, setAppFilter] = useState('all')
  const [userFilter, setUserFilter] = useState(selectedUserId || 'all')
  
  const useHubManagement = currentTenant?.settings?.use_hub_management ?? true

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesUser = userFilter === 'all' || member.user_id === userFilter
    
    const matchesApp = appFilter === 'all' || 
                      member.app_assignments.some(a => a.app_id === appFilter)
    
    return matchesSearch && matchesUser && matchesApp
  })

  const getAppUsageStats = (appId: string) => {
    // Count users assigned to the app (excluding owners who have automatic access)
    const assignedNonOwners = members.filter(m => 
      m.role !== 'owner' && m.app_assignments.some(a => a.app_id === appId && a.status === 'active')
    ).length
    
    const app = installedApps.find(a => a.id === appId)
    const maxUsers = app?.subscription.max_users || 0
    
    // Total displayed users includes assigned members + owners
    const ownerCount = members.filter(m => m.role === 'owner').length
    const totalDisplayed = assignedNonOwners + ownerCount
    
    return {
      assigned: totalDisplayed,
      available: maxUsers - assignedNonOwners, // Only non-owners count against limit
      max: maxUsers,
      percentage: maxUsers > 0 ? (assignedNonOwners / maxUsers) * 100 : 0
    }
  }

  const handleAssignUser = async (userId: string, appId: string) => {
    try {
      await assignUserToApp(userId, appId)
    } catch (error) {
      console.error('Failed to assign user:', error)
    }
  }

  const handleRevokeUser = async (userId: string, appId: string) => {
    // Prevent removing owner from any app
    const member = members.find(m => m.user_id === userId)
    if (member?.role === 'owner') {
      alert('Cannot revoke access for company owner. Owners have access to all apps.')
      return
    }

    try {
      await revokeUserFromApp(userId, appId)
    } catch (error) {
      console.error('Failed to revoke user:', error)
    }
  }

  const canAssignToApp = (userId: string, appId: string) => {
    const member = members.find(m => m.user_id === userId)
    // Owners are always assignable (they don't count against limits)
    if (member?.role === 'owner') {
      return true
    }
    
    const stats = getAppUsageStats(appId)
    return stats.available > 0
  }

  const isUserAssignedToApp = (userId: string, appId: string) => {
    const member = members.find(m => m.user_id === userId)
    // Owners are always considered assigned to all apps
    if (member?.role === 'owner') {
      return true
    }
    return member?.app_assignments.some(a => a.app_id === appId && a.status === 'active') || false
  }

  const getRoleBadge = (member: any) => {
    if (member.role === 'owner') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Crown className="w-3 h-3 mr-1" />
          Owner
        </Badge>
      )
    }
    
    if (useHubManagement && member.delegate_permissions.length > 0) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <Shield className="w-3 h-3 mr-1" />
          Delegate
        </Badge>
      )
    }
    
    return (
      <Badge variant="outline">
        <Users className="w-3 h-3 mr-1" />
        Member
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case 'trial':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Trial
          </Badge>
        )
      default:
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {members.map(member => (
              <SelectItem key={member.user_id} value={member.user_id}>
                {member.user.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={appFilter} onValueChange={setAppFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by app" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Apps</SelectItem>
            {installedApps.map(app => (
              <SelectItem key={app.id} value={app.id}>{app.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* App License Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {installedApps.map(app => {
          const stats = getAppUsageStats(app.id)
          return (
            <Card key={app.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <app.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{app.name}</CardTitle>
                      <CardDescription className="text-xs">{app.subscription.plan}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>License Usage</span>
                    <span className="font-medium">
                      {stats.assigned}/{stats.max} users
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stats.percentage > 90 ? 'bg-red-500' :
                        stats.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{stats.available} available</span>
                    <span>${app.subscription.total_cost}/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* User App Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>App Access Management</CardTitle>
          <CardDescription>
            Assign and revoke app access for team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {member.user.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.user.full_name}</h3>
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                    </div>
                  </div>
                  {getRoleBadge(member)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {installedApps.map(app => {
                    const isAssigned = isUserAssignedToApp(member.user_id, app.id)
                    const canAssign = canAssignToApp(member.user_id, app.id)
                    const stats = getAppUsageStats(app.id)
                    
                    return (
                      <div key={app.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <app.icon className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-sm">{app.name}</span>
                          </div>
                          {isAssigned ? (
                            member.role === 'owner' ? (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Crown className="w-3 h-3 mr-1" />
                                Owner Access
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeUser(member.user_id, app.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Minus className="w-3 h-3 mr-1" />
                                Revoke
                              </Button>
                            )
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssignUser(member.user_id, app.id)}
                              disabled={!canAssign}
                              className={canAssign ? "text-green-600 border-green-200 hover:bg-green-50" : ""}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Assign
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className={isAssigned ? "text-green-600 font-medium" : "text-gray-400"}>
                              {isAssigned ? (member.role === 'owner' ? "Owner Access" : "Active") : "No Access"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Available:</span>
                            <span className={stats.available > 0 ? "text-green-600" : "text-red-600"}>
                              {stats.available}/{stats.max}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('')
                setUserFilter('all')
                setAppFilter('all')
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* License Usage Warning */}
      {installedApps.some(app => getAppUsageStats(app.id).percentage > 90) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-900">License Limit Warning</h3>
                <p className="text-sm text-yellow-700">
                  Some of your apps are near their user limit. Consider upgrading your plan or managing user access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
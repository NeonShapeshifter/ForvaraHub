import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  UserPlus,
  Package,
  Shield,
  Crown,
  Mail,
  Calendar,
  MoreVertical,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRoleStore } from '@/stores/roleStore'
import { useTenantStore } from '@/stores/tenantStore'

export default function TeamOverview() {
  const { members } = useRoleStore()
  const { currentTenant } = useTenantStore()
  
  const useHubManagement = currentTenant?.settings?.use_hub_management ?? true

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
    
    if (member.app_assignments.length > 0) {
      return (
        <Badge variant="secondary">
          <Package className="w-3 h-3 mr-1" />
          App User
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

  const recentMembers = members
    .sort((a, b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime())
    .slice(0, 5)

  const delegates = members.filter(m => m.delegate_permissions.length > 0)
  const appUsers = members.filter(m => m.app_assignments.length > 0)
  const hubOnlyMembers = members.filter(m => m.app_assignments.length === 0 && m.role !== 'owner')

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" asChild>
          <Link to="/team/members/invite">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Invite New Member</CardTitle>
                  <CardDescription className="text-sm">Add people to your team</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{members.length}/50 slots used</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" asChild>
          <Link to="/team/apps">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Manage App Access</CardTitle>
                  <CardDescription className="text-sm">Assign apps to team members</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{appUsers.length} members with apps</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Link>
        </Card>

        {useHubManagement && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer" asChild>
            <Link to="/team/delegates">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Manage Delegates</CardTitle>
                    <CardDescription className="text-sm">Create app-specific admins</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{delegates.length} active delegates</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Link>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Members
              <Button variant="outline" size="sm" asChild>
                <Link to="/team/members">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Latest additions to your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {member.user.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.user.full_name}</p>
                      <p className="text-xs text-gray-500">
                        Joined {formatDate(member.joined_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getRoleBadge(member)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Team Composition</CardTitle>
            <CardDescription>
              Breakdown of roles and access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Owners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{members.filter(m => m.role === 'owner').length}</span>
                  <Badge variant="outline" className="text-xs">Full Access</Badge>
                </div>
              </div>

              {useHubManagement && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Delegates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{delegates.length}</span>
                    <Badge variant="outline" className="text-xs">App Admin</Badge>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-green-600" />
                  <span className="text-sm">App Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{appUsers.length}</span>
                  <Badge variant="outline" className="text-xs">App Access</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Hub Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{hubOnlyMembers.length}</span>
                  <Badge variant="outline" className="text-xs">Hub Only</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Active Team Members
            <Button variant="outline" size="sm" asChild>
              <Link to="/team/members">Manage All</Link>
            </Button>
          </CardTitle>
          <CardDescription>
            Team members who have logged in recently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members
              .filter(m => m.user.last_login)
              .sort((a, b) => new Date(b.user.last_login!).getTime() - new Date(a.user.last_login!).getTime())
              .slice(0, 10)
              .map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {member.user.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{member.user.full_name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {member.user.email}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Last login: {formatLastLogin(member.user.last_login!)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getRoleBadge(member)}
                    <div className="text-sm text-gray-500">
                      {member.app_assignments.length} {member.app_assignments.length === 1 ? 'app' : 'apps'}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/team/members/${member.id}`}>
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/team/apps?user=${member.user_id}`}>
                            Manage Apps
                          </Link>
                        </DropdownMenuItem>
                        {useHubManagement && member.role !== 'owner' && (
                          <DropdownMenuItem asChild>
                            <Link to={`/team/delegates/new?user=${member.user_id}`}>
                              Make Delegate
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
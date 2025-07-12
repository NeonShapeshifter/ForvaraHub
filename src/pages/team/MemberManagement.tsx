import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  Package,
  Shield,
  Crown,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Send,
  Copy,
  ExternalLink
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

function MembersList() {
  const [searchParams] = useSearchParams()
  const { members, updateMember } = useRoleStore()
  const { currentTenant } = useTenantStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [appFilter, setAppFilter] = useState('all')
  
  const useHubManagement = currentTenant?.settings?.use_hub_management ?? true

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || 
                       (roleFilter === 'owner' && member.role === 'owner') ||
                       (roleFilter === 'delegate' && member.delegate_permissions.length > 0) ||
                       (roleFilter === 'app_user' && member.app_assignments.length > 0) ||
                       (roleFilter === 'hub_only' && member.app_assignments.length === 0 && member.role !== 'owner')

    const matchesApp = appFilter === 'all' || 
                      member.app_assignments.some(a => a.app_id === appFilter)
    
    return matchesSearch && matchesRole && matchesApp
  })

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
        Hub Member
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

  // Mock available apps for filter
  const availableApps = [
    { id: 'elaris', name: 'Elaris ERP' },
    { id: 'forvaramail', name: 'ForvaraMail' },
    { id: 'analytics', name: 'Analytics' }
  ]

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
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="owner">Owners</SelectItem>
            {useHubManagement && <SelectItem value="delegate">Delegates</SelectItem>}
            <SelectItem value="app_user">App Users</SelectItem>
            <SelectItem value="hub_only">Hub Members</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Team Members ({filteredMembers.length})
            <Button asChild>
              <Link to="invite">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Link>
            </Button>
          </CardTitle>
          <CardDescription>
            Manage your team members and their access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {member.user.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{member.user.full_name}</h3>
                        {getRoleBadge(member)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {member.user.email}
                          </div>
                          {member.user.phone && (
                            <div>📱 {member.user.phone}</div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Joined {formatDate(member.joined_at)}
                          </div>
                          {member.user.last_login && (
                            <div>Last login: {formatLastLogin(member.user.last_login)}</div>
                          )}
                        </div>
                        
                        {/* App Assignments */}
                        <div className="flex items-center space-x-2 mt-2">
                          <Package className="w-4 h-4" />
                          <span>Apps:</span>
                          {member.app_assignments.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {member.app_assignments.slice(0, 3).map(assignment => {
                                const app = availableApps.find(a => a.id === assignment.app_id)
                                return (
                                  <Badge key={assignment.id} variant="outline" className="text-xs">
                                    {app?.name || assignment.app_id}
                                  </Badge>
                                )
                              })}
                              {member.app_assignments.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{member.app_assignments.length - 3} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">Hub access only</span>
                          )}
                        </div>

                        {/* Delegate Permissions */}
                        {useHubManagement && member.delegate_permissions.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Delegate of:</span>
                            <div className="flex flex-wrap gap-1">
                              {member.delegate_permissions.map(perm => {
                                const app = availableApps.find(a => a.id === perm.app_id)
                                return (
                                  <Badge key={perm.id} className="bg-blue-100 text-blue-800 text-xs">
                                    {app?.name || perm.app_id}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}
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
                        <Link to={`${member.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/team/apps?user=${member.user_id}`}>
                          <Package className="w-4 h-4 mr-2" />
                          Manage Apps
                        </Link>
                      </DropdownMenuItem>
                      {useHubManagement && member.role !== 'owner' && (
                        <DropdownMenuItem asChild>
                          <Link to={`/team/delegates/new?user=${member.user_id}`}>
                            <Shield className="w-4 h-4 mr-2" />
                            Make Delegate
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Member
                      </DropdownMenuItem>
                      {member.role !== 'owner' && (
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('')
                setRoleFilter('all')
                setAppFilter('all')
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InviteMember() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    message: '',
    send_welcome_email: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // TODO: Implement actual invitation
      console.log('Inviting member:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      navigate('/team/members')
    } catch (error) {
      console.error('Invite error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inviteLink = `${window.location.origin}/join?invite=abc123`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Invite New Member</h2>
          <p className="text-gray-600">Add a new person to your team</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/team/members')}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invitation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Invitation</CardTitle>
            <CardDescription>
              Send an email invitation to join your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Personal Message (Optional)</label>
                <textarea
                  className="w-full p-2 border rounded-md resize-none"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Welcome to our team! We're excited to have you..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="welcome_email"
                  checked={formData.send_welcome_email}
                  onChange={(e) => setFormData({ ...formData, send_welcome_email: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="welcome_email" className="text-sm">Send welcome email</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Invite Link */}
        <Card>
          <CardHeader>
            <CardTitle>Share Invite Link</CardTitle>
            <CardDescription>
              Or share this link directly with the person
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invitation Link</label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(inviteLink)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Link Details</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Link expires in 7 days</li>
                <li>• Can be used only once</li>
                <li>• Gives Hub access initially</li>
                <li>• Apps can be assigned later</li>
              </ul>
            </div>

            <Button variant="outline" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Test Link
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function MemberManagement() {
  return (
    <Routes>
      <Route path="/" element={<MembersList />} />
      <Route path="/invite" element={<InviteMember />} />
      <Route path="/:id" element={<div>Member profile coming soon...</div>} />
    </Routes>
  )
}
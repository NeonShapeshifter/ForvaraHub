import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Send,
  UserPlus,
  Copy,
  CheckCircle,
  AlertCircle,
  Phone,
  Building2,
  Package,
  Shield
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
import { Checkbox } from '@/components/ui/checkbox'
import { useTenantStore } from '@/stores/tenantStore'
import { useRoleStore } from '@/stores/roleStore'

export default function InviteMember() {
  const navigate = useNavigate()
  const { currentTenant } = useTenantStore()
  const { members } = useRoleStore()
  const [isLoading, setIsLoading] = useState(false)
  const [inviteMethod, setInviteMethod] = useState<'email' | 'phone'>('email')
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    full_name: '',
    role: 'member', // member, admin, delegate
    message: 'You have been invited to join our team on Forvara Hub. Click the link below to get started!',
    apps: [] as string[],
    send_email: true
  })

  const useHubManagement = currentTenant?.settings?.use_hub_management ?? false
  
  const availableApps = [
    { id: 'elaris-erp', name: 'Elaris ERP', icon: Package },
    { id: 'forvara-mail', name: 'ForvaraMail', icon: Mail },
    { id: 'forvara-analytics', name: 'ForvaraAnalytics', icon: Building2 }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Inviting member:', {
        contact: inviteMethod === 'email' ? formData.email : formData.phone,
        method: inviteMethod,
        name: formData.full_name,
        role: formData.role,
        apps: formData.apps,
        message: formData.message
      })

      // Show success message
      alert(`Invitation sent successfully to ${inviteMethod === 'email' ? formData.email : formData.phone}!`)
      
      // Navigate back to team
      navigate('/team')
      
    } catch (error) {
      console.error('Failed to send invitation:', error)
      alert('Failed to send invitation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppToggle = (appId: string) => {
    setFormData(prev => ({
      ...prev,
      apps: prev.apps.includes(appId)
        ? prev.apps.filter(id => id !== appId)
        : [...prev.apps, appId]
    }))
  }

  const generateInviteLink = () => {
    const baseUrl = window.location.origin
    const inviteCode = Math.random().toString(36).substring(2, 15)
    return `${baseUrl}/invite/${inviteCode}`
  }

  const inviteLink = generateInviteLink()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/team')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Team
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invite Team Member</h1>
          <p className="text-gray-600">Add new people to your {currentTenant?.name} workspace</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invite Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Invitation Details</span>
              </CardTitle>
              <CardDescription>
                Fill in the details for the person you want to invite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Method */}
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={inviteMethod === 'email' ? 'default' : 'outline'}
                      onClick={() => setInviteMethod('email')}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={inviteMethod === 'phone' ? 'default' : 'outline'}
                      onClick={() => setInviteMethod('phone')}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </Button>
                  </div>

                  {inviteMethod === 'email' ? (
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="colleague@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <span>Member - Basic hub access</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>Admin - Can manage team settings</span>
                        </div>
                      </SelectItem>
                      {useHubManagement && (
                        <SelectItem value="delegate">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span>Delegate - App-specific admin rights</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* App Access */}
                <div>
                  <label className="block text-sm font-medium mb-3">App Access</label>
                  <div className="space-y-3">
                    {availableApps.map((app) => (
                      <div key={app.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={app.id}
                          checked={formData.apps.includes(app.id)}
                          onCheckedChange={() => handleAppToggle(app.id)}
                        />
                        <app.icon className="w-5 h-5 text-blue-600" />
                        <label htmlFor={app.id} className="flex-1 cursor-pointer">
                          {app.name}
                        </label>
                        <Badge variant="outline">
                          {app.id === 'elaris-erp' ? '$59/month' : app.id === 'forvara-mail' ? '$8/month' : '$19/month'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected apps will be accessible to this member. Additional licensing costs may apply.
                  </p>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">Invitation Message</label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Add a personal message to the invitation..."
                  />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send_email"
                      checked={formData.send_email}
                      onCheckedChange={(checked) => setFormData({ ...formData, send_email: !!checked })}
                    />
                    <label htmlFor="send_email" className="text-sm text-gray-600 cursor-pointer">
                      Send invitation immediately
                    </label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" onClick={() => navigate('/team')}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Info */}
        <div className="space-y-6">
          {/* Team Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Members</span>
                <span className="font-medium">{members.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Available Licenses</span>
                <span className="font-medium">{50 - members.length} remaining</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Apps Installed</span>
                <span className="font-medium">{availableApps.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Invite Link */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Direct Invite Link</CardTitle>
              <CardDescription>
                Share this link directly instead of sending an invitation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg break-all text-sm font-mono">
                  {inviteLink}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink)
                    alert('Link copied to clipboard!')
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Invitations expire after 7 days</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Members can be assigned to apps later</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Role permissions can be changed anytime</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
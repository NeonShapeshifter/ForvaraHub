import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Users,
  UserPlus,
  Settings,
  Crown,
  Shield,
  Package,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  Building2,
  Plus,
  Minus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX
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
import { cn } from '@/lib/utils'

// Import sub-components
import TeamOverview from './team/TeamOverview'
import MemberManagement from './team/MemberManagement'
import DelegateManagement from './team/DelegateManagement'
import AppAssignments from './team/AppAssignments'
import InviteMember from './team/InviteMember'

const teamNavigation = [
  { name: 'Overview', href: '/team', icon: Users, exact: true },
  { name: 'Members', href: '/team/members', icon: UserPlus },
  { name: 'App Access', href: '/team/apps', icon: Package },
  { name: 'Delegates', href: '/team/delegates', icon: Shield },
]

function TeamLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentTenant } = useTenantStore()
  const { loadMembers, members, isLoading } = useRoleStore()

  const handleEnableHubManagement = () => {
    // Set a flag in localStorage so Settings knows to open Company tab
    localStorage.setItem('openCompanyTab', 'true')
    navigate('/settings')
  }

  useEffect(() => {
    if (currentTenant) {
      loadMembers()
    }
  }, [currentTenant, loadMembers])

  // Check if hub management is enabled
  const useHubManagement = currentTenant?.settings?.use_hub_management ?? true

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">
            Manage your team members, roles, and app access
            {!useHubManagement && (
              <span className="ml-2 text-orange-600 font-medium">
                (Standalone Mode)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/team/members/invite">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Link>
          </Button>
          {useHubManagement && (
            <Button asChild>
              <Link to="/team/delegates/new">
                <Shield className="w-4 h-4 mr-2" />
                Create Delegate
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {teamNavigation.map((item) => {
            // Hide delegates tab if not using hub management
            if (item.href.includes('delegates') && !useHubManagement) {
              return null
            }
            
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href)
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-gray-500">of 50 free slots</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">App Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.app_assignments.length > 0).length}
            </div>
            <p className="text-xs text-gray-500">have app access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {useHubManagement ? 'Delegates' : 'Admins'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {useHubManagement 
                ? members.filter(m => m.delegate_permissions.length > 0).length
                : members.filter(m => m.role === 'owner').length + 1 // Mock admin count
              }
            </div>
            <p className="text-xs text-gray-500">
              {useHubManagement ? 'managing apps' : 'with admin access'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hub Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {members.filter(m => m.app_assignments.length === 0).length}
            </div>
            <p className="text-xs text-gray-500">hub access only</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Mode Banner */}
      {!useHubManagement && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-orange-900">Standalone Mode</h3>
                <p className="text-sm text-orange-700">
                  Your company is using standalone app management. Advanced delegation features are disabled.
                  <button 
                    onClick={handleEnableHubManagement}
                    className="ml-2 underline hover:no-underline text-orange-700 font-medium"
                  >
                    Enable Hub Management
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div>{children}</div>
    </div>
  )
}

export default function Team() {
  return (
    <TeamLayout>
      <Routes>
        <Route path="/" element={<TeamOverview />} />
        <Route path="/members/*" element={<MemberManagement />} />
        <Route path="/members/invite" element={<InviteMember />} />
        <Route path="/apps/*" element={<AppAssignments />} />
        <Route path="/delegates/*" element={<DelegateManagement />} />
      </Routes>
    </TeamLayout>
  )
}
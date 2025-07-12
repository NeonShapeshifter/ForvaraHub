import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  Package,
  Users,
  BarChart3,
  Settings,
  Plus,
  Crown,
  Shield,
  Database,
  Activity,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppsManagement from './AppsManagement'
import UsersManagement from './UsersManagement'
import SystemSettings from './SystemSettings'
import Analytics from '../Analytics'
import { cn } from '@/lib/utils'

const adminNavigation = [
  { name: 'Overview', href: '/admin', icon: BarChart3, exact: true },
  { name: 'Apps Management', href: '/admin/apps', icon: Package },
  { name: 'Users & Tenants', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
]

function AdminOverview() {
  const stats = [
    {
      title: 'Total Apps',
      value: '12',
      change: '+2 this month',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Active Tenants',
      value: '47',
      change: '+8 this month',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: '$24,890',
      change: '+12% this month',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: 'Uptime',
      icon: Activity,
      color: 'emerald'
    }
  ]

  const recentApps = [
    { name: 'ProjectFlow Pro', status: 'pending', submittedAt: '2024-01-15' },
    { name: 'InvoiceBot', status: 'approved', submittedAt: '2024-01-14' },
    { name: 'TeamChat Plus', status: 'in_review', submittedAt: '2024-01-13' },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      approved: { variant: 'default' as const, label: 'Approved' },
      in_review: { variant: 'outline' as const, label: 'In Review' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' }
    }
    const config = variants[status as keyof typeof variants] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the Forvara ecosystem and marketplace</p>
        </div>
        <Button asChild>
          <Link to="/admin/apps/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New App
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent App Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent App Submissions</CardTitle>
            <CardDescription>
              Apps awaiting review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApps.map((app, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-gray-500">Submitted {app.submittedAt}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/apps">View All Submissions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/apps/new">
                <Package className="w-4 h-4 mr-2" />
                Add New App to Marketplace
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/users">
                <Users className="w-4 h-4 mr-2" />
                Manage User Accounts
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                View System Analytics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/settings">
                <Settings className="w-4 h-4 mr-2" />
                System Configuration
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const location = useLocation()
  
  return (
    <div className="flex h-full">
      {/* Admin Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Crown className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">System Management</p>
          </div>
        </div>

        <nav className="space-y-1">
          {adminNavigation.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href)
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-yellow-800' : 'text-gray-400'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Admin Access</span>
          </div>
          <p className="text-xs text-blue-700">
            You have full administrative privileges to manage the platform.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/apps/*" element={<AppsManagement />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </div>
    </div>
  )
}
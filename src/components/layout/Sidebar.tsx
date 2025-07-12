import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTenantStore } from '@/stores/tenantStore'
import {
  BarChart3,
  Building2,
  ChevronDown,
  CreditCard,
  FileText,
  Home,
  MessageCircle,
  Package,
  Plus,
  Settings,
  Shield,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Apps', href: '/apps', icon: Package },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Mail', href: '/mail', icon: MessageCircle },
  { name: 'Files', href: '/files', icon: FileText },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
]

// Admin-only navigation (only for platform admins)
const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Shield },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  // TEMP: Using mock data for development
  // const { currentTenant, availableTenants, switchTenant, createTenant } = useTenantStore()
  const { currentTenant, availableTenants, switchTenant } = useTenantStore()
  const createTenant = () => console.log('Create tenant')
  
  // TEMP: Mock admin check - in real app this would check user roles
  const isAdmin = true // You are the platform admin

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-12 px-4 border-b border-gray-200 bg-white">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-gray-900">Forvara</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tenant switcher */}
          <div className="p-4 border-b border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left"
                  size="sm"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {currentTenant?.name || 'Select company'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {availableTenants.map((tenant) => (
                  <DropdownMenuItem
                    key={tenant.id}
                    onClick={() => switchTenant(tenant.id)}
                    className={cn(
                      'flex items-center space-x-2',
                      currentTenant?.id === tenant.id && 'bg-gray-100'
                    )}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>{tenant.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    // TODO: Open create company modal
                    console.log('Create new company')
                  }}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create new company</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose()
                    }
                  }}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-blue-700' : 'text-gray-400'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Platform Admin
                  </p>
                </div>
                {adminNavigation.map((item) => {
                  const isActive = location.pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-red-50 text-red-700'
                          : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose()
                        }
                      }}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5',
                          isActive ? 'text-red-700' : 'text-gray-400'
                        )}
                      />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </>
            )}
          </nav>

          {/* Storage usage */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Storage</span>
                <span className="text-gray-900 font-medium">
                  {currentTenant ? `${(currentTenant.storage_used / 1024 / 1024).toFixed(1)} MB / ${(currentTenant.storage_limit / 1024 / 1024 / 1024).toFixed(0)} GB` : '0 MB / 5 GB'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: currentTenant
                      ? `${(currentTenant.storage_used / currentTenant.storage_limit) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
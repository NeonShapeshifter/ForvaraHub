// ForvaraHub/src/components/layout/Sidebar.tsx

import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useLocation, Link } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Settings, 
  BarChart3,
  CreditCard,
  Store,
  Package,
  Crown,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuthStore()
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.is_superuser
  
  // Main navigation
  const navigation = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/marketplace',
      icon: Store,
      label: 'Marketplace',
    },
    {
      href: '/my-apps',
      icon: Package,
      label: 'Mis Apps',
    },
    {
      href: '/users',
      icon: Users,
      label: 'Usuarios',
    },
    {
      href: '/companies',
      icon: Building,
      label: 'Empresas',
    },
    {
      href: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
    {
      href: '/billing',
      icon: CreditCard,
      label: 'Facturación',
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Configuración',
    },
  ]
  
  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] transition-transform duration-150",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <nav className="p-4 space-y-4">
          {/* Mobile close button */}
          <div className="flex lg:hidden justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-fast",
                    isActive
                      ? "gradient-brand text-white font-medium shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
          
          {/* Admin Section */}
          {isAdmin && (
            <div className="border-t pt-4">
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-fast",
                  location.pathname === '/admin'
                    ? "gradient-brand text-white font-medium shadow-sm"
                    : "text-orange-600 hover:bg-orange-50"
                )}
              >
                <Crown className="w-5 h-5" />
                <span className="font-medium">Admin Dashboard</span>
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

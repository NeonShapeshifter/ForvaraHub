import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Settings, 
  BarChart3,
  CreditCard,
  Store,
  Package,
  Crown
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: '🏪 Marketplace',
    href: '/marketplace',
    icon: Store,
    highlight: true,
  },
  {
    name: '🎮 Mis Apps',
    href: '/my-apps',
    icon: Package,
  },
  {
    name: 'Usuarios',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Empresas',
    href: '/companies',
    icon: Building,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Facturación',
    href: '/billing',
    icon: CreditCard,
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const { user } = useAuthStore()
  
  // Check if user is admin
  const isAdmin = user?.email === 'ale@forvara.com' || user?.email === 'admin@forvara.com'
  
  return (
    <aside className="w-64 bg-card border-r min-h-[calc(100vh-65px)]">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  (item as any).highlight && 'ring-2 ring-purple-200 dark:ring-purple-800 bg-purple-50 dark:bg-purple-950/50'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
        
        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="border-t pt-4 mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                👑 Admin Zone
              </p>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
                    'ring-2 ring-yellow-200 dark:ring-yellow-800 bg-yellow-50 dark:bg-yellow-950/50',
                    isActive
                      ? 'bg-yellow-600 text-white ring-yellow-400'
                      : 'text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
                  )
                }
              >
                <Crown className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </NavLink>
            </div>
          </>
        )}
      </nav>
    </aside>
  )
}
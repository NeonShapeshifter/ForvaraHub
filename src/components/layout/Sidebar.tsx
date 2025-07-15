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
  Crown,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavSection } from '@/components/navigation'

const mainNavigation = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/marketplace',
    icon: Store,
    label: '🏪 Marketplace',
    isHighlighted: true,
  },
  {
    href: '/my-apps',
    icon: Package,
    label: '🎮 Mis Apps',
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

const adminNavigation = [
  {
    href: '/admin',
    icon: Crown,
    label: 'Admin Dashboard',
    isAdmin: true,
  },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { user } = useAuthStore()
  
  // Check if user is admin
  const isAdmin = user?.email === 'ale@forvara.com' || user?.email === 'admin@forvara.com'
  
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
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r min-h-[calc(100vh-65px)] transition-transform duration-300 ease-in-out",
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
        <NavSection 
          items={mainNavigation} 
          onItemClick={() => setSidebarOpen(false)} 
        />
        
        {/* Admin Section */}
        {isAdmin && (
          <div className="border-t pt-4">
            <NavSection 
              title="👑 Admin Zone"
              items={adminNavigation} 
              onItemClick={() => setSidebarOpen(false)} 
            />
          </div>
        )}
      </nav>
    </aside>
    </>
  )
}
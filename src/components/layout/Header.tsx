import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Building, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { LogoAuto } from '@/components/ui/logo'
import { MobileMenuButton } from '@/components/navigation'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { user, currentCompany, logout } = useAuthStore()
  
  const userInitials = user ? `${user.first_name[0]}${user.last_name[0]}` : 'U'
  
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <MobileMenuButton
            isOpen={sidebarOpen}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          
          <div className="flex items-center space-x-3">
            <LogoAuto variant="icon" size="sm" className="hover:scale-110 transition-transform" />
            <LogoAuto variant="full" size="sm" className="hidden sm:block" />
          </div>
        </div>

        {/* Center - Company Switcher */}
        {currentCompany && (
          <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2">
            <Building className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{currentCompany.razon_social}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
              {currentCompany.status}
            </span>
          </div>
        )}

        {/* Right - User Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-9">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:block">
                  {user?.first_name} {user?.last_name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
import { Shield, Bell, Settings, ChevronDown } from 'lucide-react'

interface HeaderProps {
  currentUser?: {
    nombre: string
    apellido: string
    avatar_url?: string
  }
  currentTenant?: {
    nombre: string
  }
}

export default function Header({ currentUser, currentTenant }: HeaderProps) {
  return (
    <header className="bg-surface border-b border-secondary/20 px-6 py-4 flex items-center justify-between">
      {/* Logo Forvara */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">FORVARA</h1>
          {currentTenant && (
            <p className="text-sm text-accent">{currentTenant.nombre}</p>
          )}
        </div>
      </div>

      {/* User Area */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-accent hover:text-text transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3 px-3 py-2 bg-background rounded-lg border border-secondary/20 hover:border-accent/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {currentUser ? `${currentUser.nombre[0]}${currentUser.apellido[0]}` : 'U'}
            </span>
          </div>
          <div className="text-sm">
            <p className="text-text font-medium">
              {currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : 'Usuario'}
            </p>
            <p className="text-accent text-xs">Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-accent" />
        </div>

        {/* Settings */}
        <button className="p-2 text-accent hover:text-text transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}

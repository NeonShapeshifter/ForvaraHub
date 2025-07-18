// ForvaraHub/src/components/ui/command-palette.tsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Home,
  Users,
  Building,
  Package,
  CreditCard,
  Settings,
  BarChart3,
  Store,
  LogOut,
  Plus,
  Command
} from 'lucide-react'
import { Dialog, DialogContent } from './dialog'
import { useAuthStore } from '@/stores/authStore'

interface CommandItem {
  id: string
  label: string
  icon: any
  shortcut?: string
  action: () => void
  category: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const inputRef = useRef<HTMLInputElement>(null)

  // Comandos disponibles
  const commands: CommandItem[] = [
    // Navegación
    {
      id: 'nav-dashboard',
      label: 'Ir a Dashboard',
      icon: Home,
      action: () => {
        navigate('/dashboard')
        setOpen(false)
      },
      category: 'Navegación'
    },
    {
      id: 'nav-users',
      label: 'Ir a Usuarios',
      icon: Users,
      action: () => {
        navigate('/users')
        setOpen(false)
      },
      category: 'Navegación'
    },
    {
      id: 'nav-companies',
      label: 'Ir a Empresas',
      icon: Building,
      action: () => {
        navigate('/companies')
        setOpen(false)
      },
      category: 'Navegación'
    },
    {
      id: 'nav-marketplace',
      label: 'Ir a Marketplace',
      icon: Store,
      action: () => {
        navigate('/marketplace')
        setOpen(false)
      },
      category: 'Navegación'
    },
    {
      id: 'nav-apps',
      label: 'Ir a Mis Apps',
      icon: Package,
      action: () => {
        navigate('/my-apps')
        setOpen(false)
      },
      category: 'Navegación'
    },
    {
      id: 'nav-analytics',
      label: 'Ir a Analytics',
      icon: BarChart3,
      action: () => {
        navigate('/analytics')
        setOpen(false)
      },
      category: 'Navegación'
    },
    {
      id: 'nav-billing',
      label: 'Ir a Facturación',
      icon: CreditCard,
      action: () => {
        navigate('/billing')
        setOpen(false)
      },
      category: 'Navegación'
    },
    {
      id: 'nav-settings',
      label: 'Ir a Configuración',
      icon: Settings,
      action: () => {
        navigate('/settings')
        setOpen(false)
      },
      category: 'Navegación'
    },
    // Acciones
    {
      id: 'action-new-user',
      label: 'Invitar usuario',
      icon: Plus,
      shortcut: '⌘I',
      action: () => {
        navigate('/users')
        setOpen(false)
        // Trigger invite modal
      },
      category: 'Acciones'
    },
    {
      id: 'action-new-company',
      label: 'Crear empresa',
      icon: Plus,
      shortcut: '⌘E',
      action: () => {
        navigate('/companies')
        setOpen(false)
        // Trigger create modal
      },
      category: 'Acciones'
    },
    {
      id: 'action-logout',
      label: 'Cerrar sesión',
      icon: LogOut,
      action: () => {
        logout()
        navigate('/login')
        setOpen(false)
      },
      category: 'Acciones'
    }
  ]

  // Filtrar comandos basado en búsqueda
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  )

  // Agrupar por categoría
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      const commandsArray = filteredCommands

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => (i + 1) % commandsArray.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => (i - 1 + commandsArray.length) % commandsArray.length)
          break
        case 'Enter':
          e.preventDefault()
          if (commandsArray[selectedIndex]) {
            commandsArray[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredCommands, selectedIndex])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  return (
    <>
      {/* Trigger button (opcional, ya que usamos Cmd+K) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden"
        aria-label="Open command palette"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center border-b px-4">
            <Search className="w-4 h-4 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar comandos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 py-4 outline-none bg-transparent placeholder:text-gray-400"
            />
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>

          {/* Commands list */}
          <div className="max-h-96 overflow-y-auto p-2">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No se encontraron comandos
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                    {category}
                  </div>
                  {items.map((cmd, idx) => {
                    const isSelected = filteredCommands.indexOf(cmd) === selectedIndex
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(filteredCommands.indexOf(cmd))}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-fast ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-900'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <cmd.icon className="w-4 h-4 text-gray-400" />
                        <span className="flex-1 text-left text-sm">{cmd.label}</span>
                        {cmd.shortcut && (
                          <span className="text-xs text-gray-400">{cmd.shortcut}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">↑</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">↓</span>
                navegar
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">↵</span>
                seleccionar
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">esc</span>
                cerrar
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface NavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive?: boolean
  isHighlighted?: boolean
  isAdmin?: boolean
  onClick?: () => void
}

export function NavItem({ 
  href, 
  icon: Icon, 
  label, 
  isHighlighted = false,
  isAdmin = false,
  onClick 
}: NavItemProps) {
  const baseClasses = 'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative'
  
  const getItemClasses = (isActive: boolean) => {
    if (isAdmin) {
      return cn(
        baseClasses,
        'ring-2 ring-yellow-200 dark:ring-yellow-800 bg-yellow-50 dark:bg-yellow-950/50',
        isActive
          ? 'bg-yellow-600 text-white ring-yellow-400'
          : 'text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
      )
    }
    
    return cn(
      baseClasses,
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
      isHighlighted && 'ring-2 ring-purple-200 dark:ring-purple-800 bg-purple-50 dark:bg-purple-950/50'
    )
  }

  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) => getItemClasses(isActive)}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  )
}
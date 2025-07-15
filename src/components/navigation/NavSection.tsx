import React from 'react'
import { NavItem } from './NavItem'
import { LucideIcon } from 'lucide-react'

interface NavSectionProps {
  title?: string
  items: Array<{
    href: string
    icon: LucideIcon
    label: string
    isHighlighted?: boolean
    isAdmin?: boolean
  }>
  onItemClick?: () => void
}

export function NavSection({ title, items, onItemClick }: NavSectionProps) {
  return (
    <div className="space-y-1">
      {title && (
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          {title}
        </h3>
      )}
      
      {items.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isHighlighted={item.isHighlighted}
          isAdmin={item.isAdmin}
          onClick={onItemClick}
        />
      ))}
    </div>
  )
}
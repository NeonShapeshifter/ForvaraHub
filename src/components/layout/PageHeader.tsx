import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  children?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  actions 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      
      {(actions || children) && (
        <div className="flex items-center gap-2">
          {actions}
          {children}
        </div>
      )}
    </div>
  )
}
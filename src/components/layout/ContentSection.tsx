import React from 'react'
import { cn } from '@/lib/utils'

interface ContentSectionProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'card' | 'bordered'
}

export function ContentSection({ 
  children, 
  className, 
  variant = 'default' 
}: ContentSectionProps) {
  const variants = {
    default: '',
    card: 'bg-card rounded-lg border p-6',
    bordered: 'border rounded-lg p-6'
  }

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  )
}
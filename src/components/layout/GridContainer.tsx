import React from 'react'
import { cn } from '@/lib/utils'

interface GridContainerProps {
  children: React.ReactNode
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function GridContainer({
  children,
  columns = { default: 1, md: 2, lg: 3 },
  gap = 6,
  className
}: GridContainerProps) {
  const gridClasses = [
    'grid',
    `gap-${gap}`,
    columns.default && `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`
  ].filter(Boolean).join(' ')

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  )
}

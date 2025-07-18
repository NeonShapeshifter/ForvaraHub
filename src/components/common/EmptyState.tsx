import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentSection } from '@/components/layout/ContentSection'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'inline' | 'page' | 'card'
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'inline'
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {Icon && (
        <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {action && (
        <Button onClick={action.onClick} className="gap-2">
          {action.label}
        </Button>
      )}
    </div>
  )

  if (variant === 'page') {
    return (
      <div className="flex items-center justify-center min-h-96">
        {content}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <ContentSection variant="card" className="text-center py-12">
        {content}
      </ContentSection>
    )
  }

  return content
}

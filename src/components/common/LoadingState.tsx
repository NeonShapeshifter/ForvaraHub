import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { ContentSection } from '@/components/layout/ContentSection'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'inline' | 'page' | 'card'
}

export function LoadingState({ 
  message = 'Cargando...', 
  size = 'md',
  variant = 'inline' 
}: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <LoadingSpinner size={size} />
      <p className="text-sm text-muted-foreground">{message}</p>
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
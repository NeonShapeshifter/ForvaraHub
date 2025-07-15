import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentSection } from '@/components/layout/ContentSection'

interface ErrorStateProps {
  title?: string
  message?: string
  variant?: 'inline' | 'page' | 'card'
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorState({ 
  title = 'Error',
  message = 'Algo salió mal. Por favor, intenta de nuevo.',
  variant = 'inline',
  onRetry,
  showRetry = true
}: ErrorStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Intentar de nuevo
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
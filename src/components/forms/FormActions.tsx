import React from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

interface FormActionsProps {
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  isSubmitting?: boolean
  isValid?: boolean
  className?: string
}

export function FormActions({
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  isSubmitting = false,
  isValid = true,
  className
}: FormActionsProps) {
  return (
    <div className={cn('flex items-center gap-3 pt-4', className)}>
      {onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting || !isValid}
          className="gap-2"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}
          {submitLabel}
        </Button>
      )}

      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}
    </div>
  )
}

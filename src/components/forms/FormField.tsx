import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea' | 'select'
  value: string | number
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: Array<{ value: string; label: string }>
  rows?: number
  className?: string
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  options = [],
  rows = 3,
  className
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={cn(error && 'border-destructive focus:border-destructive')}
          />
        )

      case 'select':
        return (
          <Select value={String(value)} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={cn(error && 'border-destructive focus:border-destructive')}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={cn(error && 'border-destructive focus:border-destructive')}
          />
        )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
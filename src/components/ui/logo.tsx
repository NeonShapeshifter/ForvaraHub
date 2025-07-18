import { cn } from '@/lib/utils'

export interface LogoProps {
  variant?: 'full' | 'icon'
  theme?: 'light' | 'dark' | 'grey' | 'purple'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  alt?: string
}

const sizeClasses = {
  xs: 'h-6',
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-24'
}

const textSizeClasses = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl'
}

export function Logo({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className,
  alt = 'Forvara Logo'
}: LogoProps) {
  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return 'text-white'
      case 'grey':
        return 'text-gray-600'
      case 'purple':
        return 'text-purple-600'
      default:
        return 'text-gray-900'
    }
  }

  if (variant === 'icon') {
    // SVG Icon placeholder
    return (
      <div
        className={cn(
          sizeClasses[size],
          'flex items-center justify-center rounded-lg gradient-brand text-white font-bold transition-all duration-300 hover:scale-105',
          className
        )}
        role="img"
        aria-label={alt}
      >
        <span className={textSizeClasses[size]}>F</span>
      </div>
    )
  }

  // Full logo as text
  return (
    <div
      className={cn(
        'flex items-center transition-all duration-300 hover:scale-105',
        className
      )}
      role="img"
      aria-label={alt}
    >
      <span className={cn(
        textSizeClasses[size],
        'font-bold logo-gradient',
        getThemeColors()
      )}>
        Forvara
      </span>
    </div>
  )
}

// Specialized components for common use cases
export function LogoFull(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="full" />
}

export function LogoIcon(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="icon" />
}

// Dark mode aware logo (automatically switches based on theme)
export function LogoAuto({
  className,
  ...props
}: Omit<LogoProps, 'theme'>) {
  return (
    <>
      {/* Light mode logo */}
      <Logo
        {...props}
        theme="light"
        className={cn('dark:hidden', className)}
      />
      {/* Dark mode logo */}
      <Logo
        {...props}
        theme="dark"
        className={cn('hidden dark:block', className)}
      />
    </>
  )
}

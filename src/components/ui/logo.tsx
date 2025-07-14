import React from 'react'
import { cn } from '@/lib/utils'

export interface LogoProps {
  variant?: 'full' | 'icon'
  theme?: 'light' | 'dark' | 'grey' | 'purple'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  alt?: string
}

const sizeClasses = {
  xs: 'h-6 w-auto',
  sm: 'h-8 w-auto', 
  md: 'h-12 w-auto',
  lg: 'h-16 w-auto',
  xl: 'h-24 w-auto'
}

export function Logo({ 
  variant = 'full',
  theme = 'light',
  size = 'md',
  className,
  alt = 'Forvara Logo'
}: LogoProps) {
  // Auto-detect dark mode if theme is 'auto'
  const getLogoPath = () => {
    const baseDir = variant === 'full' ? '/logos' : '/icons'
    const fileName = variant === 'full' ? 'ForvaraLogo' : 'ForvaraIcon'
    
    const themeMapping = {
      light: 'BlackWhite',
      dark: 'WhiteBlack', 
      grey: 'WhiteGrey',
      purple: 'WhitePurple'
    }
    
    return `${baseDir}/${fileName}${themeMapping[theme]}.png`
  }

  return (
    <img
      src={getLogoPath()}
      alt={alt}
      className={cn(
        sizeClasses[size],
        'object-contain transition-all duration-300 hover:scale-105',
        className
      )}
      draggable={false}
    />
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
    <div className="relative">
      {/* Light mode logo */}
      <Logo 
        {...props} 
        theme="light" 
        className={cn("dark:hidden", className)} 
      />
      {/* Dark mode logo */}
      <Logo 
        {...props} 
        theme="dark" 
        className={cn("hidden dark:block", className)} 
      />
    </div>
  )
}
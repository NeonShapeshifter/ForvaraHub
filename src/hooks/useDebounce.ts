import React, { useState, useEffect, useCallback, useRef } from 'react'

// Basic debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Advanced debounce hook with callback
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }) as T,
    [callback, delay]
  )

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [debouncedCallback, cancel]
}

// Search-specific debounce hook
export function useSearchDebounce(
  searchTerm: string,
  delay: number = 300
): {
  debouncedSearchTerm: string
  isSearching: boolean
  searchCount: number
} {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
  const [isSearching, setIsSearching] = useState(false)
  const [searchCount, setSearchCount] = useState(0)

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true)
    }

    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setIsSearching(false)
      if (searchTerm.length > 0) {
        setSearchCount(prev => prev + 1)
      }
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, delay, debouncedSearchTerm])

  return {
    debouncedSearchTerm,
    isSearching,
    searchCount
  }
}

// Debounce with loading state
export function useDebounceWithLoading<T>(
  value: T,
  delay: number,
  immediate: boolean = false
): {
  debouncedValue: T
  isLoading: boolean
  isReady: boolean
} {
  const [debouncedValue, setDebouncedValue] = useState<T>(immediate ? value : {} as T)
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(immediate)

  useEffect(() => {
    if (!immediate && !isReady) {
      setIsReady(true)
      setDebouncedValue(value)
      return
    }

    setIsLoading(true)

    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsLoading(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, immediate, isReady])

  return {
    debouncedValue,
    isLoading,
    isReady
  }
}

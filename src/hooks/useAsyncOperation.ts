import { useState, useCallback } from 'react'

interface UseAsyncOperationResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

export function useAsyncOperation<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncOperationResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true)
      setError(null)
      const result = await asyncFunction(...args)
      setData(result)
      return result
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

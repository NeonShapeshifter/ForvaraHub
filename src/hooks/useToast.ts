import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const toasts: Toast[] = []
const listeners: ((toasts: Toast[]) => void)[] = []

let nextId = 1

const emitChange = () => {
  listeners.forEach(listener => listener([...toasts]))
}

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = String(nextId++)
  const newToast: Toast = {
    ...toast,
    id,
    duration: toast.duration ?? 5000
  }

  toasts.push(newToast)
  emitChange()

  // Auto remove after duration
  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  return id
}

const removeToast = (id: string) => {
  const index = toasts.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    emitChange()
  }
}

export const toast = {
  success: (title: string, message?: string) =>
    addToast({ type: 'success', title, message }),

  error: (title: string, message?: string) =>
    addToast({ type: 'error', title, message }),

  warning: (title: string, message?: string) =>
    addToast({ type: 'warning', title, message }),

  info: (title: string, message?: string) =>
    addToast({ type: 'info', title, message }),

  remove: removeToast
}

export const useToast = () => {
  const [toastList, setToastList] = useState<Toast[]>([...toasts])

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  const unsubscribe = useCallback(() => {
    listeners.length = 0
  }, [])

  // Subscribe to changes
  useState(() => {
    const unsubscribe = subscribe(setToastList)
    return unsubscribe
  })

  return {
    toasts: toastList,
    toast,
    removeToast
  }
}

// ForvaraHub/src/components/ui/search-modal.tsx

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  Users,
  Building,
  Package,
  File,
  Clock,
  TrendingUp,
  ArrowRight,
  Loader2,
  Hash,
  Calendar,
  Filter
} from 'lucide-react'
import { api } from '@/services/api'
import { useSearchDebounce } from '@/hooks/useDebounce'

interface SearchResult {
  id: string
  type: 'user' | 'company' | 'app' | 'document'
  title: string
  subtitle?: string
  icon?: any
  url: string
  metadata?: Record<string, any>
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchType, setSearchType] = useState<'all' | 'users' | 'companies' | 'apps' | 'documents'>('all')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const { debouncedSearchTerm, isSearching } = useSearchDebounce(query, 300)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      loadRecentSearches()
    } else {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch()
    } else {
      setResults([])
    }
  }, [debouncedSearchTerm, searchType])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => (i + 1) % results.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => (i - 1 + results.length) % results.length)
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  const loadRecentSearches = () => {
    const saved = localStorage.getItem('forvara_recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }

  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('forvara_recent_searches', JSON.stringify(updated))
  }

  const performSearch = async () => {
    try {

      const params = {
        q: debouncedSearchTerm,
        type: searchType === 'all' ? undefined : searchType
      }

      const response = await api.get('/search', { params })

      // Transform API results to our format
      const formattedResults: SearchResult[] = response.data.map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.name || item.title,
        subtitle: item.description || item.email,
        icon: getIconForType(item.type),
        url: getUrlForResult(item),
        metadata: item
      }))

      setResults(formattedResults)
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    }
  }

  const getIconForType = (type: string) => {
    const icons = {
      user: Users,
      company: Building,
      app: Package,
      document: File
    }
    return icons[type as keyof typeof icons] || File
  }

  const getUrlForResult = (result: any) => {
    switch (result.type) {
      case 'user':
        return `/users/${result.id}`
      case 'company':
        return `/companies/${result.id}`
      case 'app':
        return `/marketplace/${result.id}`
      case 'document':
        return `/documents/${result.id}`
      default:
        return '#'
    }
  }

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query)
    navigate(result.url)
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen px-4 flex items-start justify-center pt-20">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="border-b">
            <div className="flex items-center px-6 py-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar usuarios, empresas, aplicaciones..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-lg placeholder:text-gray-400"
              />
              <button
                onClick={onClose}
                className="ml-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search type filters */}
            <div className="px-6 pb-3 flex items-center gap-2">
              {[
                { value: 'all', label: 'Todo' },
                { value: 'users', label: 'Usuarios', icon: Users },
                { value: 'companies', label: 'Empresas', icon: Building },
                { value: 'apps', label: 'Apps', icon: Package },
                { value: 'documents', label: 'Documentos', icon: File }
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setSearchType(type.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-fast flex items-center gap-1.5 ${
                    searchType === type.value
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.icon && <type.icon className="w-3.5 h-3.5" />}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Buscando...</p>
              </div>
            ) : query ? (
              results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => {
                    const Icon = result.icon
                    const isSelected = index === selectedIndex

                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-sm text-gray-500">{result.subtitle}</p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    No se encontraron resultados
                  </p>
                  <p className="text-sm text-gray-500">
                    Intenta con otros términos de búsqueda
                  </p>
                </div>
              )
            ) : (
              /* Recent searches or suggestions */
              <div className="p-6">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Búsquedas recientes
                    </h3>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(search)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick actions */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Acciones rápidas
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        navigate('/users?action=invite')
                        onClose()
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Users className="w-5 h-5 text-gray-600 mb-1" />
                      <p className="text-sm font-medium text-gray-900">Invitar usuario</p>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/companies?action=create')
                        onClose()
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Building className="w-5 h-5 text-gray-600 mb-1" />
                      <p className="text-sm font-medium text-gray-900">Crear empresa</p>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/marketplace')
                        onClose()
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Package className="w-5 h-5 text-gray-600 mb-1" />
                      <p className="text-sm font-medium text-gray-900">Explorar apps</p>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/analytics')
                        onClose()
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                    >
                      <TrendingUp className="w-5 h-5 text-gray-600 mb-1" />
                      <p className="text-sm font-medium text-gray-900">Ver analytics</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border">↑↓</kbd> navegar
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border">↵</kbd> seleccionar
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border">esc</kbd> cerrar
                </span>
              </div>
              {results.length > 0 && (
                <span>{results.length} resultados</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Hook para usar el search modal
export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }
}

// ForvaraHub/src/components/ui/data-table.tsx

import React, { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Check,
  X
} from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './dropdown-menu'

// Types
export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  actions?: (row: T) => React.ReactNode
  bulkActions?: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: (selectedRows: T[]) => void
    variant?: 'default' | 'destructive'
  }[]
  emptyState?: React.ReactNode
  loading?: boolean
  pageSize?: number
  onExport?: () => void
}

// Sorting types
type SortDirection = 'asc' | 'desc' | null
type SortConfig<T> = {
  key: keyof T | string
  direction: SortDirection
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  actions,
  bulkActions,
  emptyState,
  loading = false,
  pageSize = 10,
  onExport
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({ key: '', direction: null })
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Record<string, string>>({})

  // Filter data based on search
  const filteredData = useMemo(() => {
    let filtered = data

    // Search filter
    if (search) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    // Column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        )
      }
    })

    return filtered
  }, [data, search, filters])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === bValue) return 0

      const isAsc = sortConfig.direction === 'asc'
      if (aValue < bValue) return isAsc ? -1 : 1
      return isAsc ? 1 : -1
    })
  }, [filteredData, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Handlers
  const handleSort = (key: keyof T | string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key
        ? prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc'
        : 'asc'
    }))
  }

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)))
    }
  }

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }

  const handleBulkAction = (action: DataTableProps<T>['bulkActions'][0]) => {
    const selected = paginatedData.filter((_, i) => selectedRows.has(i))
    action.onClick(selected)
    setSelectedRows(new Set())
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="skeleton h-10 w-64 rounded-lg"></div>
          <div className="flex gap-2">
            <div className="skeleton h-10 w-24 rounded-lg"></div>
            <div className="skeleton h-10 w-24 rounded-lg"></div>
          </div>
        </div>
        <div className="border rounded-xl">
          <div className="skeleton h-12 w-full"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full border-t"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {searchable && (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {columns.some(col => col.filterable) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedRows.size > 0 && bulkActions && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm text-gray-500">
                {selectedRows.size} seleccionados
              </span>
              {bulkActions.map((action, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={action.variant || 'outline'}
                  onClick={() => handleBulkAction(action)}
                >
                  {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          {columns.filter(col => col.filterable).map(col => (
            <div key={String(col.key)} className="flex-1 max-w-xs">
              <Input
                placeholder={`Filtrar ${col.header}...`}
                value={filters[String(col.key)] || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  [String(col.key)]: e.target.value
                }))}
                size="sm"
              />
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({})}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {bulkActions && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-900 ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : sortConfig.direction === 'desc' ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronsUpDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (bulkActions ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  {emptyState || (
                    <div className="text-gray-500">
                      <p>No se encontraron resultados</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {bulkActions && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleSelectRow(rowIndex)}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  {columns.map(column => (
                    <td
                      key={String(column.key)}
                      className="px-4 py-4 text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] || '-')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-4 text-right">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-sm rounded-lg transition-fast ${
                    currentPage === i + 1
                      ? 'gradient-brand text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

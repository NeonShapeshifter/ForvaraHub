import React, { useState } from 'react'
import {
  File,
  Folder,
  Upload,
  Download,
  Trash2,
  Share2,
  Search,
  Grid,
  List,
  MoreVertical,
  Plus,
  Filter,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Eye,
  Edit,
  Copy,
  Move,
  Star,
  Clock,
  Users,
  Lock,
  Globe,
  FolderPlus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTenantStore } from '@/stores/tenantStore'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified_at: string
  created_by: string
  app_source?: string
  access_level: 'public' | 'company' | 'app' | 'private'
  shared_with?: string[]
  is_starred?: boolean
  mime_type?: string
}

export default function Files() {
  const { currentTenant } = useTenantStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPath, setCurrentPath] = useState(['Root'])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [starredFiles, setStarredFiles] = useState<string[]>(['3']) // Mock: Presentación Q1 2024 is starred

  // Mock file data
  const mockFiles: FileItem[] = [
    {
      id: '1',
      name: 'Documentos Empresa',
      type: 'folder',
      modified_at: '2024-01-15T10:30:00Z',
      created_by: 'Alex Rodriguez',
      access_level: 'company'
    },
    {
      id: '2',
      name: 'Elaris ERP Data',
      type: 'folder',
      modified_at: '2024-01-15T09:15:00Z',
      created_by: 'Sistema',
      app_source: 'Elaris ERP',
      access_level: 'app'
    },
    {
      id: '3',
      name: 'Presentación Q1 2024.pptx',
      type: 'file',
      size: 5242880, // 5MB
      modified_at: '2024-01-14T16:45:00Z',
      created_by: 'María García',
      access_level: 'company',
      mime_type: 'application/vnd.ms-powerpoint',
      shared_with: ['team-ventas']
    },
    {
      id: '4',
      name: 'Logo Forvara.png',
      type: 'file',
      size: 156672, // 153KB
      modified_at: '2024-01-14T14:20:00Z',
      created_by: 'Carlos Mendoza',
      access_level: 'public',
      mime_type: 'image/png'
    },
    {
      id: '5',
      name: 'Reportes Financieros',
      type: 'folder',
      modified_at: '2024-01-13T11:00:00Z',
      created_by: 'Ana López',
      access_level: 'private',
      shared_with: ['alex@forvara.com', 'ana@forvara.com']
    },
    {
      id: '6',
      name: 'Manual Usuario Elaris.pdf',
      type: 'file',
      size: 2097152, // 2MB
      modified_at: '2024-01-12T08:30:00Z',
      created_by: 'Sistema',
      app_source: 'Elaris ERP',
      access_level: 'app',
      mime_type: 'application/pdf'
    },
    {
      id: '7',
      name: 'Video Onboarding.mp4',
      type: 'file',
      size: 52428800, // 50MB
      modified_at: '2024-01-11T15:20:00Z',
      created_by: 'Juan Pérez',
      access_level: 'company',
      mime_type: 'video/mp4'
    }
  ]

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return Folder
    
    if (!file.mime_type) return File
    
    if (file.mime_type.startsWith('image/')) return Image
    if (file.mime_type.startsWith('video/')) return Video
    if (file.mime_type.startsWith('audio/')) return Music
    if (file.mime_type === 'application/pdf') return FileText
    if (file.mime_type.includes('archive') || file.mime_type.includes('zip')) return Archive
    
    return File
  }

  const getAccessIcon = (access: string) => {
    switch (access) {
      case 'public': return Globe
      case 'company': return Users
      case 'app': return Lock
      case 'private': return Lock
      default: return Users
    }
  }

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'public': return 'bg-green-100 text-green-800'
      case 'company': return 'bg-blue-100 text-blue-800'
      case 'app': return 'bg-purple-100 text-purple-800'
      case 'private': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const isStarred = starredFiles.includes(file.id)
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'folders' && file.type === 'folder') ||
      (selectedFilter === 'files' && file.type === 'file') ||
      (selectedFilter === 'starred' && isStarred) ||
      (selectedFilter === 'shared' && file.shared_with && file.shared_with.length > 0) ||
      (selectedFilter === 'apps' && file.app_source)
    
    return matchesSearch && matchesFilter
  })

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const toggleStar = (fileId: string) => {
    setStarredFiles(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleCreateFolder = () => {
    const folderName = prompt('Enter folder name:')
    if (folderName) {
      console.log('Creating folder:', folderName)
      // TODO: Implement folder creation
    }
  }

  const handleUploadFiles = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        console.log('Uploading files:', Array.from(files).map(f => f.name))
        // TODO: Implement file upload
      }
    }
    input.click()
  }

  const handleFileAction = (action: string, fileId: string) => {
    console.log(`${action} file:`, fileId)
    
    switch (action) {
      case 'star':
        toggleStar(fileId)
        break
      case 'preview':
        console.log('Opening preview for:', fileId)
        break
      case 'download':
        console.log('Downloading:', fileId)
        break
      case 'share':
        console.log('Opening share dialog for:', fileId)
        break
      case 'rename':
        const newName = prompt('Enter new name:')
        if (newName) console.log('Renaming to:', newName)
        break
      case 'delete':
        if (confirm('Are you sure you want to delete this file?')) {
          console.log('Deleting:', fileId)
        }
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  const storageStats = {
    used: currentTenant?.storage_used || 0,
    total: currentTenant?.storage_limit || 5368709120,
    percentage: ((currentTenant?.storage_used || 0) / (currentTenant?.storage_limit || 5368709120)) * 100
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
          <p className="text-gray-600">Shared storage across all your apps</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCreateFolder}>
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button size="sm" onClick={handleUploadFiles}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Storage Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Storage Usage</span>
            <span className="text-sm text-gray-600">
              {formatFileSize(storageStats.used)} / {formatFileSize(storageStats.total)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${storageStats.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{storageStats.percentage.toFixed(1)}% used</span>
            <span>{formatFileSize(storageStats.total - storageStats.used)} available</span>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Filter */}
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="folders">Folders</SelectItem>
              <SelectItem value="files">Files</SelectItem>
              <SelectItem value="starred">Starred</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
              <SelectItem value="apps">From Apps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {currentPath.map((path, index) => (
          <React.Fragment key={index}>
            <button
              className="hover:text-gray-900"
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
            >
              {path}
            </button>
            {index < currentPath.length - 1 && <span>/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file)
            const AccessIcon = getAccessIcon(file.access_level)
            
            return (
              <Card 
                key={file.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleFileSelect(file.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <FileIcon className="w-8 h-8 text-blue-600" />
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStar(file.id)
                        }}
                        className="p-1"
                      >
                        <Star className={`w-4 h-4 ${starredFiles.includes(file.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleFileAction('preview', file.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileAction('download', file.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileAction('share', file.id)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleFileAction('rename', file.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileAction('copy', file.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileAction('move', file.id)}>
                            <Move className="w-4 h-4 mr-2" />
                            Move
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleFileAction('delete', file.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium truncate" title={file.name}>
                      {file.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{file.type === 'file' && file.size ? formatFileSize(file.size) : 'Folder'}</span>
                      <span>{new Date(file.modified_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getAccessColor(file.access_level)}>
                        <AccessIcon className="w-3 h-3 mr-1" />
                        {file.access_level}
                      </Badge>
                      
                      {file.app_source && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          {file.app_source}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      by {file.created_by}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file)
                const AccessIcon = getAccessIcon(file.access_level)
                
                return (
                  <div 
                    key={file.id}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleFileSelect(file.id)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <FileIcon className="w-5 h-5 text-blue-600" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStar(file.id)
                        }}
                        className="p-1"
                      >
                        <Star className={`w-4 h-4 ${starredFiles.includes(file.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                      </Button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          by {file.created_by} • {new Date(file.modified_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className={getAccessColor(file.access_level)}>
                        <AccessIcon className="w-3 h-3 mr-1" />
                        {file.access_level}
                      </Badge>
                      
                      {file.app_source && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          {file.app_source}
                        </Badge>
                      )}
                      
                      <div className="text-sm text-gray-500 w-16 text-right">
                        {file.type === 'file' && file.size ? formatFileSize(file.size) : 'Folder'}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleFileAction('preview', file.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileAction('download', file.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileAction('share', file.id)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleFileAction('rename', file.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileAction('copy', file.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileAction('move', file.id)}>
                            <Move className="w-4 h-4 mr-2" />
                            Move
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleFileAction('delete', file.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by uploading some files to your shared storage'
              }
            </p>
            {!searchQuery && selectedFilter === 'all' && (
              <Button onClick={handleUploadFiles}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Folder, 
  Upload, 
  Download, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  FolderPlus
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'markdown' | 'json' | 'pdf' | 'text'
  path: string
  size: number
  createdAt: number
  updatedAt: number
  category: 'web-dev' | 'prompts' | 'books' | 'notes' | 'scripts'
  tags: string[]
}

interface DocumentFolder {
  id: string
  name: string
  documents: Document[]
  subfolders: DocumentFolder[]
}

export const DocumentManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Mock documents - replace with actual document management
  const documents: Document[] = [
    {
      id: '1',
      name: 'React Architecture Guide.md',
      type: 'markdown',
      path: '/docs/web-dev/react-architecture.md',
      size: 15420,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000,
      category: 'web-dev',
      tags: ['react', 'architecture', 'patterns']
    },
    {
      id: '2',
      name: 'AI Prompts Collection.json',
      type: 'json',
      path: '/docs/prompts/ai-prompts.json',
      size: 8910,
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 7200000,
      category: 'prompts',
      tags: ['ai', 'prompts', 'templates']
    }
  ]

  const categories = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'web-dev', name: 'Web Development', count: documents.filter(d => d.category === 'web-dev').length },
    { id: 'prompts', name: 'Prompts', count: documents.filter(d => d.category === 'prompts').length },
    { id: 'books', name: 'Books', count: documents.filter(d => d.category === 'books').length },
    { id: 'notes', name: 'Notes', count: documents.filter(d => d.category === 'notes').length },
    { id: 'scripts', name: 'Scripts', count: documents.filter(d => d.category === 'scripts').length }
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'markdown': return '📝'
      case 'json': return '📋'
      case 'pdf': return '📄'
      case 'text': return '📄'
      default: return '📄'
    }
  }

  const handleFileUpload = async () => {
    if (window.electronAPI) {
      const filePaths = await window.electronAPI.file.openDialog()
      if (filePaths) {
        console.log('Selected files:', filePaths)
        // Handle file upload
      }
    }
  }

  const handleExportDocument = async (document: Document) => {
    if (window.electronAPI) {
      const savePath = await window.electronAPI.file.saveDialog()
      if (savePath) {
        // Handle export
        console.log('Export to:', savePath)
      }
    }
  }

  return (
    <div className="document-manager">
      <div className="manager-header">
        <div className="header-title">
          <FileText className="title-icon" />
          <h2>Document Management</h2>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleFileUpload}
          >
            <Upload size={16} />
            Import
          </button>
          <button className="btn btn-secondary">
            <FolderPlus size={16} />
            New Folder
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            New Document
          </button>
        </div>
      </div>

      <div className="document-filters">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search documents and tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
          
          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="document-sidebar">
        <div className="folder-tree">
          <h3>
            <Folder size={16} />
            Document Hierarchy
          </h3>
          
          <div className="tree-structure">
            {categories.filter(c => c.id !== 'all').map(category => (
              <div key={category.id} className="tree-node">
                <button
                  className={`tree-item ${selectedCategory === category.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Folder size={14} />
                  {category.name}
                  <span className="item-count">{category.count}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="document-content">
        {filteredDocuments.length === 0 ? (
          <div className="empty-state">
            <FileText size={64} className="empty-icon" />
            <h3>No Documents Found</h3>
            <p>
              {searchTerm ? 
                `No documents match your search "${searchTerm}"` :
                'Import or create documents to get started'
              }
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={handleFileUpload}
              >
                <Upload size={16} />
                Import Documents
              </button>
            )}
          </div>
        ) : (
          <div className={`document-grid ${viewMode}`}>
            {filteredDocuments.map((document) => (
              <motion.div
                key={document.id}
                className="document-card"
                whileHover={{ y: -4, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="document-header">
                  <div className="document-icon">
                    {getFileIcon(document.type)}
                  </div>
                  <div className="document-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setSelectedDocument(document)}
                      title="View Document"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="btn btn-ghost"
                      title="Edit Document"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => handleExportDocument(document)}
                      title="Export Document"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      className="btn btn-ghost delete"
                      title="Delete Document"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="document-info">
                  <h4 className="document-name">{document.name}</h4>
                  <p className="document-path">{document.path}</p>
                  
                  <div className="document-meta">
                    <span className="file-size">{formatFileSize(document.size)}</span>
                    <span className="file-type">{document.type.toUpperCase()}</span>
                  </div>

                  <div className="document-tags">
                    {document.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="document-dates">
                    <div className="date-info">
                      <span>Modified: {new Date(document.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="modal-overlay" onClick={() => setSelectedDocument(null)}>
          <motion.div
            className="document-preview-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="modal-header">
              <h3>
                <FileText size={20} />
                {selectedDocument.name}
              </h3>
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedDocument(null)}
              >
                ×
              </button>
            </div>

            <div className="document-preview-content">
              <div className="preview-placeholder">
                <FileText size={48} />
                <p>Document preview will be implemented here</p>
                <p className="preview-path">{selectedDocument.path}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => handleExportDocument(selectedDocument)}
              >
                <Download size={16} />
                Export
              </button>
              <button className="btn btn-primary">
                <Edit size={16} />
                Edit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

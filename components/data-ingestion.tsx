'use client'

import { useState, useEffect } from 'react'
import { Search, Play, Clock, CheckCircle, XCircle, AlertCircle, Plus, Settings, Database, Globe } from 'lucide-react'

interface IngestionSource {
  id: string
  name: string
  url: string
  type: 'abs' | 'government' | 'research' | 'news' | 'custom'
  category: string
  description: string
  selectors: DataSelectors
  schedule?: 'daily' | 'weekly' | 'monthly' | 'manual'
  lastIngested?: string
  status: 'active' | 'inactive' | 'error'
}

interface DataSelectors {
  title: string
  content: string
  date?: string
  author?: string
  category?: string
  tags?: string
  links?: string
  images?: string
  metadata?: Record<string, string>
}

interface IngestionJob {
  id: string
  sourceIds: string[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt?: string
  completedAt?: string
  results: IngestionResult[]
  errors: string[]
}

interface IngestionResult {
  sourceId: string
  sourceName: string
  url: string
  timestamp: string
  success: boolean
  dataCount: number
  errors: string[]
  data: IngestedDataItem[]
}

interface IngestedDataItem {
  title: string
  content: string
  url: string
  source: string
  category: string
  date?: string
  author?: string
  tags?: string[]
  metadata?: Record<string, any>
  dataAsset?: any
}

export default function DataIngestion() {
  const [sources, setSources] = useState<IngestionSource[]>([])
  const [jobs, setJobs] = useState<IngestionJob[]>([])
  const [ingestedData, setIngestedData] = useState<IngestedDataItem[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'sources' | 'jobs' | 'data' | 'custom'>('sources')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customSource, setCustomSource] = useState<Partial<IngestionSource>>({})

  useEffect(() => {
    fetchSources()
    fetchJobs()
    fetchIngestedData()
  }, [])

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/data-ingestion?action=sources')
      const data = await response.json()
      setSources(data.sources)
    } catch (error) {
      console.error('Error fetching sources:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/data-ingestion?action=jobs')
      const data = await response.json()
      setJobs(data.jobs)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchIngestedData = async () => {
    try {
      const response = await fetch('/api/data-ingestion?action=data')
      const data = await response.json()
      setIngestedData(data.data)
    } catch (error) {
      console.error('Error fetching ingested data:', error)
    }
  }

  const handleIngestion = async () => {
    if (selectedSources.length === 0) {
      alert('Please select at least one source')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/data-ingestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ingest',
          sourceIds: selectedSources
        })
      })

      const result = await response.json()
      
      if (result.status === 'completed') {
        alert(`Ingestion completed! Processed ${result.totalDataCount} items`)
        fetchJobs()
        fetchIngestedData()
      } else {
        alert('Ingestion failed: ' + result.errors?.join(', '))
      }
    } catch (error) {
      console.error('Error during ingestion:', error)
      alert('Error during ingestion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomIngestion = async () => {
    if (!customSource.id || !customSource.name || !customSource.url) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/data-ingestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ingest-custom',
          customSource: {
            ...customSource,
            type: customSource.type || 'custom',
            category: customSource.category || 'custom',
            selectors: customSource.selectors || {
              title: 'h1, h2, h3',
              content: 'p, .content, .description'
            },
            status: 'active'
          }
        })
      })

      const result = await response.json()
      
      if (result.status === 'completed') {
        alert(`Custom ingestion completed! Processed ${result.dataCount} items`)
        setShowCustomForm(false)
        setCustomSource({})
        fetchJobs()
        fetchIngestedData()
      } else {
        alert('Custom ingestion failed: ' + result.errors?.join(', '))
      }
    } catch (error) {
      console.error('Error during custom ingestion:', error)
      alert('Error during custom ingestion')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'running':
        return <Play className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'abs':
        return <Database className="w-4 h-4 text-blue-500" />
      case 'government':
        return <Globe className="w-4 h-4 text-green-500" />
      case 'research':
        return <Search className="w-4 h-4 text-purple-500" />
      case 'news':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      default:
        return <Settings className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Ingestion Pipeline</h1>
        <p className="text-gray-600">
          Gather and ingest data from various websites and data sources
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'sources', label: 'Data Sources', icon: Database },
            { id: 'jobs', label: 'Ingestion Jobs', icon: Clock },
            { id: 'data', label: 'Ingested Data', icon: Search },
            { id: 'custom', label: 'Custom Source', icon: Plus }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Available Data Sources</h2>
            <button
              onClick={handleIngestion}
              disabled={isLoading || selectedSources.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>Start Ingestion</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((source) => (
              <div
                key={source.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedSources.includes(source.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedSources(prev =>
                    prev.includes(source.id)
                      ? prev.filter(id => id !== source.id)
                      : [...prev, source.id]
                  )
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(source.type)}
                    <h3 className="font-medium text-gray-900">{source.name}</h3>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    source.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{source.type}</span>
                  <span className="capitalize">{source.schedule || 'manual'}</span>
                </div>
                
                {source.lastIngested && (
                  <div className="text-xs text-gray-400 mt-2">
                    Last ingested: {new Date(source.lastIngested).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ingestion Jobs</h2>
          
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No ingestion jobs found
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      <span className="font-medium">Job {job.id.slice(-8)}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Started:</span>
                      <br />
                      {job.startedAt ? new Date(job.startedAt).toLocaleString() : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Completed:</span>
                      <br />
                      {job.completedAt ? new Date(job.completedAt).toLocaleString() : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Sources:</span>
                      <br />
                      {job.sourceIds.length}
                    </div>
                    <div>
                      <span className="font-medium">Total Items:</span>
                      <br />
                      {job.results.reduce((sum, r) => sum + r.dataCount, 0)}
                    </div>
                  </div>
                  
                  {job.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {job.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ingested Data</h2>
          
          <div className="space-y-4">
            {ingestedData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No ingested data found. Start an ingestion job to see data here.
              </div>
            ) : (
              ingestedData.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <span className="text-xs text-gray-500">{item.source}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{item.category}</span>
                      {item.author && <span>by {item.author}</span>}
                      {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
                    </div>
                    
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Source
                    </a>
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Custom Source Tab */}
      {activeTab === 'custom' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Custom Data Source</h2>
          
          <div className="max-w-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source ID *
                </label>
                <input
                  type="text"
                  value={customSource.id || ''}
                  onChange={(e) => setCustomSource(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., my-custom-source"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Name *
                </label>
                <input
                  type="text"
                  value={customSource.name || ''}
                  onChange={(e) => setCustomSource(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., My Custom Data Source"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  value={customSource.url || ''}
                  onChange={(e) => setCustomSource(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={customSource.category || ''}
                  onChange={(e) => setCustomSource(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., custom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={customSource.description || ''}
                  onChange={(e) => setCustomSource(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Description of the data source..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleCustomIngestion}
                  disabled={isLoading || !customSource.id || !customSource.name || !customSource.url}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Start Custom Ingestion'}
                </button>
                
                <button
                  onClick={() => {
                    setCustomSource({})
                    setShowCustomForm(false)
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

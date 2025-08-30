'use client'

import { SearchResult, PaginationInfo } from '@/types/search'
import { ExternalLink, Calendar, User, Clock, Database, Download, Info, Link, Tag, Shield, FileText, TrendingUp, FileText as ArticleIcon, X } from 'lucide-react'
import { useState, useRef } from 'react'
import Pagination from './pagination'

interface SearchResultsProps {
  results: SearchResult[]
  pagination?: PaginationInfo
  isLoading: boolean
  onPageChange?: (page: number) => void
}

export default function SearchResults({ results, pagination, isLoading, onPageChange }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Searching across websites...</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="mt-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-500">
          Try different keywords or check your search terms
        </p>
      </div>
    )
  }

  return (
    <div className="mt-12">
              <div className="mb-6">
          <p className="text-gray-600">
            Found {pagination?.totalResults || results.length} article{(pagination?.totalResults || results.length) !== 1 ? 's' : ''} from trusted sources
            {pagination && pagination.totalPages > 1 && (
              <span className="text-gray-500">
                {' '}(Page {pagination.currentPage} of {pagination.totalPages})
              </span>
            )}
          </p>
        </div>

        <div className="space-y-8">
          {results.map((result, index) => (
            <SearchResultCard key={index} result={result} />
          ))}
        </div>

        {/* Pagination */}
        {pagination && onPageChange && (
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        )}
    </div>
  )
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDataAsset, setShowDataAsset] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const getImageUrl = () => {
    if (result.pagemap?.metatags?.[0]?.['og:image']) {
      return result.pagemap.metatags[0]['og:image']
    }
    if (result.pagemap?.cse_image?.[0]?.src) {
      return result.pagemap.cse_image[0].src
    }
    return null
  }

  const getPublishedDate = () => {
    return result.pagemap?.metatags?.[0]?.['article:published_time']
  }

  const getAuthor = () => {
    return result.pagemap?.metatags?.[0]?.['article:author']
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return null
    }
  }

  const getArticleType = () => {
    // Simple classification based on URL and title
    const url = result.link.toLowerCase()
    const title = result.title.toLowerCase()
    
    if (url.includes('/article/') || url.includes('/post/') || url.includes('/blog/')) {
      return 'Article'
    }
    if (url.includes('/tutorial/') || title.includes('tutorial')) {
      return 'Tutorial'
    }
    if (url.includes('/guide/') || title.includes('guide')) {
      return 'Guide'
    }
    if (url.includes('/documentation/') || url.includes('/docs/')) {
      return 'Documentation'
    }
    if (url.includes('/dataset/') || url.includes('/data/') || title.includes('dataset')) {
      return 'Dataset'
    }
    if (url.includes('/research/') || url.includes('/study/') || title.includes('research')) {
      return 'Research'
    }
    if (url.includes('/report/') || title.includes('report')) {
      return 'Report'
    }
    
    return 'Article'
  }

  const getArticlePath = () => {
    try {
      const url = new URL(result.link)
      const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0)
      return pathSegments.slice(0, -1).join(' / ') // Show path without the last segment
    } catch {
      return null
    }
  }

  const handleAnalyzeContent = async () => {
    // Cancel any ongoing analysis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: result.link,
          title: result.title,
          content: result.snippet
        }),
        signal: abortControllerRef.current.signal,
      })

      if (response.ok) {
        const analysis = await response.json()
        // Update the result with analysis data
        result.dataAsset = {
          ...result.dataAsset,
          contentAnalysis: analysis
        }
        setShowDataAsset(true)
      }
    } catch (error) {
      // Don't show error if request was cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Content analysis was cancelled')
        return
      }
      console.error('Content analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
      abortControllerRef.current = null
    }
  }

  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsAnalyzing(false)
      abortControllerRef.current = null
    }
  }

  const imageUrl = getImageUrl()
  const publishedDate = getPublishedDate()
  const author = getAuthor()
  const formattedDate = publishedDate ? formatDate(publishedDate) : null
  const hasDataAsset = result.dataAsset && Object.keys(result.dataAsset).length > 0
  const articleType = getArticleType()
  const articlePath = getArticlePath()

  return (
    <div className="result-card">
      <div className="flex gap-4">
        {imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt=""
              className="w-24 h-24 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Article Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              articleType === 'Article' ? 'bg-blue-100 text-blue-800' :
              articleType === 'Tutorial' ? 'bg-green-100 text-green-800' :
              articleType === 'Guide' ? 'bg-purple-100 text-purple-800' :
              articleType === 'Documentation' ? 'bg-orange-100 text-orange-800' :
              articleType === 'Dataset' ? 'bg-red-100 text-red-800' :
              articleType === 'Research' ? 'bg-indigo-100 text-indigo-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <ArticleIcon className="w-3 h-3 inline mr-1" />
              {articleType}
            </span>
            {articlePath && (
              <span className="text-xs text-gray-500">
                {articlePath}
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors duration-200">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {result.title}
              </a>
            </h3>
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
          </div>

          <p className="text-sm text-green-600 mb-2">
            {getDomain(result.displayLink)}
          </p>

          <p className="text-gray-600 mb-3 line-clamp-2">
            {result.snippet}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {formattedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            )}

            {author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{articleType}</span>
            </div>
          </div>

          {/* Data Asset Analysis Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data Asset Information
              </h4>
              <div className="flex gap-2">
                {!hasDataAsset && (
                  <div className="flex gap-2">
                    {isAnalyzing ? (
                      <button
                        onClick={handleCancelAnalysis}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
                        title="Cancel analysis"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={handleAnalyzeContent}
                        disabled={isAnalyzing}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Analyze Content
                      </button>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setShowDataAsset(!showDataAsset)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  {showDataAsset ? 'Hide' : 'Show'} Details
                </button>
              </div>
            </div>

            {isAnalyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Analyzing content...</span>
                </div>
              </div>
            )}

            {showDataAsset && result.dataAsset && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                {/* Description and Purpose */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Description & Purpose
                    </h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      {result.dataAsset.description && (
                        <p><strong>Description:</strong> {result.dataAsset.description}</p>
                      )}
                      {result.dataAsset.purpose && (
                        <p><strong>Purpose:</strong> {result.dataAsset.purpose}</p>
                      )}
                      {result.dataAsset.collectionDate && (
                        <p><strong>Collection Date:</strong> {formatDate(result.dataAsset.collectionDate)}</p>
                      )}
                      {result.dataAsset.department && (
                        <p><strong>Department:</strong> {result.dataAsset.department}</p>
                      )}
                    </div>
                  </div>

                  {/* Availability and Custodian */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Availability & Access
                    </h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      {result.dataAsset.availability?.status && (
                        <p>
                          <strong>Status:</strong>
                          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                            result.dataAsset.availability.status === 'public'
                              ? 'bg-green-100 text-green-800'
                              : result.dataAsset.availability.status === 'restricted'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.dataAsset.availability.status}
                          </span>
                        </p>
                      )}
                      {result.dataAsset.availability?.custodian && (
                        <p><strong>Custodian:</strong> {result.dataAsset.availability.custodian}</p>
                      )}
                      {result.dataAsset.availability?.contactEmail && (
                        <p><strong>Contact:</strong> {result.dataAsset.availability.contactEmail}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                {result.dataAsset.metadata && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Metadata
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      {result.dataAsset.metadata.format && (
                        <div><strong>Format:</strong> {result.dataAsset.metadata.format}</div>
                      )}
                      {result.dataAsset.metadata.size && (
                        <div><strong>Size:</strong> {result.dataAsset.metadata.size}</div>
                      )}
                      {result.dataAsset.metadata.records && (
                        <div><strong>Records:</strong> {result.dataAsset.metadata.records.toLocaleString()}</div>
                      )}
                      {result.dataAsset.metadata.lastUpdated && (
                        <div><strong>Updated:</strong> {formatDate(result.dataAsset.metadata.lastUpdated)}</div>
                      )}
                      {result.dataAsset.metadata.version && (
                        <div><strong>Version:</strong> {result.dataAsset.metadata.version}</div>
                      )}
                      {result.dataAsset.metadata.license && (
                        <div><strong>License:</strong> {result.dataAsset.metadata.license}</div>
                      )}
                    </div>
                    {result.dataAsset.metadata.tags && result.dataAsset.metadata.tags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {result.dataAsset.metadata.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Relationships */}
                {result.dataAsset.relationships && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      Dataset Relationships
                    </h5>
                    <div className="text-sm text-gray-600 space-y-2">
                      {result.dataAsset.relationships.parentDataset && (
                        <p><strong>Parent Dataset:</strong> {result.dataAsset.relationships.parentDataset}</p>
                      )}
                      {result.dataAsset.relationships.childDatasets && result.dataAsset.relationships.childDatasets.length > 0 && (
                        <p><strong>Child Datasets:</strong> {result.dataAsset.relationships.childDatasets.join(', ')}</p>
                      )}
                      {result.dataAsset.relationships.relatedSeries && result.dataAsset.relationships.relatedSeries.length > 0 && (
                        <p><strong>Related Series:</strong> {result.dataAsset.relationships.relatedSeries.join(', ')}</p>
                      )}
                      {result.dataAsset.relationships.derivedFrom && result.dataAsset.relationships.derivedFrom.length > 0 && (
                        <p><strong>Derived From:</strong> {result.dataAsset.relationships.derivedFrom.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Analysis */}
                {result.dataAsset.contentAnalysis && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Content Analysis
                    </h5>
                    <div className="text-sm text-gray-600 space-y-2">
                      {result.dataAsset.contentAnalysis.summary && (
                        <p><strong>Summary:</strong> {result.dataAsset.contentAnalysis.summary}</p>
                      )}
                      {result.dataAsset.contentAnalysis.keyTopics && result.dataAsset.contentAnalysis.keyTopics.length > 0 && (
                        <div>
                          <strong>Key Topics:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.dataAsset.contentAnalysis.keyTopics.map((topic, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.dataAsset.contentAnalysis.dataTypes && result.dataAsset.contentAnalysis.dataTypes.length > 0 && (
                        <p><strong>Data Types:</strong> {result.dataAsset.contentAnalysis.dataTypes.join(', ')}</p>
                      )}
                      {result.dataAsset.contentAnalysis.qualityScore && (
                        <p><strong>Quality Score:</strong> {result.dataAsset.contentAnalysis.qualityScore}/10</p>
                      )}
                      {result.dataAsset.contentAnalysis.updateFrequency && (
                        <p><strong>Update Frequency:</strong> {result.dataAsset.contentAnalysis.updateFrequency}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

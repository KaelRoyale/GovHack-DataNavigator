'use client'

import { SearchResult, PaginationInfo } from '@/types/search'
import { ExternalLink, Calendar, User, Clock, Database, Download, Info, Link, Tag, Shield, FileText, TrendingUp, FileText as ArticleIcon, X, Brain, Sparkles } from 'lucide-react'
import { useState, useRef } from 'react'
import Pagination from '@/components/pagination'

interface SearchResultsProps {
  results: SearchResult[]
  pagination?: PaginationInfo
  isLoading: boolean
  onPageChange?: (page: number) => void
}

export default function SearchResults({ results, pagination, isLoading, onPageChange }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Searching across websites...</p>
        </div>
      </div>
    )
  }

  if (results.length === 0 && !isLoading) {
    return (
      <div className="mt-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search query or check the list of supported websites.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
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
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [dataAsset, setDataAsset] = useState(result.dataAsset)
  const abortControllerRef = useRef<AbortController | null>(null)

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const getImageUrl = () => {
    return result.pagemap?.cse_image?.[0]?.src || 
           result.pagemap?.metatags?.[0]?.['og:image'] ||
           undefined
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
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return null
    }
  }

  // Restored getArticleType and getArticlePath
  const getArticleType = () => {
    const url = result.link.toLowerCase()
    const title = result.title.toLowerCase()
    if (url.includes('/article/') || url.includes('/post/') || url.includes('/blog/')) { return 'Article' }
    if (url.includes('/tutorial/') || title.includes('tutorial')) { return 'Tutorial' }
    if (url.includes('/guide/') || title.includes('guide')) { return 'Guide' }
    if (url.includes('/documentation/') || url.includes('/docs/')) { return 'Documentation' }
    if (url.includes('/dataset/') || url.includes('/data/') || title.includes('dataset')) { return 'Dataset' }
    if (url.includes('/research/') || url.includes('/study/') || title.includes('research')) { return 'Research' }
    if (url.includes('/report/') || title.includes('report')) { return 'Report' }
    return 'Article'
  }

  const getArticlePath = () => {
    try {
      const url = new URL(result.link)
      const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0)
      return pathSegments.slice(0, -1).join(' / ')
    } catch {
      return null
    }
  }

  const handleAnalyzeContent = async () => {
    // Restored abort controller logic
    if (abortControllerRef.current) { abortControllerRef.current.abort() }
    abortControllerRef.current = new AbortController()
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/fetch-dataset-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: result.link,
          title: result.title
        }),
        signal: abortControllerRef.current.signal, // Restored signal
      })

      if (response.ok) {
        const data = await response.json()
        // Update the local state with data asset information
        setDataAsset(data.dataAsset)
      } else {
        console.error('Dataset info fetch failed')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') { console.log('Dataset info fetch was cancelled'); return } // Restored
      console.error('Dataset info fetch failed:', error)
    } finally {
      setIsAnalyzing(false)
      abortControllerRef.current = null // Restored
    }
  }

  const handleCancelAnalysis = () => { // Restored
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsAnalyzing(false)
      abortControllerRef.current = null
    }
  }

  const handleAIAnalysis = async () => {
    if (aiAnalysis) {
      setShowAIAnalysis(!showAIAnalysis)
      return
    }

    setIsAnalyzingAI(true)
    try {
      const response = await fetch('/api/analyze-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          content: result.snippet + ' ' + (result.htmlSnippet || ''),
          url: result.link,
          provider: 'openai' // Can be made configurable
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(data)
        setShowAIAnalysis(true)
      } else {
        console.error('AI analysis failed')
      }
    } catch (error) {
      console.error('AI analysis error:', error)
    } finally {
      setIsAnalyzingAI(false)
    }
  }

  const publishedDate = getPublishedDate()
  const author = getAuthor()
  const formattedDate = publishedDate ? formatDate(publishedDate) : null
  const hasDataAsset = dataAsset && Object.keys(dataAsset).length > 0
  const articleType = getArticleType() // Restored
  const articlePath = getArticlePath() // Restored

  return (
    <div className="result-card flex items-start gap-4">
      {/* Image */}
      {getImageUrl() && (
        <div className="flex-shrink-0">
          <img
            src={getImageUrl()}
            alt={result.title}
            className="w-20 h-20 object-cover rounded-lg"
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
            <span>{articleType}</span> {/* Updated from "Article" */}
          </div>
        </div>

        {/* Data Asset Analysis Section */}
        <div className="mt-4">
          <div className="flex gap-2 flex-wrap">
            {!hasDataAsset && (
              <div className="flex gap-2">
                {isAnalyzing ? (
                  <button
                    onClick={handleCancelAnalysis} // Restored
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
                       Fetch Dataset Info
                     </button>
                )}
              </div>
            )}
            <button
              onClick={() => setShowDataAsset(!showDataAsset)}
              className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              {showDataAsset ? 'Hide' : 'Show'} Data Asset Info
            </button>
            
            {/* AI Analysis Button */}
            <button
              onClick={handleAIAnalysis}
              disabled={isAnalyzingAI}
              className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
            >
              {isAnalyzingAI ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-3 h-3" />
                  {aiAnalysis ? 'Show' : 'Analyze with AI'}
                </>
              )}
            </button>
          </div>

          {isAnalyzing && ( // Restored
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <div className="flex items-center gap-2 text-blue-800">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Analyzing content...</span>
              </div>
            </div>
          )}

          {showDataAsset && dataAsset && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Description
                  </h4>
                  <p className="text-gray-700">{dataAsset.description}</p>
                </div>

                {/* Collection Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Collection Info
                  </h4>
                                     <div className="space-y-1 text-gray-700">
                     <p><strong>Date:</strong> {dataAsset.collectionDate ? new Date(dataAsset.collectionDate).toLocaleDateString() : 'Unknown'}</p>
                     <p><strong>Purpose:</strong> {dataAsset.purpose || 'Unknown'}</p>
                     <p><strong>Department:</strong> {dataAsset.department || 'Unknown'}</p>
                   </div>
                </div>

                {/* Metadata */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <Database className="w-4 h-4" />
                    Metadata
                  </h4>
                                     <div className="space-y-1 text-gray-700">
                     <p><strong>Format:</strong> {dataAsset.metadata?.format || 'Unknown'}</p>
                     <p><strong>Size:</strong> {dataAsset.metadata?.size || 'Unknown'}</p>
                     <p><strong>Records:</strong> {dataAsset.metadata?.records || 0}</p>
                     <p><strong>Last Updated:</strong> {dataAsset.metadata?.lastUpdated ? new Date(dataAsset.metadata.lastUpdated).toLocaleDateString() : 'Unknown'}</p>
                     <p><strong>Version:</strong> {dataAsset.metadata?.version || 'Unknown'}</p>
                     <p><strong>License:</strong> {dataAsset.metadata?.license || 'Unknown'}</p>
                   </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Availability
                  </h4>
                                     <div className="space-y-1 text-gray-700">
                     <p><strong>Status:</strong> <span className="text-green-600">{dataAsset.availability?.status || 'Unknown'}</span></p>
                     <p><strong>Custodian:</strong> {dataAsset.availability?.custodian || 'Unknown'}</p>
                     <p><strong>Contact:</strong> {dataAsset.availability?.contactEmail || 'Unknown'}</p>
                     <p><strong>Process:</strong> {dataAsset.availability?.requestProcess || 'Unknown'}</p>
                   </div>
                </div>

                {/* Content Analysis */}
                {dataAsset.contentAnalysis && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Content Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-700 mb-2"><strong>Summary:</strong> {dataAsset.contentAnalysis.summary}</p>
                        <p className="text-gray-700 mb-2"><strong>Quality Score:</strong> {dataAsset.contentAnalysis.qualityScore}/10</p>
                        <p className="text-gray-700"><strong>Update Frequency:</strong> {dataAsset.contentAnalysis.updateFrequency}</p>
                      </div>
                      <div>
                                                 <p className="text-gray-700 mb-2">
                           <strong>Key Topics:</strong>
                           <div className="flex flex-wrap gap-1 mt-1">
                             {dataAsset.contentAnalysis?.keyTopics?.map((topic, index) => (
                               <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                 {topic}
                               </span>
                             )) || <span className="text-gray-500 text-xs">No topics available</span>}
                           </div>
                         </p>
                         <p className="text-gray-700">
                           <strong>Data Types:</strong>
                           <div className="flex flex-wrap gap-1 mt-1">
                             {dataAsset.contentAnalysis?.dataTypes?.map((type, index) => (
                               <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                 {type}
                               </span>
                             )) || <span className="text-gray-500 text-xs">No data types available</span>}
                           </div>
                         </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h4>
                                     <div className="flex flex-wrap gap-2">
                     {dataAsset.metadata?.tags?.map((tag, index) => (
                       <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">
                         {tag}
                       </span>
                     )) || <span className="text-gray-500 text-xs">No tags available</span>}
                   </div>
                                 </div>
               </div>
             </div>
           )}

           {/* AI Analysis Section */}
           {showAIAnalysis && aiAnalysis && (
             <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg text-sm">
               <div className="flex items-center gap-2 mb-3">
                 <Sparkles className="w-4 h-4 text-purple-600" />
                 <h4 className="font-medium text-purple-900">AI Analysis</h4>
                 <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                   {aiAnalysis.provider.toUpperCase()}
                 </span>
                 {aiAnalysis.confidence > 0 && (
                   <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                     {Math.round(aiAnalysis.confidence * 100)}% confidence
                   </span>
                 )}
               </div>

               {/* Summary */}
               <div className="mb-4">
                 <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                 <p className="text-gray-700 leading-relaxed">{aiAnalysis.summary}</p>
               </div>

               {/* Key Points */}
               {aiAnalysis.keyPoints && aiAnalysis.keyPoints.length > 0 && (
                 <div className="mb-4">
                   <h5 className="font-medium text-gray-900 mb-2">Key Points</h5>
                   <ul className="space-y-1">
                     {aiAnalysis.keyPoints.map((point: string, index: number) => (
                       <li key={index} className="text-gray-700 flex items-start gap-2">
                         <span className="text-purple-500 mt-1">•</span>
                         <span>{point}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               {/* Sentiment */}
               {aiAnalysis.sentiment && (
                 <div className="flex items-center gap-2">
                   <h5 className="font-medium text-gray-900">Sentiment:</h5>
                   <span className={`px-2 py-1 text-xs rounded-full ${
                     aiAnalysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                     aiAnalysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                     'bg-gray-100 text-gray-800'
                   }`}>
                     {aiAnalysis.sentiment.charAt(0).toUpperCase() + aiAnalysis.sentiment.slice(1)}
                   </span>
                 </div>
               )}
             </div>
           )}
         </div>
       </div>
     </div>
   )
 }

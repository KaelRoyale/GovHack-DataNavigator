'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import UnifiedSearch from '@/components/unified-search'
import UnifiedResults from '@/components/unified-results'
import { SearchResult, PaginationInfo } from '@/types/search'

export default function HomePage() {
  const [webResults, setWebResults] = useState<SearchResult[]>([])
  const [absResults, setAbsResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [webPagination, setWebPagination] = useState<PaginationInfo | undefined>(undefined)
  const [absPagination, setAbsPagination] = useState<PaginationInfo | undefined>(undefined)
  const [webCurrentPage, setWebCurrentPage] = useState(1)
  const [absCurrentPage, setAbsCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'web' | 'abs'>('web')
  
  // Track search state for pagination
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('')
  const [lastSearchType, setLastSearchType] = useState<'web' | 'abs'>('web')
  const [lastSearchOptions, setLastSearchOptions] = useState<{
    webSearchType?: string
    site?: string
    startDate?: string
    endDate?: string
  }>({})

  // AbortController for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null)

  const cancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  const handleUnifiedSearch = async (query: string, searchType: 'web' | 'abs', searchOptions?: { 
    webSearchType?: string, 
    site?: string,
    startDate?: string,
    endDate?: string 
  }) => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsLoading(true)
    setHasSearched(true)
    setWebCurrentPage(1)
    setAbsCurrentPage(1)
    setLastSearchQuery(query)
    setLastSearchType(searchType)
    setLastSearchOptions(searchOptions || {})

    try {
      if (searchType === 'web') {
        // Perform web search with enhanced options
        const webResponse = await fetch('http://localhost:3002/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query, 
            page: 1,
            searchType: searchOptions?.webSearchType || 'comprehensive',
            site: searchOptions?.site,
            startDate: searchOptions?.startDate,
            endDate: searchOptions?.endDate
          }),
          signal
        })

        if (webResponse.ok) {
          const webData = await webResponse.json()
          setWebResults(webData.items || [])
          setWebPagination(webData.pagination)
          setActiveTab('web')
        } else {
          console.error('Web search failed')
          setWebResults([])
          setWebPagination(undefined)
        }

        // Also try ABS search for related data
        try {
          const absResponse = await fetch('http://localhost:3002/api/abs-search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              query: query, // Pass the query for content discovery
              dataflowId: query, 
              dataKey: 'all',
              startDate: searchOptions?.startDate,
              endDate: searchOptions?.endDate,
              page: 1 
            }),
            signal
          })

          if (absResponse.ok) {
            const absData = await absResponse.json()
            setAbsResults(absData.items || [])
            setAbsPagination(absData.pagination)
          } else {
            setAbsResults([])
            setAbsPagination(undefined)
          }
        } catch (absError: any) {
          if (absError.name === 'AbortError') {
            console.log('ABS search was cancelled')
            return
          }
          console.error('ABS search error:', absError)
          setAbsResults([])
          setAbsPagination(undefined)
        }
      } else {
        // Perform ABS search
        const absResponse = await fetch('http://localhost:3002/api/abs-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query: query, // Pass the query for content discovery
            dataflowId: query, 
            dataKey: 'all',
            startDate: searchOptions?.startDate,
            endDate: searchOptions?.endDate,
            page: 1 
          }),
          signal
        })

        if (absResponse.ok) {
          const absData = await absResponse.json()
          setAbsResults(absData.items || [])
          setAbsPagination(absData.pagination)
          setActiveTab('abs')
        } else {
          console.error('ABS search failed')
          setAbsResults([])
          setAbsPagination(undefined)
        }

        // Also try web search for related content
        try {
          const webResponse = await fetch('http://localhost:3002/api/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              query, 
              page: 1,
              searchType: 'comprehensive',
              startDate: searchOptions?.startDate,
              endDate: searchOptions?.endDate
            }),
            signal
          })

          if (webResponse.ok) {
            const webData = await webResponse.json()
            setWebResults(webData.items || [])
            setWebPagination(webData.pagination)
          } else {
            setWebResults([])
            setWebPagination(undefined)
          }
        } catch (webError: any) {
          if (webError.name === 'AbortError') {
            console.log('Web search was cancelled')
            return
          }
          console.error('Web search error:', webError)
          setWebResults([])
          setWebPagination(undefined)
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Search was cancelled')
        return
      }
      console.error('Search error:', error)
      setWebResults([])
      setAbsResults([])
      setWebPagination(undefined)
      setAbsPagination(undefined)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleWebPageChange = async (page: number) => {
    if (!lastSearchQuery) {
      console.error('No previous search to paginate')
      return
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setWebCurrentPage(page)
    setIsLoading(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: lastSearchQuery, 
          page,
          searchType: lastSearchOptions.webSearchType || 'comprehensive',
          site: lastSearchOptions.site,
          startDate: lastSearchOptions.startDate,
          endDate: lastSearchOptions.endDate
        }),
        signal
      })

      if (response.ok) {
        const data = await response.json()
        setWebResults(data.items || [])
        setWebPagination(data.pagination)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Web page change was cancelled')
        return
      }
      console.error('Web page change error:', error)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleABSPageChange = async (page: number) => {
    if (!lastSearchQuery) {
      console.error('No previous search to paginate')
      return
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setAbsCurrentPage(page)
    setIsLoading(true)

    try {
      const response = await fetch('/api/abs-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: lastSearchQuery, // Pass the query for content discovery
          dataflowId: lastSearchQuery, 
          dataKey: 'all',
          startDate: lastSearchOptions.startDate,
          endDate: lastSearchOptions.endDate,
          page 
        }),
        signal
      })

      if (response.ok) {
        const data = await response.json()
        setAbsResults(data.items || [])
        setAbsPagination(data.pagination)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('ABS page change was cancelled')
        return
      }
      console.error('ABS page change error:', error)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="DataLandscape Logo"
              width={450}
              height={160}
              priority
              className="h-auto"
            />
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Unified search across the web and official ABS statistics
          </p>
          <div className="flex justify-center">
            <a 
              href="https://github.com/KaelRoyale/GovHack-DataNavigator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>View Source</span>
            </a>
          </div>
        </div>

        {/* Unified Search Interface */}
        <UnifiedSearch 
          onSearch={handleUnifiedSearch} 
          onCancel={cancelSearch}
          isLoading={isLoading} 
        />

        {/* Results */}
        {hasSearched && (
          <UnifiedResults 
            webResults={webResults}
            absResults={absResults}
            webPagination={webPagination}
            absPagination={absPagination}
            isLoading={isLoading}
            onWebPageChange={handleWebPageChange}
            onABSPageChange={handleABSPageChange}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="mt-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start your unified search
              </h3>
              <p className="text-gray-500">
                Search across the web for articles and documentation, or access official ABS statistics
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

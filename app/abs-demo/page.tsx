'use client'

import { useState } from 'react'
import EnhancedABSSearch from '@/components/enhanced-abs-search'
import { SearchResult } from '@/types/search'

export default function ABSDemoPage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchMetadata, setSearchMetadata] = useState<any>(null)

  const handleSearch = async (query: string, dataKey?: string, startPeriod?: string, endPeriod?: string) => {
    setIsLoading(true)
    setResults([])
    setSearchMetadata(null)

    try {
      const response = await fetch('/api/abs-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          dataKey,
          startPeriod,
          endPeriod,
          page: 1
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.items || [])
        setSearchMetadata(data.searchMetadata)
      } else {
        console.error('ABS search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ABS Data Explorer Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore Australian Bureau of Statistics data with enhanced category-based search, 
            geographic filtering, and advanced data discovery capabilities.
          </p>
        </div>

        {/* Enhanced ABS Search Component */}
        <EnhancedABSSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Search Metadata */}
        {searchMetadata && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Category:</span>
                <p className="text-gray-900">{searchMetadata.category || 'All Categories'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Geography:</span>
                <p className="text-gray-900">{searchMetadata.geography || 'All Regions'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Search Type:</span>
                <p className="text-gray-900">{searchMetadata.searchType || 'Comprehensive'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Results ({results.length})
            </h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-blue-600 hover:text-blue-800">
                        <a href={result.link} target="_blank" rel="noopener noreferrer">
                          {result.title}
                        </a>
                      </h4>
                      <p className="text-gray-600 mt-2">{result.snippet}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>{result.displayLink}</span>
                        {result.dataAsset && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {result.dataAsset.metadata?.format || 'Data'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Data Asset Information */}
                  {result.dataAsset && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <p className="text-gray-600">{result.dataAsset.description}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Department:</span>
                          <p className="text-gray-600">{result.dataAsset.department}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Purpose:</span>
                          <p className="text-gray-600">{result.dataAsset.purpose}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Quality Score:</span>
                          <p className="text-gray-600">{result.dataAsset.contentAnalysis?.qualityScore}/10</p>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {result.dataAsset.metadata?.tags && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700 text-sm">Tags:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {result.dataAsset.metadata.tags.map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Searching ABS data...</span>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && results.length === 0 && searchMetadata && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse by category to find relevant data.
              </p>
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Enhanced ABS Search Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Category Browsing</h4>
              <p className="text-sm text-gray-600">
                Browse data by categories like Economics, Demographics, Social Statistics, and more.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Geographic Filtering</h4>
              <p className="text-sm text-gray-600">
                Filter data by states, territories, and regions across Australia.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Time Period Selection</h4>
              <p className="text-sm text-gray-600">
                Specify date ranges to get data for specific time periods.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Data Quality Indicators</h4>
              <p className="text-sm text-gray-600">
                View data quality scores, update frequency, and metadata information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Quick Access</h4>
              <p className="text-sm text-gray-600">
                Quick access to popular dataflows like CPI, GDP, Population, and Labour Force data.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Enhanced UX</h4>
              <p className="text-sm text-gray-600">
                Intuitive interface with expandable categories and progressive disclosure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

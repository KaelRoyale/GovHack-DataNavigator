'use client'

import { useState, KeyboardEvent } from 'react'
import { Search, Mic, X, Info } from 'lucide-react'
import { config } from '@/lib/config'

interface SearchBarProps {
  onSearch: (query: string) => void
  onCancel?: () => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, onCancel, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSiteInfo, setShowSiteInfo] = useState(false)

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSearch(query.trim())
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const getSiteDomains = () => {
    return config.search.supportedSites.map(site => site.replace('site:', ''))
  }

  const siteDomains = getSiteDomains()
  const siteCount = siteDomains.length

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center w-full">
          {/* Search Icon */}
          <div className="absolute left-4 text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search across government and research websites..."
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200"
            disabled={isLoading}
          />

          {/* Right side icons */}
          <div className="absolute right-4 flex items-center gap-2">
            {isLoading ? (
              <button
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Cancel search"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  title="Voice search"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim() || isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Search
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Site Information */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Search powered by Google Custom Search API</span>
          <button 
            onClick={() => setShowSiteInfo(!showSiteInfo)} 
            title="Show search sites"
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        
        {showSiteInfo && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Searching across {siteCount} trusted websites:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
              {siteDomains.map((domain, index) => (
                <div key={index} className="truncate">
                  {domain}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

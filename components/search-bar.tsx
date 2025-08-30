'use client'

import { useState, KeyboardEvent } from 'react'
import { Search, Mic } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('')

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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="flex items-center w-full bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
          <div className="flex-shrink-0 pl-4">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for articles across multiple websites..."
            className="flex-1 px-4 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-400"
            disabled={isLoading}
          />
          
          <div className="flex-shrink-0 pr-4">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Voice search"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching...
            </div>
          ) : (
            'Search'
          )}
        </button>
      </div>
      

    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import SearchBar from '@/components/search-bar'
import SearchResults from '@/components/search-results'
import { SearchResult, PaginationInfo } from '@/types/search'

export default function HomePage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSearch = async (query: string, page: number = 1) => {
    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setHasSearched(true)
    setCurrentQuery(query)
    setCurrentPage(page)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, page }),
        signal: abortControllerRef.current.signal,
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.items || [])
        setPagination(data.pagination || undefined)
      } else {
        const errorData = await response.json()
        console.error('Search failed:', errorData.error)
        setResults([])
        setPagination(undefined)
      }
    } catch (error) {
      // Don't show error if request was cancelled
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Search was cancelled')
        return
      }
      console.error('Search error:', error)
      setResults([])
      setPagination(undefined)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handlePageChange = (page: number) => {
    if (currentQuery) {
      handleSearch(currentQuery, page)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!hasSearched ? (
        // Google-like search page layout
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="DataLandscape"
              width={200}
              height={80}
              className="object-contain"
              priority
            />
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <SearchBar
              onSearch={(query) => handleSearch(query, 1)}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>

          {/* Tagline */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">
              Search across trusted government, research, and technical websites
            </p>
          </div>
        </div>
      ) : (
        // Results page layout
        <div className="container mx-auto px-4 py-8">
          {/* Header with logo and search bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="DataLandscape"
                width={120}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="flex-1 max-w-md ml-8">
              <SearchBar
                onSearch={(query) => handleSearch(query, 1)}
                onCancel={handleCancel}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Search Results */}
          <SearchResults
            results={results}
            pagination={pagination}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

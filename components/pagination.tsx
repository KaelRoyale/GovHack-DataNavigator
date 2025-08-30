'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { PaginationInfo } from '@/types/search'

interface PaginationProps {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export default function Pagination({ pagination, onPageChange, isLoading = false }: PaginationProps) {
  const { currentPage, totalPages, totalResults, hasNextPage, hasPreviousPage, startIndex, endIndex } = pagination

  if (totalPages <= 1) {
    return null
  }

  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 7
    const halfVisible = Math.floor(maxVisible / 2)

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - halfVisible)
      let end = Math.min(totalPages, currentPage + halfVisible)

      // Adjust if we're near the edges
      if (currentPage <= halfVisible + 1) {
        end = maxVisible
      } else if (currentPage >= totalPages - halfVisible) {
        start = totalPages - maxVisible + 1
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('...')
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add last page and ellipsis if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !isLoading) {
      onPageChange(page)
    }
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between">
        {/* Results info */}
        <div className="text-sm text-gray-700">
          Showing {startIndex} to {endIndex} of {totalResults.toLocaleString()} results
        </div>

        {/* Pagination controls */}
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={!hasPreviousPage || isLoading}
            className={`px-3 py-2 text-sm font-medium rounded-md border ${
              hasPreviousPage && !isLoading
                ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-sm text-gray-500">
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageClick(page as number)}
                    disabled={isLoading}
                    className={`px-3 py-2 text-sm font-medium rounded-md border ${
                      page === currentPage
                        ? 'text-white bg-primary-600 border-primary-600'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                    } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
            className={`px-3 py-2 text-sm font-medium rounded-md border ${
              hasNextPage && !isLoading
                ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Page info */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

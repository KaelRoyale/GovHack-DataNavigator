'use client'

import { useState } from 'react'
import { Database, Search } from 'lucide-react'
import ABSSearch from './abs-search'
import SearchBar from './search-bar'

interface SearchTabsProps {
  onABSSearch: (dataflowId: string, dataKey?: string, startPeriod?: string, endPeriod?: string) => void
  onNormalSearch: (query: string) => void
  isLoading: boolean
}

export default function SearchTabs({ onABSSearch, onNormalSearch, isLoading }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState<'abs' | 'normal'>('normal')

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('abs')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'abs'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-5 h-5" />
            ABS Statistics
          </button>
          <button
            onClick={() => setActiveTab('normal')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'normal'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="w-5 h-5" />
            Web Search
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'abs' ? (
          <ABSSearch onSearch={onABSSearch} isLoading={isLoading} />
        ) : (
          <div className="text-center">
            
            <SearchBar onSearch={onNormalSearch} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  )
}

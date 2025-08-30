'use client'

import { useState } from 'react'
import { Search, Database, Globe, Filter, TrendingUp, Users, Building, ShoppingCart, Home, GraduationCap } from 'lucide-react'
import DateTimePicker from './datetime-picker'

interface UnifiedSearchProps {
  onSearch: (query: string, searchType: 'web' | 'abs', searchOptions?: { 
    webSearchType?: string, 
    site?: string,
    startDate?: string,
    endDate?: string 
  }) => void
  isLoading: boolean
}

// Popular ABS dataflows for quick access
const POPULAR_DATAFLOWS = [
  {
    id: 'CPI',
    name: 'Consumer Price Index',
    description: 'Inflation and price statistics',
    icon: TrendingUp,
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'POP',
    name: 'Population Estimates',
    description: 'Demographic statistics',
    icon: Users,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'LFS',
    name: 'Labour Force Survey',
    description: 'Employment statistics',
    icon: Building,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'ALC',
    name: 'Alcohol Consumption',
    description: 'Health statistics',
    icon: ShoppingCart,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'RES_DWELL',
    name: 'Residential Dwellings',
    description: 'Housing statistics',
    icon: Home,
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    id: 'EDU',
    name: 'Education Statistics',
    description: 'Educational data',
    icon: GraduationCap,
    color: 'bg-teal-500 hover:bg-teal-600'
  }
]



export default function UnifiedSearch({ onSearch, isLoading }: UnifiedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'web' | 'abs'>('web')
  const [webSearchType, setWebSearchType] = useState('comprehensive')
  const [selectedSite, setSelectedSite] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedDataflow, setSelectedDataflow] = useState('')
  const [dataKey, setDataKey] = useState('all')
  const [startPeriod, setStartPeriod] = useState('')
  const [endPeriod, setEndPeriod] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSearch = () => {
    if (!searchQuery.trim() && !selectedDataflow) return

    if (searchType === 'abs') {
      // For ABS search, pass the query for content discovery and dataflow for data
      const queryToSearch = searchQuery.trim() || selectedDataflow
      const searchOptions = {
        startDate: startPeriod || startDate,
        endDate: endPeriod || endDate
      }
      onSearch(queryToSearch, 'abs', searchOptions)
    } else {
      // For web search, use the actual search query with enhanced options
      const searchOptions = {
        webSearchType,
        site: selectedSite,
        startDate,
        endDate
      }
      onSearch(searchQuery, 'web', searchOptions)
    }
  }

  const handleQuickABSSearch = (dataflowId: string) => {
    setSearchType('abs')
    setSelectedDataflow(dataflowId)
    setSearchQuery(dataflowId)
    onSearch(dataflowId, 'abs')
  }



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }



  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Search Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setSearchType('web')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              searchType === 'web'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Globe className="w-5 h-5" />
            Web Search
          </button>
          <button
            onClick={() => setSearchType('abs')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              searchType === 'abs'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-5 h-5" />
            ABS Statistics
          </button>
        </div>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {searchType === 'web' ? (
          /* Web Search Interface */
          <div className="space-y-6">
            {/* Web Content Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search the Web
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for articles, documentation, research papers..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>



            {/* Advanced Web Search */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Advanced Web Search</h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Type
                      </label>
                      <select
                        value={webSearchType}
                        onChange={(e) => setWebSearchType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="comprehensive">Comprehensive</option>
                        <option value="articles">Articles & News</option>
                        <option value="documentation">Documentation</option>
                        <option value="research">Research Papers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific Site (optional)
                      </label>
                      <select
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All sites</option>
                        <option value="abs.gov.au">ABS Statistics</option>
                        <option value="data.gov.au">Data.gov.au</option>
                        <option value="australia.gov.au">Australia.gov.au</option>
                        <option value="treasury.gov.au">Treasury</option>
                        <option value="rba.gov.au">Reserve Bank</option>
                        <option value="health.gov.au">Health</option>
                        <option value="education.gov.au">Education</option>
                        <option value="csiro.au">CSIRO</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Range Filter */}
                  <div className="border-t pt-4">
                    <DateTimePicker
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={setStartDate}
                      onEndDateChange={setEndDate}
                      onClear={() => {
                        setStartDate('')
                        setEndDate('')
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Start searching
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ABS Search Interface */
          <div className="space-y-6">
            {/* ABS Content Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search ABS Content
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for ABS articles, publications, research..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Search for specific articles, publications, and content within the ABS website
              </p>
            </div>

            {/* Quick ABS Dataflows */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Popular ABS Dataflows</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {POPULAR_DATAFLOWS.map((dataflow) => {
                  const IconComponent = dataflow.icon
                  return (
                    <button
                      key={dataflow.id}
                      onClick={() => handleQuickABSSearch(dataflow.id)}
                      disabled={isLoading}
                      className={`${dataflow.color} text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-left`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-6 h-6 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">{dataflow.name}</h4>
                          <p className="text-xs opacity-90">{dataflow.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Advanced ABS Search */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Advanced ABS Search</h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dataflow ID
                      </label>
                      <input
                        type="text"
                        value={selectedDataflow}
                        onChange={(e) => setSelectedDataflow(e.target.value)}
                        placeholder="e.g., CPI, POP, LFS"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Key (optional)
                      </label>
                      <input
                        type="text"
                        value={dataKey}
                        onChange={(e) => setDataKey(e.target.value)}
                        placeholder="e.g., 1.2.1.4.A or leave as 'all'"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Time Range Filter */}
                  <div className="border-t pt-4">
                    <DateTimePicker
                      startDate={startPeriod}
                      endDate={endPeriod}
                      onStartDateChange={setStartPeriod}
                      onEndDateChange={setEndPeriod}
                      onClear={() => {
                        setStartPeriod('')
                        setEndPeriod('')
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleSearch}
                  disabled={(!selectedDataflow && !searchQuery.trim()) || isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      Search ABS Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Search className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Search Tips</h4>
            <div className="text-sm text-blue-800 space-y-1">
              {searchType === 'web' ? (
                <>
                  <p>• Choose a search type to focus on specific content (articles, documentation, research)</p>
                  <p>• Use site-specific search to find content from particular government departments</p>
                  <p>• Enhanced search finds deeper content including PDFs, articles, and documentation</p>
                  <p>• Results include trusted sources from government, academic, and technical sites</p>
                </>
              ) : (
                <>
                  <p>• Search for specific ABS articles, publications, and content</p>
                  <p>• Click on popular dataflows for quick access to common statistics</p>
                  <p>• Use advanced options to specify data keys and time periods</p>
                  <p>• ABS data is official Australian Bureau of Statistics information</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

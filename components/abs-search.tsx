'use client'

import { useState, useEffect } from 'react'
import { Database, TrendingUp, Users, Building, Search, Filter, Calendar, MapPin, BarChart3, FileText, Globe, Home, Car, ShoppingCart, GraduationCap, Heart, Leaf, Factory, Plane } from 'lucide-react'

interface ABSDataflow {
  id: string
  name: string
  description?: string
  version: string
  category?: string
}

interface ABSSearchProps {
  onSearch: (dataflowId: string, dataKey?: string, startPeriod?: string, endPeriod?: string) => void
  isLoading: boolean
}

// Enhanced popular dataflows with categories and better descriptions
const POPULAR_DATAFLOWS = [
  {
    id: 'CPI',
    name: 'Consumer Price Index',
    description: 'Measures changes in the price level of consumer goods and services',
    category: 'Economics',
    icon: TrendingUp,
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'POP',
    name: 'Population Estimates',
    description: 'Australian population estimates by age, sex, and region',
    category: 'Demographics',
    icon: Users,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'LFS',
    name: 'Labour Force Survey',
    description: 'Employment, unemployment, and labour force participation statistics',
    category: 'Employment',
    icon: Building,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'GDP',
    name: 'Gross Domestic Product',
    description: 'Measures the total value of goods and services produced in Australia',
    category: 'Economics',
    icon: Database,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'ALC',
    name: 'Apparent Consumption of Alcohol',
    description: 'Alcohol consumption statistics and trends',
    category: 'Health',
    icon: ShoppingCart,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'RES_DWELL',
    name: 'Residential Dwellings',
    description: 'Housing statistics and dwelling information',
    category: 'Housing',
    icon: Home,
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    id: 'EDU',
    name: 'Education Statistics',
    description: 'Educational attainment and participation data',
    category: 'Education',
    icon: GraduationCap,
    color: 'bg-teal-500 hover:bg-teal-600'
  },
  {
    id: 'HEALTH',
    name: 'Health Statistics',
    description: 'Health indicators and medical statistics',
    category: 'Health',
    icon: Heart,
    color: 'bg-pink-500 hover:bg-pink-600'
  }
]

// Data key examples based on ABS API documentation
const DATA_KEY_EXAMPLES = {
  'CPI': {
    description: 'Consumer Price Index data keys',
    examples: ['1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.5.0', '1.6.0', '1.7.0', '1.8.0', '1.9.0', '1.10.0', '1.11.0', '1.12.0']
  },
  'POP': {
    description: 'Population data keys',
    examples: ['1.AUS', '1.NSW', '1.VIC', '1.QLD', '1.WA', '1.SA', '1.TAS', '1.NT', '1.ACT']
  },
  'LFS': {
    description: 'Labour Force data keys',
    examples: ['1.AUS', '1.NSW', '1.VIC', '1.QLD', '1.WA', '1.SA', '1.TAS', '1.NT', '1.ACT']
  },
  'ALC': {
    description: 'Alcohol consumption data keys',
    examples: ['1.2.1.4.A', '1.2.2.4.A', '1.2.3.4.A', '1.2.4.4.A']
  },
  'RES_DWELL': {
    description: 'Residential dwellings data keys',
    examples: ['1.1GSYD+1RNSW.Q', '1.2GMEL+2RVIC.Q', '1.3GBRI+3RQLD.Q']
  }
}

export default function ABSSearch({ onSearch, isLoading }: ABSSearchProps) {
  const [dataflows, setDataflows] = useState<ABSDataflow[]>([])
  const [selectedDataflow, setSelectedDataflow] = useState<string>('')
  const [dataKey, setDataKey] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showDataKeyHelp, setShowDataKeyHelp] = useState(false)
  
  // Set default dates (1 year ago to now)
  const getDefaultStartDate = () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 1)
    return date.toISOString().slice(0, 16)
  }
  
  const getDefaultEndDate = () => {
    return new Date().toISOString().slice(0, 16)
  }
  
  const [startPeriod, setStartPeriod] = useState<string>(getDefaultStartDate())
  const [endPeriod, setEndPeriod] = useState<string>(getDefaultEndDate())
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    fetchDataflows()
  }, [])

  const fetchDataflows = async () => {
    try {
      const response = await fetch('/api/abs-search?type=dataflows')
      if (response.ok) {
        const data = await response.json()
        setDataflows(data.dataflows || [])
      }
    } catch (error) {
      console.error('Failed to fetch dataflows:', error)
    }
  }

  const handleQuickSearch = (dataflowId: string) => {
    onSearch(dataflowId, 'all')
  }

  const handleAdvancedSearch = () => {
    if (selectedDataflow) {
      onSearch(selectedDataflow, dataKey, startPeriod, endPeriod)
    }
  }

  // Filter dataflows based on search query and category
  const filteredDataflows = dataflows.filter(df => {
    const matchesSearch = !searchQuery || 
      df.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      df.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || df.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories from dataflows
  const categories = ['all', ...new Set(dataflows.map(df => df.category).filter(Boolean))]

  // Get data key examples for selected dataflow
  const getDataKeyExamples = () => {
    return DATA_KEY_EXAMPLES[selectedDataflow as keyof typeof DATA_KEY_EXAMPLES] || null
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Quick Search Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Search ABS Statistics
        </h2>
        <p className="text-gray-600 mb-8">
          Access official Australian Bureau of Statistics data through our integrated API
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Dataflows
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or ID..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>
        </div>

        {/* Dataflow Results */}
        {searchQuery || selectedCategory !== 'all' ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Available Dataflows ({filteredDataflows.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredDataflows.map((df) => (
                <button
                  key={df.id}
                  onClick={() => handleQuickSearch(df.id)}
                  disabled={isLoading}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">{df.name}</div>
                  <div className="text-sm text-gray-600">ID: {df.id}</div>
                  {df.category && (
                    <div className="text-xs text-blue-600 mt-1">{df.category}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Popular Dataflows */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Popular Dataflows</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_DATAFLOWS.map((dataflow) => {
            const IconComponent = dataflow.icon
            return (
              <button
                key={dataflow.id}
                onClick={() => handleQuickSearch(dataflow.id)}
                disabled={isLoading}
                className={`${dataflow.color} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-center">
                  <IconComponent className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{dataflow.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{dataflow.description}</p>
                  {dataflow.category && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                      {dataflow.category}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Advanced Search Form */}
      {showAdvanced && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Advanced Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dataflow
              </label>
              <select
                value={selectedDataflow}
                onChange={(e) => setSelectedDataflow(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a dataflow</option>
                {dataflows.map((df) => (
                  <option key={df.id} value={df.id}>
                    {df.name} ({df.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Key
                <button
                  type="button"
                  onClick={() => setShowDataKeyHelp(!showDataKeyHelp)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FileText className="w-4 h-4 inline" />
                </button>
              </label>
              <input
                type="text"
                value={dataKey}
                onChange={(e) => setDataKey(e.target.value)}
                placeholder="e.g., 1.2.1.4.A or leave as 'all'"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Data Key Help */}
              {showDataKeyHelp && selectedDataflow && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-2">Data Key Examples for {selectedDataflow}</h4>
                  {getDataKeyExamples() ? (
                    <div>
                      <p className="text-sm text-blue-800 mb-2">{getDataKeyExamples()?.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {getDataKeyExamples()?.examples.map((example, index) => (
                          <button
                            key={index}
                            onClick={() => setDataKey(example)}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-800">
                      Use 'all' to get all available data, or specify a data key based on the dataflow structure.
                      <br />
                      <a 
                        href="https://www.abs.gov.au/about/data-services/application-programming-interfaces-apis/data-api-user-guide/worked-examples#explore-a-dataset-and-construct-a-data-request" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Learn more about data keys
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Period
              </label>
              <input
                type="datetime-local"
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select date and time for start period
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Period
              </label>
              <input
                type="datetime-local"
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select date and time for end period
              </p>
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Date Presets
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const now = new Date()
                  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
                  setStartPeriod(oneYearAgo.toISOString().slice(0, 16))
                  setEndPeriod(now.toISOString().slice(0, 16))
                }}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Last Year
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date()
                  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
                  setStartPeriod(sixMonthsAgo.toISOString().slice(0, 16))
                  setEndPeriod(now.toISOString().slice(0, 16))
                }}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                Last 6 Months
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date()
                  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
                  setStartPeriod(threeMonthsAgo.toISOString().slice(0, 16))
                  setEndPeriod(now.toISOString().slice(0, 16))
                }}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
              >
                Last 3 Months
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartPeriod('')
                  setEndPeriod('')
                }}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                All Data
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleAdvancedSearch}
              disabled={!selectedDataflow || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Search ABS Data'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Enhanced API Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <Database className="w-6 h-6 text-blue-600 mt-0.5 mr-4 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">ABS Data API Integration</h4>
            <p className="text-sm text-blue-800 mb-3">
              This search uses the official Australian Bureau of Statistics Data API following 
              <a 
                href="https://www.abs.gov.au/about/data-services/application-programming-interfaces-apis/data-api-user-guide/worked-examples#explore-a-dataset-and-construct-a-data-request" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                ABS API specifications
              </a>
              . Data is retrieved in SDMX-JSON format and transformed for display.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700">
              <div>
                <h5 className="font-medium mb-1">API Features:</h5>
                <ul className="space-y-1">
                  <li>• Machine-to-machine access via SDMX RESTful web service</li>
                  <li>• Support for wildcards and OR operators using "+"</li>
                  <li>• Time period filtering with startPeriod and endPeriod</li>
                  <li>• Data key filtering for specific dimensions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-1">Data Formats:</h5>
                <ul className="space-y-1">
                  <li>• SDMX-JSON for structured data</li>
                  <li>• CSV export capability</li>
                  <li>• Metadata and codelist support</li>
                  <li>• Pagination and result limiting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

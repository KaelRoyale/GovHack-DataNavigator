'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  TrendingUp, 
  Users, 
  Building, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  BarChart3, 
  FileText, 
  Globe, 
  Home, 
  Car, 
  ShoppingCart, 
  GraduationCap, 
  Heart, 
  Leaf, 
  Factory, 
  Plane,
  Cpu,
  Shield,
  Zap,
  Target,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface ABSDataflow {
  id: string
  name: string
  description?: string
  version: string
  category?: string
}

interface ABSCategory {
  name: string
  description: string
  dataflows: string[]
  icon: string
  color: string
}

interface EnhancedABSSearchProps {
  onSearch: (query: string, dataKey?: string, startPeriod?: string, endPeriod?: string) => void
  isLoading: boolean
}

const ICON_MAP = {
  TrendingUp,
  Users,
  Heart,
  Factory,
  Leaf,
  Building,
  Cpu,
  Database,
  BarChart3,
  FileText,
  Globe,
  Home,
  Car,
  ShoppingCart,
  GraduationCap,
  Shield,
  Zap,
  Target
}

export default function EnhancedABSSearch({ onSearch, isLoading }: EnhancedABSSearchProps) {
  const [categories, setCategories] = useState<Record<string, ABSCategory>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedGeography, setSelectedGeography] = useState<string>('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  
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

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/abs-search?type=categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || {})
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleCategorySearch = (category: string) => {
    setSelectedCategory(category)
    const categoryInfo = categories[category]
    if (categoryInfo) {
      onSearch(categoryInfo.name, 'all', startPeriod, endPeriod)
    }
  }

  const handleDataflowSearch = (dataflowId: string) => {
    onSearch(dataflowId, 'all', startPeriod, endPeriod)
  }

  const handleAdvancedSearch = () => {
    const query = searchQuery.trim() || selectedCategory
    if (query) {
      onSearch(query, 'all', startPeriod, endPeriod)
    }
  }

  const toggleCategoryExpansion = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP] || Database
    return <IconComponent className="w-5 h-5" />
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdvancedSearch()
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ABS Data Explorer
        </h2>
        <p className="text-gray-600 mb-8">
          Browse and search Australian Bureau of Statistics data by category
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search ABS data, publications, or dataflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Advanced
          </button>
          <button
            onClick={handleAdvancedSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geography
              </label>
              <select
                value={selectedGeography}
                onChange={(e) => setSelectedGeography(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Regions</option>
                <option value="NSW">New South Wales</option>
                <option value="VIC">Victoria</option>
                <option value="QLD">Queensland</option>
                <option value="WA">Western Australia</option>
                <option value="SA">South Australia</option>
                <option value="TAS">Tasmania</option>
                <option value="NT">Northern Territory</option>
                <option value="ACT">Australian Capital Territory</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Category Browser */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Browse by Category
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    {getIconComponent(category.icon)}
                  </div>
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                </div>
                <button
                  onClick={() => toggleCategoryExpansion(key)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedCategories.has(key) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              
              <button
                onClick={() => handleCategorySearch(key)}
                className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Search Category
              </button>
              
              {expandedCategories.has(key) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Popular Dataflows:</h5>
                  <div className="space-y-1">
                    {category.dataflows.slice(0, 3).map((dataflow) => (
                      <button
                        key={dataflow}
                        onClick={() => handleDataflowSearch(dataflow)}
                        className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {dataflow}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Quick Access
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleDataflowSearch('CPI')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <TrendingUp className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-sm font-medium">CPI</span>
            <span className="text-xs text-gray-500">Consumer Price Index</span>
          </button>
          
          <button
            onClick={() => handleDataflowSearch('POP')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium">Population</span>
            <span className="text-xs text-gray-500">Population Estimates</span>
          </button>
          
          <button
            onClick={() => handleDataflowSearch('LFS')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <Building className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm font-medium">Labour Force</span>
            <span className="text-xs text-gray-500">Employment Data</span>
          </button>
          
          <button
            onClick={() => handleDataflowSearch('GDP')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <Database className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium">GDP</span>
            <span className="text-xs text-gray-500">Gross Domestic Product</span>
          </button>
        </div>
      </div>
    </div>
  )
}

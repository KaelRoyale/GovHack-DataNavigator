'use client'

import { useState } from 'react'
import { Search, Database, Globe, TrendingUp, Users, Building, ShoppingCart, Home, GraduationCap, ArrowRight, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Search,
      title: 'Unified Search Interface',
      description: 'Single search bar for both web content and ABS statistics',
      details: [
        'Toggle between Web Search and ABS Statistics',
        'Popular ABS dataflows for quick access',
        'Advanced search options for custom queries',
        'Real-time search suggestions'
      ]
    },
    {
      icon: Database,
      title: 'ABS Statistics Integration',
      description: 'Direct access to official Australian Bureau of Statistics data',
      details: [
        'Consumer Price Index (CPI) data',
        'Population estimates and demographics',
        'Labour Force Survey results',
        'Housing and education statistics',
        'Health and alcohol consumption data'
      ]
    },
    {
      icon: Globe,
      title: 'Web Search Results',
      description: 'Comprehensive web search across trusted sources',
      details: [
        'Government and academic sources',
        'Research papers and documentation',
        'News articles and reports',
        'Technical tutorials and guides',
        'Dataset repositories and catalogs'
      ]
    },
    {
      icon: TrendingUp,
      title: 'AI-Powered Analysis',
      description: 'Intelligent content analysis using Gemini AI',
      details: [
        'Automatic content summarization',
        'Key points extraction',
        'Sentiment analysis',
        'Confidence scoring',
        'Multi-provider AI support (OpenAI + Gemini)'
      ]
    }
  ]

  const popularSearches = [
    {
      type: 'web',
      query: 'Australian economic indicators 2024',
      description: 'Find recent economic reports and analysis'
    },
    {
      type: 'abs',
      query: 'CPI',
      description: 'Consumer Price Index inflation data'
    },
    {
      type: 'web',
      query: 'data.gov.au datasets',
      description: 'Explore government open data'
    },
    {
      type: 'abs',
      query: 'POP',
      description: 'Population estimates and demographics'
    },
    {
      type: 'web',
      query: 'Australian housing market trends',
      description: 'Research housing market analysis'
    },
    {
      type: 'abs',
      query: 'RES_DWELL',
      description: 'Residential dwellings statistics'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            DataLandscape Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of unified search across web content and official ABS statistics. 
            Discover how one interface can connect you to both trusted web sources and authoritative government data.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full p-6 rounded-lg text-left transition-all duration-200 ${
                      activeFeature === index
                        ? 'bg-white shadow-lg border-2 border-blue-500'
                        : 'bg-white/70 hover:bg-white shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        activeFeature === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Feature Details */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500 text-white rounded-lg">
                  {(() => {
                    const IconComponent = features[activeFeature].icon
                    return <IconComponent className="w-6 h-6" />
                  })()}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {features[activeFeature].title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {features[activeFeature].description}
              </p>
              
              <ul className="space-y-3">
                {features[activeFeature].details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Try These Popular Searches
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSearches.map((search, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-4">
                  {search.type === 'web' ? (
                    <Globe className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Database className="w-5 h-5 text-green-500" />
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    search.type === 'web' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {search.type === 'web' ? 'Web Search' : 'ABS Data'}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">
                  {search.query}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {search.description}
                </p>
                
                <Link
                  href={`/?demo=${encodeURIComponent(search.query)}&type=${search.type}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Try this search
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ABS Dataflows Showcase */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular ABS Dataflows
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'CPI', name: 'Consumer Price Index', icon: TrendingUp, color: 'bg-red-500' },
              { id: 'POP', name: 'Population Estimates', icon: Users, color: 'bg-blue-500' },
              { id: 'LFS', name: 'Labour Force Survey', icon: Building, color: 'bg-green-500' },
              { id: 'ALC', name: 'Alcohol Consumption', icon: ShoppingCart, color: 'bg-orange-500' },
              { id: 'RES_DWELL', name: 'Residential Dwellings', icon: Home, color: 'bg-indigo-500' },
              { id: 'EDU', name: 'Education Statistics', icon: GraduationCap, color: 'bg-teal-500' }
            ].map((dataflow, index) => {
              const IconComponent = dataflow.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <div className={`${dataflow.color} text-white p-3 rounded-lg w-fit mb-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {dataflow.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Official ABS statistics and data
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">
                      ID: {dataflow.id}
                    </span>
                    <Link
                      href={`/?demo=${dataflow.id}&type=abs`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Data
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <Star className="w-12 h-12 text-yellow-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience Unified Search?
            </h2>
            
            <p className="text-gray-600 mb-6">
              Start exploring the power of combining web search with official ABS statistics. 
              Get instant access to both trusted web content and authoritative government data.
            </p>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Start Searching Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import SearchBar from '@/components/search-bar'
import SearchResults from '@/components/search-results'
import { SearchResult } from '@/types/search'

// Mock data for demonstration
const mockResults: SearchResult[] = [
  {
    title: "Getting Started with Next.js 14: A Complete Guide",
    link: "https://medium.com/@developer/nextjs-14-guide",
    snippet: "Learn how to build modern web applications with Next.js 14, including the new App Router, Server Components, and improved performance features...",
    displayLink: "medium.com",
    formattedUrl: "https://medium.com/@developer/nextjs-14-guide",
    htmlSnippet: "Learn how to build modern web applications with Next.js 14...",
    pagemap: {
      metatags: [{
        'og:title': 'Next.js 14 Complete Guide',
        'og:description': 'Comprehensive guide to Next.js 14 features',
        'og:image': 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=Next.js+14',
        'article:published_time': '2024-01-15T10:00:00Z',
        'article:author': 'John Developer'
      }]
    },
    dataAsset: {
      description: "Comprehensive tutorial covering Next.js 14 framework features and best practices for modern web development",
      collectionDate: "2024-01-15T10:00:00Z",
      purpose: "Educational resource for developers learning Next.js 14",
      department: "Web Development",
      metadata: {
        format: "Tutorial",
        size: "45 KB",
        records: 1,
        lastUpdated: "2024-01-15T10:00:00Z",
        version: "1.0",
        license: "Creative Commons",
        tags: ["next.js", "react", "tutorial", "web development"]
      },
      availability: {
        status: "public",
        custodian: "Medium.com",
        contactEmail: "support@medium.com",
        requestProcess: "Direct access"
      },
      relationships: {
        parentDataset: "Web Development Tutorials",
        childDatasets: ["React Tutorials", "TypeScript Guides"],
        relatedSeries: ["Next.js Tutorial Series"],
        dependencies: ["React", "Node.js"],
        derivedFrom: ["React Documentation"]
      },
      contentAnalysis: {
        summary: "Comprehensive guide covering Next.js 14 features including App Router, Server Components, and performance optimizations for building modern web applications.",
        keyTopics: ["App Router", "Server Components", "Performance", "TypeScript", "Deployment"],
        dataTypes: ["Tutorial", "Documentation", "Code Examples"],
        qualityScore: 9,
        updateFrequency: "Monthly"
      }
    }
  },
  {
    title: "TypeScript Best Practices for React Developers",
    link: "https://dev.to/typescript/react-best-practices",
    snippet: "Discover the best practices for using TypeScript with React, including proper type definitions, interfaces, and advanced patterns for better code quality...",
    displayLink: "dev.to",
    formattedUrl: "https://dev.to/typescript/react-best-practices",
    htmlSnippet: "Discover the best practices for using TypeScript with React...",
    pagemap: {
      metatags: [{
        'og:title': 'TypeScript React Best Practices',
        'og:description': 'Essential TypeScript patterns for React development',
        'og:image': 'https://via.placeholder.com/400x200/3178c6/ffffff?text=TypeScript+React',
        'article:published_time': '2024-01-10T14:30:00Z',
        'article:author': 'Sarah TypeScript'
      }]
    },
    dataAsset: {
      description: "Best practices guide for integrating TypeScript with React development workflows",
      collectionDate: "2024-01-10T14:30:00Z",
      purpose: "Improve code quality and type safety in React applications",
      department: "Frontend Development",
      metadata: {
        format: "Best Practices Guide",
        size: "32 KB",
        records: 1,
        lastUpdated: "2024-01-10T14:30:00Z",
        version: "2.1",
        license: "MIT",
        tags: ["typescript", "react", "best practices", "type safety"]
      },
      availability: {
        status: "public",
        custodian: "Dev.to Community",
        contactEmail: "hello@dev.to",
        requestProcess: "Open access"
      },
      relationships: {
        parentDataset: "React Development Resources",
        childDatasets: ["TypeScript Guides", "React Patterns"],
        relatedSeries: ["TypeScript Best Practices Series"],
        dependencies: ["TypeScript", "React"],
        derivedFrom: ["TypeScript Handbook", "React Documentation"]
      },
      contentAnalysis: {
        summary: "Best practices and advanced patterns for using TypeScript with React development, focusing on type safety and code quality improvements.",
        keyTopics: ["Type Safety", "React Integration", "Best Practices", "Interfaces", "Generics"],
        dataTypes: ["Best Practices", "Code Examples", "Patterns"],
        qualityScore: 8,
        updateFrequency: "Quarterly"
      }
    }
  },
  {
    title: "Building Scalable APIs with Node.js and Express",
    link: "https://hashnode.dev/nodejs-express-api",
    snippet: "A comprehensive tutorial on building RESTful APIs with Node.js and Express, covering authentication, validation, error handling, and deployment strategies...",
    displayLink: "hashnode.dev",
    formattedUrl: "https://hashnode.dev/nodejs-express-api",
    htmlSnippet: "A comprehensive tutorial on building RESTful APIs...",
    pagemap: {
      metatags: [{
        'og:title': 'Node.js Express API Guide',
        'og:description': 'Build scalable REST APIs with Node.js',
        'og:image': 'https://via.placeholder.com/400x200/339933/ffffff?text=Node.js+API',
        'article:published_time': '2024-01-08T09:15:00Z',
        'article:author': 'Mike Backend'
      }]
    }
  },
  {
    title: "The Future of Web Development: AI-Powered Tools",
    link: "https://techcrunch.com/ai-web-development-tools",
    snippet: "Explore how artificial intelligence is revolutionizing web development, from automated code generation to intelligent debugging and performance optimization...",
    displayLink: "techcrunch.com",
    formattedUrl: "https://techcrunch.com/ai-web-development-tools",
    htmlSnippet: "Explore how artificial intelligence is revolutionizing web development...",
    pagemap: {
      metatags: [{
        'og:title': 'AI in Web Development',
        'og:description': 'How AI is transforming web development',
        'og:image': 'https://via.placeholder.com/400x200/6366f1/ffffff?text=AI+Web+Dev',
        'article:published_time': '2024-01-12T16:45:00Z',
        'article:author': 'Tech Reporter'
      }]
    }
  },
  {
    title: "CSS Grid vs Flexbox: When to Use Each",
    link: "https://css-tricks.com/grid-vs-flexbox",
    snippet: "Understanding the differences between CSS Grid and Flexbox, with practical examples and guidelines for choosing the right layout method for your projects...",
    displayLink: "css-tricks.com",
    formattedUrl: "https://css-tricks.com/grid-vs-flexbox",
    htmlSnippet: "Understanding the differences between CSS Grid and Flexbox...",
    pagemap: {
      metatags: [{
        'og:title': 'CSS Grid vs Flexbox',
        'og:description': 'Complete comparison of CSS layout methods',
        'og:image': 'https://via.placeholder.com/400x200/1572b6/ffffff?text=CSS+Layout',
        'article:published_time': '2024-01-05T11:20:00Z',
        'article:author': 'CSS Expert'
      }]
    }
  }
]

export default function DemoPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    // Cancel any ongoing search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsLoading(true)
    setHasSearched(true)

    // Simulate API delay with timeout
    timeoutRef.current = setTimeout(() => {
      // Filter mock results based on query
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.snippet.toLowerCase().includes(query.toLowerCase())
      )

      setSearchResults(filteredResults)
      setIsLoading(false)
      timeoutRef.current = null
    }, 1500)
  }

  const handleCancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            DataLandscape
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Search across multiple websites and discover articles
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>Demo Mode:</strong> This is a demonstration with mock data.
              To use real search functionality, configure your Google Custom Search API credentials.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onCancel={handleCancel}
          isLoading={isLoading}
        />

        {/* Results */}
        {hasSearched && (
          <SearchResults
            results={searchResults}
            isLoading={isLoading}
          />
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="mt-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Try the demo search
              </h3>
              <p className="text-gray-500 mb-4">
                Enter keywords like "Next.js", "TypeScript", "React", or "CSS" to see mock results
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Available demo topics:</p>
                <p>• Next.js 14 • TypeScript • Node.js • AI • CSS Grid</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

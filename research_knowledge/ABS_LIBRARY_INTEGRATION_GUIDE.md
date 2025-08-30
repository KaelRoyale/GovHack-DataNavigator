# ABS Library Integration Guide

## Overview

This guide provides comprehensive instructions for integrating the enhanced ABS (Australian Bureau of Statistics) search functionality into your applications. The integration leverages the ABS Data Explorer research and provides category-based search, geographic filtering, and advanced data discovery capabilities.

## Available Libraries and Tools

### 1. Enhanced ABS Search API

The enhanced ABS search API provides multiple endpoints for different search scenarios:

#### Base URL
```
/api/abs-search
```

#### Available Endpoints

**GET Endpoints:**
- `GET /api/abs-search?type=dataflows` - Get available dataflows
- `GET /api/abs-search?type=categories` - Get category information
- `GET /api/abs-search?type=geography` - Get geographic regions
- `GET /api/abs-search?type=popular` - Get popular dataflows by category

**POST Endpoints:**
- `POST /api/abs-search` - Perform comprehensive search with advanced filtering

### 2. React Components

#### EnhancedABSSearch Component
```typescript
import EnhancedABSSearch from '@/components/enhanced-abs-search'

// Usage
<EnhancedABSSearch 
  onSearch={handleSearch} 
  isLoading={isLoading} 
/>
```

#### ABS Search Component (Legacy)
```typescript
import ABSSearch from '@/components/abs-search'

// Usage
<ABSSearch 
  onSearch={handleSearch} 
  isLoading={isLoading} 
/>
```

## API Integration Examples

### 1. Category-Based Search

```typescript
// Search by category
const searchByCategory = async (category: string) => {
  const response = await fetch('/api/abs-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category: 'economics', // or 'demographics', 'social', 'industry', etc.
      startDate: '2023-01-01T00:00:00',
      endDate: '2024-01-01T00:00:00'
    })
  })
  
  const data = await response.json()
  return data
}
```

### 2. Geographic Filtering

```typescript
// Search with geographic filtering
const searchWithGeography = async (query: string, geography: string) => {
  const response = await fetch('/api/abs-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'population',
      geography: 'NSW', // State code
      startDate: '2023-01-01T00:00:00',
      endDate: '2024-01-01T00:00:00'
    })
  })
  
  const data = await response.json()
  return data
}
```

### 3. Dataflow-Specific Search

```typescript
// Search specific dataflows
const searchDataflow = async (dataflowId: string) => {
  const response = await fetch('/api/abs-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dataflowId: 'CPI',
      dataKey: 'all',
      startPeriod: '2023-Q1',
      endPeriod: '2024-Q1'
    })
  })
  
  const data = await response.json()
  return data
}
```

### 4. Get Available Categories

```typescript
// Fetch available categories
const getCategories = async () => {
  const response = await fetch('/api/abs-search?type=categories')
  const data = await response.json()
  return data.categories
}
```

### 5. Get Geographic Regions

```typescript
// Fetch available geographic regions
const getGeography = async () => {
  const response = await fetch('/api/abs-search?type=geography')
  const data = await response.json()
  return data.geographicRegions
}
```

## Available Categories

The ABS search supports the following categories based on the ABS Data Explorer:

### 1. Economics & Finance
- **Dataflows**: CPI, GDP, LFS, TRADE, BUSINESS, FINANCE, INFLATION, INTEREST_RATES
- **Description**: Economic indicators, financial statistics, and business data
- **Icon**: TrendingUp
- **Color**: bg-red-500

### 2. Population & Demographics
- **Dataflows**: POP, CENSUS, MIGRATION, REGIONAL, AGE_GENDER, BIRTHS_DEATHS
- **Description**: Population estimates, census data, and demographic statistics
- **Icon**: Users
- **Color**: bg-blue-500

### 3. Social Statistics
- **Dataflows**: EDU, HEALTH, HOUSING, CRIME, CULTURE, SPORT, ALC, WELLBEING
- **Description**: Education, health, housing, and social wellbeing data
- **Icon**: Heart
- **Color**: bg-green-500

### 4. Industry & Business
- **Dataflows**: MANUFACTURING, RETAIL, AGRICULTURE, MINING, CONSTRUCTION, TRANSPORT
- **Description**: Manufacturing, retail, agriculture, and industry statistics
- **Icon**: Factory
- **Color**: bg-purple-500

### 5. Environment & Energy
- **Dataflows**: ENVIRONMENT, ENERGY, CLIMATE, NATURAL_RESOURCES, WASTE
- **Description**: Environmental statistics, energy data, and climate information
- **Icon**: Leaf
- **Color**: bg-emerald-500

### 6. Government & Public Sector
- **Dataflows**: GOVERNMENT, DEFENCE, PUBLIC_HEALTH, PUBLIC_ADMIN, JUSTICE
- **Description**: Government finance, public administration, and defence statistics
- **Icon**: Building
- **Color**: bg-indigo-500

### 7. Technology & Science
- **Dataflows**: SCIENCE, TECHNOLOGY, INNOVATION, RESEARCH
- **Description**: Science, technology, innovation, and research statistics
- **Icon**: Cpu
- **Color**: bg-cyan-500

## Geographic Regions

Available geographic filtering options:

### States and Territories
- NSW - New South Wales
- VIC - Victoria
- QLD - Queensland
- WA - Western Australia
- SA - South Australia
- TAS - Tasmania
- NT - Northern Territory
- ACT - Australian Capital Territory

### National Level
- AUS - Australia-wide statistics

## Popular Dataflows

Quick access to commonly used dataflows:

### Economic Indicators
- **CPI** - Consumer Price Index
- **GDP** - Gross Domestic Product
- **LFS** - Labour Force Survey

### Demographics
- **POP** - Population Estimates
- **CENSUS** - Census Data
- **MIGRATION** - Migration Statistics

### Social Statistics
- **EDU** - Education Statistics
- **HEALTH** - Health Statistics
- **HOUSING** - Housing Statistics

## Integration Patterns

### 1. React Hook Pattern

```typescript
import { useState, useEffect } from 'react'

const useABSSearch = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchABS = async (params) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/abs-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      
      const data = await response.json()
      setResults(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, searchABS }
}
```

### 2. Service Class Pattern

```typescript
class ABSSearchService {
  private baseUrl = '/api/abs-search'

  async search(params: ABSSearchParams): Promise<ABSSearchResult> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    
    if (!response.ok) {
      throw new Error(`ABS search failed: ${response.statusText}`)
    }
    
    return response.json()
  }

  async getCategories(): Promise<ABSCategories> {
    const response = await fetch(`${this.baseUrl}?type=categories`)
    return response.json()
  }

  async getGeography(): Promise<ABSGeography> {
    const response = await fetch(`${this.baseUrl}?type=geography`)
    return response.json()
  }
}

export const absSearchService = new ABSSearchService()
```

### 3. Context Provider Pattern

```typescript
import { createContext, useContext, useState } from 'react'

const ABSSearchContext = createContext()

export const ABSSearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState({
    results: [],
    loading: false,
    error: null
  })

  const searchABS = async (params) => {
    setSearchState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch('/api/abs-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      
      const data = await response.json()
      setSearchState({
        results: data.items || [],
        loading: false,
        error: null
      })
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }

  return (
    <ABSSearchContext.Provider value={{ ...searchState, searchABS }}>
      {children}
    </ABSSearchContext.Provider>
  )
}

export const useABSSearch = () => useContext(ABSSearchContext)
```

## Error Handling

### Common Error Scenarios

1. **API Unavailable**
```typescript
try {
  const response = await fetch('/api/abs-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  
  if (!response.ok) {
    throw new Error(`ABS API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
} catch (error) {
  console.error('ABS search failed:', error)
  // Handle gracefully - return mock data or show user-friendly message
}
```

2. **Invalid Parameters**
```typescript
// Validate parameters before sending
const validateSearchParams = (params) => {
  if (!params.query && !params.dataflowId && !params.category) {
    throw new Error('Query, dataflowId, or category is required')
  }
  
  if (params.category && !['economics', 'demographics', 'social', 'industry', 'environment', 'government', 'technology'].includes(params.category)) {
    throw new Error('Invalid category specified')
  }
}
```

## Performance Optimization

### 1. Caching Strategies

```typescript
// Cache categories and geography data
const categoryCache = new Map()
const geographyCache = new Map()

const getCachedCategories = async () => {
  if (categoryCache.has('categories')) {
    return categoryCache.get('categories')
  }
  
  const categories = await fetch('/api/abs-search?type=categories').then(r => r.json())
  categoryCache.set('categories', categories)
  return categories
}
```

### 2. Debounced Search

```typescript
import { useMemo } from 'react'
import debounce from 'lodash/debounce'

const useDebouncedSearch = (searchFunction, delay = 300) => {
  const debouncedSearch = useMemo(
    () => debounce(searchFunction, delay),
    [searchFunction, delay]
  )
  
  return debouncedSearch
}
```

### 3. Pagination

```typescript
const searchWithPagination = async (params, page = 1) => {
  const response = await fetch('/api/abs-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, page })
  })
  
  const data = await response.json()
  return {
    items: data.items,
    pagination: data.pagination
  }
}
```

## Testing

### 1. Unit Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EnhancedABSSearch from '@/components/enhanced-abs-search'

describe('EnhancedABSSearch', () => {
  it('should render category browser', () => {
    render(<EnhancedABSSearch onSearch={jest.fn()} isLoading={false} />)
    expect(screen.getByText('Browse by Category')).toBeInTheDocument()
  })

  it('should handle category search', async () => {
    const mockOnSearch = jest.fn()
    render(<EnhancedABSSearch onSearch={mockOnSearch} isLoading={false} />)
    
    const categoryButton = screen.getByText('Economics & Finance')
    fireEvent.click(categoryButton)
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Economics & Finance', 'all', expect.any(String), expect.any(String))
    })
  })
})
```

### 2. API Tests

```typescript
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/abs-search/route'

describe('/api/abs-search', () => {
  it('should return categories', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { type: 'categories' }
    })

    await GET(req)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.categories).toBeDefined()
  })

  it('should handle search requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { category: 'economics' }
    })

    await POST(req)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.items).toBeDefined()
  })
})
```

## Best Practices

### 1. User Experience
- Provide loading states for all async operations
- Show meaningful error messages
- Implement progressive disclosure for advanced features
- Use consistent visual design patterns

### 2. Performance
- Implement proper caching strategies
- Use debouncing for search inputs
- Optimize bundle size by lazy loading components
- Implement proper pagination

### 3. Accessibility
- Ensure keyboard navigation works
- Provide proper ARIA labels
- Support screen readers
- Maintain color contrast ratios

### 4. Error Handling
- Graceful degradation when API is unavailable
- User-friendly error messages
- Retry mechanisms for transient failures
- Proper logging for debugging

## Conclusion

The enhanced ABS search integration provides a comprehensive solution for accessing Australian Bureau of Statistics data. By following the patterns and best practices outlined in this guide, you can create robust, user-friendly applications that leverage the full power of the ABS Data Explorer functionality.

For more information, refer to:
- [ABS Data Explorer Research](./ABS_DATA_EXPLORER_RESEARCH.md)
- [ABS API Integration](./ABS_API_INTEGRATION.md)
- [ABS Data Explorer](https://dataexplorer.abs.gov.au/)

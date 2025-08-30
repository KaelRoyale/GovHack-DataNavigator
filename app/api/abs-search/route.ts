import { NextRequest, NextResponse } from 'next/server'
import { handleCors, addCorsHeaders } from '@/lib/cors'

const ABS_BASE_URL = 'https://data.api.abs.gov.au'
const ABS_WEBSITE_BASE = 'https://www.abs.gov.au'

// Enhanced interfaces based on ABS API documentation
interface ABSDataStructure {
  id: string
  name: string
  dimensions: ABSDimension[]
  attributes: ABSAttribute[]
}

interface ABSDimension {
  id: string
  name: string
  position: number
  codelist: ABSCodelist
}

interface ABSCodelist {
  id: string
  codes: ABSCode[]
}

interface ABSCode {
  id: string
  name: string
  description?: string
}

interface ABSAttribute {
  id: string
  name: string
  codelist?: ABSCodelist
}

interface QueryFilters {
  dimensions: Record<string, string | string[]>
  startPeriod?: string
  endPeriod?: string
  detail?: 'full' | 'dataonly' | 'serieskeysonly'
  firstNObservations?: number
  lastNObservations?: number
}

interface ABSDataflow {
  id: string
  name: string
  description?: string
  version: string
  category?: string
}

interface ABSDataResponse {
  dataflows: ABSDataflow[]
  error?: string
}

interface ABSContentResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  formattedUrl: string
  htmlSnippet: string
  pagemap?: any
  dataAsset?: any
  type: 'data' | 'content'
  relevanceScore?: number
}

// Popular ABS dataflows based on the ABS API documentation
const POPULAR_DATAFLOWS = {
  'ALC': {
    name: 'Apparent Consumption of Alcohol, Australia',
    description: 'Alcohol consumption statistics',
    category: 'Social'
  },
  'CPI': {
    name: 'Consumer Price Index, Australia',
    description: 'Inflation and price statistics',
    category: 'Economics'
  },
  'RES_DWELL': {
    name: 'Residential Dwellings, Australia',
    description: 'Housing and dwelling statistics',
    category: 'Social'
  },
  'POP': {
    name: 'Population Estimates, Australia',
    description: 'Demographic statistics',
    category: 'Demographics'
  },
  'LFS': {
    name: 'Labour Force, Australia',
    description: 'Employment and unemployment statistics',
    category: 'Economics'
  }
}

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'dataflows') {
      // Get all available dataflows from ABS API
      const dataflows = await discoverDataflows()
      const response = NextResponse.json({ dataflows })
      return addCorsHeaders(response, request)
    }
    
    if (type === 'datastructure') {
      const dataflowId = searchParams.get('dataflowId')
      if (!dataflowId) {
        const response = NextResponse.json({ error: 'dataflowId is required' }, { status: 400 })
        return addCorsHeaders(response, request)
      }
      
      const dataStructure = await getDataStructure(dataflowId)
      const response = NextResponse.json({ dataStructure })
      return addCorsHeaders(response, request)
    }
    
    if (type === 'popular') {
      const response = NextResponse.json({ 
        popularDataflows: POPULAR_DATAFLOWS,
        totalDataflows: Object.keys(POPULAR_DATAFLOWS).length
      })
      return addCorsHeaders(response, request)
    }
    
    // Default response
    const response = NextResponse.json({ 
      message: 'ABS API is working',
      availableEndpoints: ['dataflows', 'datastructure', 'popular'],
      popularDataflows: Object.keys(POPULAR_DATAFLOWS)
    })
    return addCorsHeaders(response, request)
    
  } catch (error) {
    console.error('ABS API GET error:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response, request)
  }
}

export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const body = await request.json()
    const { 
      query, 
      dataflowId, 
      dataKey = 'all', 
      startPeriod, 
      endPeriod, 
      startDate, 
      endDate, 
      page = 1,
      category,
      geography,
      searchType = 'comprehensive'
    } = body

    if (!query && !dataflowId) {
      const response = NextResponse.json({ error: 'Query or dataflowId is required' }, { status: 400 })
      return addCorsHeaders(response, request)
    }

    const searchQuery = query || dataflowId
    console.log('ABS search request:', { 
      searchQuery, 
      dataflowId, 
      dataKey, 
      startPeriod, 
      endPeriod, 
      startDate, 
      endDate, 
      page
    })

    let allResults: ABSContentResult[] = []

    // If dataflowId is provided, fetch actual ABS data using proper API structure
    if (dataflowId) {
      const effectiveStartDate = startDate || startPeriod
      const effectiveEndDate = endDate || endPeriod
      const dataResults = await fetchABSData(dataflowId, dataKey, effectiveStartDate, effectiveEndDate, 'full', page)
      allResults.push(...dataResults)
    }

    // Also perform content search for related ABS articles and publications
    const contentResults = await performContentFocusedABSSearch(searchQuery, category)
    allResults.push(...contentResults)

    // Apply geographic filtering if specified
    if (geography) {
      allResults = filterByGeography(allResults, geography)
    }

    // Combine and deduplicate results
    const uniqueResults = removeDuplicateResults(allResults)
    
    // Sort by relevance score
    const sortedResults = uniqueResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))

    // Calculate pagination
    const maxResults = 10
    const totalResults = sortedResults.length
    const totalPages = Math.ceil(totalResults / maxResults)
    const startIndex = (page - 1) * maxResults
    const endIndex = Math.min(startIndex + maxResults, totalResults)
    const paginatedResults = sortedResults.slice(startIndex, endIndex)

    const pagination = {
      currentPage: page,
      totalPages,
      totalResults,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      startIndex: startIndex + 1,
      endIndex
    }

    const response = NextResponse.json({
      items: paginatedResults,
      pagination,
      searchMetadata: {
        dataflowId,
        category,
        geography,
        searchType,
        totalDataflows: Object.keys(POPULAR_DATAFLOWS).length
      }
    })
    return addCorsHeaders(response, request)

  } catch (error) {
    console.error('ABS search error:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response, request)
  }
}

// Discover all available dataflows from ABS API
async function discoverDataflows(): Promise<ABSDataflow[]> {
  try {
    console.log('Discovering ABS dataflows...')
    const response = await fetch(`${ABS_BASE_URL}/rest/dataflow`)
    
    if (!response.ok) {
      console.error('Failed to fetch dataflows:', response.status, response.statusText)
      return []
    }

    const text = await response.text()
    const dataflows: ABSDataflow[] = []
    
    // Parse XML response to extract dataflow information
    const dataflowMatches = text.match(/<structure:Dataflow id="([^"]+)"[^>]*>/g)
    if (dataflowMatches) {
      for (const match of dataflowMatches) {
        const idMatch = match.match(/id="([^"]+)"/)
        if (idMatch) {
          const id = idMatch[1]
          dataflows.push({
            id,
            name: getDataflowName(id),
            description: getDataflowDescription(id),
            version: '1.0.0',
            category: getDataflowCategory(id)
          })
        }
      }
    }

    console.log(`Discovered ${dataflows.length} dataflows`)
    return dataflows
  } catch (error) {
    console.error('Error discovering dataflows:', error)
    return []
  }
}

// Get data structure definition for a specific dataflow
async function getDataStructure(dataflowId: string): Promise<ABSDataStructure | null> {
  try {
    console.log(`Getting data structure for ${dataflowId}...`)
    const response = await fetch(`${ABS_BASE_URL}/rest/datastructure/ABS/${dataflowId}?references=children`)
    
    if (!response.ok) {
      console.error(`Failed to get data structure for ${dataflowId}:`, response.status, response.statusText)
      return null
    }

    const text = await response.text()
    
    // Parse XML to extract dimension information
    const dimensions: ABSDimension[] = []
    const dimensionMatches = text.match(/<structure:Dimension id="([^"]+)" position="(\d+)">/g)
    
    if (dimensionMatches) {
      for (const match of dimensionMatches) {
        const idMatch = match.match(/id="([^"]+)"/)
        const positionMatch = match.match(/position="(\d+)"/)
        
        if (idMatch && positionMatch) {
          dimensions.push({
            id: idMatch[1],
            name: getDimensionName(idMatch[1]),
            position: parseInt(positionMatch[1]),
            codelist: { id: idMatch[1], codes: [] }
          })
        }
      }
    }

    return {
      id: dataflowId,
      name: getDataflowName(dataflowId),
      dimensions,
      attributes: []
    }
  } catch (error) {
    console.error(`Error getting data structure for ${dataflowId}:`, error)
    return null
  }
}

// Fetch ABS data using proper API structure
async function fetchABSData(dataflowId: string, dataKey?: string, startPeriod?: string, endPeriod?: string, detail?: string, page?: number): Promise<ABSContentResult[]> {
  try {
    console.log(`Fetching ABS data for ${dataflowId}...`)
    
    // Build the proper ABS API URL according to documentation
    let url = `${ABS_BASE_URL}/rest/data/${dataflowId}`
    
    // Add dataKey if specified, otherwise use 'all'
    if (dataKey && dataKey !== 'all') {
      url += `/${dataKey}`
    } else {
      url += '/all'
    }
    
    // Add query parameters
    const params = new URLSearchParams()
    if (startPeriod) params.append('startPeriod', startPeriod)
    if (endPeriod) params.append('endPeriod', endPeriod)
    if (detail) params.append('detail', detail)
    if (page && page > 1) params.append('firstNObservations', (page * 10).toString())
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }

    console.log('ABS API URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.sdmx.data+json;version=1.0'
      }
    })
    
    if (!response.ok) {
      console.error(`ABS API error for ${dataflowId}:`, response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      return []
    }

    const data = await response.json()
    
    // Convert ABS data to our result format
    const results: ABSContentResult[] = []
    
    if (data.data && data.data.length > 0) {
      for (const series of data.data) {
        const result: ABSContentResult = {
          title: `${getDataflowName(dataflowId)} - ${series.seriesKey || 'Data Series'}`,
          link: `${ABS_BASE_URL}/rest/data/${dataflowId}`,
          snippet: `ABS statistical data for ${getDataflowName(dataflowId)}`,
          displayLink: 'data.api.abs.gov.au',
          formattedUrl: `${ABS_BASE_URL}/rest/data/${dataflowId}`,
          htmlSnippet: `Official ABS data: ${getDataflowName(dataflowId)}`,
          type: 'data',
          relevanceScore: 1.0,
          dataAsset: {
            name: getDataflowName(dataflowId),
            description: getDataflowDescription(dataflowId),
            dataflowId,
            observations: series.observations || [],
            dimensions: series.dimensions || {}
          }
        }
        results.push(result)
      }
    }

    console.log(`Retrieved ${results.length} data series for ${dataflowId}`)
    return results
  } catch (error) {
    console.error(`Error fetching ABS data for ${dataflowId}:`, error)
    return []
  }
}

// Perform content-focused ABS search (for articles, publications, etc.)
async function performContentFocusedABSSearch(query: string, category?: string): Promise<ABSContentResult[]> {
  try {
    console.log(`Performing content search for: ${query}`)
    
    // This would typically search ABS website content
    // For now, return mock results based on popular dataflows
    const results: ABSContentResult[] = []
    
    for (const [id, dataflow] of Object.entries(POPULAR_DATAFLOWS)) {
      if (query.toLowerCase().includes(id.toLowerCase()) || 
          dataflow.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          title: dataflow.name,
          link: `${ABS_WEBSITE_BASE}/statistics/${id.toLowerCase()}`,
          snippet: dataflow.description,
          displayLink: 'abs.gov.au',
          formattedUrl: `${ABS_WEBSITE_BASE}/statistics/${id.toLowerCase()}`,
          htmlSnippet: `Official ABS statistics: ${dataflow.description}`,
          type: 'content',
          relevanceScore: 0.9
        })
      }
    }
    
    return results
  } catch (error) {
    console.error('Error in content search:', error)
    return []
  }
}

// Helper functions for dataflow information
function getDataflowName(id: string): string {
  return POPULAR_DATAFLOWS[id as keyof typeof POPULAR_DATAFLOWS]?.name || id
}

function getDataflowDescription(id: string): string {
  return POPULAR_DATAFLOWS[id as keyof typeof POPULAR_DATAFLOWS]?.description || 'ABS statistical data'
}

function getDataflowCategory(id: string): string {
  return POPULAR_DATAFLOWS[id as keyof typeof POPULAR_DATAFLOWS]?.category || 'General'
}

function getDimensionName(id: string): string {
  const dimensionNames: Record<string, string> = {
    'TYP': 'Type',
    'MEA': 'Measure',
    'BEVT': 'Beverage Type',
    'SUB': 'Sub-category',
    'FREQUENCY': 'Frequency',
    'REGION': 'Region',
    'TIME_PERIOD': 'Time Period'
  }
  return dimensionNames[id] || id
}

// Filter results by geography
function filterByGeography(results: ABSContentResult[], geography: string): ABSContentResult[] {
  return results.filter(result => 
    result.title.toLowerCase().includes(geography.toLowerCase()) ||
    result.snippet.toLowerCase().includes(geography.toLowerCase())
  )
}

// Remove duplicate results
function removeDuplicateResults(results: ABSContentResult[]): ABSContentResult[] {
  const seen = new Set<string>()
  return results.filter(result => {
    const key = result.link
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}


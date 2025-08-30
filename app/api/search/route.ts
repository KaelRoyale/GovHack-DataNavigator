import { NextRequest, NextResponse } from 'next/server'

interface SearchRequest {
  query: string
  page?: number
  searchType?: 'comprehensive' | 'articles' | 'documentation' | 'research'
  site?: string
  startDate?: string
  endDate?: string
}

interface GoogleSearchResponse {
  items?: Array<{
    title: string
    link: string
    snippet: string
    displayLink: string
    formattedUrl: string
    htmlSnippet: string
    pagemap?: {
      metatags?: Array<{
        'og:title'?: string
        'og:description'?: string
        'og:image'?: string
        'article:published_time'?: string
        'article:author'?: string
      }>
      cse_image?: Array<{
        src: string
      }>
    }
  }>
  searchInformation?: {
    totalResults: string
    searchTime: number
  }
  error?: {
    code: number
    message: string
  }
}

interface EnhancedSearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  formattedUrl: string
  htmlSnippet: string
  pagemap?: any
  searchType: 'primary' | 'site-specific' | 'content-specific'
  relevanceScore?: number
}

// Enhanced search strategies for deeper content discovery
const SEARCH_STRATEGIES = {
  comprehensive: {
    queries: [
      '{query}',
      '"{query}"',
      '{query} site:*.gov.au OR site:*.edu.au OR site:*.org.au',
      '{query} filetype:pdf OR filetype:doc OR filetype:docx',
      '{query} inurl:article OR inurl:post OR inurl:blog OR inurl:news',
      '{query} inurl:research OR inurl:study OR inurl:analysis',
      '{query} inurl:documentation OR inurl:docs OR inurl:guide'
    ],
    weights: [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4]
  },
  articles: {
    queries: [
      '{query} inurl:article OR inurl:post OR inurl:blog OR inurl:news',
      '"{query}" inurl:article OR inurl:post OR inurl:blog',
      '{query} "article" OR "post" OR "blog post"',
      '{query} filetype:pdf inurl:article',
      '{query} inurl:media OR inurl:press OR inurl:release'
    ],
    weights: [1.0, 0.9, 0.8, 0.7, 0.6]
  },
  documentation: {
    queries: [
      '{query} inurl:documentation OR inurl:docs OR inurl:guide OR inurl:manual',
      '"{query}" inurl:documentation OR inurl:docs',
      '{query} filetype:pdf inurl:docs',
      '{query} "documentation" OR "user guide" OR "manual"',
      '{query} inurl:help OR inurl:faq OR inurl:tutorial'
    ],
    weights: [1.0, 0.9, 0.8, 0.7, 0.6]
  },
  research: {
    queries: [
      '{query} inurl:research OR inurl:study OR inurl:analysis OR inurl:paper',
      '"{query}" inurl:research OR inurl:study',
      '{query} filetype:pdf inurl:research',
      '{query} "research paper" OR "study" OR "analysis"',
      '{query} inurl:academic OR inurl:scholar OR inurl:journal'
    ],
    weights: [1.0, 0.9, 0.8, 0.7, 0.6]
  }
}

// Popular sites for site-specific searches
const POPULAR_SITES = [
  'abs.gov.au',
  'data.gov.au',
  'australia.gov.au',
  'treasury.gov.au',
  'rba.gov.au',
  'health.gov.au',
  'education.gov.au',
  'industry.gov.au',
  'agriculture.gov.au',
  'environment.gov.au',
  'infrastructure.gov.au',
  'defence.gov.au',
  'homeaffairs.gov.au',
  'dfat.gov.au',
  'accc.gov.au',
  'ato.gov.au',
  'csiro.au',
  'bom.gov.au',
  'ga.gov.au',
  'census.gov.au'
]

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query, page = 1, searchType = 'comprehensive', site, startDate, endDate } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Get API credentials from environment variables
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CUSTOM_SEARCH_API_KEY
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID

    if (!apiKey || !searchEngineId) {
      console.error('Missing Google Custom Search API credentials')
      return NextResponse.json(
        { error: 'Search service is not configured' },
        { status: 500 }
      )
    }

    // Import configuration
    const { config } = await import('@/lib/config')

    console.log('Enhanced search request:', {
      query,
      searchType,
      site,
      page,
      startDate,
      endDate
    })

    // Perform enhanced search with multiple strategies
    const allResults = await performEnhancedSearch(
      query,
      searchType,
      site,
      page,
      apiKey,
      searchEngineId,
      config,
      startDate,
      endDate
    )

    // Calculate pagination info
    const totalResults = allResults.length
    const maxResults = config.search.maxResults
    const totalPages = Math.ceil(totalResults / maxResults)
    const currentPage = page
    const hasNextPage = currentPage < totalPages
    const hasPreviousPage = currentPage > 1
    const startIndex = (currentPage - 1) * maxResults
    const endIndex = Math.min(currentPage * maxResults, totalResults)

    // Paginate results
    const paginatedResults = allResults.slice(startIndex, endIndex)

    const pagination = {
      currentPage,
      totalPages,
      totalResults,
      hasNextPage,
      hasPreviousPage,
      startIndex: startIndex + 1,
      endIndex
    }

    // Return the enhanced search results with pagination
    return NextResponse.json({
      items: paginatedResults,
      searchInformation: {
        totalResults: totalResults.toString(),
        searchTime: 0 // Will be calculated from actual API calls
      },
      pagination
    })

  } catch (error) {
    console.error('Enhanced search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function performEnhancedSearch(
  query: string,
  searchType: string,
  site: string | undefined,
  page: number,
  apiKey: string,
  searchEngineId: string,
  config: any,
  startDate?: string,
  endDate?: string
): Promise<EnhancedSearchResult[]> {
  const allResults: EnhancedSearchResult[] = []
  const seenUrls = new Set<string>()

  try {
    // Strategy 1: Primary search with enhanced queries
    const strategy = SEARCH_STRATEGIES[searchType as keyof typeof SEARCH_STRATEGIES] || SEARCH_STRATEGIES.comprehensive
    
    // Add date filtering to queries if provided
    const dateFilter = startDate && endDate ? ` after:${startDate.split('T')[0]} before:${endDate.split('T')[0]}` : ''
    
    for (let i = 0; i < strategy.queries.length; i++) {
      const searchQuery = strategy.queries[i].replace('{query}', query) + dateFilter
      const weight = strategy.weights[i]
      
      console.log(`Performing search ${i + 1}/${strategy.queries.length}:`, searchQuery)
      
      const results = await performGoogleSearch(
        searchQuery,
        apiKey,
        searchEngineId,
        config,
        'primary',
        weight
      )
      
      // Add unique results with relevance scoring
      for (const result of results) {
        if (!seenUrls.has(result.link)) {
          seenUrls.add(result.link)
          allResults.push({
            ...result,
            searchType: 'primary' as const,
            relevanceScore: weight
          })
        }
      }
      
      // Add delay to respect API rate limits
      if (i < strategy.queries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // Strategy 2: Site-specific searches for popular sites
    if (!site) {
      const siteQueries = POPULAR_SITES.slice(0, 5) // Limit to top 5 sites to avoid rate limits
      
      for (const siteDomain of siteQueries) {
        const siteQuery = `${query} site:${siteDomain}${dateFilter}`
        console.log(`Performing site-specific search for ${siteDomain}:`, siteQuery)
        
        const results = await performGoogleSearch(
          siteQuery,
          apiKey,
          searchEngineId,
          config,
          'site-specific',
          0.8
        )
        
        // Add unique results
        for (const result of results) {
          if (!seenUrls.has(result.link)) {
            seenUrls.add(result.link)
            allResults.push({
              ...result,
              searchType: 'site-specific' as const,
              relevanceScore: 0.8
            })
          }
        }
        
        // Add delay between site searches
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } else {
      // Strategy 3: Specific site search if provided
      const siteQuery = `${query} site:${site}${dateFilter}`
      console.log(`Performing specific site search for ${site}:`, siteQuery)
      
      const results = await performGoogleSearch(
        siteQuery,
        apiKey,
        searchEngineId,
        config,
        'site-specific',
        0.9
      )
      
      // Add unique results
      for (const result of results) {
        if (!seenUrls.has(result.link)) {
          seenUrls.add(result.link)
          allResults.push({
            ...result,
            searchType: 'site-specific' as const,
            relevanceScore: 0.9
          })
        }
      }
    }

    // Strategy 4: Content-specific searches
    const contentQueries = [
      `${query} filetype:pdf${dateFilter}`,
      `${query} filetype:doc OR filetype:docx${dateFilter}`,
      `${query} inurl:article OR inurl:post OR inurl:blog${dateFilter}`,
      `${query} inurl:research OR inurl:study OR inurl:analysis${dateFilter}`,
      `${query} inurl:documentation OR inurl:docs OR inurl:guide${dateFilter}`
    ]
    
    for (let i = 0; i < contentQueries.length; i++) {
      const contentQuery = contentQueries[i]
      console.log(`Performing content-specific search ${i + 1}/${contentQueries.length}:`, contentQuery)
      
      const results = await performGoogleSearch(
        contentQuery,
        apiKey,
        searchEngineId,
        config,
        'content-specific',
        0.7 - (i * 0.1) // Decreasing weight for each content type
      )
      
      // Add unique results
      for (const result of results) {
        if (!seenUrls.has(result.link)) {
          seenUrls.add(result.link)
          allResults.push({
            ...result,
            searchType: 'content-specific' as const,
            relevanceScore: 0.7 - (i * 0.1)
          })
        }
      }
      
      // Add delay between content searches
      if (i < contentQueries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 250))
      }
    }

    // Sort results by relevance score and remove duplicates
    const sortedResults = allResults
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .filter((result, index, self) => 
        index === self.findIndex(r => r.link === result.link)
      )

    console.log(`Enhanced search completed. Found ${sortedResults.length} unique results.`)
    return sortedResults

  } catch (error) {
    console.error('Error in enhanced search:', error)
    return []
  }
}

async function performGoogleSearch(
  searchQuery: string,
  apiKey: string,
  searchEngineId: string,
  config: any,
  searchType: string,
  weight: number
): Promise<any[]> {
  try {
    // Calculate start index for pagination
    const startIndex = 1 // Start from first result for each strategy
    
    // Make request to Google Custom Search API
    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1')
    searchUrl.searchParams.set('key', apiKey)
    searchUrl.searchParams.set('cx', searchEngineId)
    searchUrl.searchParams.set('q', searchQuery)
    searchUrl.searchParams.set('num', Math.min(10, config.search.maxResults).toString()) // Limit results per strategy
    searchUrl.searchParams.set('start', startIndex.toString())
    searchUrl.searchParams.set('fields', 'items(title,link,snippet,displayLink,formattedUrl,htmlSnippet,pagemap),searchInformation')

    console.log(`Google API request for ${searchType}:`, searchUrl.toString().replace(apiKey, '[API_KEY]'))

    const response = await fetch(searchUrl.toString())
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Google API error for ${searchType}:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      return []
    }

    const data: GoogleSearchResponse = await response.json()

    // Check for Google API errors
    if (data.error) {
      console.error(`Google API returned error for ${searchType}:`, data.error)
      return []
    }

    console.log(`${searchType} search results:`, {
      totalResults: data.searchInformation?.totalResults,
      searchTime: data.searchInformation?.searchTime,
      itemsCount: data.items?.length || 0
    })

    return data.items || []

  } catch (error) {
    console.error(`Error in ${searchType} search:`, error)
    return []
  }
}

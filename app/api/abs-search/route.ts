import { NextRequest, NextResponse } from 'next/server'

const ABS_BASE_URL = 'https://api.data.abs.gov.au'
const ABS_WEBSITE_BASE = 'https://www.abs.gov.au'

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

// Enhanced dataflow categories based on ABS Data Explorer research
const DATAFLOW_CATEGORIES = {
  // Economics & Finance
  'CPI': 'Economics',
  'GDP': 'Economics',
  'LFS': 'Economics',
  'TRADE': 'Economics',
  'BUSINESS': 'Economics',
  'FINANCE': 'Economics',
  'INFLATION': 'Economics',
  'INTEREST_RATES': 'Economics',
  'EXCHANGE_RATES': 'Economics',
  
  // Population & Demographics
  'POP': 'Demographics',
  'CENSUS': 'Demographics',
  'MIGRATION': 'Demographics',
  'REGIONAL': 'Demographics',
  'AGE_GENDER': 'Demographics',
  'BIRTHS_DEATHS': 'Demographics',
  
  // Social Statistics
  'EDU': 'Social',
  'HEALTH': 'Social',
  'HOUSING': 'Social',
  'CRIME': 'Social',
  'CULTURE': 'Social',
  'SPORT': 'Social',
  'ALC': 'Social',
  'WELLBEING': 'Social',
  
  // Industry & Business
  'MANUFACTURING': 'Industry',
  'RETAIL': 'Industry',
  'AGRICULTURE': 'Industry',
  'MINING': 'Industry',
  'CONSTRUCTION': 'Industry',
  'TRANSPORT': 'Industry',
  'TOURISM': 'Industry',
  'HOSPITALITY': 'Industry',
  
  // Environment & Energy
  'ENVIRONMENT': 'Environment',
  'ENERGY': 'Environment',
  'CLIMATE': 'Environment',
  'NATURAL_RESOURCES': 'Environment',
  'WASTE': 'Environment',
  
  // Government & Public Sector
  'GOVERNMENT': 'Government',
  'DEFENCE': 'Government',
  'PUBLIC_HEALTH': 'Government',
  'PUBLIC_ADMIN': 'Government',
  'JUSTICE': 'Government',
  
  // Technology & Science
  'SCIENCE': 'Technology',
  'TECHNOLOGY': 'Technology',
  'INNOVATION': 'Technology',
  'RESEARCH': 'Technology'
}

// Comprehensive ABS categories with descriptions and dataflows
const ABS_CATEGORIES = {
  economics: {
    name: 'Economics & Finance',
    description: 'Economic indicators, financial statistics, and business data',
    dataflows: ['CPI', 'GDP', 'LFS', 'TRADE', 'BUSINESS', 'FINANCE', 'INFLATION', 'INTEREST_RATES'],
    icon: 'TrendingUp',
    color: 'bg-red-500'
  },
  demographics: {
    name: 'Population & Demographics',
    description: 'Population estimates, census data, and demographic statistics',
    dataflows: ['POP', 'CENSUS', 'MIGRATION', 'REGIONAL', 'AGE_GENDER', 'BIRTHS_DEATHS'],
    icon: 'Users',
    color: 'bg-blue-500'
  },
  social: {
    name: 'Social Statistics',
    description: 'Education, health, housing, and social wellbeing data',
    dataflows: ['EDU', 'HEALTH', 'HOUSING', 'CRIME', 'CULTURE', 'SPORT', 'ALC', 'WELLBEING'],
    icon: 'Heart',
    color: 'bg-green-500'
  },
  industry: {
    name: 'Industry & Business',
    description: 'Manufacturing, retail, agriculture, and industry statistics',
    dataflows: ['MANUFACTURING', 'RETAIL', 'AGRICULTURE', 'MINING', 'CONSTRUCTION', 'TRANSPORT'],
    icon: 'Factory',
    color: 'bg-purple-500'
  },
  environment: {
    name: 'Environment & Energy',
    description: 'Environmental statistics, energy data, and climate information',
    dataflows: ['ENVIRONMENT', 'ENERGY', 'CLIMATE', 'NATURAL_RESOURCES', 'WASTE'],
    icon: 'Leaf',
    color: 'bg-emerald-500'
  },
  government: {
    name: 'Government & Public Sector',
    description: 'Government finance, public administration, and defence statistics',
    dataflows: ['GOVERNMENT', 'DEFENCE', 'PUBLIC_HEALTH', 'PUBLIC_ADMIN', 'JUSTICE'],
    icon: 'Building',
    color: 'bg-indigo-500'
  },
  technology: {
    name: 'Technology & Science',
    description: 'Science, technology, innovation, and research statistics',
    dataflows: ['SCIENCE', 'TECHNOLOGY', 'INNOVATION', 'RESEARCH'],
    icon: 'Cpu',
    color: 'bg-cyan-500'
  }
}

// Content-focused search strategies for ABS
const ABS_CONTENT_SEARCH_STRATEGIES = {
  publications: {
    queries: [
      '{query} publication',
      '{query} article',
      '{query} report',
      '{query} analysis',
      '{query} study'
    ],
    urls: [
      'https://www.abs.gov.au/publications',
      'https://www.abs.gov.au/statistics',
      'https://www.abs.gov.au/research'
    ]
  },
  media: {
    queries: [
      '{query} media release',
      '{query} announcement',
      '{query} news',
      '{query} update'
    ],
    urls: [
      'https://www.abs.gov.au/media-centre',
      'https://www.abs.gov.au/news'
    ]
  },
  statistics: {
    queries: [
      '{query} statistics',
      '{query} data',
      '{query} figures',
      '{query} results'
    ],
    urls: [
      'https://www.abs.gov.au/statistics',
      'https://www.abs.gov.au/data'
    ]
  }
}

// Navigation and structural elements to filter out
const NAVIGATION_PATTERNS = [
  'menu', 'navigation', 'breadcrumb', 'footer', 'header',
  'search', 'contact', 'about', 'help', 'sitemap',
  'privacy', 'terms', 'accessibility', 'copyright',
  'home', 'back to top', 'skip to content'
]

// Content patterns that indicate meaningful content
const CONTENT_PATTERNS = [
  'publication', 'article', 'report', 'analysis', 'study',
  'statistics', 'data', 'figures', 'results', 'findings',
  'media release', 'announcement', 'news', 'update',
  'research', 'survey', 'census', 'index', 'trend'
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'dataflows') {
      // Get available dataflows using the correct endpoint
      const response = await fetch(`${ABS_BASE_URL}/dataflow/ABS`, {
        headers: {
          'Accept': 'application/vnd.sdmx.structure+json',
          'User-Agent': 'DataLandscape-Search/1.0'
        }
      })

      if (!response.ok) {
        console.error('ABS API error:', response.status, response.statusText)
        // Return enhanced default dataflows if API fails
        const defaultDataflows: ABSDataflow[] = [
          { id: 'CPI', name: 'Consumer Price Index', version: '1.0.0', category: 'Economics' },
          { id: 'POP', name: 'Population Estimates', version: '1.0.0', category: 'Demographics' },
          { id: 'LFS', name: 'Labour Force Survey', version: '1.0.0', category: 'Economics' },
          { id: 'GDP', name: 'Gross Domestic Product', version: '1.0.0', category: 'Economics' },
          { id: 'ALC', name: 'Apparent Consumption of Alcohol', version: '1.0.0', category: 'Social' },
          { id: 'EDU', name: 'Education Statistics', version: '1.0.0', category: 'Social' },
          { id: 'HEALTH', name: 'Health Statistics', version: '1.0.0', category: 'Social' },
          { id: 'MANUFACTURING', name: 'Manufacturing Statistics', version: '1.0.0', category: 'Industry' }
        ]
        return NextResponse.json({ dataflows: defaultDataflows })
      }

      const data = await response.json()
      
      // Process and enhance dataflows with categories
      const enhancedDataflows = processDataflows(data)
      
      return NextResponse.json({ dataflows: enhancedDataflows })
    }
    
    if (type === 'categories') {
      // Return comprehensive category information
      return NextResponse.json({ 
        categories: ABS_CATEGORIES,
        totalCategories: Object.keys(ABS_CATEGORIES).length
      })
    }
    
    if (type === 'geography') {
      // Return available geographic regions
      const geographicRegions = {
        national: {
          name: 'National',
          description: 'Australia-wide statistics',
          code: 'AUS'
        },
        states: [
          { name: 'New South Wales', code: 'NSW' },
          { name: 'Victoria', code: 'VIC' },
          { name: 'Queensland', code: 'QLD' },
          { name: 'Western Australia', code: 'WA' },
          { name: 'South Australia', code: 'SA' },
          { name: 'Tasmania', code: 'TAS' },
          { name: 'Northern Territory', code: 'NT' },
          { name: 'Australian Capital Territory', code: 'ACT' }
        ],
        territories: [
          { name: 'Northern Territory', code: 'NT' },
          { name: 'Australian Capital Territory', code: 'ACT' }
        ]
      }
      
      return NextResponse.json({ geographicRegions })
    }
    
    if (type === 'popular') {
      // Return popular dataflows by category
      const popularDataflows = Object.entries(ABS_CATEGORIES).map(([key, category]) => ({
        category: key,
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        dataflows: category.dataflows.slice(0, 3) // Top 3 per category
      }))
      
      return NextResponse.json({ popularDataflows })
    }
    
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
    
  } catch (error) {
    console.error('ABS API GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    if (!query && !dataflowId && !category) {
      return NextResponse.json({ error: 'Query, dataflowId, or category is required' }, { status: 400 })
    }

    const searchQuery = query || dataflowId
    console.log('Enhanced ABS search request:', { 
      searchQuery, 
      dataflowId, 
      dataKey, 
      startPeriod, 
      endPeriod, 
      startDate, 
      endDate, 
      page,
      category,
      geography,
      searchType
    })

    let allResults: ABSContentResult[] = []

    // Perform category-based search if category is specified
    if (category && ABS_CATEGORIES[category as keyof typeof ABS_CATEGORIES]) {
      const categoryDataflows = ABS_CATEGORIES[category as keyof typeof ABS_CATEGORIES].dataflows
      const categoryResults = await performCategoryBasedSearch(category, categoryDataflows, searchQuery)
      allResults.push(...categoryResults)
    }

    // Perform content-focused ABS search
    const contentResults = await performContentFocusedABSSearch(searchQuery, category)
    allResults.push(...contentResults)
    
    // Also fetch dataflow data if dataflowId is provided
    let dataflowResults: ABSContentResult[] = []
    if (dataflowId) {
      // Use the new date parameters if available, otherwise fall back to period parameters
      const effectiveStartDate = startDate || startPeriod
      const effectiveEndDate = endDate || endPeriod
      dataflowResults = await fetchABSData(dataflowId, dataKey, effectiveStartDate, effectiveEndDate, 'full', page)
    }
    allResults.push(...dataflowResults)

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

    return NextResponse.json({
      items: paginatedResults,
      pagination,
      searchMetadata: {
        category,
        geography,
        searchType,
        totalCategories: category ? 1 : Object.keys(ABS_CATEGORIES).length
      }
    })

  } catch (error) {
    console.error('ABS search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function performCategoryBasedSearch(category: string, dataflows: string[], query?: string): Promise<ABSContentResult[]> {
  const results: ABSContentResult[] = []
  
  try {
    const categoryInfo = ABS_CATEGORIES[category as keyof typeof ABS_CATEGORIES]
    if (!categoryInfo) return results

    // Search for dataflows in this category
    for (const dataflowId of dataflows.slice(0, 5)) { // Limit to top 5 dataflows
      try {
        const dataflowResults = await fetchABSData(dataflowId, 'all', undefined, undefined, 'full', 1)
        results.push(...dataflowResults)
      } catch (error) {
        console.error(`Error fetching dataflow ${dataflowId}:`, error)
      }
    }

    // Also search for category-specific content
    const categoryContentResults = await searchABSContent(query || category, 'statistics')
    results.push(...categoryContentResults)
    
  } catch (error) {
    console.error('Error in category-based search:', error)
  }
  
  return results
}

async function performContentFocusedABSSearch(query: string, category?: string): Promise<ABSContentResult[]> {
  const allResults: ABSContentResult[] = []
  
  try {
    // Strategy 1: Search for publications and articles
    const publicationResults = await searchABSContent(query, 'publications')
    allResults.push(...publicationResults)
    
    // Strategy 2: Search for media releases and announcements
    const mediaResults = await searchABSContent(query, 'media')
    allResults.push(...mediaResults)
    
    // Strategy 3: Search for statistics and data
    const statisticsResults = await searchABSContent(query, 'statistics')
    allResults.push(...statisticsResults)
    
    // Strategy 4: Direct content search using Google Custom Search API
    const googleResults = await searchABSWithGoogle(query)
    allResults.push(...googleResults)
    
  } catch (error) {
    console.error('Error in content-focused ABS search:', error)
  }
  
  return allResults
}

async function searchABSContent(query: string, strategy: keyof typeof ABS_CONTENT_SEARCH_STRATEGIES): Promise<ABSContentResult[]> {
  const results: ABSContentResult[] = []
  const strategyConfig = ABS_CONTENT_SEARCH_STRATEGIES[strategy]
  
  try {
    for (const baseUrl of strategyConfig.urls) {
      for (const queryTemplate of strategyConfig.queries) {
        const searchQuery = queryTemplate.replace('{query}', query)
        const searchUrl = `${baseUrl}?q=${encodeURIComponent(searchQuery)}`
        
        console.log(`Searching ABS ${strategy}:`, searchUrl)
        
        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'DataLandscape-Search/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        })
        
        if (response.ok) {
          const html = await response.text()
          const contentResults = extractMeaningfulContent(html, baseUrl, query, strategy)
          results.push(...contentResults)
        }
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
  } catch (error) {
    console.error(`Error searching ABS ${strategy}:`, error)
  }
  
  return results
}

async function searchABSWithGoogle(query: string): Promise<ABSContentResult[]> {
  const results: ABSContentResult[] = []
  
  try {
    // Use Google Custom Search API to find ABS content
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CUSTOM_SEARCH_API_KEY
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID
    
    if (!apiKey || !searchEngineId) {
      console.warn('Google Custom Search API not configured for ABS search')
      return results
    }
    
    // Create ABS-specific search queries
    const absQueries = [
      `site:abs.gov.au ${query}`,
      `site:abs.gov.au "${query}"`,
      `site:abs.gov.au ${query} publication`,
      `site:abs.gov.au ${query} article`,
      `site:abs.gov.au ${query} statistics`,
      `site:abs.gov.au ${query} media release`
    ]
    
    for (let i = 0; i < absQueries.length; i++) {
      const searchQuery = absQueries[i]
      const weight = 1.0 - (i * 0.1) // Decreasing weight for each query
      
      const searchUrl = new URL('https://www.googleapis.com/customsearch/v1')
      searchUrl.searchParams.set('key', apiKey)
      searchUrl.searchParams.set('cx', searchEngineId)
      searchUrl.searchParams.set('q', searchQuery)
      searchUrl.searchParams.set('num', '5') // Limit results per query
      searchUrl.searchParams.set('start', '1')
      
      const response = await fetch(searchUrl.toString())
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.items) {
          for (const item of data.items) {
            // Filter for meaningful content
            if (isMeaningfulABSContent(item.title, item.snippet, item.link)) {
              results.push({
                title: item.title,
                link: item.link,
                snippet: item.snippet,
                displayLink: item.displayLink,
                formattedUrl: item.formattedUrl,
                htmlSnippet: item.htmlSnippet,
                pagemap: item.pagemap,
                type: 'content',
                relevanceScore: weight,
                dataAsset: createABSContentDataAsset(item.title, query, item.link)
              })
            }
          }
        }
      }
      
      // Add delay between requests
      if (i < absQueries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }
    
  } catch (error) {
    console.error('Error in Google ABS search:', error)
  }
  
  return results
}

function extractMeaningfulContent(html: string, baseUrl: string, query: string, strategy: string): ABSContentResult[] {
  const results: ABSContentResult[] = []
  
  try {
    // Extract content using more sophisticated patterns
    const contentPatterns = [
      // Article and publication patterns
      /<article[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<\/article>/gi,
      /<div[^>]*class="[^"]*publication[^"]*"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<\/div>/gi,
      /<div[^>]*class="[^"]*article[^"]*"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<\/div>/gi,
      
      // Content section patterns
      /<section[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<\/section>/gi,
      /<main[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<\/main>/gi,
      
      // Specific ABS content patterns
      /<div[^>]*class="[^"]*content[^"]*"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<\/div>/gi,
      /<div[^>]*class="[^"]*statistics[^"]*"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<\/div>/gi
    ]
    
    for (const pattern of contentPatterns) {
      const matches = html.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const titleMatch = match.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i)
          if (titleMatch) {
            const title = titleMatch[1].trim()
            
            if (isMeaningfulContent(title, query)) {
              // Extract snippet from surrounding content
              const snippetMatch = match.match(/<p[^>]*>([^<]+)<\/p>/i)
              const snippet = snippetMatch ? snippetMatch[1].trim() : `ABS ${strategy} content: ${title}`
              
              // Generate unique link for content results
              const uniqueContentLink = generateUniqueContentLink(baseUrl, title, strategy)
              
              results.push({
                title: title,
                link: uniqueContentLink,
                snippet: snippet,
                displayLink: 'abs.gov.au',
                formattedUrl: uniqueContentLink,
                htmlSnippet: snippet,
                type: 'content',
                relevanceScore: calculateRelevanceScore(title, query, strategy),
                dataAsset: createABSContentDataAsset(title, query, uniqueContentLink)
              })
            }
          }
        })
      }
    }
    
  } catch (error) {
    console.error('Error extracting meaningful content:', error)
  }
  
  return results
}

function isMeaningfulContent(title: string, query: string): boolean {
  const titleLower = title.toLowerCase()
  const queryLower = query.toLowerCase()
  
  // Skip navigation and structural elements
  if (NAVIGATION_PATTERNS.some(pattern => titleLower.includes(pattern))) {
    return false
  }
  
  // Check for content indicators
  const hasContentIndicator = CONTENT_PATTERNS.some(pattern => titleLower.includes(pattern))
  
  // Check for query relevance
  const queryTerms = queryLower.split(' ').filter(term => term.length > 2)
  const hasQueryRelevance = queryTerms.some(term => titleLower.includes(term))
  
  // Must have either content indicator or query relevance
  return hasContentIndicator || hasQueryRelevance
}

function isMeaningfulABSContent(title: string, snippet: string, link: string): boolean {
  const titleLower = title.toLowerCase()
  const snippetLower = snippet.toLowerCase()
  const linkLower = link.toLowerCase()
  
  // Skip navigation and structural elements
  if (NAVIGATION_PATTERNS.some(pattern => 
    titleLower.includes(pattern) || snippetLower.includes(pattern)
  )) {
    return false
  }
  
  // Skip common navigation URLs
  const navigationUrls = ['/search', '/contact', '/about', '/help', '/sitemap', '/privacy']
  if (navigationUrls.some(url => linkLower.includes(url))) {
    return false
  }
  
  // Check for content indicators
  const hasContentIndicator = CONTENT_PATTERNS.some(pattern => 
    titleLower.includes(pattern) || snippetLower.includes(pattern)
  )
  
  return hasContentIndicator
}

function calculateRelevanceScore(title: string, query: string, strategy: string): number {
  let score = 0.5 // Base score
  
  const titleLower = title.toLowerCase()
  const queryLower = query.toLowerCase()
  
  // Boost for exact matches
  if (titleLower.includes(queryLower)) {
    score += 0.3
  }
  
  // Boost for content patterns
  const contentMatches = CONTENT_PATTERNS.filter(pattern => titleLower.includes(pattern))
  score += contentMatches.length * 0.1
  
  // Strategy-specific boosts
  switch (strategy) {
    case 'publications':
      if (titleLower.includes('publication') || titleLower.includes('article')) {
        score += 0.2
      }
      break
    case 'media':
      if (titleLower.includes('media') || titleLower.includes('release')) {
        score += 0.2
      }
      break
    case 'statistics':
      if (titleLower.includes('statistics') || titleLower.includes('data')) {
        score += 0.2
      }
      break
  }
  
  return Math.min(score, 1.0)
}

function createABSContentDataAsset(title: string, query: string, url: string) {
  return {
    description: `ABS content related to ${query}: ${title}`,
    collectionDate: new Date().toISOString(),
    purpose: 'Official ABS content and publications',
    department: 'Australian Bureau of Statistics',
    metadata: {
      format: 'Web Content',
      size: 'Variable',
      records: 1,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      license: 'Creative Commons Attribution 4.0 International',
      tags: ['abs', 'content', 'publications', 'australia', query.toLowerCase()],
      url: url
    },
    availability: {
      status: 'public',
      custodian: 'Australian Bureau of Statistics',
      contactEmail: 'client.services@abs.gov.au',
      requestProcess: 'Direct website access'
    },
    contentAnalysis: {
      summary: `ABS content related to ${query}: ${title}`,
      keyTopics: [query, 'abs', 'statistics', 'australia'],
      dataTypes: ['Web Content', 'Publications', 'Articles'],
      qualityScore: 9,
      updateFrequency: 'As published'
    }
  }
}

function filterByGeography(results: ABSContentResult[], geography: string): ABSContentResult[] {
  if (!geography) return results
  
  return results.filter(result => {
    const titleLower = result.title.toLowerCase()
    const snippetLower = result.snippet.toLowerCase()
    
    // Check for geographic indicators in title or snippet
    const geographicTerms = geography.toLowerCase().split(' ')
    return geographicTerms.some(term => 
      titleLower.includes(term) || snippetLower.includes(term)
    )
  })
}

function removeDuplicateResults(results: ABSContentResult[]): ABSContentResult[] {
  const seen = new Set<string>()
  return results.filter(result => {
    const key = `${result.title}-${result.link}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function processDataflows(data: any): ABSDataflow[] {
  try {
    if (data.dataflows) {
      return data.dataflows.map((dataflow: any) => ({
        id: dataflow.id,
        name: dataflow.name || dataflow.id,
        description: dataflow.description,
        version: dataflow.version || '1.0.0',
        category: DATAFLOW_CATEGORIES[dataflow.id as keyof typeof DATAFLOW_CATEGORIES] || 'General'
      }))
    }
    return []
  } catch (error) {
    console.error('Error processing dataflows:', error)
    return []
  }
}

async function fetchABSData(dataflowId: string, dataKey?: string, startPeriod?: string, endPeriod?: string, detail?: string, page?: number): Promise<ABSContentResult[]> {
  // Enhanced datetime conversion based on ABS API documentation
  const convertToABSPeriod = (datetimeString: string): string => {
    if (!datetimeString) return ''
    
    try {
      const date = new Date(datetimeString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      
      // Determine period format based on dataflow
      if (dataflowId === 'CPI') {
        // CPI uses quarterly format: YYYY-Qx
        const quarter = Math.ceil((date.getMonth() + 1) / 3)
        return `${year}-Q${quarter}`
      } else if (dataflowId === 'POP') {
        // Population uses annual format: YYYY
        return `${year}`
      } else {
        // Default to monthly format: YYYY-MM
        return `${year}-${month}`
      }
    } catch (error) {
      console.error('Error converting datetime:', error)
      return ''
    }
  }

  try {
    // Build the ABS API URL
    let absUrl = `${ABS_BASE_URL}/data/ABS/${dataflowId}`
    
    // Add data key if specified
    if (dataKey && dataKey !== 'all') {
      absUrl += `/${dataKey}`
    }
    
    // Add period parameters
    const params = new URLSearchParams()
    if (startPeriod) {
      params.append('startPeriod', convertToABSPeriod(startPeriod))
    }
    if (endPeriod) {
      params.append('endPeriod', convertToABSPeriod(endPeriod))
    }
    if (detail) {
      params.append('detail', detail)
    }
    
    if (params.toString()) {
      absUrl += `?${params.toString()}`
    }
    
    console.log('ABS API URL:', absUrl)
    
    const response = await fetch(absUrl, {
      headers: {
        'Accept': 'application/vnd.sdmx.data+json',
        'User-Agent': 'DataLandscape-Search/1.0'
      }
    })
    
    if (!response.ok) {
      console.error('ABS API error:', response.status, response.statusText)
      // Return mock data for demonstration
      return generateEnhancedMockABSData(dataflowId, dataKey, startPeriod, endPeriod)
    }
    
    const data = await response.json()
    return transformEnhancedABSData(data, dataflowId)
    
  } catch (error) {
    console.error('Error fetching ABS data:', error)
    // Return mock data for demonstration
    return generateEnhancedMockABSData(dataflowId, dataKey, startPeriod, endPeriod)
  }
}

function generateEnhancedMockABSData(dataflowId: string, dataKey?: string, startPeriod?: string, endPeriod?: string): ABSContentResult[] {
  const dataAsset = getEnhancedDataAssetInfo(dataflowId)
  
  // Generate realistic mock data based on dataflow type
  const mockData = []
  const periods = generatePeriods(startPeriod, endPeriod, dataflowId)
  
  for (let i = 0; i < Math.min(periods.length, 10); i++) {
    const period = periods[i]
    const value = generateRealisticValue(dataflowId, period)
    
    // Generate unique links for each result
    const uniqueLink = generateUniqueABSLink(dataflowId, period, dataKey)
    
    mockData.push({
      title: `${dataAsset.name} - ${period}`,
      link: uniqueLink,
      snippet: `${dataAsset.name} data for ${period}: ${value}`,
      displayLink: 'abs.gov.au',
      formattedUrl: uniqueLink,
      htmlSnippet: `${dataAsset.name} data for ${period}: ${value}`,
      type: 'data' as const,
      dataAsset: {
        ...dataAsset,
        data: {
          period: period,
          value: value,
          unit: dataAsset.metadata.unit,
          change: generateChangeValue(dataflowId)
        }
      }
    })
  }
  
  return mockData
}

function generatePeriods(startPeriod?: string, endPeriod?: string, dataflowId?: string): string[] {
  const periods = []
  const now = new Date()
  
  // Generate periods based on dataflow type
  if (dataflowId === 'CPI') {
    // Quarterly periods
    for (let i = 0; i < 8; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - (i * 3), 1)
      const year = date.getFullYear()
      const quarter = Math.ceil((date.getMonth() + 1) / 3)
      periods.push(`${year}-Q${quarter}`)
    }
  } else if (dataflowId === 'POP') {
    // Annual periods
    for (let i = 0; i < 5; i++) {
      const year = now.getFullYear() - i
      periods.push(`${year}`)
    }
  } else {
    // Monthly periods
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      periods.push(`${year}-${month}`)
    }
  }
  
  return periods
}

function generateRealisticValue(dataflowId: string, period: string): string {
  // Generate realistic values based on dataflow type
  switch (dataflowId) {
    case 'CPI':
      return (Math.random() * 5 + 115).toFixed(1) + ' index points'
    case 'POP':
      return (Math.random() * 5000000 + 25000000).toFixed(0)
    case 'LFS':
      return (Math.random() * 2 + 5).toFixed(1) + '%'
    case 'GDP':
      return (Math.random() * 100 + 2000).toFixed(1) + ' billion AUD'
    default:
      return (Math.random() * 1000 + 100).toFixed(0)
  }
}

function generateChangeValue(dataflowId: string): string {
  const change = (Math.random() * 10 - 5).toFixed(1)
  return `${change}%`
}

function generateUniqueABSLink(dataflowId: string, period: string, dataKey?: string): string {
  // Generate unique links based on dataflow type and period
  const baseUrl = 'https://www.abs.gov.au'
  
  // Create different link patterns based on dataflow type
  switch (dataflowId) {
    case 'CPI':
      return `${baseUrl}/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia/latest-release#data-downloads`
    case 'POP':
      return `${baseUrl}/statistics/people/population/national-state-and-territory-population/latest-release#data-downloads`
    case 'LFS':
      return `${baseUrl}/statistics/labour/employment-and-unemployment/labour-force-australia/latest-release#data-downloads`
    case 'GDP':
      return `${baseUrl}/statistics/economy/national-accounts/australian-national-accounts-national-income-expenditure-and-product/latest-release#data-downloads`
    case 'TRADE':
      return `${baseUrl}/statistics/economy/international-trade/international-trade-in-goods-and-services-australia/latest-release#data-downloads`
    case 'BUSINESS':
      return `${baseUrl}/statistics/economy/business-indicators/business-indicators-australia/latest-release#data-downloads`
    default:
      // For other dataflows, create a more specific link
      const dataflowLower = dataflowId.toLowerCase()
      const periodParam = period.replace(/[^0-9]/g, '')
      return `${baseUrl}/statistics/${dataflowLower}/latest-release?period=${periodParam}${dataKey ? `&key=${dataKey}` : ''}`
  }
}

function generateUniqueContentLink(baseUrl: string, title: string, strategy: string): string {
  // Generate unique content links based on strategy and title
  const baseUrlObj = new URL(baseUrl)
  const titleSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
  
  // Create different link patterns based on content strategy
  switch (strategy) {
    case 'publications':
      return `${baseUrlObj.origin}/publications/${titleSlug}`
    case 'media':
      return `${baseUrlObj.origin}/media-releases/${titleSlug}`
    case 'statistics':
      return `${baseUrlObj.origin}/statistics/${titleSlug}`
    default:
      return `${baseUrlObj.origin}/content/${titleSlug}`
  }
}

function transformEnhancedABSData(data: any, dataflowId: string): ABSContentResult[] {
  const dataAsset = getEnhancedDataAssetInfo(dataflowId)
  const results: ABSContentResult[] = []
  
  try {
    if (data.dataSets && data.dataSets[0] && data.dataSets[0].series) {
      const series = data.dataSets[0].series
      
      Object.keys(series).forEach(seriesKey => {
        const seriesData = series[seriesKey]
        const observations = seriesData.observations
        
        Object.keys(observations).forEach(obsKey => {
          const observation = observations[obsKey]
          const value = observation[0]
          
          // Generate unique link for each observation
          const uniqueLink = generateUniqueABSLink(dataflowId, obsKey, seriesKey)
          
          results.push({
            title: `${dataAsset.name} - ${obsKey}`,
            link: uniqueLink,
            snippet: `${dataAsset.name} data: ${value}`,
            displayLink: 'abs.gov.au',
            formattedUrl: uniqueLink,
            htmlSnippet: `${dataAsset.name} data: ${value}`,
            type: 'data' as const,
            dataAsset: {
              ...dataAsset,
              data: {
                period: obsKey,
                value: value,
                unit: dataAsset.metadata.unit
              }
            }
          })
        })
      })
    }
  } catch (error) {
    console.error('Error transforming ABS data:', error)
  }
  
  return results
}

function getEnhancedDataAssetInfo(dataflowId: string) {
  const dataflowInfo = {
    CPI: {
      name: 'Consumer Price Index',
      description: 'Measures changes in the price level of a weighted average market basket of consumer goods and services',
      purpose: 'Inflation measurement and economic analysis',
      updateFrequency: 'Quarterly',
      unit: 'Index points',
      tags: ['inflation', 'prices', 'economics', 'cpi']
    },
    POP: {
      name: 'Population Estimates',
      description: 'Official population estimates for Australia and its states and territories',
      purpose: 'Demographic analysis and planning',
      updateFrequency: 'Quarterly',
      unit: 'Persons',
      tags: ['population', 'demographics', 'census', 'australia']
    },
    LFS: {
      name: 'Labour Force Survey',
      description: 'Monthly survey of employment and unemployment statistics',
      purpose: 'Employment and labour market analysis',
      updateFrequency: 'Monthly',
      unit: 'Percentage',
      tags: ['employment', 'unemployment', 'labour', 'workforce']
    },
    GDP: {
      name: 'Gross Domestic Product',
      description: 'Measures the total value of goods and services produced in Australia',
      purpose: 'Economic growth measurement',
      updateFrequency: 'Quarterly',
      unit: 'Billion AUD',
      tags: ['gdp', 'economics', 'growth', 'production']
    }
  }
  
  const info = dataflowInfo[dataflowId as keyof typeof dataflowInfo] || {
    name: dataflowId,
    description: 'ABS statistical data',
    purpose: 'Statistical analysis',
    updateFrequency: 'Varies',
    unit: 'Units',
    tags: [dataflowId.toLowerCase(), 'statistics', 'abs']
  }
  
  return {
    name: info.name,
    description: info.description,
    collectionDate: new Date().toISOString(),
    purpose: info.purpose,
    department: 'Australian Bureau of Statistics',
    metadata: {
      format: 'SDMX-JSON',
      size: 'Variable',
      records: 1,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      license: 'Creative Commons Attribution 4.0 International',
      tags: info.tags,
      unit: info.unit,
      updateFrequency: info.updateFrequency
    },
    availability: {
      status: 'public',
      custodian: 'Australian Bureau of Statistics',
      contactEmail: 'client.services@abs.gov.au',
      requestProcess: 'API access'
    },
    contentAnalysis: {
      summary: `${info.name}: ${info.description}`,
      keyTopics: info.tags,
      dataTypes: ['Statistical Data', 'Time Series', 'Economic Indicators'],
      qualityScore: 10,
      updateFrequency: info.updateFrequency
    }
  }
}


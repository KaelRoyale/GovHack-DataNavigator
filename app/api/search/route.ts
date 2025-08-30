import { NextRequest, NextResponse } from 'next/server'

interface SearchRequest {
  query: string
  page?: string
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

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query, page = 1 } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate page parameter
    const pageNumber = Math.max(1, parseInt(page.toString()) || 1)
    const resultsPerPage = 10
    const startIndex = (pageNumber - 1) * resultsPerPage + 1

    // Get API credentials from environment variables
    const apiKey = "AIzaSyDNHmd-jxVw3j7PS8UlY8LNwrX2RA0zR10"
    const searchEngineId = "379b338ec78574283"

    if (!apiKey || !searchEngineId) {
      console.error('Missing Google Custom Search API credentials')
      return NextResponse.json(
        { error: 'Search service is not configured' },
        { status: 500 }
      )
    }

    // Import configuration
    const { config } = await import('@/lib/config')

    // Build the search query with site restrictions
    const siteQuery = config.search.supportedSites.join(' OR ')
    const fullQuery = `${query}`

    console.log('Search query:', fullQuery)
    console.log('Page:', pageNumber, 'Start index:', startIndex)
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...')
    console.log('Search Engine ID:', searchEngineId)

    // Make request to Google Custom Search API
    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1')
    searchUrl.searchParams.set('key', apiKey)
    searchUrl.searchParams.set('cx', searchEngineId)
    searchUrl.searchParams.set('q', fullQuery)
    searchUrl.searchParams.set('num', resultsPerPage.toString())
    searchUrl.searchParams.set('start', startIndex.toString())

    searchUrl.searchParams.set('fields', 'items(title,link,snippet,displayLink,formattedUrl,htmlSnippet,pagemap),searchInformation')

    console.log('Request URL (without key):', searchUrl.toString().replace(apiKey, '[API_KEY]'))

    const response = await fetch(searchUrl.toString())
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })

      let errorMessage = 'Search service temporarily unavailable'
      
      if (response.status === 400) {
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            const googleError = errorData.error
            console.error('Google API error details:', googleError)
            
            // Provide specific error messages based on Google API error codes
            switch (googleError.code) {
              case 400:
                errorMessage = 'Invalid request. Please check your search query and API configuration.'
                break
              case 403:
                errorMessage = 'API key is invalid or quota exceeded. Please check your Google Custom Search API key and quota.'
                break
              case 429:
                errorMessage = 'API quota exceeded. Please try again later or upgrade your quota.'
                break
              default:
                errorMessage = `Google API error: ${googleError.message || 'Unknown error'}`
            }
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data: GoogleSearchResponse = await response.json()

    // Check for Google API errors in successful response
    if (data.error) {
      console.error('Google API returned error in response:', data.error)
      return NextResponse.json(
        { error: `Google API error: ${data.error.message}` },
        { status: 500 }
      )
    }

    console.log('Search results:', {
      totalResults: data.searchInformation?.totalResults,
      searchTime: data.searchInformation?.searchTime,
      itemsCount: data.items?.length || 0,
      currentPage: pageNumber,
      startIndex: startIndex
    })

    // Calculate pagination information
    const totalResults = parseInt(data.searchInformation?.totalResults || '0')
    const totalPages = Math.ceil(totalResults / resultsPerPage)
    const hasNextPage = pageNumber < totalPages
    const hasPreviousPage = pageNumber > 1

    // Return the search results with pagination info
    return NextResponse.json({
      items: data.items || [],
      searchInformation: data.searchInformation || {
        totalResults: '0',
        searchTime: 0
      },
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalResults: totalResults,
        resultsPerPage: resultsPerPage,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        startIndex: startIndex,
        endIndex: Math.min(startIndex + resultsPerPage - 1, totalResults)
      }
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

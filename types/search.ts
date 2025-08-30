export interface SearchResult {
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
  // Enhanced data asset information
  dataAsset?: {
    description?: string
    collectionDate?: string
    purpose?: string
    department?: string
    metadata?: {
      format?: string
      size?: string
      records?: number
      lastUpdated?: string
      version?: string
      license?: string
      tags?: string[]
    }
    availability?: {
      status: 'public' | 'restricted' | 'request-required'
      custodian?: string
      contactEmail?: string
      requestProcess?: string
    }
    relationships?: {
      parentDataset?: string
      childDatasets?: string[]
      relatedSeries?: string[]
      dependencies?: string[]
      derivedFrom?: string[]
    }
    contentAnalysis?: {
      summary?: string
      keyTopics?: string[]
      dataTypes?: string[]
      qualityScore?: number
      updateFrequency?: string
    }
  }
}

export interface SearchResponse {
  items: SearchResult[]
  searchInformation: {
    totalResults: string
    searchTime: number
  }
}

export interface SearchRequest {
  query: string
  startDate?: string
  endDate?: string
}

export interface ContentAnalysisRequest {
  url: string
  title: string
  content: string
}

export interface ContentAnalysisResponse {
  summary: string
  keyTopics: string[]
  dataTypes: string[]
  qualityScore: number
  updateFrequency: string
  metadata: {
    format: string
    size: string
    records: number
    lastUpdated: string
    version: string
    license: string
    tags: string[]
  }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalResults: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startIndex: number
  endIndex: number
}

export interface SearchRequest {
  query: string
  page?: number
}

export interface SearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  formattedUrl: string
  htmlSnippet: string
  pagemap?: {
    metatags?: Array<{
      'article:published_time'?: string
      'article:author'?: string
      'og:image'?: string
      'og:updated_time'?: string
      'og:author'?: string
    }>
    cse_image?: Array<{
      src: string
    }>
  }
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

export interface SearchInformation {
  totalResults: string
  searchTime: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalResults: number
  resultsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startIndex: number
  endIndex: number
}

export interface SearchResponse {
  items: SearchResult[]
  searchInformation: SearchInformation
  pagination: PaginationInfo
}

export interface ContentAnalysisRequest {
  url: string
  title: string
  content: string
}

export interface ContentAnalysisResponse {
  summary?: string
  keyTopics?: string[]
  dataTypes?: string[]
  qualityScore?: number
  updateFrequency?: string
}

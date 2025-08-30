import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

// Data ingestion interfaces
interface IngestionSource {
  id: string
  name: string
  url: string
  type: 'abs' | 'government' | 'research' | 'news' | 'custom'
  category: string
  description: string
  selectors: DataSelectors
  schedule?: 'daily' | 'weekly' | 'monthly' | 'manual'
  lastIngested?: string
  status: 'active' | 'inactive' | 'error'
}

interface DataSelectors {
  title: string
  content: string
  date?: string
  author?: string
  category?: string
  tags?: string
  links?: string
  images?: string
  metadata?: Record<string, string>
}

interface IngestionResult {
  sourceId: string
  sourceName: string
  url: string
  timestamp: string
  success: boolean
  dataCount: number
  errors: string[]
  data: IngestedDataItem[]
}

interface IngestedDataItem {
  title: string
  content: string
  url: string
  source: string
  category: string
  date?: string
  author?: string
  tags?: string[]
  metadata?: Record<string, any>
  dataAsset?: any
}

interface IngestionJob {
  id: string
  sourceIds: string[]
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt?: string
  completedAt?: string
  results: IngestionResult[]
  errors: string[]
}

// Predefined data sources
const DATA_SOURCES: IngestionSource[] = [
  {
    id: 'abs-statistics',
    name: 'ABS Statistics',
    url: 'https://www.abs.gov.au/statistics',
    type: 'abs',
    category: 'statistics',
    description: 'Australian Bureau of Statistics official statistics',
    selectors: {
      title: 'h1, h2, h3',
      content: 'p, .content, .description',
      date: '.date, .published-date',
      category: '.category, .topic',
      tags: '.tags, .keywords'
    },
    schedule: 'daily',
    status: 'active'
  },
  {
    id: 'abs-publications',
    name: 'ABS Publications',
    url: 'https://www.abs.gov.au/publications',
    type: 'abs',
    category: 'publications',
    description: 'ABS research publications and reports',
    selectors: {
      title: 'h1, h2, .publication-title',
      content: '.publication-content, .abstract',
      date: '.publication-date',
      author: '.author, .contributor',
      category: '.publication-type'
    },
    schedule: 'weekly',
    status: 'active'
  },
  {
    id: 'data-gov-au',
    name: 'Data.gov.au',
    url: 'https://data.gov.au',
    type: 'government',
    category: 'open-data',
    description: 'Australian Government open data portal',
    selectors: {
      title: 'h1, .dataset-title',
      content: '.dataset-description, .summary',
      date: '.dataset-date, .updated',
      category: '.dataset-category',
      tags: '.dataset-tags'
    },
    schedule: 'daily',
    status: 'active'
  },
  {
    id: 'research-orgs',
    name: 'Research Organizations',
    url: 'https://www.research.gov.au',
    type: 'research',
    category: 'research',
    description: 'Australian research organizations and institutions',
    selectors: {
      title: 'h1, .research-title',
      content: '.research-content, .abstract',
      date: '.research-date',
      author: '.researcher, .author',
      category: '.research-field'
    },
    schedule: 'weekly',
    status: 'active'
  },
  {
    id: 'news-abc',
    name: 'ABC News Data',
    url: 'https://www.abc.net.au/news/data',
    type: 'news',
    category: 'news',
    description: 'ABC News data journalism and statistics',
    selectors: {
      title: 'h1, .article-title',
      content: '.article-content, .story-body',
      date: '.article-date, .published',
      author: '.article-author',
      category: '.article-category'
    },
    schedule: 'daily',
    status: 'active'
  }
]

// In-memory storage for ingestion jobs (in production, use database)
const ingestionJobs: Map<string, IngestionJob> = new Map()
const ingestedData: Map<string, IngestedDataItem[]> = new Map()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'sources':
        return NextResponse.json({ sources: DATA_SOURCES })

      case 'jobs':
        const jobs = Array.from(ingestionJobs.values())
        return NextResponse.json({ jobs })

      case 'data':
        const sourceId = searchParams.get('sourceId')
        if (sourceId) {
          const data = ingestedData.get(sourceId) || []
          return NextResponse.json({ data, sourceId })
        }
        // Return all data
        const allData = Array.from(ingestedData.values()).flat()
        return NextResponse.json({ data: allData })

      case 'status':
        const jobId = searchParams.get('jobId')
        if (jobId && ingestionJobs.has(jobId)) {
          return NextResponse.json({ job: ingestionJobs.get(jobId) })
        }
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Data ingestion GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, sourceIds, customSource, jobId } = body

    switch (action) {
      case 'ingest':
        return await handleIngestion(sourceIds || [])

      case 'ingest-custom':
        return await handleCustomIngestion(customSource)

      case 'schedule':
        return await scheduleIngestion(sourceIds || [])

      case 'cancel':
        return await cancelIngestion(jobId)

      case 'add-source':
        return await addCustomSource(customSource)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Data ingestion POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleIngestion(sourceIds: string[]): Promise<NextResponse> {
  const jobId = generateJobId()
  const job: IngestionJob = {
    id: jobId,
    sourceIds,
    status: 'running',
    startedAt: new Date().toISOString(),
    results: [],
    errors: []
  }

  ingestionJobs.set(jobId, job)

  try {
    const sources = DATA_SOURCES.filter(source => sourceIds.includes(source.id))
    
    for (const source of sources) {
      try {
        const result = await ingestFromSource(source)
        job.results.push(result)
        
        // Store ingested data
        if (result.success && result.data.length > 0) {
          ingestedData.set(source.id, result.data)
        }
      } catch (error) {
        const errorResult: IngestionResult = {
          sourceId: source.id,
          sourceName: source.name,
          url: source.url,
          timestamp: new Date().toISOString(),
          success: false,
          dataCount: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          data: []
        }
        job.results.push(errorResult)
        job.errors.push(`Failed to ingest ${source.name}: ${error}`)
      }
    }

    job.status = 'completed'
    job.completedAt = new Date().toISOString()

    return NextResponse.json({
      jobId,
      status: 'completed',
      results: job.results,
      totalDataCount: job.results.reduce((sum, r) => sum + r.dataCount, 0)
    })

  } catch (error) {
    job.status = 'failed'
    job.completedAt = new Date().toISOString()
    job.errors.push(error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json({
      jobId,
      status: 'failed',
      errors: job.errors
    }, { status: 500 })
  }
}

async function handleCustomIngestion(customSource: IngestionSource): Promise<NextResponse> {
  const jobId = generateJobId()
  const job: IngestionJob = {
    id: jobId,
    sourceIds: [customSource.id],
    status: 'running',
    startedAt: new Date().toISOString(),
    results: [],
    errors: []
  }

  ingestionJobs.set(jobId, job)

  try {
    const result = await ingestFromSource(customSource)
    job.results.push(result)
    
    if (result.success && result.data.length > 0) {
      ingestedData.set(customSource.id, result.data)
    }

    job.status = 'completed'
    job.completedAt = new Date().toISOString()

    return NextResponse.json({
      jobId,
      status: 'completed',
      result,
      dataCount: result.dataCount
    })

  } catch (error) {
    job.status = 'failed'
    job.completedAt = new Date().toISOString()
    job.errors.push(error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json({
      jobId,
      status: 'failed',
      errors: job.errors
    }, { status: 500 })
  }
}

async function ingestFromSource(source: IngestionSource): Promise<IngestionResult> {
  console.log(`Starting ingestion from ${source.name} (${source.url})`)

  const result: IngestionResult = {
    sourceId: source.id,
    sourceName: source.name,
    url: source.url,
    timestamp: new Date().toISOString(),
    success: false,
    dataCount: 0,
    errors: [],
    data: []
  }

  try {
    // Fetch the webpage
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'DataLandscape-Ingestion/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const $ = dom.window.document

    // Extract data based on selectors
    const items = await extractDataItems($, source, source.url)
    
    result.data = items
    result.dataCount = items.length
    result.success = true

    console.log(`Successfully ingested ${items.length} items from ${source.name}`)

  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    console.error(`Error ingesting from ${source.name}:`, error)
  }

  return result
}

async function extractDataItems(doc: Document, source: IngestionSource, baseUrl: string): Promise<IngestedDataItem[]> {
  const items: IngestedDataItem[] = []
  const selectors = source.selectors

  try {
    // Find all potential content containers
    const containers = doc.querySelectorAll('article, .content, .item, .entry, .post, .publication, .dataset')
    
    if (containers.length === 0) {
      // Fallback: look for any content with titles
      const titles = doc.querySelectorAll(selectors.title)
      titles.forEach(element => {
        const title = element.textContent?.trim()
        if (title && title.length > 10) {
          const item = createDataItem(element, source, baseUrl, selectors)
          if (item) {
            items.push(item)
          }
        }
      })
    } else {
      // Process structured containers
      containers.forEach(container => {
        const item = createDataItem(container, source, baseUrl, selectors)
        if (item) {
          items.push(item)
        }
      })
    }

    // If no structured content found, try to extract from the main page
    if (items.length === 0) {
      const mainContent = doc.querySelector('main, .main-content, #content, .content')
      if (mainContent) {
        const item = createDataItem(mainContent, source, baseUrl, selectors)
        if (item) {
          items.push(item)
        }
      }
    }

  } catch (error) {
    console.error('Error extracting data items:', error)
  }

  return items.slice(0, 50) // Limit to 50 items per source
}

function createDataItem(
  element: Element, 
  source: IngestionSource, 
  baseUrl: string, 
  selectors: DataSelectors
): IngestedDataItem | null {
  try {
    const $element = element
    
    // Extract title
    const titleElement = $element.querySelector(selectors.title)
    const title = titleElement?.textContent?.trim()
    
    if (!title || title.length < 5) {
      return null
    }

    // Extract content
    const contentElement = $element.querySelector(selectors.content)
    const content = contentElement?.textContent?.trim()

    // Extract date
    const dateElement = $element.querySelector(selectors.date || '.date')
    const date = dateElement?.textContent?.trim()

    // Extract author
    const authorElement = $element.querySelector(selectors.author || '.author')
    const author = authorElement?.textContent?.trim()

    // Extract category
    const categoryElement = $element.querySelector(selectors.category || '.category')
    const category = categoryElement?.textContent?.trim() || source.category

    // Extract tags
    const tagsElement = $element.querySelector(selectors.tags || '.tags')
    const tagsText = tagsElement?.textContent?.trim()
    const tags = tagsText ? tagsText.split(',').map(tag => tag.trim()) : []

    // Extract URL
    const linkElement = $element.querySelector('a')
    const relativeUrl = linkElement?.getAttribute('href') || ''
    const url = relativeUrl ? new URL(relativeUrl, baseUrl).href : baseUrl

    // Create data asset metadata
    const dataAsset = createDataAssetMetadata(source, title, content || '', url)

    return {
      title,
      content: content || title,
      url,
      source: source.name,
      category,
      date: date || new Date().toISOString(),
      author: author || 'Unknown',
      tags: tags.length > 0 ? tags : [source.category],
      metadata: {
        sourceId: source.id,
        sourceType: source.type,
        ingestedAt: new Date().toISOString()
      },
      dataAsset
    }

  } catch (error) {
    console.error('Error creating data item:', error)
    return null
  }
}

function createDataAssetMetadata(source: IngestionSource, title: string, content: string, url: string) {
  return {
    description: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
    collectionDate: new Date().toISOString(),
    purpose: `Data ingestion from ${source.name}`,
    department: source.type === 'abs' ? 'Australian Bureau of Statistics' : 'Various Sources',
    metadata: {
      format: 'Web Content',
      size: 'Variable',
      records: 1,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      license: 'Varies by source',
      tags: [source.category, source.type, 'ingested-data'],
      url: url,
      source: source.name
    },
    availability: {
      status: 'public',
      custodian: source.name,
      contactEmail: 'data@datalandscape.com',
      requestProcess: 'Direct website access'
    },
    contentAnalysis: {
      summary: `Ingested content from ${source.name}: ${title}`,
      keyTopics: [source.category, source.type],
      dataTypes: ['Web Content', 'Articles', 'Publications'],
      qualityScore: 8,
      updateFrequency: source.schedule || 'manual'
    }
  }
}

async function scheduleIngestion(sourceIds: string[]): Promise<NextResponse> {
  // In a real implementation, this would schedule jobs using a task queue
  // For now, we'll just return a success response
  return NextResponse.json({
    message: 'Ingestion scheduled',
    sourceIds,
    scheduledAt: new Date().toISOString()
  })
}

async function cancelIngestion(jobId: string): Promise<NextResponse> {
  if (ingestionJobs.has(jobId)) {
    const job = ingestionJobs.get(jobId)!
    job.status = 'cancelled'
    job.completedAt = new Date().toISOString()
    
    return NextResponse.json({
      message: 'Ingestion cancelled',
      jobId
    })
  }
  
  return NextResponse.json({ error: 'Job not found' }, { status: 404 })
}

async function addCustomSource(customSource: IngestionSource): Promise<NextResponse> {
  // Validate custom source
  if (!customSource.id || !customSource.name || !customSource.url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // In a real implementation, this would save to a database
  DATA_SOURCES.push(customSource)

  return NextResponse.json({
    message: 'Custom source added',
    source: customSource
  })
}

function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Utility function to get ingestion statistics
function getIngestionStats() {
  const totalJobs = ingestionJobs.size
  const completedJobs = Array.from(ingestionJobs.values()).filter(job => job.status === 'completed').length
  const totalDataItems = Array.from(ingestedData.values()).reduce((sum, items) => sum + items.length, 0)
  
  return {
    totalJobs,
    completedJobs,
    failedJobs: totalJobs - completedJobs,
    totalDataItems,
    activeSources: DATA_SOURCES.filter(source => source.status === 'active').length
  }
}

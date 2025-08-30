import { JSDOM } from 'jsdom'

export interface ScrapedContent {
  title: string
  content: string
  metadata: {
    description?: string
    keywords?: string[]
    author?: string
    publishedDate?: string
    lastModified?: string
    language?: string
    type?: string
  }
  links: string[]
  images: string[]
}

export async function scrapeWebContent(url: string): Promise<ScrapedContent> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract title
    const title = document.querySelector('title')?.textContent || 
                  document.querySelector('h1')?.textContent || 
                  'Untitled'

    // Extract main content
    const content = extractMainContent(document)

    // Extract metadata
    const metadata = extractMetadata(document)

    // Extract links
    const links = Array.from(document.querySelectorAll('a[href]'))
      .map(link => (link as HTMLAnchorElement).href)
      .filter(href => href && !href.startsWith('javascript:'))

    // Extract images
    const images = Array.from(document.querySelectorAll('img[src]'))
      .map(img => (img as HTMLImageElement).src)
      .filter(src => src)

    return {
      title: title.trim(),
      content: content.trim(),
      metadata,
      links,
      images
    }

  } catch (error) {
    console.error('Scraping error:', error)
    throw new Error(`Failed to scrape content from ${url}`)
  }
}

function extractMainContent(document: Document): string {
  // Try to find main content area
  const selectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '.post-content',
    '.article-content',
    '.entry-content',
    '#content',
    '#main'
  ]

  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element) {
      return cleanText(element.textContent || '')
    }
  }

  // Fallback: extract text from body, excluding navigation and footer
  const body = document.body
  if (body) {
    // Remove navigation, footer, and other non-content elements
    const elementsToRemove = body.querySelectorAll('nav, footer, header, .nav, .footer, .header, .sidebar, .menu')
    elementsToRemove.forEach(el => el.remove())

    return cleanText(body.textContent || '')
  }

  return ''
}

function extractMetadata(document: Document) {
  const metadata: any = {}

  // Extract meta tags
  const metaTags = document.querySelectorAll('meta')
  metaTags.forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property')
    const content = meta.getAttribute('content')

    if (name && content) {
      switch (name.toLowerCase()) {
        case 'description':
          metadata.description = content
          break
        case 'keywords':
          metadata.keywords = content.split(',').map(k => k.trim())
          break
        case 'author':
          metadata.author = content
          break
        case 'og:title':
          if (!metadata.title) metadata.title = content
          break
        case 'og:description':
          if (!metadata.description) metadata.description = content
          break
        case 'og:author':
          if (!metadata.author) metadata.author = content
          break
        case 'article:published_time':
          metadata.publishedDate = content
          break
        case 'article:modified_time':
          metadata.lastModified = content
          break
      }
    }
  })

  // Extract structured data
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]')
  structuredData.forEach(script => {
    try {
      const data = JSON.parse(script.textContent || '')
      if (data['@type'] === 'Article' || data['@type'] === 'WebPage') {
        if (data.author && !metadata.author) {
          metadata.author = typeof data.author === 'string' ? data.author : data.author.name
        }
        if (data.datePublished && !metadata.publishedDate) {
          metadata.publishedDate = data.datePublished
        }
        if (data.dateModified && !metadata.lastModified) {
          metadata.lastModified = data.dateModified
        }
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }
  })

  return metadata
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim()
}

// Alternative scraping methods for different content types
export async function scrapePDF(url: string): Promise<ScrapedContent> {
  // This would require a PDF parsing library like pdf-parse
  // For now, return a placeholder
  return {
    title: 'PDF Document',
    content: 'PDF content extraction not implemented',
    metadata: {},
    links: [],
    images: []
  }
}

export async function scrapeCSV(url: string): Promise<ScrapedContent> {
  try {
    const response = await fetch(url)
    const csvText = await response.text()
    
    // Parse CSV headers and first few rows for analysis
    const lines = csvText.split('\n').filter(line => line.trim())
    const headers = lines[0]?.split(',').map(h => h.trim()) || []
    const sampleRows = lines.slice(1, 5) // First 5 data rows
    
    return {
      title: `CSV Dataset: ${headers.join(', ')}`,
      content: `CSV file with ${headers.length} columns and ${lines.length - 1} rows. Headers: ${headers.join(', ')}`,
      metadata: {
        type: 'CSV',
        records: lines.length - 1,
        columns: headers.length
      },
      links: [],
      images: []
    }
  } catch (error) {
    throw new Error(`Failed to parse CSV from ${url}`)
  }
}

export async function scrapeJSON(url: string): Promise<ScrapedContent> {
  try {
    const response = await fetch(url)
    const jsonData = await response.json()
    
    // Analyze JSON structure
    const structure = analyzeJSONStructure(jsonData)
    
    return {
      title: `JSON Dataset: ${structure.type}`,
      content: `JSON file containing ${structure.description}`,
      metadata: {
        type: 'JSON',
        structure: structure.type,
        records: structure.recordCount
      },
      links: [],
      images: []
    }
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${url}`)
  }
}

function analyzeJSONStructure(data: any): { type: string; description: string; recordCount: number } {
  if (Array.isArray(data)) {
    return {
      type: 'Array',
      description: `array with ${data.length} items`,
      recordCount: data.length
    }
  } else if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data)
    return {
      type: 'Object',
      description: `object with ${keys.length} properties: ${keys.join(', ')}`,
      recordCount: 1
    }
  } else {
    return {
      type: 'Primitive',
      description: `primitive value: ${typeof data}`,
      recordCount: 1
    }
  }
}

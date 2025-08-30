import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'
import { handleCors, addCorsHeaders } from '@/lib/cors'

interface DatasetInfoRequest {
  url: string
  title: string
}

interface DatasetInfo {
  description: string
  collectionDate: string
  purpose: string
  department: string
  metadata: {
    format: string
    size: string
    records: number
    lastUpdated: string
    version: string
    license: string
    tags: string[]
  }
  availability: {
    status: 'public' | 'restricted' | 'request-required'
    custodian: string
    contactEmail: string
    requestProcess: string
  }
  relationships: {
    parentDataset: string
    childDatasets: string[]
    relatedSeries: string[]
    dependencies: string[]
    derivedFrom: string[]
  }
  contentAnalysis: {
    summary: string
    keyTopics: string[]
    dataTypes: string[]
    qualityScore: number
    updateFrequency: string
  }
}

export async function POST(request: NextRequest) {
  let title = 'Unknown Dataset'
  
  try {
    const body: DatasetInfoRequest = await request.json()
    const { url, title: requestTitle } = body
    title = requestTitle || title

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    console.log('Fetching dataset info from:', url)

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract dataset information from the webpage
    const datasetInfo = await extractDatasetInfo(document, url, title)

    return NextResponse.json({ dataAsset: datasetInfo })

  } catch (error) {
    console.error('Error fetching dataset info:', error)
    
    // Return fallback data if scraping fails
    const fallbackInfo: DatasetInfo = {
      description: `Dataset information for ${title}`,
      collectionDate: new Date().toISOString(),
      purpose: 'Data analysis and research',
      department: 'Unknown',
      metadata: {
        format: 'Unknown',
        size: 'Unknown',
        records: 0,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
        license: 'Unknown',
        tags: ['dataset', 'data']
      },
      availability: {
        status: 'public',
        custodian: 'Unknown',
        contactEmail: '',
        requestProcess: 'Direct access'
      },
      relationships: {
        parentDataset: '',
        childDatasets: [],
        relatedSeries: [],
        dependencies: [],
        derivedFrom: []
      },
      contentAnalysis: {
        summary: `Dataset information extracted from ${title}`,
        keyTopics: ['data', 'dataset'],
        dataTypes: ['Unknown'],
        qualityScore: 5,
        updateFrequency: 'Unknown'
      }
    }

    return NextResponse.json({ dataAsset: fallbackInfo })
  }
}

async function extractDatasetInfo(document: Document, url: string, title: string): Promise<DatasetInfo> {
  // Extract meta tags and structured data
  const metaTags = document.querySelectorAll('meta')
  const metaData: Record<string, string> = {}
  
  metaTags.forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property')
    const content = meta.getAttribute('content')
    if (name && content) {
      metaData[name] = content
    }
  })

  // Extract JSON-LD structured data
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
  let structuredData: any = null
  
  Array.from(jsonLdScripts).forEach(script => {
    try {
      const data = JSON.parse(script.textContent || '')
      if (data['@type'] === 'Dataset' || data['@type'] === 'DataCatalog' || data['@type'] === 'Article' || data['@type'] === 'WebPage') {
        structuredData = data
      }
    } catch (e) {
      // Ignore invalid JSON
    }
  })

  // Extract text content for analysis - focus on main content areas
  const mainContent = extractMainContent(document)
  const bodyText = mainContent || document.body?.textContent || ''
  
  // Enhanced extraction with more context
  const description = extractDescription(metaData, structuredData, bodyText, title)
  const dataTypes = extractDataTypes(bodyText, structuredData, title)
  const keyTopics = extractKeyTopics(bodyText, title, url)
  const format = extractFormat(metaData, structuredData, bodyText, url)
  const license = extractLicense(metaData, structuredData, bodyText)
  const department = extractDepartment(url, bodyText, title)
  const qualityScore = calculateQualityScore(metaData, structuredData, bodyText, url)

  return {
    description: description || `Dataset information for ${title}`,
    collectionDate: extractDate(metaData, structuredData) || new Date().toISOString(),
    purpose: extractPurpose(bodyText, structuredData) || 'Data analysis and research',
    department: department || 'Unknown',
    metadata: {
      format: format || 'Unknown',
      size: extractSize(metaData, structuredData) || 'Unknown',
      records: extractRecords(metaData, structuredData) || 0,
      lastUpdated: extractLastUpdated(metaData, structuredData) || new Date().toISOString(),
      version: extractVersion(metaData, structuredData) || '1.0.0',
      license: license || 'Unknown',
      tags: extractTags(bodyText, structuredData)
    },
    availability: {
      status: determineAvailabilityStatus(url, bodyText),
      custodian: extractCustodian(url, bodyText) || 'Unknown',
      contactEmail: extractContactEmail(bodyText) || '',
      requestProcess: extractRequestProcess(bodyText) || 'Direct access'
    },
    relationships: {
      parentDataset: extractParentDataset(structuredData) || '',
      childDatasets: extractChildDatasets(structuredData) || [],
      relatedSeries: extractRelatedSeries(structuredData) || [],
      dependencies: extractDependencies(structuredData) || [],
      derivedFrom: extractDerivedFrom(structuredData) || []
    },
    contentAnalysis: {
      summary: generateSummary(description, bodyText),
      keyTopics: keyTopics,
      dataTypes: dataTypes,
      qualityScore: qualityScore,
      updateFrequency: extractUpdateFrequency(bodyText, structuredData) || 'Unknown'
    }
  }
}

function extractMainContent(document: Document): string {
  // Try to find main content areas
  const selectors = [
    'main',
    'article',
    '.content',
    '.main-content',
    '#content',
    '#main',
    '.post-content',
    '.entry-content',
    '.article-content'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element && element.textContent && element.textContent.length > 200) {
      return element.textContent
    }
  }
  
  // Fallback to first substantial paragraph
  const paragraphs = document.querySelectorAll('p')
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i]
    if (p.textContent && p.textContent.length > 100) {
      return p.textContent
    }
  }
  
  return ''
}

function extractDescription(metaData: Record<string, string>, structuredData: any, bodyText: string, title: string): string {
  // Try structured data first
  if (structuredData?.description) {
    return structuredData.description
  }
  
  // Try meta tags
  if (metaData['description']) {
    return metaData['description']
  }
  if (metaData['og:description']) {
    return metaData['og:description']
  }
  if (metaData['twitter:description']) {
    return metaData['twitter:description']
  }
  
  // Extract from body text (first substantial paragraph)
  const paragraphs = bodyText.split('\n').filter(p => p.trim().length > 50)
  if (paragraphs.length > 0) {
    const firstPara = paragraphs[0].trim()
    return firstPara.length > 200 ? firstPara.substring(0, 200) + '...' : firstPara
  }
  
  // Fallback to title-based description
  return `Information about ${title}`
}

function extractDataTypes(bodyText: string, structuredData: any, title: string): string[] {
  const dataTypes: string[] = []
  
  // Check structured data
  if (structuredData?.variableMeasured) {
    if (Array.isArray(structuredData.variableMeasured)) {
      dataTypes.push(...structuredData.variableMeasured)
    } else {
      dataTypes.push(structuredData.variableMeasured)
    }
  }
  
  // Extract from text with enhanced detection
  const text = (bodyText + ' ' + title).toLowerCase()
  
  // File formats
  const fileFormats = ['csv', 'json', 'xml', 'excel', 'xlsx', 'xls', 'pdf', 'txt', 'zip', 'rdf']
  fileFormats.forEach(format => {
    if (text.includes(format)) {
      dataTypes.push(format.toUpperCase())
    }
  })
  
  // Data types
  const typeKeywords = [
    'statistical', 'numerical', 'categorical', 'time series', 'geospatial', 'spatial',
    'survey', 'census', 'administrative', 'transactional', 'log data', 'big data',
    'structured data', 'unstructured data', 'semi-structured', 'relational',
    'no-sql', 'graph data', 'time-series', 'panel data', 'cross-sectional'
  ]
  
  typeKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      dataTypes.push(keyword)
    }
  })
  
  // API and access methods
  if (text.includes('api') || text.includes('rest') || text.includes('endpoint')) {
    dataTypes.push('API')
  }
  if (text.includes('database') || text.includes('db')) {
    dataTypes.push('Database')
  }
  if (text.includes('spreadsheet') || text.includes('table')) {
    dataTypes.push('Tabular')
  }
  
  // Domain-specific detection
  if (text.includes('population') || text.includes('demographics')) {
    dataTypes.push('Demographic')
  }
  if (text.includes('economic') || text.includes('financial') || text.includes('gdp')) {
    dataTypes.push('Economic')
  }
  if (text.includes('health') || text.includes('medical')) {
    dataTypes.push('Health')
  }
  if (text.includes('education') || text.includes('school')) {
    dataTypes.push('Education')
  }
  if (text.includes('transport') || text.includes('traffic')) {
    dataTypes.push('Transport')
  }
  if (text.includes('environment') || text.includes('climate')) {
    dataTypes.push('Environmental')
  }
  
  return dataTypes.length > 0 ? [...new Set(dataTypes)] : ['Information']
}

function extractKeyTopics(bodyText: string, title: string, url: string): string[] {
  const text = (title + ' ' + bodyText + ' ' + url).toLowerCase()
  const topics: string[] = []
  
  // Enhanced topic detection with more specific categories
  const topicKeywords = {
    'Population & Demographics': ['population', 'demographics', 'census', 'birth', 'death', 'migration', 'age', 'gender'],
    'Economics & Finance': ['economics', 'finance', 'gdp', 'inflation', 'unemployment', 'employment', 'income', 'poverty', 'wealth'],
    'Health & Medicine': ['health', 'medical', 'disease', 'hospital', 'doctor', 'patient', 'mortality', 'morbidity', 'vaccination'],
    'Education': ['education', 'school', 'university', 'student', 'teacher', 'academic', 'learning', 'literacy'],
    'Transport & Infrastructure': ['transport', 'traffic', 'road', 'rail', 'airport', 'infrastructure', 'public transport'],
    'Environment & Climate': ['environment', 'climate', 'pollution', 'emissions', 'renewable', 'sustainability', 'biodiversity'],
    'Social Issues': ['social', 'welfare', 'housing', 'crime', 'justice', 'inequality', 'discrimination'],
    'Technology': ['technology', 'digital', 'internet', 'software', 'hardware', 'ai', 'machine learning', 'cybersecurity'],
    'Agriculture': ['agriculture', 'farming', 'crop', 'livestock', 'food', 'rural'],
    'Energy': ['energy', 'electricity', 'oil', 'gas', 'renewable', 'solar', 'wind'],
    'Government & Politics': ['government', 'politics', 'policy', 'legislation', 'election', 'voting'],
    'Business & Industry': ['business', 'industry', 'manufacturing', 'retail', 'service', 'trade', 'export'],
    'Science & Research': ['science', 'research', 'study', 'experiment', 'laboratory', 'discovery'],
    'Culture & Arts': ['culture', 'arts', 'music', 'film', 'literature', 'heritage', 'tourism']
  }
  
  // Check for topic matches
  Object.entries(topicKeywords).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        topics.push(category)
        return
      }
    })
  })
  
  // Extract specific terms from title and content
  const specificTerms = extractSpecificTerms(text)
  topics.push(...specificTerms)
  
  // Remove duplicates and limit to top topics
  const uniqueTopics = [...new Set(topics)]
  return uniqueTopics.length > 0 ? uniqueTopics.slice(0, 5) : ['Information']
}

function extractSpecificTerms(text: string): string[] {
  const terms: string[] = []
  
  // Look for specific data indicators
  if (text.includes('dataset') || text.includes('data set')) terms.push('Dataset')
  if (text.includes('statistics') || text.includes('statistical')) terms.push('Statistics')
  if (text.includes('survey') || text.includes('poll')) terms.push('Survey')
  if (text.includes('report') || text.includes('analysis')) terms.push('Report')
  if (text.includes('research') || text.includes('study')) terms.push('Research')
  if (text.includes('api') || text.includes('endpoint')) terms.push('API')
  if (text.includes('database') || text.includes('db')) terms.push('Database')
  
  return terms
}

function extractFormat(metaData: Record<string, string>, structuredData: any, bodyText: string, url: string): string {
  if (structuredData?.encodingFormat) {
    return structuredData.encodingFormat
  }
  
  const text = (bodyText + ' ' + url).toLowerCase()
  
  // File formats
  if (text.includes('csv')) return 'CSV'
  if (text.includes('json')) return 'JSON'
  if (text.includes('xml')) return 'XML'
  if (text.includes('excel') || text.includes('xlsx') || text.includes('xls')) return 'Excel'
  if (text.includes('pdf')) return 'PDF'
  if (text.includes('txt') || text.includes('text')) return 'Text'
  if (text.includes('zip') || text.includes('compressed')) return 'Compressed'
  if (text.includes('rdf')) return 'RDF'
  
  // API and web formats
  if (text.includes('api') || text.includes('rest') || text.includes('endpoint')) return 'API'
  if (text.includes('html') || text.includes('web')) return 'Web Page'
  if (text.includes('database') || text.includes('db')) return 'Database'
  if (text.includes('spreadsheet') || text.includes('table')) return 'Tabular'
  
  // Check URL for format hints
  if (url.includes('.csv')) return 'CSV'
  if (url.includes('.json')) return 'JSON'
  if (url.includes('.xml')) return 'XML'
  if (url.includes('.xlsx') || url.includes('.xls')) return 'Excel'
  if (url.includes('.pdf')) return 'PDF'
  if (url.includes('api')) return 'API'
  
  return 'Web Content'
}

function extractLicense(metaData: Record<string, string>, structuredData: any, bodyText: string): string {
  if (structuredData?.license) {
    return structuredData.license
  }
  
  const text = bodyText.toLowerCase()
  if (text.includes('creative commons')) return 'Creative Commons'
  if (text.includes('open data')) return 'Open Data License'
  if (text.includes('public domain')) return 'Public Domain'
  
  return 'Unknown'
}

function extractDepartment(url: string, bodyText: string, title: string): string {
  const urlLower = url.toLowerCase()
  const text = (bodyText + ' ' + title).toLowerCase()
  
  // Known organizations and their domains
  const organizations = {
    'abs.gov.au': 'Australian Bureau of Statistics',
    'data.gov.au': 'Australian Government',
    'worldbank.org': 'World Bank',
    'un.org': 'United Nations',
    'who.int': 'World Health Organization',
    'oecd.org': 'Organisation for Economic Co-operation and Development',
    'imf.org': 'International Monetary Fund',
    'eurostat.ec.europa.eu': 'European Commission (Eurostat)',
    'ons.gov.uk': 'Office for National Statistics (UK)',
    'census.gov': 'United States Census Bureau',
    'bls.gov': 'Bureau of Labor Statistics (US)',
    'stats.govt.nz': 'Statistics New Zealand',
    'statcan.gc.ca': 'Statistics Canada',
    'github.com': 'GitHub',
    'kaggle.com': 'Kaggle',
    'data.world': 'Data.World',
    'figshare.com': 'Figshare',
    'zenodo.org': 'Zenodo',
    'arxiv.org': 'arXiv',
    'researchgate.net': 'ResearchGate',
    'scholar.google.com': 'Google Scholar',
    'ieee.org': 'IEEE',
    'acm.org': 'Association for Computing Machinery',
    'nature.com': 'Nature',
    'science.org': 'Science',
    'springer.com': 'Springer',
    'wiley.com': 'Wiley',
    'tandfonline.com': 'Taylor & Francis',
    'sciencedirect.com': 'Elsevier',
    'jstor.org': 'JSTOR'
  }
  
  // Check URL for known organizations
  for (const [domain, org] of Object.entries(organizations)) {
    if (urlLower.includes(domain)) {
      return org
    }
  }
  
  // Try to extract from text with enhanced patterns
  const departmentPatterns = [
    /(?:department|ministry|agency|bureau|institute|foundation|organization|organisation)\s+of\s+([a-zA-Z\s]+)/i,
    /([a-zA-Z\s]+)\s+(?:department|ministry|agency|bureau|institute|foundation|organization|organisation)/i,
    /(?:by|from|at)\s+([a-zA-Z\s]+(?:university|college|institute|foundation|organization|organisation))/i,
    /(?:published|released|maintained)\s+by\s+([a-zA-Z\s]+)/i
  ]
  
  for (const pattern of departmentPatterns) {
    const match = text.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }
  
  // Try to extract from meta tags or structured data
  const metaAuthor = extractMetaAuthor(bodyText)
  if (metaAuthor) {
    return metaAuthor
  }
  
  return 'Unknown Organization'
}

function extractMetaAuthor(text: string): string | null {
  // Look for common author/organization patterns
  const patterns = [
    /author[:\s]+([a-zA-Z\s]+)/i,
    /organization[:\s]+([a-zA-Z\s]+)/i,
    /institution[:\s]+([a-zA-Z\s]+)/i,
    /affiliation[:\s]+([a-zA-Z\s]+)/i
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }
  
  return null
}

function calculateQualityScore(metaData: Record<string, string>, structuredData: any, bodyText: string, url: string): number {
  let score = 5 // Base score
  
  // Bonus for structured data
  if (structuredData) score += 2
  
  // Bonus for comprehensive metadata
  if (metaData['description']) score += 1
  if (metaData['keywords']) score += 1
  if (metaData['author']) score += 1
  if (metaData['og:description']) score += 1
  if (metaData['twitter:description']) score += 1
  
  // Bonus for detailed content
  if (bodyText.length > 1000) score += 1
  if (bodyText.includes('methodology')) score += 1
  if (bodyText.includes('documentation')) score += 1
  if (bodyText.includes('data source')) score += 1
  if (bodyText.includes('collection method')) score += 1
  if (bodyText.includes('quality assurance')) score += 1
  
  // Bonus for reputable sources
  const reputableDomains = [
    'abs.gov.au', 'data.gov.au', 'worldbank.org', 'un.org', 'who.int',
    'oecd.org', 'imf.org', 'eurostat.ec.europa.eu', 'ons.gov.uk',
    'census.gov', 'bls.gov', 'stats.govt.nz', 'statcan.gc.ca',
    'nature.com', 'science.org', 'arxiv.org', 'ieee.org', 'acm.org'
  ]
  
  for (const domain of reputableDomains) {
    if (url.toLowerCase().includes(domain)) {
      score += 2
      break
    }
  }
  
  // Bonus for academic/research content
  if (bodyText.includes('research') || bodyText.includes('study') || bodyText.includes('analysis')) score += 1
  if (bodyText.includes('peer-reviewed') || bodyText.includes('journal')) score += 1
  if (bodyText.includes('university') || bodyText.includes('institute')) score += 1
  
  // Bonus for data-specific indicators
  if (bodyText.includes('dataset') || bodyText.includes('data set')) score += 1
  if (bodyText.includes('statistics') || bodyText.includes('statistical')) score += 1
  if (bodyText.includes('api') || bodyText.includes('download')) score += 1
  
  return Math.min(score, 10)
}

function extractDate(metaData: Record<string, string>, structuredData: any): string | null {
  if (structuredData?.dateCreated) {
    return structuredData.dateCreated
  }
  if (structuredData?.datePublished) {
    return structuredData.datePublished
  }
  if (metaData['article:published_time']) {
    return metaData['article:published_time']
  }
  return null
}

function extractSize(metaData: Record<string, string>, structuredData: any): string | null {
  if (structuredData?.contentSize) {
    return structuredData.contentSize
  }
  return null
}

function extractRecords(metaData: Record<string, string>, structuredData: any): number | null {
  if (structuredData?.numberOfItems) {
    return structuredData.numberOfItems
  }
  return null
}

function extractLastUpdated(metaData: Record<string, string>, structuredData: any): string | null {
  if (structuredData?.dateModified) {
    return structuredData.dateModified
  }
  if (metaData['article:modified_time']) {
    return metaData['article:modified_time']
  }
  return null
}

function extractVersion(metaData: Record<string, string>, structuredData: any): string | null {
  if (structuredData?.version) {
    return structuredData.version
  }
  return null
}

function extractTags(bodyText: string, structuredData: any): string[] {
  const tags: string[] = []
  
  if (structuredData?.keywords) {
    if (Array.isArray(structuredData.keywords)) {
      tags.push(...structuredData.keywords)
    } else {
      tags.push(structuredData.keywords)
    }
  }
  
  // Extract common tags from text
  const text = bodyText.toLowerCase()
  const commonTags = ['dataset', 'data', 'statistics', 'open data', 'public data']
  
  commonTags.forEach(tag => {
    if (text.includes(tag)) {
      tags.push(tag)
    }
  })
  
  return tags
}

function determineAvailabilityStatus(url: string, bodyText: string): 'public' | 'restricted' | 'request-required' {
  const text = bodyText.toLowerCase()
  
  if (text.includes('restricted') || text.includes('private') || text.includes('confidential')) {
    return 'restricted'
  }
  if (text.includes('request') || text.includes('apply') || text.includes('permission')) {
    return 'request-required'
  }
  
  return 'public'
}

function extractCustodian(url: string, bodyText: string): string | null {
  // Try to extract from URL domain
  try {
    const domain = new URL(url).hostname
    if (domain.includes('abs.gov.au')) return 'Australian Bureau of Statistics'
    if (domain.includes('data.gov.au')) return 'Australian Government'
  } catch (e) {
    // Ignore URL parsing errors
  }
  
  // Try to extract from text
  const custodianPatterns = [
    /(?:maintained by|provided by|curated by)\s+([a-zA-Z\s]+)/i,
    /([a-zA-Z\s]+)\s+(?:is responsible|maintains|provides)/i
  ]
  
  for (const pattern of custodianPatterns) {
    const match = bodyText.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }
  
  return null
}

function extractContactEmail(bodyText: string): string | null {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const emails = bodyText.match(emailPattern)
  return emails ? emails[0] : null
}

function extractRequestProcess(bodyText: string): string | null {
  const text = bodyText.toLowerCase()
  
  if (text.includes('api')) return 'API access'
  if (text.includes('download')) return 'Direct download'
  if (text.includes('email')) return 'Email request'
  if (text.includes('form')) return 'Online form'
  
  return null
}

function extractParentDataset(structuredData: any): string | null {
  return structuredData?.isPartOf?.name || null
}

function extractChildDatasets(structuredData: any): string[] {
  return structuredData?.hasPart?.map((item: any) => item.name) || []
}

function extractRelatedSeries(structuredData: any): string[] {
  return structuredData?.relatedSeries || []
}

function extractDependencies(structuredData: any): string[] {
  return structuredData?.dependencies || []
}

function extractDerivedFrom(structuredData: any): string[] {
  return structuredData?.derivedFrom || []
}

function extractPurpose(bodyText: string, structuredData: any): string | null {
  if (structuredData?.purpose) {
    return structuredData.purpose
  }
  
  const text = bodyText.toLowerCase()
  if (text.includes('research')) return 'Research and analysis'
  if (text.includes('policy')) return 'Policy development'
  if (text.includes('planning')) return 'Planning and decision making'
  if (text.includes('monitoring')) return 'Monitoring and evaluation'
  
  return null
}

function extractUpdateFrequency(bodyText: string, structuredData: any): string | null {
  if (structuredData?.updateFrequency) {
    return structuredData.updateFrequency
  }
  
  const text = bodyText.toLowerCase()
  if (text.includes('daily')) return 'Daily'
  if (text.includes('weekly')) return 'Weekly'
  if (text.includes('monthly')) return 'Monthly'
  if (text.includes('quarterly')) return 'Quarterly'
  if (text.includes('annually') || text.includes('yearly')) return 'Annually'
  
  return null
}

function generateSummary(description: string, bodyText: string): string {
  if (description) {
    return description.length > 200 ? description.substring(0, 200) + '...' : description
  }
  
  // Generate summary from body text with better sentence selection
  const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 20)
  
  // Look for the most informative sentence (contains key terms)
  const keyTerms = ['data', 'dataset', 'information', 'statistics', 'research', 'study', 'analysis', 'report']
  let bestSentence = sentences[0] || ''
  
  for (const sentence of sentences) {
    const score = keyTerms.reduce((acc, term) => 
      acc + (sentence.toLowerCase().includes(term) ? 1 : 0), 0)
    if (score > 0) {
      bestSentence = sentence
      break
    }
  }
  
  if (bestSentence) {
    return bestSentence.length > 200 ? bestSentence.substring(0, 200) + '...' : bestSentence
  }
  
  return 'Information extracted from webpage content.'
}

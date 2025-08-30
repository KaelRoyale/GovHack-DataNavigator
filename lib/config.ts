export const config = {
  search: {
    maxResults: 100,
    // List of websites to search within
    // Format: 'site:domain.com' - searches only within that domain
    // Enhanced with specific paths to find individual articles
    supportedSites: [
      // Australian Government Sites
      'site:abs.gov.au',           // Australian Bureau of Statistics
      'site:dewr.gov.au',          // Department of Employment and Workplace Relations
      'site:data.gov.au',          // Australian Government Data Portal
      'site:ato.gov.au',           // Australian Taxation Office
      'site:health.gov.au',        // Department of Health
      'site:education.gov.au'   // Department of Education
      ],
    
    // Enhanced search patterns for finding articles
    articlePatterns: [
      // Common article URL patterns
      '*/article/*',
      '*/post/*', 
      '*/health/*',
      '*/statistics/*',
      '*/blog/*',
      '*/tutorial/*',
      '*/guide/*',
      '*/docs/*',
      '*/documentation/*',
      '*/dataset/*',
      '*/data/*',
      '*/research/*',
      '*/study/*',
      '*/report/*',
      '*/analysis/*',
      '*/news/*'
    ],
    
    // Keywords that indicate article content
    articleKeywords: [
      'article', 'post', 'blog', 'tutorial', 'guide', 'documentation',
      'report', 'study', 'research', 'analysis', 'dataset', 'data',
      'news', 'story', 'feature', 'insight', 'perspective', 'opinion', 'statistics'
    ]
  },
  api: {
    baseUrl: 'https://www.googleapis.com/customsearch/v1',
    timeout: 10000
  },
  ui: {
    debounceDelay: 300,
    maxSnippetLength: 200
  }
} as const

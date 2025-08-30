export const config = {
  search: {
    maxResults: 10,
    // List of websites to search within
    // Format: 'site:domain.com' - searches only within that domain
    supportedSites: [
      // Australian Government Sites
      'site:abs.gov.au',           // Australian Bureau of Statistics
      'site:dewr.gov.au',          // Department of Employment and Workplace Relations
      'site:data.gov.au',          // Australian Government Data Portal
      'site:ato.gov.au',           // Australian Taxation Office
      'site:health.gov.au',        // Department of Health
      'site:education.gov.au',     // Department of Education
      
      // International Government Data Sites
      'site:data.gov',             // US Government Data
      'site:data.gov.uk',          // UK Government Data
      'site:data.gc.ca',           // Canadian Government Data
      
      // Research and Academic Sites
      'site:researchgate.net',     // Research papers and publications
      'site:arxiv.org',            // Scientific papers
      'site:scholar.google.com',   // Google Scholar
      
      // Technical Documentation Sites
      'site:github.com',           // Code repositories and documentation
      'site:stackoverflow.com',    // Technical Q&A
      'site:medium.com',           // Technical articles
      'site:dev.to',               // Developer articles
      'site:hashnode.dev',         // Developer blogs
      
      // News and Media Sites
      'site:techcrunch.com',       // Tech news
      'site:theverge.com',         // Technology news
      'site:arstechnica.com',      // Technology news and analysis
      
      // Educational and Tutorial Sites
      'site:css-tricks.com',       // CSS tutorials
      'site:smashingmagazine.com', // Web design articles
      'site:alistapart.com',       // Web standards
      'site:web.dev',              // Web development resources
      'site:developers.google.com', // Google developer docs
      'site:mozilla.org',          // Mozilla developer docs
      'site:mdn.io'                // MDN Web Docs
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

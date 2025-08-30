// Example site configurations for different search use cases
// Copy these configurations to lib/config.ts to customize your search

// Configuration for Government Data Analysis
export const governmentDataSites = {
  search: {
    maxResults: 10,
    supportedSites: [
      // Australian Government
      'site:abs.gov.au',           // Australian Bureau of Statistics
      'site:data.gov.au',          // Australian Government Data Portal
      'site:dewr.gov.au',          // Department of Employment and Workplace Relations
      'site:ato.gov.au',           // Australian Taxation Office
      'site:health.gov.au',        // Department of Health
      'site:education.gov.au',     // Department of Education
      'site:infrastructure.gov.au', // Department of Infrastructure
      'site:agriculture.gov.au',   // Department of Agriculture
      
      // International Government Data
      'site:data.gov',             // US Government Data
      'site:data.gov.uk',          // UK Government Data
      'site:data.gc.ca',           // Canadian Government Data
      'site:data.govt.nz',         // New Zealand Government Data
      
      // Research and Academic
      'site:researchgate.net',     // Research papers
      'site:arxiv.org',            // Scientific papers
      'site:scholar.google.com',   // Google Scholar
      'site:jstor.org',            // Academic journals
    ]
  }
}



// Configuration for Academic Research
export const academicResearchSites = {
  search: {
    maxResults: 10,
    supportedSites: [
      // Academic Databases
      'site:researchgate.net',     // Research papers
      'site:arxiv.org',            // Scientific papers
      'site:scholar.google.com',   // Google Scholar
      'site:jstor.org',            // Academic journals
      'site:ieee.org',             // IEEE publications
      'site:acm.org',              // ACM publications
      'site:sciencedirect.com',    // Science Direct
      'site:springer.com',         // Springer publications
      
      // University Repositories
      'site:*.edu',                // All educational institutions
      'site:repository.cam.ac.uk', // Cambridge repository
      'site:eprints.whiterose.ac.uk', // White Rose repository
      
      // Research Organizations
      'site:nature.com',           // Nature publications
      'site:science.org',          // Science publications
      'site:cell.com',             // Cell publications
      'site:thelancet.com',        // Lancet publications
    ]
  }
}

// Configuration for Business and Finance
export const businessFinanceSites = {
  search: {
    maxResults: 10,
    supportedSites: [
      // Financial Data
      'site:asx.com.au',           // Australian Securities Exchange
      'site:finance.yahoo.com',    // Yahoo Finance
      'site:marketwatch.com',      // Market Watch
      'site:bloomberg.com',        // Bloomberg
      'site:reuters.com',          // Reuters
      'site:ft.com',               // Financial Times
      'site:wsj.com',              // Wall Street Journal
      
      // Business News
      'site:forbes.com',           // Forbes
      'site:fortune.com',          // Fortune
      'site:economist.com',        // The Economist
      'site:cnbc.com',             // CNBC
      
      // Government Economic Data
      'site:abs.gov.au',           // Australian Bureau of Statistics
      'site:rba.gov.au',           // Reserve Bank of Australia
      'site:treasury.gov.au',      // Australian Treasury
      'site:data.gov',             // US Government Data
    ]
  }
}

// Configuration for Health and Medical Research
export const healthMedicalSites = {
  search: {
    maxResults: 10,
    supportedSites: [
      // Medical Databases
      'site:pubmed.ncbi.nlm.nih.gov', // PubMed
      'site:medlineplus.gov',      // MedlinePlus
      'site:who.int',              // World Health Organization
      'site:cdc.gov',              // Centers for Disease Control
      'site:health.gov.au',        // Australian Department of Health
      'site:nhmrc.gov.au',         // National Health and Medical Research Council
      
      // Medical Journals
      'site:nejm.org',             // New England Journal of Medicine
      'site:thelancet.com',        // The Lancet
      'site:jama.com',             // JAMA
      'site:bmj.com',              // British Medical Journal
      'site:nature.com',           // Nature
      'site:science.org',          // Science
      
      // Research Organizations
      'site:researchgate.net',     // Research papers
      'site:arxiv.org',            // Scientific papers
      'site:scholar.google.com',   // Google Scholar
    ]
  }
}

// Configuration for Environmental and Climate Data
export const environmentalSites = {
  search: {
    maxResults: 10,
    supportedSites: [
      // Government Environmental Data
      'site:environment.gov.au',   // Australian Department of Environment
      'site:bom.gov.au',           // Bureau of Meteorology
      'site:csiro.au',             // CSIRO
      'site:data.gov',             // US Government Data
      'site:data.gov.uk',          // UK Government Data
      
      // International Organizations
      'site:un.org',               // United Nations
      'site:ipcc.ch',              // Intergovernmental Panel on Climate Change
      'site:unfccc.int',           // UN Framework Convention on Climate Change
      'site:who.int',              // World Health Organization
      
      // Research and Academic
      'site:researchgate.net',     // Research papers
      'site:arxiv.org',            // Scientific papers
      'site:scholar.google.com',   // Google Scholar
      'site:nature.com',           // Nature publications
      'site:science.org',          // Science publications
    ]
  }
}

// Configuration for Education and Learning
export const educationSites = {
  search: {
    maxResults: 10,
    supportedSites: [
      // Educational Platforms
      'site:coursera.org',         // Coursera
      'site:edx.org',              // edX
      'site:udemy.com',            // Udemy
      'site:khanacademy.org',      // Khan Academy
      'site:mit.edu',              // MIT OpenCourseWare
      'site:harvard.edu',          // Harvard resources
      
      // Educational Content
      'site:youtube.com',          // YouTube educational content
      'site:ted.com',              // TED Talks
      'site:wikipedia.org',        // Wikipedia
      'site:britannica.com',       // Encyclopaedia Britannica
      
      // Academic Resources
      'site:scholar.google.com',   // Google Scholar
      'site:researchgate.net',     // Research papers
      'site:arxiv.org',            // Scientific papers
      'site:jstor.org',            // Academic journals
      
      // Government Education
      'site:education.gov.au',     // Australian Department of Education
      'site:data.gov.au',          // Australian Government Data
    ]
  }
}

// How to use these configurations:
// 1. Copy the desired configuration to lib/config.ts
// 2. Replace the existing config object with your chosen configuration
// 3. Restart your development server
// 4. Test your search with relevant keywords

// Example usage:
// For government data analysis: Use governmentDataSites
// For technical development: Use technicalDevelopmentSites
// For academic research: Use academicResearchSites
// For business/finance: Use businessFinanceSites
// For health/medical: Use healthMedicalSites
// For environmental data: Use environmentalSites
// For education: Use educationSites

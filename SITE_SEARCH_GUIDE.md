# Site-Specific Search Guide

## How Site-Specific Search Works

The DataLandscape search engine is designed to search within a predefined list of websites. When you enter a search query, it automatically restricts results to only those specified websites.

## Current Search Configuration

### How It Works

1. **Query Construction**: When you search for "population data", the system creates a query like:
   ```
   population data (site:abs.gov.au OR site:dewr.gov.au OR site:data.gov.au OR ...)
   ```

2. **Google Custom Search**: This query is sent to Google Custom Search API, which returns results only from the specified websites.

3. **Result Filtering**: Results are automatically filtered to show only content from your configured sites.

## Current Supported Sites

### Australian Government Sites
- `site:abs.gov.au` - Australian Bureau of Statistics
- `site:dewr.gov.au` - Department of Employment and Workplace Relations  
- `site:data.gov.au` - Australian Government Data Portal
- `site:ato.gov.au` - Australian Taxation Office
- `site:health.gov.au` - Department of Health
- `site:education.gov.au` - Department of Education

### International Government Data
- `site:data.gov` - US Government Data
- `site:data.gov.uk` - UK Government Data
- `site:data.gc.ca` - Canadian Government Data

### Research and Academic
- `site:researchgate.net` - Research papers and publications
- `site:arxiv.org` - Scientific papers
- `site:scholar.google.com` - Google Scholar

### Technical Documentation
- `site:github.com` - Code repositories and documentation
- `site:stackoverflow.com` - Technical Q&A
- `site:medium.com` - Technical articles
- `site:dev.to` - Developer articles
- `site:hashnode.dev` - Developer blogs

### News and Media
- `site:techcrunch.com` - Tech news
- `site:theverge.com` - Technology news
- `site:arstechnica.com` - Technology news and analysis

### Educational Resources
- `site:css-tricks.com` - CSS tutorials
- `site:smashingmagazine.com` - Web design articles
- `site:alistapart.com` - Web standards
- `site:web.dev` - Web development resources
- `site:developers.google.com` - Google developer docs
- `site:mozilla.org` - Mozilla developer docs
- `site:mdn.io` - MDN Web Docs

## Customizing Your Search Sites

### Method 1: Edit Configuration File

1. Open `lib/config.ts`
2. Modify the `supportedSites` array:

```typescript
export const config = {
  search: {
    maxResults: 10,
    supportedSites: [
      // Add your preferred sites here
      'site:yourdomain.com',
      'site:anothersite.com',
      'site:example.org'
    ]
  },
  // ... rest of config
}
```

### Method 2: Create Custom Site Lists

You can create different site configurations for different use cases:

```typescript
// Government data sites only
const governmentSites = [
  'site:abs.gov.au',
  'site:data.gov.au',
  'site:data.gov',
  'site:data.gov.uk'
]

// Technical documentation only
const techSites = [
  'site:github.com',
  'site:stackoverflow.com',
  'site:medium.com',
  'site:dev.to'
]

// Research papers only
const researchSites = [
  'site:researchgate.net',
  'site:arxiv.org',
  'site:scholar.google.com'
]
```

## Site Search Format

### Basic Format
```
site:domain.com
```

### Examples
- `site:github.com` - Searches only GitHub
- `site:*.gov.au` - Searches all Australian government sites
- `site:example.com/path` - Searches specific path on domain

### Advanced Patterns
- `site:*.edu` - All educational institutions
- `site:*.gov` - All government sites
- `site:example.com OR site:another.com` - Multiple specific sites

## Search Examples

### Government Data Search
**Query**: "population statistics"
**Sites**: Australian government sites
**Results**: Population data from ABS, government portals, etc.

### Technical Documentation Search
**Query**: "React hooks tutorial"
**Sites**: GitHub, Stack Overflow, Medium, Dev.to
**Results**: Tutorials, code examples, documentation

### Research Paper Search
**Query**: "machine learning algorithms"
**Sites**: ResearchGate, arXiv, Google Scholar
**Results**: Academic papers, research publications

## Adding New Sites

### Step 1: Choose Your Sites
Decide which websites you want to include in your search.

### Step 2: Format Correctly
Use the format: `site:domain.com`

### Step 3: Add to Configuration
```typescript
supportedSites: [
  // ... existing sites
  'site:newsite.com',
  'site:anotherdomain.org'
]
```

### Step 4: Test Your Search
Try searching for keywords that should appear on your new sites.

## Best Practices

### 1. Choose Relevant Sites
- Focus on sites that contain the type of content you're looking for
- Consider the quality and reliability of the sites

### 2. Balance Coverage vs. Precision
- Too many sites: May dilute results
- Too few sites: May miss relevant content
- Aim for 10-30 sites for optimal results

### 3. Use Specific Domains
- `site:github.com` is better than `site:*.com`
- More specific domains give more relevant results

### 4. Group Related Sites
- Government data sites together
- Technical documentation sites together
- Research sites together

## Troubleshooting

### No Results Found
1. Check if the sites are accessible
2. Verify the domain format is correct
3. Try broader search terms
4. Check if sites have the content you're looking for

### Too Many Irrelevant Results
1. Use more specific site restrictions
2. Add more targeted keywords
3. Remove sites that don't match your needs

### Slow Search Performance
1. Reduce the number of sites
2. Use more specific domains
3. Consider grouping searches by site type

## Example Customizations

### For Government Data Analysis
```typescript
supportedSites: [
  'site:abs.gov.au',
  'site:data.gov.au',
  'site:data.gov',
  'site:data.gov.uk',
  'site:data.gc.ca',
  'site:researchgate.net'
]
```

### For Technical Development
```typescript
supportedSites: [
  'site:github.com',
  'site:stackoverflow.com',
  'site:medium.com',
  'site:dev.to',
  'site:css-tricks.com',
  'site:web.dev',
  'site:developers.google.com'
]
```

### For Academic Research
```typescript
supportedSites: [
  'site:researchgate.net',
  'site:arxiv.org',
  'site:scholar.google.com',
  'site:jstor.org',
  'site:ieee.org',
  'site:acm.org'
]
```

## API Response Format

When you search, the API returns results in this format:

```json
{
  "items": [
    {
      "title": "Page Title",
      "link": "https://example.com/page",
      "snippet": "Page description...",
      "displayLink": "example.com",
      "formattedUrl": "https://example.com/page"
    }
  ],
  "searchInformation": {
    "totalResults": "150",
    "searchTime": 0.23
  }
}
```

## Performance Considerations

- **Query Length**: Google has a limit on query length (2048 characters)
- **Site Count**: More sites = longer query = potential truncation
- **API Limits**: Google Custom Search has daily quota limits
- **Response Time**: More sites may increase search time

## Next Steps

1. **Customize your site list** based on your specific needs
2. **Test different combinations** to find the optimal setup
3. **Monitor search quality** and adjust as needed
4. **Consider creating multiple configurations** for different use cases

The site-specific search feature gives you complete control over where your searches are performed, ensuring you get relevant results from trusted sources.

# Enhanced Article-Level Search Guide

## Overview

The DataLandscape search engine has been enhanced to display **individual article links** from websites rather than just main website links. This provides much more granular and useful search results.

## What's New

### 🎯 **Article-Level Results**
- **Before**: Search returned main website pages (homepage, about pages, etc.)
- **After**: Search returns specific articles, tutorials, guides, datasets, and research papers

### 🔍 **Enhanced Search Query Building**
The search now uses sophisticated query construction to find individual articles:

```typescript
// Example enhanced query for "population data"
"population data" ("article" OR "post" OR "blog" OR "tutorial" OR "guide" OR "documentation" OR "report" OR "study" OR "research" OR "analysis" OR "dataset" OR "data") (site:abs.gov.au OR site:abs.gov.au*/article/* OR site:abs.gov.au*/post/* OR ...)
```

### 📊 **Article Classification**
Results are automatically classified into different types:

- **Article** - General articles and blog posts
- **Tutorial** - How-to guides and tutorials
- **Guide** - Comprehensive guides and documentation
- **Documentation** - Technical documentation
- **Dataset** - Data files and datasets
- **Research** - Research papers and studies
- **Report** - Reports and analysis

## How It Works

### 1. **Enhanced Query Construction**
The system builds sophisticated search queries that include:

- **Article Keywords**: "article", "post", "blog", "tutorial", "guide", etc.
- **Site Patterns**: Specific URL patterns like `*/article/*`, `*/post/*`, `*/tutorial/*`
- **Domain Restrictions**: Searches within your configured trusted sites

### 2. **Article Pattern Matching**
The search looks for common article URL patterns:

```
*/article/*     - Article pages
*/post/*        - Blog posts
*/blog/*        - Blog entries
*/tutorial/*    - Tutorial pages
*/guide/*       - Guide pages
*/docs/*        - Documentation
*/documentation/* - Technical docs
*/dataset/*     - Dataset pages
*/data/*        - Data resources
*/research/*    - Research papers
*/study/*       - Studies
*/report/*      - Reports
*/analysis/*    - Analysis
*/news/*        - News articles
*/story/*       - Stories
```

### 3. **Result Filtering**
The system filters out non-article results:

**❌ Excluded:**
- Main pages (`/`, `/home`, `/about`)
- Navigation pages (`/search`, `/sitemap`)
- Utility pages (`/contact`, `/privacy`)
- Short paths (likely main pages)
- Number-only paths (`/123`, `/page/1`)

**✅ Included:**
- Deep paths with meaningful content
- Article-specific URLs
- Pages with article metadata
- Content-rich pages

### 4. **Article Information Extraction**
For each result, the system extracts:

- **Article Title**: From URL path or metadata
- **Publication Date**: From article metadata
- **Author**: From article metadata
- **Article Type**: Automatic classification
- **Path Information**: URL structure analysis

## Enhanced Search Results Display

### **Article Type Badges**
Each result shows a colored badge indicating the article type:

- 🔵 **Article** - General articles
- 🟢 **Tutorial** - How-to guides
- 🟣 **Guide** - Comprehensive guides
- 🟠 **Documentation** - Technical docs
- 🔴 **Dataset** - Data resources
- 🟦 **Research** - Research papers

### **Path Information**
Shows the article's location within the website:
```
medium.com / article / nextjs-14-complete-guide
github.com / documentation / react-hooks
```

### **Enhanced Metadata**
- **Publication Date**: When the article was published
- **Author**: Article author information
- **Article Type**: Classified content type
- **Domain**: Source website

## Search Examples

### **Government Data Search**
**Query**: "population statistics"
**Results**: 
- Individual dataset pages from ABS
- Specific research reports
- Data analysis articles
- Statistical publications

### **Technical Search**
**Query**: "React hooks tutorial"
**Results**:
- Individual tutorial pages from GitHub
- Specific blog posts from Medium
- Documentation pages from MDN
- Code examples from Stack Overflow

### **Research Search**
**Query**: "machine learning algorithms"
**Results**:
- Individual research papers from arXiv
- Specific studies from ResearchGate
- Academic articles from Google Scholar
- Technical analysis from academic sites

## Configuration Options

### **Article Keywords**
Customize the keywords used to find articles:

```typescript
articleKeywords: [
  'article', 'post', 'blog', 'tutorial', 'guide', 'documentation',
  'report', 'study', 'research', 'analysis', 'dataset', 'data',
  'news', 'story', 'feature', 'insight', 'perspective', 'opinion'
]
```

### **Article Patterns**
Define URL patterns that indicate article content:

```typescript
articlePatterns: [
  '*/article/*', '*/post/*', '*/blog/*', '*/tutorial/*',
  '*/guide/*', '*/docs/*', '*/documentation/*', '*/dataset/*',
  '*/data/*', '*/research/*', '*/study/*', '*/report/*'
]
```

### **Site-Specific Patterns**
You can add site-specific patterns for better results:

```typescript
// For GitHub
'github.com/*/blob/*', 'github.com/*/wiki/*'

// For Medium
'medium.com/*/*', 'medium.com/p/*'

// For Stack Overflow
'stackoverflow.com/questions/*', 'stackoverflow.com/a/*'
```

## Benefits

### **For Users**
- **More Relevant Results**: Get specific articles instead of main pages
- **Better Content Discovery**: Find individual pieces of content
- **Clearer Context**: See article type and location
- **Faster Access**: Direct links to specific content

### **For Content Discovery**
- **Granular Search**: Find specific articles, not just websites
- **Content Classification**: Understand what type of content you're finding
- **Path Context**: See where content is located within sites
- **Metadata Rich**: Publication dates, authors, and article types

### **For Research**
- **Academic Papers**: Find individual research papers
- **Technical Documentation**: Locate specific documentation pages
- **Data Resources**: Discover individual datasets
- **Reports**: Find specific reports and analysis

## Technical Implementation

### **Query Enhancement**
```typescript
function buildEnhancedQuery(query: string): string {
  const articleKeywords = config.search.articleKeywords
  const siteQueries = config.search.supportedSites.map(site => {
    const domain = site.replace('site:', '')
    const articlePatterns = config.search.articlePatterns.map(pattern => 
      `site:${domain}${pattern}`
    )
    return `(${site} OR ${articlePatterns.join(' OR ')})`
  })
  
  const siteQuery = siteQueries.join(' OR ')
  const enhancedTerms = articleKeywords.map(keyword => `"${keyword}"`).join(' OR ')
  
  return `${query} (${enhancedTerms}) (${siteQuery})`
}
```

### **Result Processing**
```typescript
function processSearchResults(items: any[]): any[] {
  return items.map(item => {
    const articleInfo = extractArticleInfo(item)
    return {
      ...item,
      ...articleInfo,
      title: articleInfo.articleTitle || item.title,
      articleType: classifyArticleType(item.link, item.title, item.snippet)
    }
  }).filter(item => isArticleResult(item.link, item.title))
}
```

### **Article Classification**
```typescript
function classifyArticleType(link: string, title: string, snippet: string): string {
  const url = link.toLowerCase()
  
  if (url.includes('/article/') || url.includes('/post/') || url.includes('/blog/')) {
    return 'Article'
  }
  if (url.includes('/tutorial/') || title.toLowerCase().includes('tutorial')) {
    return 'Tutorial'
  }
  // ... more classifications
}
```

## Performance Considerations

### **Query Length**
- Google Custom Search has a 2048 character limit
- Enhanced queries may approach this limit with many sites
- Consider reducing site count if queries are too long

### **Result Quality**
- More specific queries may return fewer results
- Quality over quantity - better to get relevant articles
- Filtering improves result relevance

### **API Limits**
- Google Custom Search has daily quota limits
- Enhanced queries use the same quota as simple queries
- Consider caching results for repeated searches

## Best Practices

### **For Optimal Results**
1. **Use Specific Keywords**: "React hooks tutorial" vs "React"
2. **Include Content Type**: "population data analysis" vs "population"
3. **Be Specific**: "machine learning algorithms research" vs "machine learning"

### **For Site Configuration**
1. **Choose Relevant Sites**: Focus on sites with good article content
2. **Balance Coverage**: Don't add too many sites (may dilute results)
3. **Test Patterns**: Verify article patterns work for your sites

### **For Content Discovery**
1. **Use Article Types**: Filter by article type badges
2. **Check Paths**: Use path information to understand content location
3. **Review Metadata**: Check publication dates and authors

## Future Enhancements

### **Planned Features**
- **Advanced Filtering**: Filter by article type, date, author
- **Content Preview**: Show article excerpts and summaries
- **Related Articles**: Suggest related content
- **Reading Time**: Estimate article reading time
- **Content Quality Score**: Automated quality assessment

### **Integration Opportunities**
- **Content Analysis**: AI-powered content summarization
- **Citation Tracking**: Track article citations and references
- **Trend Analysis**: Identify trending topics and articles
- **Personalization**: Learn user preferences for better results

The enhanced article-level search provides a much more granular and useful search experience, helping users find specific content rather than just websites.

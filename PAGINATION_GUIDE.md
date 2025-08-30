# Pagination Guide for DataLandscape Search

## Overview

The DataLandscape search engine now includes comprehensive pagination functionality, allowing users to navigate through multiple pages of search results. This feature enhances the user experience by providing access to all available search results in manageable chunks.

## Features

### 🎯 **Multi-Page Navigation**
- **Page-by-page browsing**: Navigate through all available search results
- **Smart pagination controls**: Previous/Next buttons with page numbers
- **Results counter**: Shows current page and total results
- **Loading states**: Visual feedback during page transitions

### 📊 **Pagination Information**
- **Current page**: Shows which page you're currently viewing
- **Total pages**: Displays the total number of available pages
- **Results range**: Shows "Showing X to Y of Z results"
- **Navigation state**: Indicates if previous/next pages are available

### 🔄 **Seamless Navigation**
- **URL state management**: Maintains search query across page changes
- **Request cancellation**: Cancels ongoing requests when navigating
- **Error handling**: Graceful handling of pagination errors
- **Loading indicators**: Shows loading state during page transitions

## How It Works

### 1. **API Pagination**
The search API supports pagination through the `page` parameter:

```typescript
// Request structure
{
  query: "search term",
  page: 2  // Page number (1-based)
}

// Response structure
{
  items: [...],           // Search results for current page
  searchInformation: {...}, // Search metadata
  pagination: {
    currentPage: 2,
    totalPages: 5,
    totalResults: 47,
    resultsPerPage: 10,
    hasNextPage: true,
    hasPreviousPage: true,
    startIndex: 11,
    endIndex: 20
  }
}
```

### 2. **Google Custom Search Integration**
The pagination leverages Google Custom Search API's built-in pagination:

- **`start` parameter**: Starting index for results (1-based)
- **`num` parameter**: Number of results per page (default: 10)
- **Automatic calculation**: Converts page numbers to start indices

### 3. **Frontend Implementation**
The React components handle pagination state and navigation:

```typescript
// Page state management
const [currentPage, setCurrentPage] = useState(1)
const [pagination, setPagination] = useState<PaginationInfo | null>(null)

// Page change handler
const handlePageChange = (page: number) => {
  if (currentQuery) {
    handleSearch(currentQuery, page)
  }
}
```

## User Interface

### **Pagination Controls**
The pagination component provides intuitive navigation:

```
[← Previous] [1] [2] [3] [4] [5] [Next →]
Showing 11 to 20 of 47 results
Page 2 of 5
```

### **Visual Features**
- **Active page highlighting**: Current page is highlighted
- **Disabled states**: Previous/Next buttons are disabled when not available
- **Loading states**: Buttons show loading state during transitions
- **Responsive design**: Works on mobile and desktop

### **Smart Page Display**
- **Ellipsis for large ranges**: Shows "..." for long page lists
- **Always show first/last**: First and last pages are always visible
- **Contextual range**: Shows pages around current page

## Configuration

### **Results Per Page**
Default: 10 results per page (configurable in API)

```typescript
const resultsPerPage = 10
const startIndex = (pageNumber - 1) * resultsPerPage + 1
```

### **Pagination Limits**
- **Google API limit**: Maximum 100 results per request
- **Page calculation**: `totalPages = Math.ceil(totalResults / resultsPerPage)`
- **Start index validation**: Ensures valid page ranges

## API Endpoints

### **Search with Pagination**
```http
POST /api/search
Content-Type: application/json

{
  "query": "search term",
  "page": 2
}
```

### **Response Format**
```json
{
  "items": [
    {
      "title": "Result Title",
      "link": "https://example.com/article",
      "snippet": "Result description...",
      "displayLink": "example.com"
    }
  ],
  "searchInformation": {
    "totalResults": "47",
    "searchTime": 0.23
  },
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalResults": 47,
    "resultsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": true,
    "startIndex": 11,
    "endIndex": 20
  }
}
```

## Error Handling

### **Common Scenarios**
1. **Invalid page number**: Automatically corrected to valid range
2. **API errors**: Graceful fallback with user-friendly messages
3. **Network issues**: Retry mechanism with loading states
4. **Request cancellation**: Proper cleanup when navigating quickly

### **Validation**
```typescript
// Page validation
const pageNumber = Math.max(1, parseInt(page.toString()) || 1)
const startIndex = (pageNumber - 1) * resultsPerPage + 1

// Pagination calculation
const totalPages = Math.ceil(totalResults / resultsPerPage)
const hasNextPage = pageNumber < totalPages
const hasPreviousPage = pageNumber > 1
```

## Performance Considerations

### **Optimizations**
- **Request cancellation**: Aborts ongoing requests when navigating
- **Debounced navigation**: Prevents rapid page changes
- **Caching**: Consider implementing result caching for better performance
- **Lazy loading**: Load results only when needed

### **API Limits**
- **Google Custom Search**: 100 free queries per day
- **Rate limiting**: Implement delays between requests
- **Result limits**: Maximum 100 results per search

## Usage Examples

### **Basic Search with Pagination**
```typescript
// Search for "React tutorial" on page 2
const response = await fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'React tutorial', page: 2 })
})

const data = await response.json()
console.log(`Page ${data.pagination.currentPage} of ${data.pagination.totalPages}`)
```

### **Frontend Navigation**
```typescript
// Handle page change
const handlePageChange = (page: number) => {
  setIsLoading(true)
  handleSearch(currentQuery, page)
}

// Display pagination info
{pagination && (
  <div>
    <p>Page {pagination.currentPage} of {pagination.totalPages}</p>
    <p>Showing {pagination.startIndex} to {pagination.endIndex} of {pagination.totalResults} results</p>
  </div>
)}
```

## Testing

### **Manual Testing**
1. Perform a search with many results
2. Navigate through pages using pagination controls
3. Verify different results on each page
4. Test edge cases (first page, last page, single page)

### **Automated Testing**
Use the provided test script:

```bash
node test-pagination.js
```

This script tests:
- Page navigation
- Result consistency
- Error handling
- Pagination calculations

## Best Practices

### **For Users**
1. **Use specific queries**: More specific queries return better paginated results
2. **Check total results**: Review total result count before browsing pages
3. **Use page numbers**: Click specific page numbers for direct navigation
4. **Monitor loading**: Wait for page transitions to complete

### **For Developers**
1. **Handle loading states**: Always show loading indicators during page changes
2. **Cancel requests**: Abort ongoing requests when navigating
3. **Validate inputs**: Ensure page numbers are within valid ranges
4. **Error boundaries**: Implement proper error handling for pagination failures

## Future Enhancements

### **Planned Features**
- **Infinite scroll**: Alternative to pagination for mobile
- **Result caching**: Cache results to improve performance
- **Advanced filtering**: Filter results within pagination
- **URL state**: Add page numbers to URL for bookmarking
- **Keyboard navigation**: Arrow key support for pagination

### **Integration Opportunities**
- **Search analytics**: Track pagination usage patterns
- **Personalization**: Remember user's preferred results per page
- **A/B testing**: Test different pagination strategies
- **Performance monitoring**: Track pagination performance metrics

The pagination feature provides a robust and user-friendly way to navigate through large sets of search results, enhancing the overall search experience in DataLandscape.

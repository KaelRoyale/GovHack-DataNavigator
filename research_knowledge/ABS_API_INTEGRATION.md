# ABS API Integration

This document describes the integration with the Australian Bureau of Statistics (ABS) Data API, based on the [official ABS Data API documentation](https://www.abs.gov.au/about/data-services/application-programming-interfaces-apis/data-api-user-guide#openapi-specification).

## Overview

The ABS Data API integration allows users to directly query Australian Bureau of Statistics data through a dedicated button in the search interface. This provides access to official statistical data including economic, social, and Census data.

## Features

### 🔍 **ABS Search Button**
- **Location**: Next to the main search button in the search bar
- **Appearance**: Green button with database icon and "ABS" text
- **Functionality**: Directly queries the ABS Data API with the entered search term

### 📊 **Data Integration**
- **API Endpoint**: `https://data.api.abs.gov.au/rest/data`
- **Format**: SDMX-JSON (Statistical Data and Metadata Exchange)
- **Authentication**: No API key required (free access)
- **Response**: Transformed into our standard search result format

### 🎯 **Search Capabilities**
- **Dataflows**: Access to various ABS data collections
- **Time Periods**: Filter by start and end periods
- **Formats**: JSON, XML, CSV support
- **Real-time**: Direct access to latest ABS data

## Technical Implementation

### API Route
- **File**: `app/api/abs-search/route.ts`
- **Method**: POST
- **Input**: `{ query: string, dataflow?: string, startPeriod?: string, endPeriod?: string }`
- **Output**: Standardized search results with ABS data

### Data Transformation
The ABS API response is transformed into our standard `SearchResult` format:

```typescript
interface SearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  dataAsset?: {
    description: string
    collectionDate: string
    purpose: string
    department: string
    metadata: {
      format: string
      license: string
      tags: string[]
    }
    availability: {
      status: string
      custodian: string
      contactEmail: string
    }
    contentAnalysis: {
      summary: string
      keyTopics: string[]
      dataTypes: string[]
      qualityScore: number
    }
  }
}
```

### UI Components
- **SearchBar**: Enhanced with ABS button
- **SearchResults**: Displays ABS data with data asset information
- **Data Asset Analysis**: Shows detailed metadata about ABS datasets

## Usage Examples

### Basic ABS Search
1. Enter a search term (e.g., "population", "employment", "gdp")
2. Click the green "ABS" button
3. View results from ABS Data API

### Supported Queries
- **Demographics**: population, census, age, gender
- **Economics**: gdp, employment, inflation, trade
- **Social**: education, health, housing, crime
- **Geographic**: states, regions, postcodes

## API Configuration

### Base URL
```
https://data.api.abs.gov.au/rest/data
```

### Default Parameters
- **Dataflow**: `jv` (population data)
- **Format**: `jsondata`
- **Accept Header**: `application/vnd.sdmx.data+json`

### Example API Call
```javascript
const response = await fetch('/api/abs-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: 'population',
    dataflow: 'jv',
    startPeriod: '2020',
    endPeriod: '2023'
  })
})
```

## Data Asset Information

Each ABS result includes comprehensive data asset metadata:

### Description
- What the data contains
- Collection methodology
- Statistical significance

### Availability
- **Status**: Public (free access)
- **Custodian**: Australian Bureau of Statistics
- **Contact**: api@abs.gov.au
- **Process**: Direct API access

### Metadata
- **Format**: SDMX-JSON
- **License**: Creative Commons Attribution 4.0 International
- **Tags**: statistics, government, australia, abs
- **Quality Score**: 10/10 (official government data)

## Error Handling

### Common Errors
- **400**: Invalid query parameters
- **404**: Dataflow not found
- **500**: ABS API service issues

### Fallback Behavior
- Returns informative error messages
- Provides links to ABS documentation
- Maintains application stability

## Testing

### Test Script
Run the ABS API test script:
```bash
node test-abs-api.js
```

### Test Queries
- population
- employment
- gdp
- census

## Benefits

### For Users
- **Direct Access**: No need to visit ABS website
- **Structured Data**: Consistent format with other search results
- **Rich Metadata**: Detailed information about data sources
- **Real-time**: Latest ABS data

### For Developers
- **No Authentication**: Free API access
- **SDMX Standard**: Industry-standard format
- **Comprehensive**: Access to all ABS datasets
- **Reliable**: Official government data source

## Future Enhancements

### Planned Features
- **Advanced Filters**: Geographic, temporal, categorical filters
- **Data Visualization**: Charts and graphs for ABS data
- **Export Options**: CSV, Excel, PDF export
- **Saved Queries**: Bookmark frequently used searches
- **Alerts**: Notifications for data updates

### Integration Opportunities
- **Other Government APIs**: Integration with other Australian government data sources
- **International Statistics**: OECD, UN, World Bank data
- **Local Government**: State and territory statistics
- **Academic Sources**: University research data

## Resources

### Documentation
- [ABS Data API User Guide](https://www.abs.gov.au/about/data-services/application-programming-interfaces-apis/data-api-user-guide)
- [SDMX Standard](https://sdmx.org/)
- [OpenAPI Specification](https://api.gov.au/assets/APIs/abs/DataAPI.openapi.html)

### Support
- **ABS API Team**: api@abs.gov.au
- **Technical Issues**: Check ABS API status page
- **Data Questions**: ABS Statistical Information Service

## License

This integration uses ABS data under the Creative Commons Attribution 4.0 International License. Users must attribute the Australian Bureau of Statistics when using this data.

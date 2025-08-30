# Tests Directory

This directory contains all test files for the DataLandscape application.

## Test Files

### API Tests

- **`test-abs-api.js`** - Tests the ABS (Australian Bureau of Statistics) API integration
  - Tests dataflow discovery
  - Tests data retrieval with proper ABS API structure
  - Tests popular dataflows (ALC, CPI, RES_DWELL, etc.)
  - Run with: `node tests/test-abs-api.js`

- **`test-enhanced-abs-api.js`** - Enhanced ABS API tests with additional functionality
  - Tests advanced ABS API features
  - Tests data structure retrieval
  - Run with: `node tests/test-enhanced-abs-api.js`

- **`test-data-ingestion.js`** - Tests the data ingestion pipeline
  - Tests web scraping functionality
  - Tests data processing and storage
  - Run with: `node tests/test-data-ingestion.js`

- **`test-tts.js`** - Tests the Text-to-Speech functionality
  - Tests TTS API integration
  - Tests audio generation
  - Run with: `node tests/test-tts.js`

### Integration Tests

- **`test-abs-links.js`** - Tests ABS link validation and processing
  - Tests ABS website link validation
  - Tests link processing functionality
  - Run with: `node tests/test-abs-links.js`

### Frontend Tests

- **`test-cors.html`** - CORS (Cross-Origin Resource Sharing) test page
  - Tests CORS functionality for API endpoints
  - Tests cross-origin requests
  - Open in browser: `tests/test-cors.html`

## Running Tests

### Prerequisites
1. Make sure the development server is running: `npm run dev`
2. The server should be running on `http://localhost:3002` (or update the port in test files)

### Running Individual Tests

```bash
# Test ABS API
node tests/test-abs-api.js

# Test data ingestion
node tests/test-data-ingestion.js

# Test enhanced ABS API
node tests/test-enhanced-abs-api.js

# Test TTS functionality
node tests/test-tts.js

# Test ABS links
node tests/test-abs-links.js
```

### Running CORS Test
1. Start the development server: `npm run dev`
2. Open `tests/test-cors.html` in your browser
3. Click the test buttons to verify CORS functionality

## Test Configuration

### Environment Variables
Make sure the following environment variables are set in your `.env.local` file:

```env
# Google Custom Search API
NEXT_PUBLIC_GOOGLE_CUSTOM_SEARCH_API_KEY=your_api_key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_engine_id

# ABS API (if required)
ABS_API_KEY=your_abs_api_key

# OpenAI API (for TTS and analysis)
OPENAI_API_KEY=your_openai_api_key
```

### Server Configuration
- Default test server URL: `http://localhost:3002`
- Update the `baseUrl` in test files if using a different port
- Ensure CORS is properly configured in `middleware.ts`

## Test Results

### Expected Output
- ✅ Success messages for working functionality
- ❌ Error messages with details for failed tests
- Console logs for debugging and monitoring

### Common Issues
1. **Server not running**: Make sure `npm run dev` is running
2. **Wrong port**: Update the port number in test files if needed
3. **Missing environment variables**: Check `.env.local` configuration
4. **CORS errors**: Verify middleware configuration

## Adding New Tests

When adding new test files:
1. Place them in the `tests/` directory
2. Use the naming convention: `test-{feature}.js`
3. Update this README with documentation
4. Include proper error handling and logging
5. Test both success and failure scenarios

## Test Maintenance

- Keep test files up to date with API changes
- Update test data when ABS dataflows change
- Verify CORS configuration after deployment
- Monitor test results for regressions

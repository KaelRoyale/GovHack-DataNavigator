# Troubleshooting Google Custom Search API Issues

## Common Error 400 Issues and Solutions

### 1. **Invalid API Key**
**Error**: `400 Bad Request` with "Invalid API key" message

**Solutions**:
- Verify your API key is correct and complete
- Check that you've copied the entire API key (should be ~39 characters)
- Ensure the API key is from the correct Google Cloud project
- Make sure the Custom Search API is enabled in your Google Cloud Console

**Steps to verify**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Check that your API key exists and is active
5. Go to "APIs & Services" > "Library"
6. Search for "Custom Search API" and ensure it's enabled

### 2. **Invalid Search Engine ID**
**Error**: `400 Bad Request` with "Invalid cx parameter" message

**Solutions**:
- Verify your Search Engine ID is correct (should be ~16 characters)
- Check that the search engine is configured properly
- Ensure the search engine is set to search the entire web, not just specific sites

**Steps to verify**:
1. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Select your search engine
3. Go to "Setup" tab
4. Copy the "Search engine ID" (cx parameter)
5. Ensure "Search the entire web" is selected, not "Search only included sites"

### 3. **API Quota Exceeded**
**Error**: `403 Forbidden` with "Quota exceeded" message

**Solutions**:
- Check your daily quota usage in Google Cloud Console
- Free tier allows 100 searches per day
- Consider upgrading to paid tier ($5 per 1000 searches)
- Wait until quota resets (daily at midnight PST)

**Steps to check quota**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Dashboard"
4. Click on "Custom Search API"
5. Check "Quotas" tab for usage

### 4. **Invalid Search Query**
**Error**: `400 Bad Request` with "Invalid query" message

**Solutions**:
- Check that your search query is properly formatted
- Avoid special characters that might cause issues
- Ensure the query length is reasonable (under 2048 characters)
- Check that site restrictions are properly formatted

### 5. **Environment Variables Not Set**
**Error**: "Search service is not configured"

**Solutions**:
- Create a `.env.local` file in your project root
- Add your API credentials:

```env
GOOGLE_CUSTOM_SEARCH_API_KEY=your_actual_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_actual_search_engine_id_here
```

- Restart your development server after adding environment variables
- Ensure the file is named exactly `.env.local` (not `.env`)

## Step-by-Step Setup Verification

### 1. **Verify Google Cloud Project Setup**
```bash
# Check if you have the Google Cloud CLI installed
gcloud auth list

# If not installed, download from:
# https://cloud.google.com/sdk/docs/install
```

### 2. **Verify API Key**
```bash
# Test your API key with a simple curl request
curl "https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_SEARCH_ENGINE_ID&q=test"
```

### 3. **Verify Search Engine Configuration**
1. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Select your search engine
3. Go to "Setup" tab
4. Ensure these settings:
   - **Search the entire web**: Selected
   - **Sites to search**: Leave empty (or add specific sites if needed)
   - **Search engine ID**: Copy this value

### 4. **Test Environment Variables**
Create a test script to verify your environment variables:

```javascript
// test-env.js
console.log('API Key:', process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ? 'Set' : 'Not set');
console.log('Search Engine ID:', process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID ? 'Set' : 'Not set');
```

## Debugging Steps

### 1. **Check Server Logs**
Look at your terminal/console output for detailed error messages. The enhanced error handling will show:
- API key (first 10 characters)
- Search engine ID
- Full search query
- Google API error details

### 2. **Test API Directly**
Use curl or Postman to test the API directly:

```bash
curl "https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_SEARCH_ENGINE_ID&q=test&num=10"
```

### 3. **Check Network Tab**
In your browser's Developer Tools:
1. Open Network tab
2. Perform a search
3. Look for the `/api/search` request
4. Check the response for detailed error information

## Common Configuration Issues

### 1. **Wrong Project**
- Ensure you're using the API key from the correct Google Cloud project
- Check that the Custom Search API is enabled in that project

### 2. **Billing Issues**
- Free tier has daily limits
- Paid tier requires billing to be set up
- Check billing status in Google Cloud Console

### 3. **Search Engine Settings**
- **Search the entire web**: Required for general web search
- **Sites to search**: Can be empty or contain specific sites
- **SafeSearch**: Can be set to off, moderate, or strict

### 4. **API Restrictions**
- Check if your API key has restrictions (IP, referrer, etc.)
- Remove restrictions for testing, then add appropriate ones for production

## Environment Variables Setup

### 1. **Create .env.local file**
```bash
# In your project root directory
touch .env.local
```

### 2. **Add your credentials**
```env
# Google Custom Search API Configuration
GOOGLE_CUSTOM_SEARCH_API_KEY=AIzaSyYourActualApiKeyHere
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=123456789012345678
```

### 3. **Restart development server**
```bash
npm run dev
```

## Alternative Solutions

### 1. **Use Demo Mode**
If you're having trouble with the API setup, use the demo mode:
- Visit `http://localhost:3000/demo`
- This works without any API configuration
- Shows mock data with full functionality

### 2. **Check API Status**
- Visit [Google Cloud Status](https://status.cloud.google.com/)
- Check if Custom Search API is experiencing issues

### 3. **Contact Support**
If issues persist:
- Check [Google Custom Search API Documentation](https://developers.google.com/custom-search/v1/overview)
- Visit [Google Cloud Support](https://cloud.google.com/support)
- Check [Stack Overflow](https://stackoverflow.com/questions/tagged/google-custom-search-api)

## Quick Fix Checklist

- [ ] API key is correct and complete (39 characters)
- [ ] Search engine ID is correct (16 characters)
- [ ] Custom Search API is enabled in Google Cloud Console
- [ ] Search engine is set to "Search the entire web"
- [ ] Environment variables are in `.env.local` file
- [ ] Development server was restarted after adding environment variables
- [ ] API quota hasn't been exceeded
- [ ] No billing issues (if using paid tier)

## Testing Your Setup

1. **Test with a simple query**:
   ```bash
   curl "https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_SEARCH_ENGINE_ID&q=hello"
   ```

2. **Check response**:
   - Should return JSON with search results
   - If error, check the error message for specific issues

3. **Test in your application**:
   - Visit `http://localhost:3000`
   - Try a simple search like "test"
   - Check browser console and server logs for errors

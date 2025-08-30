# OpenAI Content Analysis Setup Guide

This guide will help you set up and use the enhanced OpenAI content analysis feature in your DataLandscape application.

## 🚀 **Quick Setup**

### **1. Get Your OpenAI API Key**

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in with your OpenAI account
3. Click "Create new secret key"
4. Copy the generated API key (starts with `sk-`)

### **2. Configure Environment Variables**

Create or update your `.env.local` file:

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# Other existing configurations...
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_custom_search_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id_here
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
```

### **3. Test Your Setup**

Visit these URLs to test your API key:

- **Test OpenAI API**: `http://localhost:3000/api/test-openai`
- **Test Content Analysis**: Use the "Analyze with AI" button in search results

## 🔧 **How It Works**

### **Enhanced Analysis Features**

The OpenAI integration now provides:

1. **Comprehensive Content Analysis**
   - Article summarization
   - Key points extraction
   - Sentiment analysis
   - Credibility assessment
   - Topic identification

2. **Link Analysis**
   - Domain credibility assessment
   - Content type detection
   - Last updated information
   - Trustworthiness scoring

3. **Content Metadata**
   - Word count analysis
   - Reading time estimation
   - Language detection
   - Topic categorization

### **API Endpoints**

- **Analyze Article**: `POST /api/analyze-article`
  - Supports both `openai` and `gemini` providers
  - Enhanced with link analysis and metadata
  - Configurable content length limits

- **Test OpenAI**: `GET /api/test-openai`
  - Validates API key and connection
  - Tests basic functionality

### **Request Format**

```json
{
  "title": "Article Title",
  "content": "Article content or snippet...",
  "url": "https://example.com/article",
  "provider": "openai",
  "includeLinkAnalysis": true,
  "maxContentLength": 3000
}
```

### **Response Format**

```json
{
  "summary": "Article summary...",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85,
  "provider": "openai",
  "linkAnalysis": {
    "domain": "example.com",
    "credibility": "high|medium|low",
    "contentType": "Article|Documentation|Tutorial|Dataset|Research",
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "metadata": {
    "wordCount": 500,
    "readingTime": 3,
    "language": "en",
    "topics": ["topic1", "topic2", "topic3"]
  }
}
```

## 🎯 **Features**

### **Content Analysis Capabilities**

- **Smart Summarization**: AI-generated concise summaries
- **Key Points Extraction**: Automatic identification of main insights
- **Sentiment Analysis**: Positive/negative/neutral assessment
- **Confidence Scoring**: Reliability indicator for analysis
- **Topic Categorization**: Automatic topic identification

### **Link Analysis Features**

- **Domain Credibility**: Assessment based on trusted domains
- **Content Type Detection**: Automatic categorization
- **Trust Scoring**: High/medium/low credibility levels
- **Update Tracking**: Last modified information

### **Metadata Generation**

- **Word Count**: Automatic text analysis
- **Reading Time**: Estimated reading duration
- **Language Detection**: Content language identification
- **Topic Tags**: AI-generated topic labels

## 🔍 **Usage Examples**

### **1. Basic Content Analysis**

```javascript
const response = await fetch('/api/analyze-article', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Your Article Title',
    content: 'Your article content...',
    url: 'https://example.com/article',
    provider: 'openai'
  })
})
```

### **2. Enhanced Analysis with Link Analysis**

```javascript
const response = await fetch('/api/analyze-article', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Your Article Title',
    content: 'Your article content...',
    url: 'https://example.com/article',
    provider: 'openai',
    includeLinkAnalysis: true,
    maxContentLength: 3000
  })
})
```

### **3. Testing API Connection**

```javascript
// Test basic connectivity
const testResponse = await fetch('/api/test-openai')
const testData = await testResponse.json()

// Test content analysis
const analysisResponse = await fetch('/api/test-openai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Article',
    content: 'This is a test article for OpenAI analysis.',
    url: 'https://example.com/test'
  })
})
```

## 🛠 **UI Integration**

### **Search Results Enhancement**

The AI analysis is integrated into search results with:

- **Analyze Button**: "Analyze with AI" button on each result
- **Enhanced Display**: Rich analysis results with metadata
- **Link Analysis**: Domain credibility and content type
- **Topic Tags**: AI-generated topic categorization
- **Sentiment Indicators**: Visual sentiment display

### **Analysis Display Features**

- **Summary Section**: AI-generated article summary
- **Key Points**: Bulleted list of main insights
- **Link Analysis**: Domain credibility and content type
- **Metadata Panel**: Word count, reading time, topics
- **Sentiment Badge**: Color-coded sentiment indicator
- **Confidence Score**: Analysis reliability percentage

## 🔍 **Troubleshooting**

### **Common Issues**

**❌ 401 Unauthorized Error:**
- Check your API key format (should start with `sk-`)
- Ensure the key is valid and not expired
- Verify the key has proper permissions

**❌ Rate Limit Exceeded:**
- Wait a few minutes before retrying
- Check your OpenAI usage limits
- Consider upgrading your plan if needed

**❌ Invalid Request:**
- Check the input format
- Ensure content is not too long
- Verify all required fields are present

**❌ Analysis Fails:**
- Check browser console for errors
- Verify API key is configured
- Test with `/api/test-openai` endpoint

### **Testing Your Setup**

1. **Test API Key**: Visit `/api/test-openai`
2. **Test Analysis**: Use the "Analyze with AI" button
3. **Check Console**: Look for detailed error messages
4. **Verify Environment**: Ensure `.env.local` is properly configured

## 📊 **Performance Optimization**

### **Content Length Limits**

- **Default**: 3000 characters
- **Configurable**: via `maxContentLength` parameter
- **Optimization**: Longer content may take more time

### **Response Time**

- **Typical**: 2-5 seconds
- **Factors**: Content length, API response time
- **Optimization**: Use appropriate content length limits

### **Cost Management**

- **Token Usage**: Monitor via OpenAI dashboard
- **Optimization**: Use `maxContentLength` to control costs
- **Fallback**: Automatic fallback to mock analysis if API fails

## 🔒 **Security Considerations**

### **API Key Security**

- **Environment Variables**: Store keys in `.env.local`
- **Never Commit**: Ensure `.env.local` is in `.gitignore`
- **Production**: Use secure environment variable management

### **Content Privacy**

- **Data Transmission**: Content sent to OpenAI for analysis
- **No Storage**: Analysis results not permanently stored
- **User Control**: Users can choose not to use AI analysis

## 📈 **Advanced Configuration**

### **Custom Prompts**

You can modify the analysis prompt in `app/api/analyze-article/route.ts`:

```typescript
const prompt = `
Analyze the following article and provide:
1. A concise summary (2-3 sentences)
2. 3-5 key points or insights
3. Overall sentiment (positive/negative/neutral)
4. Content credibility assessment
5. Main topics/themes discussed

Article Title: ${title}
Article URL: ${url}
Article Content: ${truncatedContent}
`
```

### **Provider Selection**

```typescript
// Use OpenAI
provider: 'openai'

// Use Gemini (fallback)
provider: 'gemini'

// Auto-select available provider
// (default behavior)
```

### **Error Handling**

The system includes comprehensive error handling:

- **API Failures**: Automatic fallback to mock analysis
- **Rate Limits**: User-friendly error messages
- **Invalid Keys**: Clear configuration guidance
- **Network Issues**: Graceful degradation

## 🎉 **Success Indicators**

When properly configured, you should see:

- ✅ **Test Endpoint**: `/api/test-openai` returns success
- ✅ **Analysis Button**: "Analyze with AI" appears on search results
- ✅ **Rich Results**: Enhanced analysis with metadata and link analysis
- ✅ **Fast Response**: Analysis completes in 2-5 seconds
- ✅ **No Errors**: Clean console without API errors

Your OpenAI content analysis feature is now fully enabled and ready to use! 🚀

# Gemini AI Integration Setup Guide

This guide will help you set up Google's Gemini AI integration in your DataLandscape application.

## 🚀 **Quick Setup**

### **1. Get Your Gemini API Key**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### **2. Configure Environment Variables**

Create or update your `.env.local` file:

```env
# Google Cloud API Key (used for both Text-to-Speech and Gemini AI)
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

# OpenAI API Key (optional - for comparison)
OPENAI_API_KEY=your_openai_api_key_here

# Other existing configurations...
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_custom_search_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### **3. Test Your Setup**

Visit these URLs to test your API keys:

- **Test Gemini AI**: `http://localhost:3000/api/test-gemini`
- **Test OpenAI**: `http://localhost:3000/api/test-openai`

## 🔧 **How It Works**

### **AI Provider Selection**

The application automatically chooses between available AI providers:

1. **Primary**: Uses the provider specified in the request
2. **Fallback**: If primary fails, tries the other available provider
3. **Mock**: If no API keys are configured, uses mock analysis

### **API Endpoints**

- **Analyze Article**: `POST /api/analyze-article`
  - Supports both `openai` and `gemini` providers
  - Automatically falls back to available provider

### **Response Format**

Both providers return the same response format:

```json
{
  "summary": "Article summary...",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85,
  "provider": "gemini|openai"
}
```

## 🎯 **Features**

### **Gemini AI Capabilities**

- **Article Analysis**: Summarizes content and extracts key points
- **Sentiment Analysis**: Determines positive/negative/neutral sentiment
- **Confidence Scoring**: Provides confidence level for analysis
- **JSON Response**: Structured output for easy integration

### **Error Handling**

- **401 Errors**: Invalid or expired API key
- **429 Errors**: Rate limit exceeded
- **400 Errors**: Invalid request format
- **Fallback**: Automatic fallback to available provider

## 🔍 **Troubleshooting**

### **Common Issues**

**❌ 401 Unauthorized Error:**
- Check your API key format
- Ensure the key is valid and not expired
- Verify the key has Gemini API access

**❌ Rate Limit Exceeded:**
- Wait a few minutes before retrying
- Check your Google Cloud quotas

**❌ Invalid Request:**
- Check the input format
- Ensure content is not too long

### **Testing Your Setup**

1. **Test API Key**: Visit `/api/test-gemini`
2. **Test Analysis**: Use the "Analyze with AI" button in search results
3. **Check Console**: Look for detailed error messages

## 📊 **Comparison: Gemini vs OpenAI**

| Feature | Gemini AI | OpenAI |
|---------|-----------|---------|
| **API Key** | Google Cloud API Key | OpenAI API Key |
| **Model** | gemini-pro | gpt-3.5-turbo |
| **Cost** | Generally lower | Variable |
| **Response Time** | Fast | Fast |
| **Quality** | High | High |
| **JSON Support** | ✅ | ✅ |

## 🛠 **Advanced Configuration**

### **Custom Prompts**

You can modify the analysis prompt in `app/api/analyze-article/route.ts`:

```typescript
const prompt = `
Analyze the following article and provide:
1. A concise summary (2-3 sentences) of the main points
2. 3-5 key points or insights
3. Overall sentiment (positive/negative/neutral)

Article Title: ${title}
Article Content: ${content.substring(0, 2000)}...

Please respond in JSON format:
{
  "summary": "Brief summary here",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85
}
`
```

### **Model Parameters**

Adjust Gemini model parameters:

```typescript
generationConfig: {
  temperature: 0.3,        // Creativity (0.0-1.0)
  maxOutputTokens: 500,    // Maximum response length
  topP: 0.8,              // Nucleus sampling
  topK: 40                // Top-k sampling
}
```

## 🔐 **Security Best Practices**

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor usage** to prevent unexpected charges
5. **Set up billing alerts** in Google Cloud Console

## 📚 **Additional Resources**

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Key Management](https://makersuite.google.com/app/apikey)

## 🎉 **Success Indicators**

Your Gemini AI integration is working correctly when:

- ✅ `/api/test-gemini` returns success
- ✅ "Analyze with AI" button works in search results
- ✅ AI analysis shows "GEMINI" as the provider
- ✅ Analysis provides meaningful summaries and key points
- ✅ No 401 or other API errors in console

---

**Need Help?** Check the console logs for detailed error messages or test your API key using the provided test endpoints.

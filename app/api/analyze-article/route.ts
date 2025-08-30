import { NextRequest, NextResponse } from 'next/server'

interface AnalyzeRequest {
  title: string
  content: string
  url: string
  provider?: 'openai' | 'gemini'
  includeLinkAnalysis?: boolean
  maxContentLength?: number
}

interface AnalyzeResponse {
  summary: string
  keyPoints: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  provider: string
  linkAnalysis?: {
    domain: string
    credibility: 'high' | 'medium' | 'low'
    contentType: string
    lastUpdated?: string
  }
  metadata?: {
    wordCount: number
    readingTime: number
    language: string
    topics: string[]
  }
}

export async function POST(request: NextRequest) {
  let title = '', content = '', url = '', includeLinkAnalysis = true, maxContentLength = 3000
  
  try {
    const body: AnalyzeRequest = await request.json()
    const { 
      title: reqTitle, 
      content: reqContent, 
      url: reqUrl, 
      provider = 'openai',
      includeLinkAnalysis: reqIncludeLinkAnalysis = true,
      maxContentLength: reqMaxContentLength = 3000
    } = body

    title = reqTitle
    content = reqContent
    url = reqUrl
    includeLinkAnalysis = reqIncludeLinkAnalysis
    maxContentLength = reqMaxContentLength

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check for API keys
    const openaiApiKey = process.env.OPENAI_API_KEY
    const geminiApiKey = process.env.GOOGLE_CLOUD_API_KEY

    if (!openaiApiKey && !geminiApiKey) {
      // Return enhanced mock analysis if no API keys are configured
      return NextResponse.json({
        summary: generateMockSummary(title, content),
        keyPoints: extractKeyPoints(content),
        sentiment: analyzeSentiment(content),
        confidence: 0.85,
        provider: 'mock',
        linkAnalysis: includeLinkAnalysis ? analyzeLink(url) : undefined,
        metadata: generateMetadata(content)
      })
    }

    // Try OpenAI first, then Gemini as fallback
    let analysis: AnalyzeResponse

    if (provider === 'openai' && openaiApiKey) {
      analysis = await analyzeWithOpenAI(title, content, url, openaiApiKey, includeLinkAnalysis, maxContentLength)
    } else if (provider === 'gemini' && geminiApiKey) {
      analysis = await analyzeWithGemini(title, content, url, geminiApiKey, includeLinkAnalysis, maxContentLength)
    } else {
      // Fallback to available provider
      if (openaiApiKey) {
        analysis = await analyzeWithOpenAI(title, content, url, openaiApiKey, includeLinkAnalysis, maxContentLength)
      } else if (geminiApiKey) {
        analysis = await analyzeWithGemini(title, content, url, geminiApiKey, includeLinkAnalysis, maxContentLength)
      } else {
        throw new Error('No AI providers available')
      }
    }

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('AI analysis error:', error)
    
    // Return enhanced fallback analysis
    return NextResponse.json({
      summary: 'Unable to analyze content with AI. Please try again later.',
      keyPoints: ['Analysis temporarily unavailable'],
      sentiment: 'neutral' as const,
      confidence: 0.0,
      provider: 'fallback',
      linkAnalysis: includeLinkAnalysis ? analyzeLink(url) : undefined,
      metadata: generateMetadata(content)
    })
  }
}

async function analyzeWithOpenAI(
  title: string, 
  content: string, 
  url: string, 
  apiKey: string, 
  includeLinkAnalysis: boolean,
  maxContentLength: number
): Promise<AnalyzeResponse> {
  // Validate API key format
  if (!apiKey || !apiKey.startsWith('sk-')) {
    console.error('Invalid OpenAI API key format. Key should start with "sk-"')
    throw new Error('Invalid OpenAI API key format')
  }

  const truncatedContent = content.length > maxContentLength 
    ? content.substring(0, maxContentLength) + '...'
    : content

  const prompt = `
Analyze the following article and provide a comprehensive analysis:

Article Title: ${title}
Article URL: ${url}
Article Content: ${truncatedContent}

Please provide:
1. A concise summary (2-3 sentences) of the main points
2. 3-5 key points or insights
3. Overall sentiment (positive/negative/neutral)
4. Content credibility assessment
5. Main topics/themes discussed

Please respond in JSON format:
{
  "summary": "Brief summary here",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85,
  "credibility": "high|medium|low",
  "topics": ["topic1", "topic2", "topic3"]
}
`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes articles and provides comprehensive summaries with key insights, sentiment analysis, and credibility assessment. Always respond in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        apiKeyPrefix: apiKey.substring(0, 10) + '...' // Log first 10 chars for debugging
      })

      // Handle specific error codes
      if (response.status === 401) {
        throw new Error('OpenAI API key is invalid or expired. Please check your API key.')
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.')
      } else if (response.status === 400) {
        throw new Error('OpenAI API request is invalid. Please check your input.')
      } else {
        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`)
      }
    }

    const data = await response.json()
    const analysisText = data.choices[0]?.message?.content || ''

    try {
      const analysis = JSON.parse(analysisText)
      return {
        summary: analysis.summary || 'No summary available',
        keyPoints: analysis.keyPoints || [],
        sentiment: analysis.sentiment || 'neutral',
        confidence: analysis.confidence || 0.8,
        provider: 'openai',
        linkAnalysis: includeLinkAnalysis ? analyzeLink(url) : undefined,
        metadata: {
          ...generateMetadata(content),
          topics: analysis.topics || []
        }
      }
    } catch (parseError) {
      console.warn('Failed to parse OpenAI JSON response, using fallback:', parseError)
      // If JSON parsing fails, extract summary from text
      return {
        summary: analysisText.substring(0, 200) + '...',
        keyPoints: extractKeyPoints(content),
        sentiment: analyzeSentiment(content),
        confidence: 0.7,
        provider: 'openai',
        linkAnalysis: includeLinkAnalysis ? analyzeLink(url) : undefined,
        metadata: generateMetadata(content)
      }
    }
  } catch (error) {
    console.error('OpenAI API call failed:', error)
    throw error
  }
}

async function analyzeWithGemini(
  title: string, 
  content: string, 
  url: string, 
  apiKey: string, 
  includeLinkAnalysis: boolean,
  maxContentLength: number
): Promise<AnalyzeResponse> {
  // Validate API key format
  if (!apiKey) {
    console.error('Invalid Gemini API key')
    throw new Error('Invalid Gemini API key')
  }

  const truncatedContent = content.length > maxContentLength 
    ? content.substring(0, maxContentLength) + '...'
    : content

  const prompt = `
Analyze the following article and provide a comprehensive analysis:

Article Title: ${title}
Article URL: ${url}
Article Content: ${truncatedContent}

Please provide:
1. A concise summary (2-3 sentences) of the main points
2. 3-5 key points or insights
3. Overall sentiment (positive/negative/neutral)
4. Content credibility assessment
5. Main topics/themes discussed

Please respond in JSON format:
{
  "summary": "Brief summary here",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85,
  "credibility": "high|medium|low",
  "topics": ["topic1", "topic2", "topic3"]
}
`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful assistant that analyzes articles and provides comprehensive summaries with key insights, sentiment analysis, and credibility assessment. Always respond in valid JSON format. ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 800,
          topP: 0.8,
          topK: 40
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        apiKeyPrefix: apiKey.substring(0, 10) + '...'
      })

      // Handle specific error codes
      if (response.status === 401) {
        throw new Error('Gemini API key is invalid or expired. Please check your API key.')
      } else if (response.status === 429) {
        throw new Error('Gemini API rate limit exceeded. Please try again later.')
      } else if (response.status === 400) {
        throw new Error('Gemini API request is invalid. Please check your input.')
      } else {
        throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`)
      }
    }

    const data = await response.json()
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    try {
      const analysis = JSON.parse(analysisText)
      return {
        summary: analysis.summary || 'No summary available',
        keyPoints: analysis.keyPoints || [],
        sentiment: analysis.sentiment || 'neutral',
        confidence: analysis.confidence || 0.8,
        provider: 'gemini',
        linkAnalysis: includeLinkAnalysis ? analyzeLink(url) : undefined,
        metadata: {
          ...generateMetadata(content),
          topics: analysis.topics || []
        }
      }
    } catch (parseError) {
      console.warn('Failed to parse Gemini JSON response, using fallback:', parseError)
      // If JSON parsing fails, extract summary from text
      return {
        summary: analysisText.substring(0, 200) + '...',
        keyPoints: extractKeyPoints(content),
        sentiment: analyzeSentiment(content),
        confidence: 0.7,
        provider: 'gemini',
        linkAnalysis: includeLinkAnalysis ? analyzeLink(url) : undefined,
        metadata: generateMetadata(content)
      }
    }
  } catch (error) {
    console.error('Gemini API call failed:', error)
    throw error
  }
}

function analyzeLink(url: string): { domain: string; credibility: 'high' | 'medium' | 'low'; contentType: string; lastUpdated?: string } {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')
    
    // Simple domain credibility assessment
    const credibleDomains = [
      'abs.gov.au', 'data.gov.au', 'gov.au', 'edu.au', 'org.au',
      'github.com', 'stackoverflow.com', 'medium.com', 'dev.to',
      'mozilla.org', 'w3.org', 'ietf.org', 'rfc-editor.org'
    ]
    
    const credibility: 'high' | 'medium' | 'low' = credibleDomains.some(d => domain.includes(d)) ? 'high' : 'medium'
    
    // Determine content type based on domain and path
    let contentType = 'Article'
    if (urlObj.pathname.includes('/docs/') || urlObj.pathname.includes('/documentation/')) {
      contentType = 'Documentation'
    } else if (urlObj.pathname.includes('/tutorial/') || urlObj.pathname.includes('/guide/')) {
      contentType = 'Tutorial'
    } else if (urlObj.pathname.includes('/dataset/') || urlObj.pathname.includes('/data/')) {
      contentType = 'Dataset'
    } else if (urlObj.pathname.includes('/research/') || urlObj.pathname.includes('/study/')) {
      contentType = 'Research'
    }
    
    return {
      domain,
      credibility,
      contentType,
      lastUpdated: new Date().toISOString() // Mock date
    }
  } catch {
    return {
      domain: 'unknown',
      credibility: 'low',
      contentType: 'Unknown',
      lastUpdated: new Date().toISOString()
    }
  }
}

function generateMetadata(content: string) {
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200) // Average reading speed
  const language = 'en' // Default to English
  
  return {
    wordCount,
    readingTime,
    language,
    topics: []
  }
}

function generateMockSummary(title: string, content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  const firstSentence = sentences[0] || ''
  const secondSentence = sentences[1] || ''
  
  return `${firstSentence.substring(0, 100)}... ${secondSentence.substring(0, 100)}...`
}

function extractKeyPoints(content: string): string[] {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30)
  const keyPoints = sentences.slice(0, 3).map(s => s.trim().substring(0, 100) + '...')
  return keyPoints.length > 0 ? keyPoints : ['Key points could not be extracted']
}

function analyzeSentiment(content: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'improve', 'benefit', 'advantage', 'effective', 'efficient', 'innovative', 'breakthrough', 'solution', 'optimize', 'enhance']
  const negativeWords = ['bad', 'poor', 'negative', 'problem', 'issue', 'fail', 'risk', 'concern', 'error', 'bug', 'crash', 'slow', 'expensive', 'difficult', 'complex']
  
  const lowerContent = content.toLowerCase()
  const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length
  const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

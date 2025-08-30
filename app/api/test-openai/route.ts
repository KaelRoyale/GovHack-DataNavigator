import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!openaiApiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API key not configured',
        details: 'Please set OPENAI_API_KEY in your environment variables'
      }, { status: 400 })
    }

    // Test OpenAI API with a simple request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides brief responses.'
          },
          {
            role: 'user',
            content: 'Say "Hello from OpenAI!" and provide a one-sentence summary of what you can do.'
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API test failed',
        details: {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        }
      }, { status: response.status })
    }

    const data = await response.json()
    const message = data.choices[0]?.message?.content || 'No response received'

    return NextResponse.json({
      status: 'success',
      message: 'OpenAI API is working correctly',
      response: message,
      model: data.model,
      usage: data.usage
    })

  } catch (error) {
    console.error('OpenAI test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'OpenAI API test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, url } = body

    if (!title || !content) {
      return NextResponse.json({
        status: 'error',
        message: 'Title and content are required'
      }, { status: 400 })
    }

    // Test the analyze-article endpoint
    const analyzeResponse = await fetch(`${request.nextUrl.origin}/api/analyze-article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        url: url || 'https://example.com',
        provider: 'openai',
        includeLinkAnalysis: true,
        maxContentLength: 1000
      })
    })

    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse.text()
      return NextResponse.json({
        status: 'error',
        message: 'Content analysis failed',
        details: {
          status: analyzeResponse.status,
          statusText: analyzeResponse.statusText,
          error: errorData
        }
      }, { status: analyzeResponse.status })
    }

    const analysisData = await analyzeResponse.json()

    return NextResponse.json({
      status: 'success',
      message: 'Content analysis completed successfully',
      analysis: analysisData
    })

  } catch (error) {
    console.error('Content analysis test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Content analysis test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

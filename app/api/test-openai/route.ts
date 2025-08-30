import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API key not found in environment variables',
        details: 'Please add OPENAI_API_KEY to your .env.local file'
      }, { status: 400 })
    }

    // Validate API key format
    if (!openaiApiKey.startsWith('sk-')) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid OpenAI API key format',
        details: 'API key should start with "sk-"',
        keyPrefix: openaiApiKey.substring(0, 10) + '...'
      }, { status: 400 })
    }

    // Test the API key with a simple request
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API Test Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      })

      if (response.status === 401) {
        return NextResponse.json({
          status: 'error',
          message: 'OpenAI API key is invalid or expired',
          details: 'Please check your API key at https://platform.openai.com/api-keys',
          errorCode: 401
        }, { status: 401 })
      } else {
        return NextResponse.json({
          status: 'error',
          message: `OpenAI API error: ${response.status}`,
          details: errorData,
          errorCode: response.status
        }, { status: response.status })
      }
    }

    const data = await response.json()
    
    return NextResponse.json({
      status: 'success',
      message: 'OpenAI API key is valid',
      details: 'API connection successful',
      availableModels: data.data?.length || 0,
      keyPrefix: openaiApiKey.substring(0, 10) + '...'
    })

  } catch (error) {
    console.error('OpenAI API test failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test OpenAI API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const geminiApiKey = process.env.GOOGLE_CLOUD_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Gemini API key not found in environment variables',
        details: 'Please add GOOGLE_CLOUD_API_KEY to your .env.local file'
      }, { status: 400 })
    }

    // Test the API key with a simple request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro?key=${geminiApiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API Test Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      })

      if (response.status === 401) {
        return NextResponse.json({
          status: 'error',
          message: 'Gemini API key is invalid or expired',
          details: 'Please check your API key at https://makersuite.google.com/app/apikey',
          errorCode: 401
        }, { status: 401 })
      } else {
        return NextResponse.json({
          status: 'error',
          message: `Gemini API error: ${response.status}`,
          details: errorData,
          errorCode: response.status
        }, { status: response.status })
      }
    }

    const data = await response.json()
    
    return NextResponse.json({
      status: 'success',
      message: 'Gemini API key is valid',
      details: 'API connection successful',
      modelName: data.name || 'gemini-pro',
      modelDescription: data.description || 'Gemini Pro model',
      keyPrefix: geminiApiKey.substring(0, 10) + '...'
    })

  } catch (error) {
    console.error('Gemini API test failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test Gemini API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

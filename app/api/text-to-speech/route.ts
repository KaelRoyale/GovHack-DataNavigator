import { NextRequest, NextResponse } from 'next/server'

interface TextToSpeechRequest {
  text: string
  voice?: {
    languageCode?: string
    name?: string
    ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL'
  }
  audioConfig?: {
    audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS'
    speakingRate?: number
    pitch?: number
    volumeGainDb?: number
  }
}

interface GoogleTTSResponse {
  audioContent: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TextToSpeechRequest = await request.json()
    const { text, voice = {}, audioConfig = {} } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    // Get Google Cloud API key from environment
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY
    
    if (!apiKey) {
      console.error('Google Cloud API key not configured')
      return NextResponse.json(
        { error: 'Text-to-speech service is not configured' },
        { status: 500 }
      )
    }

    // Prepare the request payload for Google Cloud Text-to-Speech
    const ttsPayload = {
      input: {
        text: text.length > 5000 ? text.substring(0, 5000) + '...' : text // Limit text length
      },
      voice: {
        languageCode: voice.languageCode || 'en-US',
        name: voice.name || 'en-US-Standard-A',
        ssmlGender: voice.ssmlGender || 'FEMALE'
      },
      audioConfig: {
        audioEncoding: audioConfig.audioEncoding || 'MP3',
        speakingRate: audioConfig.speakingRate || 1.0,
        pitch: audioConfig.pitch || 0.0,
        volumeGainDb: audioConfig.volumeGainDb || 0.0
      }
    }

    console.log('TTS Request:', {
      textLength: text.length,
      languageCode: ttsPayload.voice.languageCode,
      voiceName: ttsPayload.voice.name
    })

    // Make request to Google Cloud Text-to-Speech API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ttsPayload)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google TTS API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })

      let errorMessage = 'Text-to-speech service temporarily unavailable'
      
      if (response.status === 400) {
        errorMessage = 'Invalid text or voice configuration'
      } else if (response.status === 403) {
        errorMessage = 'Text-to-speech service access denied'
      } else if (response.status === 429) {
        errorMessage = 'Text-to-speech service rate limit exceeded'
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data: GoogleTTSResponse = await response.json()
    
    if (!data.audioContent) {
      return NextResponse.json(
        { error: 'No audio content received from TTS service' },
        { status: 500 }
      )
    }

    console.log('TTS Response: Audio content generated successfully')

    // Return the audio content as base64
    return NextResponse.json({
      audioContent: data.audioContent,
      textLength: text.length,
      voice: ttsPayload.voice,
      audioConfig: ttsPayload.audioConfig
    })

  } catch (error) {
    console.error('Text-to-speech API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}

// GET endpoint to get available voices
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Text-to-speech service is not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const languageCode = searchParams.get('languageCode') || 'en-US'

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}&languageCode=${languageCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch available voices' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      voices: data.voices || [],
      languageCode
    })

  } catch (error) {
    console.error('Voice list API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    )
  }
}

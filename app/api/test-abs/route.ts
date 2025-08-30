import { NextRequest, NextResponse } from 'next/server'
import { handleCors, addCorsHeaders } from '@/lib/cors'

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const response = NextResponse.json({ 
    message: 'ABS Test API is working',
    status: 'ok',
    timestamp: new Date().toISOString()
  })
  return addCorsHeaders(response, request)
}

export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const body = await request.json()
    const response = NextResponse.json({ 
      message: 'ABS Test POST is working',
      receivedData: body,
      status: 'ok',
      timestamp: new Date().toISOString()
    })
    return addCorsHeaders(response, request)
  } catch (error) {
    const response = NextResponse.json({ 
      error: 'Invalid JSON in request body',
      status: 'error'
    }, { status: 400 })
    return addCorsHeaders(response, request)
  }
}

import { NextRequest, NextResponse } from 'next/server'

export function corsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || '*'
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }
}

export function handleCors(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(request),
    })
  }
}

export function addCorsHeaders(response: NextResponse, request: NextRequest) {
  const headers = corsHeaders(request)
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

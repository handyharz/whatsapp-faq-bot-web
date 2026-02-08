import { NextRequest, NextResponse } from 'next/server'
import { fetchBackendAPI } from '../../../../lib/fetch-utils'

export async function POST(request: NextRequest) {
  try {
    // Get cookies from request
    const cookies = request.headers.get('cookie') || ''
    
    // Proxy to backend
    const response = await fetchBackendAPI('/api/client/whatsapp/disconnect', {
      method: 'POST',
      headers: {
        'Cookie': cookies,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to disconnect WhatsApp', details: data.details },
        { status: response.status }
      )
    }

    // Forward response with cookies
    const nextResponse = NextResponse.json(data, { status: response.status })
    
    // Forward Set-Cookie headers from backend
    const setCookieHeaders = response.headers.getSetCookie()
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie)
    })

    return nextResponse
  } catch (error: any) {
    console.error('WhatsApp disconnect error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

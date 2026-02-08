import { NextRequest, NextResponse } from 'next/server'
import { fetchBackendAPI } from '../../lib/fetch-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.businessName || !body.email || !body.password || !body.whatsappNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, email, password, whatsappNumber' },
        { status: 400 }
      )
    }

    // Proxy to backend API
    const response = await fetchBackendAPI('/api/workspaces', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create workspace' },
        { status: response.status }
      )
    }

    // Forward cookies from backend to client
    const cookies = response.headers.get('set-cookie')
    if (cookies) {
      const cookieHeaders = cookies.split(', ')
      const responseHeaders = new Headers()
      
      cookieHeaders.forEach(cookie => {
        responseHeaders.append('Set-Cookie', cookie)
      })
      
      return NextResponse.json(data, { 
        status: 201,
        headers: responseHeaders
      })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Workspace creation error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

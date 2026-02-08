import { NextRequest, NextResponse } from 'next/server'
import { fetchBackendAPI } from '../../../lib/fetch-utils'

export async function GET(request: NextRequest) {
  try {
    // Proxy to backend API
    const response = await fetchBackendAPI('/api/admin/connection-status', {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch connection status' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Connection status error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '../../../lib/fetch-utils';

/**
 * Get client settings
 * Proxies request to backend API server
 */
export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the request (contains JWT tokens)
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetchBackendAPI(
      '/api/client/settings',
      {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader,
        },
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch settings' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update client settings
 * Proxies request to backend API server
 */
export async function PUT(request: NextRequest) {
  try {
    // Forward cookies from the request (contains JWT tokens)
    const cookieHeader = request.headers.get('cookie') || '';

    const updates = await request.json();

    const response = await fetchBackendAPI(
      '/api/client/settings',
      {
        method: 'PUT',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to update settings' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

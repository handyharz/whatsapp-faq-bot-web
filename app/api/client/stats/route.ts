import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '../../../lib/fetch-utils';

/**
 * Get client statistics
 * Proxies request to backend API server
 */
export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the request (contains JWT tokens)
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetchBackendAPI(
      '/api/client/stats',
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
        { error: data.error || 'Failed to fetch statistics' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

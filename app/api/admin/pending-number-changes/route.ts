import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '../../../lib/fetch-utils';

/**
 * Get pending WhatsApp number change requests (admin only)
 * Proxies request to backend API server
 */
export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetchBackendAPI(
      '/api/admin/pending-number-changes',
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
        { error: data.error || 'Failed to fetch pending requests' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin pending requests error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

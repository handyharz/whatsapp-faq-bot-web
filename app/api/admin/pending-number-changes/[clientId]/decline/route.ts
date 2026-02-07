import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '../../../../../lib/fetch-utils';

/**
 * Decline WhatsApp number change request (admin only)
 * Proxies request to backend API server
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const { clientId } = await params;
    const body = await request.json();

    const response = await fetchBackendAPI(
      `/api/admin/pending-number-changes/${clientId}/decline`,
      {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to decline request' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin decline request error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

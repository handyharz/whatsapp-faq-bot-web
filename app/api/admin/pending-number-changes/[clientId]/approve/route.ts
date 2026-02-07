import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '../../../../../lib/fetch-utils';

/**
 * Approve WhatsApp number change request (admin only)
 * Proxies request to backend API server
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const { clientId } = params;

    const response = await fetchBackendAPI(
      `/api/admin/pending-number-changes/${clientId}/approve`,
      {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to approve request' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin approve request error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

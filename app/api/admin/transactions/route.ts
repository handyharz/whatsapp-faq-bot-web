import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '@/app/lib/fetch-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') || '50';
    const page = searchParams.get('page') || '1';

    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    if (status) params.append('status', status);
    params.append('limit', limit);
    params.append('page', page);

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetchBackendAPI(`/api/admin/transactions?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin transactions error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '@/app/lib/fetch-utils';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetchBackendAPI('/api/admin/transactions/stats', {
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
    console.error('Admin transaction stats error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

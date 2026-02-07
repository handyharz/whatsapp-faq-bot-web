import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '../../../../lib/fetch-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const { clientId } = await params;

    const response = await fetchBackendAPI(
      `/api/admin/client/${clientId}`,
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
        { error: data.error || 'Failed to fetch client' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin get client error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const { clientId } = await params;
    const body = await request.json();

    const response = await fetchBackendAPI(
      `/api/admin/client/${clientId}`,
      {
        method: 'PUT',
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
        { error: data.error || 'Failed to update client' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin update client error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

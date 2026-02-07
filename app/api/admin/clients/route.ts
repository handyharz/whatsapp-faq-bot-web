import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '../../../lib/fetch-utils';

export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the request
    const cookieHeader = request.headers.get('cookie') || '';
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const tier = searchParams.get('tier') || '';
    const search = searchParams.get('search') || '';
    
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    if (tier) queryParams.append('tier', tier);
    if (search) queryParams.append('search', search);

    const endpoint = `/api/admin/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetchBackendAPI(
      endpoint,
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
        { error: data.error || 'Failed to fetch clients' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin clients error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Forward cookies from the request
    const cookieHeader = request.headers.get('cookie') || '';
    
    const body = await request.json();
    
    const response = await fetchBackendAPI(
      '/api/admin/clients',
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
        { error: data.error || 'Failed to create client' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Admin create client error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '@/app/lib/fetch-utils';

export async function POST(request: NextRequest) {
  try {
    const { tier } = await request.json();

    if (!tier) {
      return NextResponse.json(
        { error: 'Missing tier' },
        { status: 400 }
      );
    }

    // Get cookies from the incoming request to forward authentication
    const cookieHeader = request.headers.get('cookie') || '';

    // Forward to backend API (clientId comes from JWT token in cookies)
    const response = await fetchBackendAPI('/api/client/payment-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader, // Forward cookies for authentication
      },
      body: JSON.stringify({ tier }),
    });

    const data = await response.json();

    // Forward any new cookies from backend response
    const nextResponse = NextResponse.json(data, { status: response.status });
    
    // Copy cookies from backend response
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error('Payment link creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

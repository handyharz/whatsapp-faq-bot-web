import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '@/app/lib/fetch-utils';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing payment reference' },
        { status: 400 }
      );
    }

    // Get cookies from the incoming request to forward authentication
    const cookieHeader = request.headers.get('cookie') || '';

    // Verify payment with backend
    const response = await fetchBackendAPI('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({ reference }),
    });

    const data = await response.json();

    // Forward any new cookies from backend response
    const nextResponse = NextResponse.json(data, { status: response.status });
    
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

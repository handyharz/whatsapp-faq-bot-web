import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '../../../lib/fetch-utils';

/**
 * Get client FAQs
 * Proxies request to backend API server
 */
export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the request (contains JWT tokens)
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetchBackendAPI(
      '/api/client/faqs',
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
        { error: data.error || 'Failed to fetch FAQs' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Get FAQs error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update client FAQs
 * Proxies request to backend API server
 */
export async function PUT(request: NextRequest) {
  try {
    // Forward cookies from the request (contains JWT tokens)
    const cookieHeader = request.headers.get('cookie') || '';

    const body = await request.json();

    if (!Array.isArray(body.faqs)) {
      return NextResponse.json(
        { error: 'Invalid FAQs format' },
        { status: 400 }
      );
    }

    const response = await fetchBackendAPI(
      '/api/client/faqs',
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
        { error: data.error || 'Failed to update FAQs' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update FAQs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

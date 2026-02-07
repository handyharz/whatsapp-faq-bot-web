/**
 * Next.js API route: Logout
 * Proxies to backend API
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '@/app/lib/fetch-utils';

export async function POST(request: NextRequest) {
  try {
    const response = await fetchBackendAPI('/api/auth/logout', {
      method: 'POST',
    });

    const data = await response.json();

    const nextResponse = NextResponse.json(data);
    
    // Clear cookies
    // Note: Next.js cookies.delete() doesn't accept options, but cookies are cleared by setting them to empty with same options
    nextResponse.cookies.set('accessToken', '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    nextResponse.cookies.set('refreshToken', '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return nextResponse;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}

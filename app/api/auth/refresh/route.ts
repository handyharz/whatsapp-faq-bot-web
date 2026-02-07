/**
 * Next.js API route: Refresh access token
 * Proxies to backend API
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '@/app/lib/fetch-utils';

export async function POST(request: NextRequest) {
  try {
    // Forward cookies from request
    const cookieHeader = request.headers.get('cookie') || '';
    
    const response = await fetchBackendAPI('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Forward cookies from backend (new access token)
    const setCookieHeader = response.headers.get('set-cookie');
    const nextResponse = NextResponse.json(data);
    
    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) 
        ? setCookieHeader 
        : setCookieHeader.split(',').map(c => c.trim());
      
      cookies.forEach(cookie => {
        const [nameValue, ...rest] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        if (!name || !value) return;
        
        const cookieOptions: any = {
          httpOnly: true,
          sameSite: 'lax',
          path: '/', // Make cookie available across all paths
        };
        
        rest.forEach((option: string) => {
          const trimmed = option.trim().toLowerCase();
          if (trimmed === 'httponly') {
            cookieOptions.httpOnly = true;
          } else if (trimmed.startsWith('max-age=')) {
            cookieOptions.maxAge = parseInt(trimmed.split('=')[1]);
          } else if (trimmed === 'secure') {
            cookieOptions.secure = process.env.NODE_ENV === 'production';
          } else if (trimmed.startsWith('samesite=')) {
            const sameSite = trimmed.split('=')[1].toLowerCase();
            cookieOptions.sameSite = sameSite === 'strict' ? 'strict' : sameSite === 'none' ? 'none' : 'lax';
          } else if (trimmed.startsWith('path=')) {
            cookieOptions.path = trimmed.split('=')[1];
          }
        });
        
        // Ensure path is set to root if not specified
        if (!cookieOptions.path) {
          cookieOptions.path = '/';
        }

        nextResponse.cookies.set(name.trim(), value.trim(), cookieOptions);
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

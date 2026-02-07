/**
 * Next.js API route: Admin login
 * Proxies to backend API
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '@/app/lib/fetch-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    console.log('🔗 Calling backend:', `${backendUrl}/api/auth/admin/login`);
    
    const response = await fetchBackendAPI('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }, backendUrl);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Forward cookies from backend
    // Note: getSetCookie() is available in Node.js 18+, but we'll use a more compatible approach
    const setCookieHeader = response.headers.get('set-cookie');
    const nextResponse = NextResponse.json(data);
    
    if (setCookieHeader) {
      // Handle multiple cookies (they might be comma-separated or in an array)
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
    console.error('❌ Admin login error in Next.js route:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}

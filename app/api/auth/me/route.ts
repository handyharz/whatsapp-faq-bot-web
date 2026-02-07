/**
 * Next.js API route: Get current user
 * Proxies to backend API
 * Automatically refreshes token if expired
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendAPI } from '@/app/lib/fetch-utils';

export async function GET(request: NextRequest) {
  try {
    // Forward cookies from request
    const cookieHeader = request.headers.get('cookie') || '';
    
    // First, try to get user with current access token
    let response = await fetchBackendAPI('/api/auth/me', {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
      },
    });

    let data = await response.json();
    
    // If access token expired (401), try to refresh it
    if (response.status === 401) {
      console.log('🔄 Access token expired, attempting refresh...');
      
      // Try to refresh the token
      const refreshResponse = await fetchBackendAPI('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader,
        },
      });

      const refreshData = await refreshResponse.json();
      
      if (refreshResponse.ok && refreshData.success) {
        // Token refreshed successfully
        // Forward new cookies from refresh response
        const setCookieHeader = refreshResponse.headers.get('set-cookie');
        const finalResponse = NextResponse.json({ success: false }); // Will be updated below
        
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

            finalResponse.cookies.set(name.trim(), value.trim(), cookieOptions);
          });
        }
        
        // Now retry the /api/auth/me request with the new access token
        // Use the accessToken from refresh response in Authorization header
        const newAccessToken = refreshData.accessToken;
        if (newAccessToken) {
          response = await fetchBackendAPI('/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newAccessToken}`,
              'Cookie': cookieHeader, // Still send refresh token cookie
            },
          });
        } else {
          // Fallback: use updated cookies (browser will send them)
          response = await fetchBackendAPI('/api/auth/me', {
            method: 'GET',
            headers: {
              'Cookie': cookieHeader,
            },
          });
        }
        
        data = await response.json();
        
        // Update final response with user data and forward cookies
        const userResponse = NextResponse.json(data, { status: response.status });
        
        // Copy cookies from refresh response to user response
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

            userResponse.cookies.set(name.trim(), value.trim(), cookieOptions);
          });
        }
        
        return userResponse;
      } else {
        // Refresh failed, return original 401
        console.log('❌ Token refresh failed');
        return NextResponse.json(data, { status: response.status });
      }
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}

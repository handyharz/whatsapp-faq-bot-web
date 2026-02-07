import { NextRequest, NextResponse } from 'next/server'
import { fetchBackendAPI } from '../../../lib/fetch-utils'

export async function POST(request: NextRequest) {
  try {
    const { token, email, password } = await request.json()

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Token, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const response = await fetchBackendAPI(
      '/api/auth/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email, password }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to reset password' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { fetchBackendAPI } from '../../../lib/fetch-utils'
import { sendPasswordResetEmail } from '../../../lib/email-utils'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // First, request password reset from backend (generates token)
    const response = await fetchBackendAPI(
      '/api/auth/forgot-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to send reset email' },
        { status: response.status }
      )
    }

    // If backend returned a reset URL, send email with it
    if (data.resetUrl) {
      // Send password reset email
      // Note: We don't fetch business name here to avoid exposing if email exists
      // The email will work fine without it
      const emailResult = await sendPasswordResetEmail({
        email,
        resetUrl: data.resetUrl,
      })

      if (!emailResult.success) {
        console.error('Failed to send password reset email:', emailResult.error)
        // Still return success to user (security best practice - don't reveal if email exists)
      } else {
        console.log('✅ Password reset email sent to:', email)
      }
    }

    // Always return success message (security best practice)
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

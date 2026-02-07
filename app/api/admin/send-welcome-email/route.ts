import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '../../../lib/email-utils'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.businessName || !data.email || !data.whatsappNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, email, whatsappNumber' },
        { status: 400 }
      )
    }

    const result = await sendWelcomeEmail({
      businessName: data.businessName,
      email: data.email,
      whatsappNumber: data.whatsappNumber,
      loginUrl: data.loginUrl,
      passwordSetupUrl: data.passwordSetupUrl,
      supportEmail: data.supportEmail,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send welcome email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
      messageId: result.messageId,
    })
  } catch (error: any) {
    console.error('Send welcome email error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

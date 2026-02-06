import { NextRequest, NextResponse } from 'next/server'

const resendApiKey = process.env.RESEND_API_KEY
const yourEmail = process.env.YOUR_EMAIL || 'harzkane@gmail.com'
const fromEmail = process.env.RESEND_FROM || 'WhatsApp FAQ Bot <support@exonec.com>'

function formatContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form: ${data.subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0a0a0a; margin-top: 0; font-size: 24px;">📧 New Contact Form Submission</h1>
          
          <div style="background: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #0a0a0a; font-size: 18px; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Name:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.name}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.email}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Subject:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.subject}</strong></td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #0a0a0a; font-size: 18px; margin-top: 0;">Message</h2>
            <p style="color: #0a0a0a; white-space: pre-wrap; margin: 0;">${data.message}</p>
          </div>
          
          <p style="color: #666; margin: 20px 0 0 0; font-size: 14px;">
            Reply to: <a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a>
          </p>
        </div>
      </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log the submission
    console.log('📧 New contact form submission:', {
      name: data.name,
      email: data.email,
      subject: data.subject,
    })

    // Send email via Resend
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: yourEmail,
            replyTo: data.email,
            subject: `📧 Contact Form: ${data.subject}`,
            html: formatContactEmail(data),
          }),
        })

        const emailData = await emailResponse.json()

        if (!emailResponse.ok) {
          console.error('❌ Resend error:', emailData)
          // Don't fail the request if email fails
        } else {
          console.log('✅ Contact email sent:', emailData.id)
        }
      } catch (emailError) {
        console.error('❌ Email error:', emailError)
        // Don't fail the request if email fails
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not set, skipping email')
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Message sent successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

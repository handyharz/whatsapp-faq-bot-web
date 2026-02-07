import { NextRequest, NextResponse } from 'next/server'
import { fetchWithRetry } from '../../lib/fetch-utils'

const resendApiKey = process.env.RESEND_API_KEY
const yourEmail = process.env.YOUR_EMAIL || 'harzkane@gmail.com'
const fromEmail = process.env.RESEND_FROM || 'WhatsApp FAQ Bot <support@exonec.com>'

function formatEmail(data: {
  businessName: string
  niche: string
  whatsappNumber: string
  email: string
  address?: string
  instagram?: string
  facebook?: string
  twitter?: string
  website?: string
  tiktok?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Signup: ${data.businessName}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0a0a0a; margin-top: 0; font-size: 24px;">🎉 New Signup: ${data.businessName}</h1>
          
          <div style="background: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #0a0a0a; font-size: 18px; margin-top: 0;">Business Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Business Name:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.businessName}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Niche:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.niche}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">WhatsApp:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.whatsappNumber}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.email}</strong></td>
              </tr>
              ${data.address ? `
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Address:</td>
                <td style="padding: 8px 0; color: #0a0a0a;">${data.address}</td>
              </tr>
              ` : ''}
              ${data.instagram || data.facebook || data.twitter || data.website || data.tiktok ? `
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500; vertical-align: top;">Social Media:</td>
                <td style="padding: 8px 0; color: #0a0a0a;">
                  ${data.instagram ? `<div>Instagram: ${data.instagram}</div>` : ''}
                  ${data.facebook ? `<div>Facebook: ${data.facebook}</div>` : ''}
                  ${data.twitter ? `<div>Twitter/X: ${data.twitter}</div>` : ''}
                  ${data.website ? `<div>Website: ${data.website}</div>` : ''}
                  ${data.tiktok ? `<div>TikTok: ${data.tiktok}</div>` : ''}
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <p style="color: #666; margin: 20px 0 0 0; font-size: 14px;">
            Next steps: Set up the WhatsApp bot for this business and send onboarding instructions.
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
    if (!data.businessName || !data.niche || !data.whatsappNumber || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log the submission
    console.log('📝 New signup:', {
      businessName: data.businessName,
      niche: data.niche,
      whatsappNumber: data.whatsappNumber,
      email: data.email,
      address: data.address,
      socialMedia: {
        instagram: data.instagram,
        facebook: data.facebook,
        twitter: data.twitter,
        website: data.website,
        tiktok: data.tiktok,
      },
    })

    // Send email via Resend (using fetchWithRetry utility)
    if (resendApiKey) {
      try {
        const emailResponse = await fetchWithRetry(
          'https://api.resend.com/emails',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromEmail,
              to: yourEmail,
              subject: `🎉 New Signup: ${data.businessName} (${data.niche})`,
              html: formatEmail(data),
            }),
          },
          3, // maxRetries
          30000 // timeout: 30 seconds (Resend API, not our backend)
        )

        const emailData = await emailResponse.json()

        if (!emailResponse.ok) {
          console.error('❌ Resend error:', emailData)
          // Don't fail the request if email fails
        } else {
          console.log('✅ Email sent:', emailData.id)
        }
      } catch (emailError: any) {
        console.error('❌ Email error after retries:', emailError.message)
        // Don't fail the request if email fails
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not set, skipping email')
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Form submitted successfully' 
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

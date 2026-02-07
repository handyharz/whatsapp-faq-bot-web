import { fetchWithRetry } from './fetch-utils'

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM || 'WhatsApp FAQ Bot <support@exonec.com>'

/**
 * Format welcome email for client
 */
function formatWelcomeEmail(data: {
  businessName: string
  email: string
  whatsappNumber: string
  loginUrl: string
  passwordSetupUrl?: string
  supportEmail?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to WhatsApp FAQ Bot</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0a0a0a; margin-top: 0; font-size: 24px;">🎉 Welcome to WhatsApp FAQ Bot!</h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${data.businessName},</p>
          
          <p style="color: #333; font-size: 16px;">
            Great news! Your WhatsApp FAQ Bot has been set up and is now live! 🚀
          </p>
          
          <div style="background: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #0a0a0a; font-size: 18px; margin-top: 0;">Your Account Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Login URL:</td>
                <td style="padding: 8px 0; color: #0a0a0a;">
                  <a href="${data.loginUrl}" style="color: #3b82f6; text-decoration: none;">${data.loginUrl}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.email}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">WhatsApp Number:</td>
                <td style="padding: 8px 0; color: #0a0a0a;"><strong>${data.whatsappNumber}</strong></td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 24px 0;">
            <h2 style="color: #0a0a0a; font-size: 18px; margin-top: 0;">What You Can Do:</h2>
            <ul style="color: #333; font-size: 16px; padding-left: 20px;">
              <li style="margin-bottom: 8px;">✅ View and edit your FAQs</li>
              <li style="margin-bottom: 8px;">✅ Update business hours and settings</li>
              <li style="margin-bottom: 8px;">✅ View message statistics</li>
              <li style="margin-bottom: 8px;">✅ Manage your subscription</li>
            </ul>
          </div>
          
          ${data.passwordSetupUrl ? `
          <div style="background: #e3f2fd; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #0a0a0a; font-size: 14px; margin: 0; margin-bottom: 12px;">
              <strong>🔐 Set Your Password</strong><br>
              Click the button below to set your password and access your dashboard:
            </p>
            <a href="${data.passwordSetupUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
              Set Password
            </a>
            <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
              This link expires in 24 hours. If you need a new link, use "Forgot Password" on the login page.
            </p>
          </div>
          ` : `
          <div style="background: #e3f2fd; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #0a0a0a; font-size: 14px; margin: 0;">
              <strong>🔐 First Time Login?</strong><br>
              If you haven't set a password yet, click "Forgot Password" on the login page to set your own password.
            </p>
          </div>
          `}
          
          <p style="color: #333; font-size: 16px;">
            Your WhatsApp bot is now active and will automatically respond to messages sent to: <strong>${data.whatsappNumber}</strong>
          </p>
          
          <p style="color: #333; font-size: 16px;">
            Need help? Reply to this email or contact us at <a href="mailto:${data.supportEmail || 'support@exonec.com'}" style="color: #3b82f6; text-decoration: none;">${data.supportEmail || 'support@exonec.com'}</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 32px;">
            Best regards,<br>
            <strong>The WhatsApp FAQ Bot Team</strong>
          </p>
        </div>
      </body>
    </html>
  `
}

/**
 * Send welcome email to client
 */
export async function sendWelcomeEmail(data: {
  businessName: string
  email: string
  whatsappNumber: string
  loginUrl?: string
  passwordSetupUrl?: string
  supportEmail?: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY not set, skipping welcome email')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const loginUrl = data.loginUrl || process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
      : 'https://www.exonec.com/login'

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
          to: data.email,
          subject: `🎉 Welcome to WhatsApp FAQ Bot - Your Account is Ready!`,
          html: formatWelcomeEmail({
            ...data,
            loginUrl,
            passwordSetupUrl: data.passwordSetupUrl,
          }),
        }),
      },
      3, // maxRetries
      30000 // timeout: 30 seconds
    )

    const emailData = await emailResponse.json()

    if (!emailResponse.ok) {
      console.error('❌ Resend error:', emailData)
      return { success: false, error: emailData.message || 'Failed to send email' }
    }

    console.log('✅ Welcome email sent:', emailData.id)
    return { success: true, messageId: emailData.id }
  } catch (error: any) {
    console.error('❌ Email error after retries:', error.message)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}

/**
 * Format password reset email
 */
function formatPasswordResetEmail(data: {
  businessName?: string
  resetUrl: string
  supportEmail?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0a0a0a; margin-top: 0; font-size: 24px;">🔐 Reset Your Password</h1>
          
          <p style="color: #333; font-size: 16px;">
            ${data.businessName ? `Hi ${data.businessName},` : 'Hi,'}
          </p>
          
          <p style="color: #333; font-size: 16px;">
            We received a request to reset your password for your WhatsApp FAQ Bot account.
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.resetUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #3b82f6; font-size: 12px; word-break: break-all; background: #f9f9f9; padding: 12px; border-radius: 4px;">
            ${data.resetUrl}
          </p>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #856404; font-size: 14px; margin: 0;">
              <strong>⏰ This link expires in 1 hour</strong><br>
              If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
            </p>
          </div>
          
          <p style="color: #333; font-size: 16px;">
            Need help? Contact us at <a href="mailto:${data.supportEmail || 'support@exonec.com'}" style="color: #3b82f6; text-decoration: none;">${data.supportEmail || 'support@exonec.com'}</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 32px;">
            Best regards,<br>
            <strong>The WhatsApp FAQ Bot Team</strong>
          </p>
        </div>
      </body>
    </html>
  `
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: {
  email: string
  businessName?: string
  resetUrl: string
  supportEmail?: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY not set, skipping password reset email')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

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
          to: data.email,
          subject: `🔐 Reset Your Password - WhatsApp FAQ Bot`,
          html: formatPasswordResetEmail({
            businessName: data.businessName,
            resetUrl: data.resetUrl,
            supportEmail: data.supportEmail,
          }),
        }),
      },
      3, // maxRetries
      30000 // timeout: 30 seconds
    )

    const emailData = await emailResponse.json()

    if (!emailResponse.ok) {
      console.error('❌ Resend error:', emailData)
      return { success: false, error: emailData.message || 'Failed to send email' }
    }

    console.log('✅ Password reset email sent:', emailData.id)
    return { success: true, messageId: emailData.id }
  } catch (error: any) {
    console.error('❌ Email error after retries:', error.message)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}

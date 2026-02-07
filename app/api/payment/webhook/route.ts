import { NextRequest, NextResponse } from 'next/server';
// Note: This will need to be adjusted based on your project structure
// For now, we'll implement the webhook handler directly here

// Import payment service (adjust path as needed)
// For Next.js, we'll need to ensure the bot code is accessible
// Option 1: Copy payment service to web project
// Option 2: Use a shared package
// Option 3: Make API call to bot service

// For now, we'll implement a basic handler that can be enhanced
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    
    // Get signature from headers
    const signature = request.headers.get('x-paystack-signature') || '';

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Parse webhook event
    const event = JSON.parse(body);

    // Verify signature (simplified - should use PaymentService)
    const crypto = require('node:crypto');
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || '';
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      
      // TODO: Process payment and activate subscription
      // This should call the PaymentService.handleWebhook method
      // For now, just log it
      console.log('Payment successful:', {
        reference,
        clientId: metadata?.clientId,
        tier: metadata?.tier,
      });

      // In production, call PaymentService here
      // const paymentService = new PaymentService();
      // await paymentService.handleWebhook(event);
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

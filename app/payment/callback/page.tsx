'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import PlexusBackground from '../../components/PlexusBackground'

function PaymentCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [tier, setTier] = useState<string>('')

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    
    if (!reference) {
      setStatus('error')
      setMessage('Payment reference not found')
      return
    }

    // Verify payment
    fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reference }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          setMessage(data.message || 'Payment successful! Your subscription has been activated.')
          setTier(data.tier || '')
          
          // Redirect to dashboard after 5 seconds with refresh parameter
          setTimeout(() => {
            router.push('/dashboard?upgraded=true')
            router.refresh()
          }, 5000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Payment verification failed')
        }
      })
      .catch(err => {
        setStatus('error')
        setMessage('Failed to verify payment. Please contact support if you were charged.')
      })
  }, [searchParams, router])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      <PlexusBackground />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <div className="container-md" style={{ textAlign: 'center', maxWidth: '600px' }}>
          {status === 'loading' && (
            <>
              <Loader2 style={{ width: '64px', height: '64px', color: '#3b82f6', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
              <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }} className="md:text-4xl">
                Verifying Payment...
              </h1>
              <p style={{ fontSize: '16px', color: '#a0a0a0' }}>
                Please wait while we verify your payment
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '3px solid #22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle style={{ width: '48px', height: '48px', color: '#22c55e' }} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px', color: '#22c55e' }} className="md:text-4xl">
                Payment Successful!
              </h1>
              <p style={{ fontSize: '18px', color: '#a0a0a0', marginBottom: '8px' }}>
                {message}
              </p>
              {tier && (
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
                  Your subscription has been upgraded to <span style={{ color: '#3b82f6', fontWeight: 600 }}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</span> plan
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }} className="md:flex-row md:justify-center">
                <Link 
                  href="/dashboard" 
                  className="btn btn-primary"
                  style={{ fontSize: '16px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Go to Dashboard
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </Link>
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '24px' }}>
                Redirecting to dashboard in 5 seconds...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '3px solid #ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <XCircle style={{ width: '48px', height: '48px', color: '#ef4444' }} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px', color: '#ef4444' }} className="md:text-4xl">
                Payment Verification Failed
              </h1>
              <p style={{ fontSize: '18px', color: '#a0a0a0', marginBottom: '32px' }}>
                {message}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }} className="md:flex-row md:justify-center">
                <Link 
                  href="/dashboard" 
                  className="btn btn-primary"
                  style={{ fontSize: '16px', padding: '12px 24px' }}
                >
                  Back to Dashboard
                </Link>
                <Link 
                  href="/dashboard/upgrade" 
                  className="btn btn-secondary"
                  style={{ fontSize: '16px', padding: '12px 24px' }}
                >
                  Try Again
                </Link>
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '24px' }}>
                If you were charged, please contact support with your payment reference
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  )
}

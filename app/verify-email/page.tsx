'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import PlexusBackground from '../components/PlexusBackground'
import { fetchBackendAPI } from '../lib/fetch-utils'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (token && email) {
      verifyEmail(token, email)
    } else {
      setError('Missing verification token or email')
    }
  }, [searchParams])

  const verifyEmail = async (token: string, email: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchBackendAPI('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setVerified(true)
    } catch (err: any) {
      setError(err.message || 'Failed to verify email')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', position: 'relative' }}>
        <PlexusBackground />
        <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Loader2 style={{ width: '48px', height: '48px', color: '#3b82f6', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#a0a0a0' }}>Verifying your email...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', position: 'relative' }}>
      <PlexusBackground />
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="container-md animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px' }}>
          {verified ? (
            <>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '9999px', 
                background: '#1a1a1a', 
                border: '2px solid #10b981', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginLeft: 'auto', 
                marginRight: 'auto', 
                marginBottom: '24px' 
              }}>
                <CheckCircle2 style={{ width: '48px', height: '48px', color: '#10b981' }} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Email Verified!</h1>
              <p style={{ color: '#a0a0a0', marginBottom: '32px', fontSize: '16px' }}>
                Your email address has been verified successfully. You can now access all features of your account.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Go to Dashboard
                </Link>
                <Link href="/" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Back to Home
                </Link>
              </div>
            </>
          ) : error ? (
            <>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '9999px', 
                background: '#1a1a1a', 
                border: '2px solid #ef4444', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginLeft: 'auto', 
                marginRight: 'auto', 
                marginBottom: '24px' 
              }}>
                <AlertCircle style={{ width: '48px', height: '48px', color: '#ef4444' }} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Verification Failed</h1>
              <p style={{ color: '#a0a0a0', marginBottom: '32px', fontSize: '16px' }}>
                {error}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                <Link href="/login" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Go to Login
                </Link>
                <Link href="/" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Back to Home
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}

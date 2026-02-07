'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import PlexusBackground from '../components/PlexusBackground'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', position: 'relative' }}>
      <PlexusBackground />
      
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          background: 'rgba(26, 26, 26, 0.95)', 
          borderRadius: '12px', 
          padding: '32px',
          border: '1px solid #262626',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            <MessageSquare style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>Forgot Password</h1>
          </div>

          {success ? (
            <div>
              <div style={{ 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid rgba(34, 197, 94, 0.3)', 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#22c55e',
              }}>
                <CheckCircle style={{ width: '20px', height: '20px' }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 600, marginBottom: '4px' }}>Check your email!</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#86efac' }}>
                    If an account exists with this email, a password reset link has been sent. Please check your inbox.
                  </p>
                </div>
              </div>
              <Link href="/login" style={{ 
                display: 'block', 
                textAlign: 'center', 
                color: '#3b82f6', 
                textDecoration: 'none',
                fontSize: '14px',
              }}>
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              {/* Error message */}
              {error && (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fca5a5',
                }}>
                  <AlertCircle style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '14px' }}>{error}</span>
                </div>
              )}

              <p style={{ color: '#a3a3a3', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#a3a3a3' }}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#171717',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#262626'}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: loading ? '#1e40af' : '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 0.2s',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {/* Links */}
              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#a3a3a3' }}>
                <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

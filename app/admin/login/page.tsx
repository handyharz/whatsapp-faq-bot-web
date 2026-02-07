'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Loader2, AlertCircle, Home } from 'lucide-react'
import PlexusBackground from '../../components/PlexusBackground'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
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
            <Shield style={{ width: '32px', height: '32px', color: '#8b5cf6' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>Admin Login</h1>
          </div>

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

          {/* Login form */}
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
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#262626'}
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#a3a3a3' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#262626'}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#6b21a8' : '#8b5cf6',
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
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#7c3aed'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#8b5cf6'
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Links */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#a3a3a3' }}>
            <p style={{ margin: 0, marginBottom: '8px' }}>
              <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Client login
              </Link>
            </p>
            <p style={{ margin: 0 }}>
              <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Home style={{ width: '14px', height: '14px' }} />
                Back to Home
              </Link>
            </p>
          </div>
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

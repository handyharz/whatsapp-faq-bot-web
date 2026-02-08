'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Settings, BarChart3, FileText, LogOut, Loader2 } from 'lucide-react'
import PlexusBackground from '../components/PlexusBackground'
import WhatsAppConnection from '../components/WhatsAppConnection'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'reconnecting' | 'unknown'>('unknown')

  useEffect(() => {
    const loadDashboardData = () => {
      // Check authentication first
      fetch('/api/auth/me', { credentials: 'include' })
        .then(r => r.json())
        .then(data => {
          if (!data.success || data.user?.role !== 'client') {
            // Not authenticated, redirect to login
            router.push('/login')
            return
          }

          // Fetch client profile, stats, and connection status
          Promise.all([
            fetch('/api/client/profile', { credentials: 'include' }).then(r => r.json()),
            fetch('/api/client/stats', { credentials: 'include' }).then(r => r.json()),
            fetch('/api/client/whatsapp/status', { credentials: 'include' }).then(r => r.json()),
          ])
            .then(([profileRes, statsRes, connectionRes]) => {
              if (profileRes.success) {
                setClient(profileRes.client)
              }
              if (statsRes.success) {
                setStats(statsRes.stats)
              }
              if (connectionRes.success) {
                setConnectionStatus(connectionRes.status || 'unknown')
              }
              setLoading(false)
            })
            .catch(err => {
              setError('Failed to load dashboard')
              setLoading(false)
            })
        })
        .catch(() => {
          router.push('/login')
        })
    }

    loadDashboardData()
    
    // Check if redirected from payment upgrade
    const upgraded = searchParams.get('upgraded')
    if (upgraded === 'true') {
      // Remove the query parameter from URL
      router.replace('/dashboard', { scroll: false })
      // Refetch data after a short delay to ensure backend has processed
      setTimeout(() => {
        setLoading(true)
        loadDashboardData()
      }, 1000)
    }
  }, [router, searchParams])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (error || !client) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="container-md" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Access Denied</h1>
          <p style={{ color: '#a0a0a0', marginBottom: '24px' }}>{error || 'Invalid token or client not found'}</p>
          <Link href="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  const subscriptionStatus = client.subscription?.status || 'unknown'
  const subscriptionTier = client.subscription?.tier || 'unknown'
  const isActive = subscriptionStatus === 'active' || subscriptionStatus === 'trial'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff' }}>
      {/* Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        background: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #262626',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div className="container md:px-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff' }}>
            <MessageSquare style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} className="md:w-6 md:h-6" />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }} className="desktop-only md:text-lg">WhatsApp FAQ Bot</span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }} className="mobile-only">FAQ Bot</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#a0a0a0' }} className="hidden sm:inline">{client.businessName}</span>
            <button
              onClick={handleLogout}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#a0a0a0',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              title="Logout"
            >
              <LogOut style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:pt-32 md:pb-20 md:px-6">
        <PlexusBackground />
        <div className="container-lg" style={{ position: 'relative', zIndex: 1 }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: '32px' }} className="md:mb-12">
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }} className="md:text-5xl">
              Welcome, {client.businessName}!
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0' }} className="md:text-xl">
              Manage your WhatsApp FAQ bot from here
            </p>
          </div>

          {/* Connection Reminder Banner (if not connected) */}
          {connectionStatus !== 'connected' && (
            <div style={{ 
              marginBottom: '24px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'rgba(59, 130, 246, 0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                  Complete Your Setup
                </h3>
                <p style={{ fontSize: '14px', color: '#a0a0a0', margin: 0 }}>
                  Connect your WhatsApp to start receiving messages from customers
                </p>
              </div>
              <Link 
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault()
                  // Scroll to WhatsApp connection component
                  const connectionEl = document.querySelector('[data-whatsapp-connection]')
                  if (connectionEl) {
                    connectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="btn btn-primary"
                style={{ 
                  fontSize: '14px', 
                  padding: '10px 20px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                Connect WhatsApp
              </Link>
            </div>
          )}

          {/* Important Notice Banner (always visible when connected) */}
          {connectionStatus === 'connected' && (
            <div style={{ 
              marginBottom: '24px',
              padding: '16px',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#a0a0a0',
              lineHeight: '1.5'
            }}>
              <strong style={{ color: '#ffffff' }}>Important:</strong> Message delivery depends on your phone being online and WhatsApp running. If your phone is offline or WhatsApp is closed, messages may not be delivered.
            </div>
          )}

          {/* Subscription Status */}
          <div className="card md:mb-8 md:p-6" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Subscription Status</h2>
                <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '8px' }}>
                  {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)} • {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
                </p>
                {stats && (
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    FAQs: {stats.faqs?.total || 0} / {subscriptionTier === 'trial' ? '20' : subscriptionTier === 'starter' ? '50' : subscriptionTier === 'professional' ? '200' : 'Unlimited'}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  background: isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: isActive ? '#22c55e' : '#ef4444' 
                  }}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {subscriptionTier !== 'enterprise' && (
                  <Link 
                    href="/dashboard/upgrade"
                    className="btn btn-primary"
                    style={{ 
                      fontSize: '14px', 
                      padding: '8px 16px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Upgrade Plan
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }} className="md:grid-cols-3 md:gap-6 md:mb-12">
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <BarChart3 style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Messages (24h)</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                  {stats.messages?.last24Hours || 0}
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FileText style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Total FAQs</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                  {stats.faqs?.total || 0}
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <MessageSquare style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Total Messages</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                  {stats.messages?.total || 0}
                </p>
              </div>
            </div>
          )}

          {/* WhatsApp Connection */}
          <div style={{ marginBottom: '32px' }} className="md:mb-12" data-whatsapp-connection>
            <WhatsAppConnection 
              pollingInterval={3000}
              onStatusChange={(status) => setConnectionStatus(status)}
            />
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="md:grid-cols-2 md:gap-6">
            <Link 
              href="/dashboard/faqs"
              className="card"
              style={{ 
                padding: '24px', 
                textDecoration: 'none', 
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Manage FAQs</h3>
                <p style={{ fontSize: '14px', color: '#a0a0a0' }}>Edit your FAQ questions and answers</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/settings"
              className="card"
              style={{ 
                padding: '24px', 
                textDecoration: 'none', 
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Settings style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Settings</h3>
                <p style={{ fontSize: '14px', color: '#a0a0a0' }}>Update business hours and configuration</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}

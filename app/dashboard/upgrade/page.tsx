'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, Zap } from 'lucide-react'
import PlexusBackground from '../../components/PlexusBackground'

const TIER_ORDER = ['trial', 'starter', 'professional', 'enterprise'] as const

const PRICING_TIERS = [
  {
    name: 'Starter',
    tier: 'starter',
    price: '₦5,000',
    period: '/month',
    description: 'Great for small businesses',
    features: [
      'Up to 50 FAQs',
      '1,000 messages/month',
      'Business hours',
      'Email support',
      'Basic analytics',
    ],
  },
  {
    name: 'Professional',
    tier: 'professional',
    price: '₦10,000',
    period: '/month',
    description: 'Most popular choice',
    features: [
      'Up to 200 FAQs',
      '5,000 messages/month',
      'Business hours',
      'Priority support',
      'Advanced analytics',
      'FAQ templates',
      'Custom branding',
    ],
  },
  {
    name: 'Enterprise',
    tier: 'enterprise',
    price: '₦20,000',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Unlimited FAQs',
      'Unlimited messages',
      'Business hours',
      'Dedicated support',
      'Custom integrations',
      'White-label option',
      'API access',
    ],
  },
]

function UpgradeContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [client, setClient] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication first
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.success || data.user?.role !== 'client') {
          router.push('/login')
          return
        }

        // Fetch client profile
        fetch('/api/client/profile', { credentials: 'include' })
          .then(r => r.json())
          .then(profileData => {
            if (profileData.success) {
              setClient(profileData.client)
            } else {
              setError('Failed to load profile')
            }
            setLoading(false)
          })
          .catch(err => {
            setError('Failed to load profile')
            setLoading(false)
          })
      })
      .catch(() => {
        router.push('/login')
      })
  }, [router])

  const handleUpgrade = async (tier: string) => {
    if (!client) return

    const currentTier = client.subscription?.tier || 'trial'
    const currentTierIndex = TIER_ORDER.indexOf(currentTier as any)
    const newTierIndex = TIER_ORDER.indexOf(tier as any)

    // Check if it's actually an upgrade
    if (newTierIndex <= currentTierIndex) {
      setError('Please select a higher tier to upgrade')
      return
    }

    setUpgrading(tier)
    setError('')

    try {
      const response = await fetch('/api/payment/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tier }),
      })

      const data = await response.json()

      if (data.success && data.paymentLink) {
        // Redirect to Paystack payment page
        window.location.href = data.paymentLink
      } else {
        setError(data.error || 'Failed to generate payment link')
        setUpgrading(null)
      }
    } catch (err) {
      setError('Failed to process upgrade request')
      setUpgrading(null)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (error && !client) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="container-md" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Error</h1>
          <p style={{ color: '#a0a0a0', marginBottom: '24px' }}>{error}</p>
          <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const currentTier = client?.subscription?.tier || 'trial'
  const currentTierIndex = TIER_ORDER.indexOf(currentTier as any)

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
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff' }}>
            <ArrowLeft style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:pt-32 md:pb-20 md:px-6">
        <PlexusBackground />
        <div className="container-lg" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '48px', textAlign: 'center' }} className="md:mb-12">
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }} className="md:text-5xl">
              Upgrade Your Plan
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0' }} className="md:text-xl">
              Choose a plan that fits your business needs
            </p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              Current plan: <span style={{ color: '#3b82f6', fontWeight: 600 }}>{currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#f87171' }}>{error}</p>
            </div>
          )}

          {/* Pricing Tiers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px', 
            maxWidth: '1200px', 
            marginLeft: 'auto', 
            marginRight: 'auto' 
          }} className="md:grid-cols-3">
            {PRICING_TIERS.map((tier, index) => {
              const tierIndex = TIER_ORDER.indexOf(tier.tier as any)
              const isCurrentTier = tier.tier === currentTier
              const isUpgrade = tierIndex > currentTierIndex
              const isRecommended = tier.tier === 'professional'

              return (
                <div
                  key={tier.tier}
                  className="card"
                  style={{
                    padding: '32px 24px',
                    position: 'relative',
                    border: isRecommended ? '2px solid #3b82f6' : isCurrentTier ? '2px solid #22c55e' : '1px solid #262626',
                    background: isRecommended ? 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)' : undefined,
                    transform: isRecommended ? 'scale(1.05)' : undefined,
                    zIndex: isRecommended ? 1 : 0,
                    opacity: !isUpgrade && !isCurrentTier ? 0.6 : 1,
                  }}
                >
                  {isRecommended && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#3b82f6',
                      color: '#ffffff',
                      padding: '4px 16px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      Recommended
                    </div>
                  )}
                  {isCurrentTier && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '16px',
                      background: '#22c55e',
                      color: '#ffffff',
                      padding: '4px 16px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      Current
                    </div>
                  )}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{tier.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }} className="md:text-4xl">{tier.price}</span>
                      <span style={{ fontSize: '16px', color: '#a0a0a0' }}>{tier.period}</span>
                    </div>
                    <p style={{ color: '#a0a0a0', fontSize: '14px' }}>{tier.description}</p>
                  </div>
                  
                  <ul style={{ textAlign: 'left', marginBottom: '32px', listStyle: 'none', padding: 0 }}>
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                        <Check style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: '#a0a0a0', fontSize: '14px' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isCurrentTier ? (
                    <button
                      disabled
                      className="btn btn-secondary"
                      style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Current Plan
                    </button>
                  ) : isUpgrade ? (
                    <button
                      onClick={() => handleUpgrade(tier.tier)}
                      disabled={upgrading === tier.tier}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      {upgrading === tier.tier ? (
                        <>
                          <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block' }} />
                          Upgrade to {tier.name}
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-secondary"
                      style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Downgrade Not Available
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '48px', textAlign: 'center' }}>
            All plans include 24/7 automated support • Contact us for custom enterprise pricing
          </p>
        </div>
      </section>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <UpgradeContent />
    </Suspense>
  )
}

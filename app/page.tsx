'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageSquare, Zap, Shield, TrendingUp, ArrowRight, Check, LogOut, LayoutDashboard } from 'lucide-react'
import PlexusBackground from './components/PlexusBackground'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff', minWidth: 0, flex: '0 1 auto' }}>
            <MessageSquare style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} className="md:w-6 md:h-6" />
            <span style={{ fontSize: '16px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="desktop-only md:text-lg">
              WhatsApp FAQ Bot
            </span>
            <span style={{ fontSize: '16px', fontWeight: 600 }} className="mobile-only">
              FAQ Bot
            </span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }} className="md:gap-6">
            <Link href="#features" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none', display: 'none', padding: '8px 0' }} className="md:block hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none', display: 'none', padding: '8px 0' }} className="md:block hover:text-white transition-colors">Pricing</Link>
            
            {!loading && user ? (
              // User is logged in - show dashboard and logout
              <>
                <Link 
                  href={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  style={{ 
                    fontSize: '14px', 
                    color: '#a0a0a0', 
                    textDecoration: 'none', 
                    padding: '8px 0', 
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }} 
                  className="hover:text-white transition-colors"
                >
                  <LayoutDashboard style={{ width: '16px', height: '16px' }} />
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ 
                    fontSize: '14px', 
                    color: '#a0a0a0', 
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 0', 
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }} 
                  className="hover:text-white transition-colors"
                >
                  <LogOut style={{ width: '16px', height: '16px' }} />
                  Logout
                </button>
              </>
            ) : (
              // User is not logged in - show login and get started
              <>
                <Link href="/login" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none', padding: '8px 0', whiteSpace: 'nowrap' }} className="hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/onboard" className="btn btn-primary md:px-5 md:py-2.5 md:text-base" style={{ fontSize: '14px', padding: '10px 16px', whiteSpace: 'nowrap', minHeight: '40px' }}>
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:pt-32 md:pb-20 md:px-6">
        <PlexusBackground />
        <div className="container-lg" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in md:text-sm" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            borderRadius: '9999px', 
            background: '#1a1a1a', 
            border: '1px solid #262626', 
            marginBottom: '24px',
            fontSize: '12px'
          }}>
            <Zap style={{ width: '14px', height: '14px', color: '#3b82f6', flexShrink: 0 }} className="md:w-4 md:h-4" />
            <span style={{ color: '#a0a0a0' }}>Production-ready WhatsApp automation platform</span>
          </div>
          
          <h1 style={{ 
            fontSize: '62px', 
            fontWeight: 700, 
            marginBottom: '20px', 
            lineHeight: 1.2,
            marginTop: 0,
            paddingLeft: '8px',
            paddingRight: '8px'
          }} className="md:text-5xl md:mb-6 md:px-0">
            Production-Ready WhatsApp
            <br />
            <span className="gradient-text">Automation for Real Businesses</span>
          </h1>
          
          <p style={{ fontSize: '16px', color: '#a0a0a0', marginBottom: '32px', maxWidth: '672px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-xl md:mb-12 md:px-0">
            A business-ready platform that manages multiple WhatsApp connections per workspace — with real status monitoring, health checks, and dependable message routing. Built for real business use, not just testing.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', alignItems: 'center', paddingLeft: '16px', paddingRight: '16px' }} className="md:flex-row md:gap-4 md:px-0">
            {!loading && user ? (
              <Link 
                href={user.role === 'admin' ? '/admin' : '/dashboard'} 
                className="btn btn-primary md:max-w-none md:text-lg md:py-4 md:px-8" 
                style={{ fontSize: '16px', padding: '14px 28px', width: '100%', maxWidth: '280px' }}
              >
                Go to {user.role === 'admin' ? 'Admin' : 'Client'} Dashboard
                <ArrowRight style={{ width: '18px', height: '18px', marginLeft: '8px', display: 'inline-block' }} />
              </Link>
            ) : (
              <>
                <Link href="/onboard" className="btn btn-primary md:max-w-none md:text-lg md:py-4 md:px-8" style={{ fontSize: '16px', padding: '14px 28px', width: '100%', maxWidth: '280px' }}>
                  Get Started Free
                  <ArrowRight style={{ width: '18px', height: '18px', marginLeft: '8px', display: 'inline-block' }} />
                </Link>
                <button className="btn btn-secondary md:max-w-none md:text-lg md:py-4 md:px-8" style={{ fontSize: '16px', padding: '14px 28px', width: '100%', maxWidth: '280px' }}>
                  Watch Demo
                </button>
              </>
            )}
          </div>
          
          <p style={{ fontSize: '12px', color: '#666', marginTop: '20px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-sm md:mt-6 md:px-0">
            No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ paddingTop: '60px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', background: '#0f0f0f' }} className="md:py-20 md:px-6">
        <div className="container-lg">
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="md:mb-16">
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-4xl md:mb-4 md:px-0">
              Built for Real WhatsApp Operations
            </h2>
            <p style={{ fontSize: '16px', color: '#a0a0a0', maxWidth: '672px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-xl md:px-0">
              We've evolved from MVP to a production-grade platform with true multi-tenant architecture
            </p>
          </div>
          
          <div style={{ display: 'grid', gap: '20px' }} className="features-grid md:gap-6">
            {[
              {
                icon: MessageSquare,
                title: 'Multi-Connection Architecture',
                description: 'Each business gets their own dedicated WhatsApp connection. Customers message your actual number, not a shared platform number.',
              },
              {
                icon: Shield,
                title: 'Real-Time Health Monitoring',
                description: 'Track connection status, message activity, and delivery health. Know before your customers do if something goes wrong.',
              },
              {
                icon: TrendingUp,
                title: 'Business-Ready Infrastructure',
                description: 'Built for real business use with reliable message routing, automatic reconnection, and operational insights.',
              },
              {
                icon: Zap,
                title: 'Seamless Onboarding',
                description: 'Easy QR code connection, automated setup wizard, and clear status indicators. Get live in minutes.',
              },
              {
                icon: MessageSquare,
                title: 'Smart FAQ Matching',
                description: 'AI-powered keyword matching understands customer questions in natural language and responds instantly.',
              },
              {
                icon: Shield,
                title: 'Scalable & Reliable',
                description: 'True multi-tenancy with isolated workspaces. Designed to grow with your business, not just handle demos.',
              },
            ].map((feature, index) => (
              <div key={index} className="card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <feature.icon style={{ width: '32px', height: '32px', color: '#3b82f6', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ color: '#a0a0a0' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ paddingTop: '60px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:py-20 md:px-6">
        <PlexusBackground />
        <div className="container-lg" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="md:mb-16">
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-4xl md:mb-4 md:px-0">
              How it works
            </h2>
            <p style={{ fontSize: '16px', color: '#a0a0a0', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-xl md:px-0">
              Get started in three simple steps
            </p>
          </div>
          
          <div style={{ display: 'grid', gap: '32px' }} className="how-it-works-grid md:gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Workspace',
                description: 'Sign up and create your business workspace in our self-serve onboarding wizard.',
              },
              {
                step: '2',
                title: 'Connect Your WhatsApp',
                description: 'Scan the QR code to link your WhatsApp number. Each business gets their own dedicated connection.',
              },
              {
                step: '3',
                title: 'Go Live Instantly',
                description: 'Your bot is live! Customers message your actual WhatsApp number and get instant FAQ responses.',
              },
            ].map((item, index) => (
              <div key={index} className="animate-fade-in" style={{ textAlign: 'center', animationDelay: `${index * 0.2}s` }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '9999px', 
                  background: '#1a1a1a', 
                  border: '2px solid #3b82f6', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  marginLeft: 'auto', 
                  marginRight: 'auto', 
                  marginBottom: '16px' 
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#a0a0a0' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ paddingTop: '60px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', background: '#0f0f0f' }} className="md:py-20 md:px-6">
        <div className="container-lg" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-4xl md:mb-4 md:px-0">
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: '16px', color: '#a0a0a0', marginBottom: '48px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-xl md:mb-12 md:px-0">
            Start free, scale as you grow. All plans include your own dedicated WhatsApp connection.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px', 
            maxWidth: '1200px', 
            marginLeft: 'auto', 
            marginRight: 'auto' 
          }} className="md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Free Trial',
                price: '₦0',
                period: '7 days',
                description: 'Perfect for testing the waters',
                features: [
                  'Full features',
                  'Unlimited messages',
                  'Basic FAQs',
                  'Business hours',
                ],
                highlighted: false,
              },
              {
                name: 'Starter',
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
                highlighted: false,
              },
              {
                name: 'Professional',
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
                highlighted: true,
              },
              {
                name: 'Enterprise',
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
                highlighted: false,
              },
            ].map((tier, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: '32px 24px',
                  position: 'relative',
                  border: tier.highlighted ? '2px solid #3b82f6' : '1px solid #262626',
                  background: tier.highlighted ? 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)' : undefined,
                  transform: tier.highlighted ? 'scale(1.05)' : undefined,
                  zIndex: tier.highlighted ? 1 : 0,
                }}
              >
                {tier.highlighted && (
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
                
                {!loading && user ? (
                  <Link 
                    href={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className={tier.highlighted ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ width: '100%' }}
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/onboard" 
                    className={tier.highlighted ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ width: '100%' }}
                  >
                    {tier.name === 'Free Trial' ? 'Get Started Free' : 'Choose Plan'}
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          <p style={{ fontSize: '14px', color: '#666', marginTop: '48px' }}>
            All plans include dedicated WhatsApp connection, health monitoring, and 24/7 automated support • Contact us for custom enterprise pricing
          </p>
          
          {/* Expectation Setting Note */}
          <div style={{ 
            marginTop: '48px',
            padding: '20px',
            background: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '13px', color: '#a0a0a0', margin: 0, lineHeight: '1.6' }}>
              <strong style={{ color: '#ffffff' }}>Note:</strong> WhatsApp automation relies on your phone being online and WhatsApp running, in line with WhatsApp's device model. Message delivery depends on these factors, which is standard for all WhatsApp-based solutions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ paddingTop: '60px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:py-20 md:px-6">
        <PlexusBackground />
        <div className="container-md" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="card md:p-12" style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', 
            borderColor: '#3b82f6',
            padding: '32px 24px'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-4xl md:mb-4 md:px-0">
              Ready to scale your WhatsApp operations?
            </h2>
            <p style={{ fontSize: '16px', color: '#a0a0a0', marginBottom: '24px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-xl md:mb-8 md:px-0">
              Join businesses using our business-ready WhatsApp automation platform
            </p>
            {!loading && user ? (
              <Link 
                href={user.role === 'admin' ? '/admin' : '/dashboard'} 
                className="btn btn-primary md:max-w-none md:text-lg md:py-4 md:px-8" 
                style={{ fontSize: '16px', padding: '14px 28px', width: '100%', maxWidth: '280px' }}
              >
                Go to {user.role === 'admin' ? 'Admin' : 'Client'} Dashboard
                <ArrowRight style={{ width: '18px', height: '18px', marginLeft: '8px', display: 'inline-block' }} />
              </Link>
            ) : (
              <Link href="/onboard" className="btn btn-primary md:max-w-none md:text-lg md:py-4 md:px-8" style={{ fontSize: '16px', padding: '14px 28px', width: '100%', maxWidth: '280px' }}>
                Get Started Free
                <ArrowRight style={{ width: '18px', height: '18px', marginLeft: '8px', display: 'inline-block' }} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ paddingTop: '32px', paddingBottom: '32px', paddingLeft: '16px', paddingRight: '16px', borderTop: '1px solid #262626' }} className="md:py-12 md:px-6">
        <div className="container-lg">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              <span style={{ fontSize: '14px', color: '#a0a0a0' }}>WhatsApp FAQ Bot</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '14px', color: '#666' }} className="md:gap-6">
              <Link href="/privacy" style={{ color: '#666', textDecoration: 'none' }}>Privacy</Link>
              <Link href="/terms" style={{ color: '#666', textDecoration: 'none' }}>Terms</Link>
              <Link href="/contact" style={{ color: '#666', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

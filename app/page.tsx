'use client'

import Link from 'next/link'
import { MessageSquare, Zap, Shield, TrendingUp, ArrowRight, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff' }}>
      {/* Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #262626'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
            <span style={{ fontSize: '20px', fontWeight: 600 }}>WhatsApp FAQ Bot</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="#features" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none' }}>Features</Link>
            <Link href="#pricing" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/onboard" className="btn btn-primary">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ paddingTop: '128px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="container-lg" style={{ textAlign: 'center' }}>
          <div className="animate-fade-in" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            borderRadius: '9999px', 
            background: '#1a1a1a', 
            border: '1px solid #262626', 
            marginBottom: '32px' 
          }}>
            <Zap style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
            <span style={{ fontSize: '14px', color: '#a0a0a0' }}>Automate customer support on WhatsApp</span>
          </div>
          
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 700, 
            marginBottom: '24px', 
            lineHeight: 1.2,
            marginTop: 0
          }}>
            Answer customer questions
            <br />
            <span className="gradient-text">automatically on WhatsApp</span>
          </h1>
          
          <p style={{ fontSize: '20px', color: '#a0a0a0', marginBottom: '48px', maxWidth: '672px', marginLeft: 'auto', marginRight: 'auto' }}>
            Set up an AI-powered FAQ bot for your business in minutes. 
            Never miss a customer message again.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
            <Link href="/onboard" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Get Started Free
              <ArrowRight style={{ width: '20px', height: '20px', marginLeft: '8px', display: 'inline-block' }} />
            </Link>
            <button className="btn btn-secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Watch Demo
            </button>
          </div>
          
          <p style={{ fontSize: '14px', color: '#666', marginTop: '24px' }}>
            No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', background: '#0f0f0f' }}>
        <div className="container-lg">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
              Everything you need to automate support
            </h2>
            <p style={{ fontSize: '20px', color: '#a0a0a0', maxWidth: '672px', marginLeft: 'auto', marginRight: 'auto' }}>
              Powerful features designed for Nigerian businesses
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: MessageSquare,
                title: 'Smart FAQ Matching',
                description: 'AI-powered keyword matching understands customer questions in natural language.',
              },
              {
                icon: Zap,
                title: 'Instant Responses',
                description: 'Reply to customers in seconds, even outside business hours.',
              },
              {
                icon: Shield,
                title: 'Reliable & Secure',
                description: 'Built on WhatsApp Web protocol. Your data stays private.',
              },
              {
                icon: TrendingUp,
                title: 'Easy Setup',
                description: 'No coding required. Set up your FAQs in minutes.',
              },
              {
                icon: MessageSquare,
                title: 'Customizable',
                description: 'Tailor responses to match your brand voice and business needs.',
              },
              {
                icon: Zap,
                title: '24/7 Availability',
                description: 'Never miss a customer message, even when you\'re offline.',
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
      <section style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="container-lg">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
              How it works
            </h2>
            <p style={{ fontSize: '20px', color: '#a0a0a0' }}>
              Get started in three simple steps
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Fill out our onboarding form with your business details.',
              },
              {
                step: '2',
                title: 'Connect WhatsApp',
                description: 'Scan QR code to connect your WhatsApp number.',
              },
              {
                step: '3',
                title: 'Start Automating',
                description: 'Your bot is live! Customers get instant answers.',
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
      <section id="pricing" style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', background: '#0f0f0f' }}>
        <div className="container-md" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: '20px', color: '#a0a0a0', marginBottom: '48px' }}>
            Start free, scale as you grow
          </p>
          
          <div className="card" style={{ maxWidth: '448px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#3b82f6', marginBottom: '8px' }}>₦0/month</div>
              <p style={{ color: '#a0a0a0', marginBottom: '16px' }}>Free Trial - Perfect for testing the waters</p>
            </div>
            
            <ul style={{ textAlign: 'left', marginBottom: '32px' }}>
              {[
                'Unlimited FAQ responses',
                '24/7 automated support',
                'Custom FAQ templates',
                'Email support',
                'Basic analytics',
              ].map((item, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Check style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} />
                  <span style={{ color: '#a0a0a0' }}>{item}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/onboard" className="btn btn-primary" style={{ width: '100%' }}>
              Get Started Free
            </Link>
          </div>
          
          <p style={{ fontSize: '14px', color: '#666', marginTop: '32px' }}>
            Paid plans coming soon • Contact us for enterprise pricing
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="container-md" style={{ textAlign: 'center' }}>
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', 
            borderColor: '#3b82f6' 
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
              Ready to automate your support?
            </h2>
            <p style={{ fontSize: '20px', color: '#a0a0a0', marginBottom: '32px' }}>
              Join Nigerian businesses using WhatsApp FAQ Bot
            </p>
            <Link href="/onboard" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Get Started Free
              <ArrowRight style={{ width: '20px', height: '20px', marginLeft: '8px', display: 'inline-block' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ paddingTop: '48px', paddingBottom: '48px', paddingLeft: '24px', paddingRight: '24px', borderTop: '1px solid #262626' }}>
        <div className="container-lg">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              <span style={{ fontSize: '14px', color: '#a0a0a0' }}>WhatsApp FAQ Bot</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#666' }}>
              <Link href="#" style={{ color: '#666', textDecoration: 'none' }}>Privacy</Link>
              <Link href="#" style={{ color: '#666', textDecoration: 'none' }}>Terms</Link>
              <Link href="#" style={{ color: '#666', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

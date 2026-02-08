'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react'

function OnboardForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const niche = searchParams.get('niche') || 'restaurant'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="container-md animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '9999px', 
          background: '#1a1a1a', 
          border: '2px solid #3b82f6', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginLeft: 'auto', 
          marginRight: 'auto', 
          marginBottom: '24px' 
        }}>
          <MessageSquare style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 700, marginBottom: '16px' }}>Get Started</h1>
        <p style={{ color: '#a0a0a0', marginBottom: '32px', fontSize: '16px', lineHeight: '1.6' }}>
          Create your WhatsApp FAQ bot in under 5 minutes. No credit card required. Start with a 14-day free trial.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
          <button
            onClick={() => router.push(`/signup?niche=${niche}`)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Create Account
            <ArrowRight style={{ width: '16px', height: '16px', marginLeft: '8px', display: 'inline-block' }} />
          </button>
          <Link href="/contact" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Contact Sales
          </Link>
          <Link href="/" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft style={{ width: '16px', height: '16px', display: 'inline-block' }} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OnboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <MessageSquare style={{ width: '32px', height: '32px', color: '#3b82f6', marginBottom: '16px' }} />
            <p style={{ color: '#a0a0a0' }}>Loading...</p>
          </div>
        </div>
      }
    >
      <OnboardForm />
    </Suspense>
  )
}

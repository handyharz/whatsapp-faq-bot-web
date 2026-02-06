'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

function OnboardForm() {
  const searchParams = useSearchParams()
  const niche = searchParams.get('niche') || 'restaurant'
  
  const [formData, setFormData] = useState({
    businessName: '',
    niche: niche,
    whatsappNumber: '',
    email: '',
    address: '',
    instagram: '',
  })
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit form')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="container-md animate-fade-in" style={{ textAlign: 'center' }}>
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
            <CheckCircle2 style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, marginBottom: '16px' }}>Thank you!</h1>
          <p style={{ color: '#a0a0a0', marginBottom: '32px' }}>
            We've received your information. We'll contact you shortly to set up your WhatsApp FAQ bot.
          </p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block' }} />
            Back to Home
          </Link>
        </div>
      </div>
    )
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
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="desktop-only md:text-lg">
              WhatsApp FAQ Bot
            </span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }} className="mobile-only">
              FAQ Bot
            </span>
          </Link>
          <Link href="/" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 4px', minHeight: '40px', WebkitTapHighlightColor: 'transparent' }} className="hover:text-white transition-colors">
            <ArrowLeft style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </header>

      {/* Form Section */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px' }} className="md:pt-32 md:pb-20 md:px-6">
        <div className="container-md">
          <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-fade-in md:mb-12">
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-4xl md:mb-4 md:px-0">
              Get started in minutes
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-xl md:px-0">
              Tell us about your business and we'll set up your WhatsApp FAQ bot
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card animate-fade-in md:p-6" style={{ animationDelay: '0.1s', padding: '24px' }}>
            {status === 'error' && (
              <div style={{ 
                marginBottom: '24px', 
                padding: '16px', 
                borderRadius: '8px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px' 
              }}>
                <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0 }} />
                <p style={{ fontSize: '14px', color: '#f87171' }}>{errorMessage}</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label htmlFor="businessName" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g., Abuja Ram Suya"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="niche" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Business Type *
                </label>
                <select
                  id="niche"
                  name="niche"
                  required
                  value={formData.niche}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="fashion">Fashion Store</option>
                  <option value="logistics">Logistics</option>
                  <option value="retail">Retail</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="whatsappNumber" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  required
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g., 08107060160"
                  className="input"
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Include country code if outside Nigeria</p>
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="address" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Business Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., Aminu Kano Wuse 2, Abuja"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="instagram" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Instagram Handle
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="e.g., @harzkane"
                  className="input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '32px' }}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                  Submitting...
                </>
              ) : (
                'Submit & Get Started'
              )}
            </button>

            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '24px' }}>
              By submitting, you agree to our terms of service and privacy policy
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}

export default function OnboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <OnboardForm />
    </Suspense>
  )
}

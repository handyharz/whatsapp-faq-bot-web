'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, ArrowLeft, Mail, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import PlexusBackground from '../components/PlexusBackground'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
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
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setStatus('idle')
      }, 3000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
          <Link href="/" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 4px', minHeight: '40px', WebkitTapHighlightColor: 'transparent' }} className="hover:text-white transition-colors">
            <ArrowLeft style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:pt-32 md:pb-20 md:px-6">
        <PlexusBackground />
        <div className="container-md" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-fade-in md:mb-12">
            <Mail style={{ width: '40px', height: '40px', color: '#3b82f6', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }} className="md:w-12 md:h-12 md:mb-6" />
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-5xl md:mb-4 md:px-0">
              Contact Us
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-xl md:px-0">
              Have questions? We'd love to hear from you
            </p>
          </div>

          <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }} className="contact-cards-grid md:gap-8 md:mb-12">
            <div className="card" style={{ textAlign: 'center' }}>
              <Mail style={{ width: '32px', height: '32px', color: '#3b82f6', marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Email</h3>
              <p style={{ color: '#a0a0a0', marginBottom: '16px' }}>Send us an email</p>
              <a href="mailto:support@exonec.com" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '16px' }}>
                support@exonec.com
              </a>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <MessageSquare style={{ width: '32px', height: '32px', color: '#3b82f6', marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>WhatsApp</h3>
              <p style={{ color: '#a0a0a0', marginBottom: '16px' }}>Chat with us</p>
              <a href="https://wa.me/2348107060160" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '16px' }}>
                +234 810 706 0160
              </a>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <Mail style={{ width: '32px', height: '32px', color: '#3b82f6', marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Response Time</h3>
              <p style={{ color: '#a0a0a0', marginBottom: '16px' }}>We typically respond</p>
              <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500 }}>
                Within 24 hours
              </p>
            </div>
          </div>

          <div className="card md:p-6" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', textAlign: 'center' }} className="md:text-2xl md:mb-6">
              Send us a Message
            </h2>

            {status === 'success' && (
              <div style={{ 
                marginBottom: '24px', 
                padding: '16px', 
                borderRadius: '8px', 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid rgba(34, 197, 94, 0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px' 
              }}>
                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#22c55e', flexShrink: 0 }} />
                <p style={{ fontSize: '14px', color: '#4ade80' }}>Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

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

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input"
                  />
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
                  <label htmlFor="subject" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="message" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you need..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#1a1a1a',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#262626'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block' }} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

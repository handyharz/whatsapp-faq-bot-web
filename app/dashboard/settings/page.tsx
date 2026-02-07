'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Clock, MapPin, Users, Globe, Mail, MessageSquare, HelpCircle } from 'lucide-react'
import PlexusBackground from '../../components/PlexusBackground'

function SettingsContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Settings state
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [businessHours, setBusinessHours] = useState({ start: 9, end: 17 })
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [afterHoursMessage, setAfterHoursMessage] = useState('')
  const [adminNumbers, setAdminNumbers] = useState('')
  const [address, setAddress] = useState('')
  const [socialMedia, setSocialMedia] = useState({
    instagram: '',
    facebook: '',
    twitter: '',
    website: '',
    tiktok: '',
  })

  useEffect(() => {
    // Check authentication first
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.success || data.user?.role !== 'client') {
          router.push('/login')
          return
        }

        // Fetch settings
        fetch('/api/client/settings', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.settings) {
          const settings = data.settings
          
          setWhatsappNumber(settings.whatsappNumber || '')
          
          if (settings.config) {
            setBusinessHours(settings.config.businessHours || { start: 9, end: 17 })
            setTimezone(settings.config.timezone || 'Africa/Lagos')
            setAfterHoursMessage(settings.config.afterHoursMessage || '')
            setAdminNumbers(settings.config.adminNumbers?.join(', ') || '')
          }
          
          setAddress(settings.address || '')
          setSocialMedia(settings.socialMedia || {
            instagram: '',
            facebook: '',
            twitter: '',
            website: '',
            tiktok: '',
          })
        } else {
          setError(data.error || 'Failed to load settings')
        }
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load settings')
        setLoading(false)
      })
      })
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Parse admin numbers
      const adminNumbersArray = adminNumbers
        .split(',')
        .map(n => n.trim())
        .filter(n => n.length > 0)

      const response = await fetch('/api/client/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          whatsappNumber,
          config: {
            businessHours,
            timezone,
            afterHoursMessage,
            adminNumbers: adminNumbersArray,
          },
          address,
          socialMedia,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Settings saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to save settings')
      }
    } catch (err) {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
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
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff' }}>
            <ArrowLeft style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ fontSize: '14px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {saving ? (
              <>
                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>
                <Save style={{ width: '16px', height: '16px' }} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:pt-32 md:pb-20 md:px-6">
        <PlexusBackground />
        <div className="container-lg" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '32px' }} className="md:mb-12">
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }} className="md:text-5xl">
              Settings
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0' }} className="md:text-xl">
              Configure your business hours, timezone, and contact information
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#f87171', marginBottom: error.includes('WhatsApp number') || error.includes('change') ? '16px' : '0' }}>{error}</p>
              
              {/* Contact Support Section - Show for WhatsApp number change limit errors */}
              {(error.includes('WhatsApp number') || error.includes('change') || error.includes('trial') || error.includes('month')) && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '16px', 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  border: '1px solid rgba(59, 130, 246, 0.2)', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <HelpCircle style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Need Help? Contact Support</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '16px' }}>
                    If you need to change your WhatsApp number, please contact our support team:
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }} className="md:grid-cols-2">
                    {/* Email Support */}
                    <div style={{ 
                      padding: '12px', 
                      background: 'rgba(26, 26, 26, 0.5)', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <Mail style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '12px', color: '#a0a0a0', margin: 0, marginBottom: '4px' }}>Email Support</p>
                        <a 
                          href="mailto:support@exonec.com?subject=WhatsApp Number Change Request" 
                          style={{ 
                            fontSize: '14px', 
                            color: '#3b82f6', 
                            textDecoration: 'none',
                            fontWeight: 500
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          support@exonec.com
                        </a>
                      </div>
                    </div>
                    
                    {/* WhatsApp Support */}
                    <div style={{ 
                      padding: '12px', 
                      background: 'rgba(26, 26, 26, 0.5)', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <MessageSquare style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '12px', color: '#a0a0a0', margin: 0, marginBottom: '4px' }}>WhatsApp Support</p>
                        <a 
                          href="https://wa.me/2348107060160?text=Hi%2C%20I%20need%20help%20changing%20my%20WhatsApp%20number" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            fontSize: '14px', 
                            color: '#3b82f6', 
                            textDecoration: 'none',
                            fontWeight: 500
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          +234 810 706 0160
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '12px', marginBottom: 0, fontStyle: 'italic' }}>
                    Our support team typically responds within 24 hours.
                  </p>
                </div>
              )}
            </div>
          )}

          {success && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#22c55e' }}>{success}</p>
            </div>
          )}

          {/* Business Hours */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Clock style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Business Hours</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="md:grid-cols-3 md:gap-6">
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Start Time (24-hour format)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="input"
                  value={businessHours.start}
                  onChange={(e) => setBusinessHours({ ...businessHours, start: parseInt(e.target.value) || 9 })}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  End Time (24-hour format)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="input"
                  value={businessHours.end}
                  onChange={(e) => setBusinessHours({ ...businessHours, end: parseInt(e.target.value) || 17 })}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Timezone
                </label>
                <select
                  className="input"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="Africa/Abidjan">Africa/Abidjan (GMT)</option>
                  <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                After-Hours Message
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="Thanks for your message! We're currently closed. We'll reply first thing tomorrow. 😊"
                value={afterHoursMessage}
                onChange={(e) => setAfterHoursMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <MapPin style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Contact Information</h2>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                WhatsApp Number *
              </label>
              <input
                type="text"
                className="input"
                placeholder="08107060160 or +2348107060160"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
              <p style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '8px' }}>
                Enter your WhatsApp number (with or without country code). The system will automatically format it.
              </p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                Business Address
              </label>
              <input
                type="text"
                className="input"
                placeholder="123 Main St, Lagos, Nigeria"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Admin Numbers */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Users style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Admin Numbers</h2>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                WhatsApp Numbers (comma-separated)
              </label>
              <input
                type="text"
                className="input"
                placeholder="+2348107060160, +2349012345678"
                value={adminNumbers}
                onChange={(e) => setAdminNumbers(e.target.value)}
              />
              <p style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '8px' }}>
                Admin numbers can use special commands like /RELOAD and /STATUS
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Globe style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Social Media</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="md:grid-cols-2 md:gap-6">
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Instagram
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="@yourbusiness"
                  value={socialMedia.instagram}
                  onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Facebook
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="yourbusiness"
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Twitter/X
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="@yourbusiness"
                  value={socialMedia.twitter}
                  onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Website
                </label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://yourbusiness.com"
                  value={socialMedia.website}
                  onChange={(e) => setSocialMedia({ ...socialMedia, website: e.target.value })}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  TikTok
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="@yourbusiness"
                  value={socialMedia.tiktok}
                  onChange={(e) => setSocialMedia({ ...socialMedia, tiktok: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  )
}

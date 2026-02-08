'use client'

import React, { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Wifi, WifiOff, Mail, BookOpen, QrCode } from 'lucide-react'
import PlexusBackground from '../components/PlexusBackground'
import WhatsAppConnection from '../components/WhatsAppConnection'

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface FormData {
  businessName: string
  email: string
  password: string
  confirmPassword: string
  whatsappNumber: string
  niche: string
  timezone: string
  businessHoursStart: string
  businessHoursEnd: string
  afterHoursMessage: string
}

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workspaceCreated, setWorkspaceCreated] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'checking'>('checking')
  const [emailVerified, setEmailVerified] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsappNumber: '',
    niche: (searchParams.get('niche') || 'other') as string,
    timezone: 'Africa/Lagos',
    businessHoursStart: '9',
    businessHoursEnd: '17',
    afterHoursMessage: "Thanks for your message! We're currently closed. We'll reply first thing tomorrow. 😊",
  })

  // Update niche if URL param changes
  useEffect(() => {
    const nicheParam = searchParams.get('niche')
    if (nicheParam && ['restaurant', 'fashion', 'logistics', 'retail', 'other'].includes(nicheParam)) {
      setFormData(prev => ({ ...prev, niche: nicheParam }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        if (!formData.businessName || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields')
          return false
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return false
        }
        if (!formData.email.includes('@')) {
          setError('Please enter a valid email address')
          return false
        }
        return true
      case 2:
        if (!formData.whatsappNumber) {
          setError('Please enter your WhatsApp number')
          return false
        }
        // Basic phone validation (at least 10 digits)
        const digitsOnly = formData.whatsappNumber.replace(/\D/g, '')
        if (digitsOnly.length < 10) {
          setError('Please enter a valid WhatsApp number')
          return false
        }
        return true
      case 3:
        // Business hours are optional, but validate if provided
        const start = parseInt(formData.businessHoursStart)
        const end = parseInt(formData.businessHoursEnd)
        if (start >= end) {
          setError('Business hours end time must be after start time')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as Step)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
      setError('')
    }
  }

  // Poll connection status (using new multi-connection API)
  const startConnectionPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/client/whatsapp/status', {
          credentials: 'include',
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.status) {
            if (data.status === 'connected') {
              setConnectionStatus('connected')
              clearInterval(pollInterval)
              // Auto-advance to email verification after 5 seconds (give user time to read)
              setTimeout(() => {
                if (currentStep === 5) {
                  setCurrentStep(6)
                }
              }, 5000)
            } else if (data.status === 'disconnected') {
              setConnectionStatus('disconnected')
            } else {
              setConnectionStatus('connecting')
            }
          }
        }
      } catch (err) {
        // Ignore errors, keep polling
      }
    }, 3000) // Poll every 3 seconds

    // Cleanup on unmount
    return () => clearInterval(pollInterval)
  }

  // Check email verification status
  const checkEmailVerification = async () => {
    setCheckingEmail(true)
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.user?.emailVerified) {
          setEmailVerified(true)
        }
      }
    } catch (err) {
      // Ignore errors
    } finally {
      setCheckingEmail(false)
    }
  }

  // Check email verification when on step 6
  useEffect(() => {
    if (currentStep === 6) {
      checkEmailVerification()
      // Poll every 5 seconds for email verification
      const emailCheckInterval = setInterval(checkEmailVerification, 5000)
      return () => clearInterval(emailCheckInterval)
    }
  }, [currentStep])

  // Start connection polling when workspace is created
  useEffect(() => {
    if (workspaceCreated && currentStep === 5) {
      // Check initial connection status (using new multi-connection API)
      const checkInitialStatus = async () => {
        try {
          const response = await fetch('/api/client/whatsapp/status', {
            credentials: 'include',
          })
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.status) {
              if (data.status === 'connected') {
                setConnectionStatus('connected')
              } else {
                setConnectionStatus(data.status || 'checking')
              }
            }
          }
        } catch (err) {
          // Ignore errors
        }
      }
      checkInitialStatus()
      
      const cleanup = startConnectionPolling()
      return cleanup
    }
  }, [workspaceCreated, currentStep])

  const handleVerifyEmail = () => {
    // Open email verification link in new tab
    window.open(`/verify-email?email=${encodeURIComponent(formData.email)}`, '_blank')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Prepare workspace data
      const workspaceData = {
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password,
        whatsappNumber: formData.whatsappNumber,
        niche: formData.niche,
        timezone: formData.timezone,
        businessHours: {
          start: parseInt(formData.businessHoursStart),
          end: parseInt(formData.businessHoursEnd),
        },
      }

      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(workspaceData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create workspace')
      }

      // Success - workspace created, move to QR code/connection step
      setWorkspaceCreated(true)
      setCurrentStep(5) // Step 5: QR Code & Connection Status
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
    router.refresh()
  }

  // Step 5: QR Code & Connection Status
  if (currentStep === 5) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', position: 'relative' }}>
        <PlexusBackground />
        <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="container-md animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '9999px', 
              background: '#1a1a1a', 
              border: `2px solid ${connectionStatus === 'connected' ? '#10b981' : connectionStatus === 'disconnected' ? '#ef4444' : '#3b82f6'}`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginLeft: 'auto', 
              marginRight: 'auto', 
              marginBottom: '24px' 
            }}>
              {connectionStatus === 'connected' ? (
                <CheckCircle2 style={{ width: '48px', height: '48px', color: '#10b981' }} />
              ) : connectionStatus === 'disconnected' ? (
                <WifiOff style={{ width: '48px', height: '48px', color: '#ef4444' }} />
              ) : (
                <QrCode style={{ width: '48px', height: '48px', color: '#3b82f6' }} />
              )}
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
              {connectionStatus === 'connected' ? 'WhatsApp Connected!' : 'Connect Your WhatsApp'}
            </h1>
            <p style={{ color: '#a0a0a0', marginBottom: '24px', fontSize: '16px' }}>
              {connectionStatus === 'connected' 
                ? 'Your WhatsApp number is connected and ready to receive messages!'
                : connectionStatus === 'disconnected'
                ? 'Waiting for WhatsApp connection... The bot will automatically connect when you scan the QR code.'
                : 'Your workspace has been created! Now you need to connect your WhatsApp number.'}
            </p>

            {/* Use new WhatsAppConnection component (multi-connection architecture) */}
            <div style={{ marginBottom: '32px' }}>
              <WhatsAppConnection 
                pollingInterval={3000}
                autoConnect={workspaceCreated && connectionStatus === 'disconnected'}
              />
            </div>

            {/* Connection Instructions */}
            {connectionStatus !== 'connected' && (
              <div style={{ 
                padding: '20px', 
                borderRadius: '8px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                border: '1px solid rgba(59, 130, 246, 0.2)',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <p style={{ fontSize: '14px', color: '#3b82f6', fontWeight: 600, marginBottom: '12px' }}>
                  📱 How to connect:
                </p>
                <ol style={{ fontSize: '13px', color: '#a0a0a0', paddingLeft: '20px', lineHeight: '1.8', margin: 0 }}>
                  <li>Click the "Connect WhatsApp" button above</li>
                  <li>Scan the QR code with your phone</li>
                  <li>Open WhatsApp → Settings → Linked Devices → Link a Device</li>
                  <li>Point your camera at the QR code</li>
                </ol>
              </div>
            )}
            
            {connectionStatus === 'connected' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Continue to Email Verification
                  <ChevronRight style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '14px' }}
                >
                  Skip for Now
                  <ChevronRight style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
                </button>
                <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', margin: 0 }}>
                  You can connect WhatsApp later from your dashboard
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Step 6: Email Verification
  if (currentStep === 6) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', position: 'relative' }}>
        <PlexusBackground />
        <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="container-md animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '9999px', 
              background: '#1a1a1a', 
              border: `2px solid ${emailVerified ? '#10b981' : '#3b82f6'}`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginLeft: 'auto', 
              marginRight: 'auto', 
              marginBottom: '24px' 
            }}>
              {emailVerified ? (
                <CheckCircle2 style={{ width: '48px', height: '48px', color: '#10b981' }} />
              ) : (
                <Mail style={{ width: '48px', height: '48px', color: '#3b82f6' }} />
              )}
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
              {emailVerified ? 'Email Verified!' : 'Verify Your Email'}
            </h1>
            <p style={{ color: '#a0a0a0', marginBottom: '32px', fontSize: '16px' }}>
              {emailVerified 
                ? 'Your email address has been verified successfully!'
                : `We've sent a verification email to ${formData.email}. Please check your inbox and click the verification link.`}
            </p>
            
            {!emailVerified && (
              <div style={{ 
                padding: '20px', 
                borderRadius: '8px', 
                background: '#1a1a1a', 
                border: '1px solid #262626',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '16px' }}>
                  <strong style={{ color: '#ffffff' }}>📧 Check your email:</strong>
                </p>
                <ol style={{ fontSize: '14px', color: '#a0a0a0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Open your email inbox ({formData.email})</li>
                  <li>Look for an email from "WhatsApp FAQ Bot"</li>
                  <li>Click the "Verify Email Address" button</li>
                  <li>Come back here and click "I've Verified"</li>
                </ol>
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  background: 'rgba(255, 193, 7, 0.1)', 
                  border: '1px solid rgba(255, 193, 7, 0.3)'
                }}>
                  <p style={{ fontSize: '12px', color: '#ffc107', margin: 0 }}>
                    ⚠️ <strong>Email not received?</strong> Email verification may not be configured (RESEND_API_KEY not set). You can skip this step and verify later from your dashboard.
                  </p>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
              {emailVerified ? (
                <button
                  onClick={() => setCurrentStep(7)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Continue to Tutorial
                  <ChevronRight style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleVerifyEmail}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Open Email Verification Link
                    <Mail style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
                  </button>
                  <button
                    onClick={checkEmailVerification}
                    disabled={checkingEmail}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    {checkingEmail ? (
                      <>
                        <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                        Checking...
                      </>
                    ) : (
                      'I\'ve Verified My Email'
                    )}
                  </button>
                  <button
                    onClick={() => setCurrentStep(7)}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '14px' }}
                  >
                    Skip for Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 7: Success with Tutorial
  if (currentStep === 7) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', position: 'relative' }}>
        <PlexusBackground />
        <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="container-md animate-fade-in" style={{ textAlign: 'center', maxWidth: '700px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '9999px', 
              background: '#1a1a1a', 
              border: '2px solid #10b981', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginLeft: 'auto', 
              marginRight: 'auto', 
              marginBottom: '24px' 
            }}>
              <CheckCircle2 style={{ width: '48px', height: '48px', color: '#10b981' }} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>🎉 Welcome! You're All Set</h1>
            <p style={{ color: '#a0a0a0', marginBottom: '32px', fontSize: '16px' }}>
              Your WhatsApp FAQ bot workspace is ready! Here's a quick guide to get you started.
            </p>

            {/* Onboarding Tutorial */}
            <div style={{ 
              background: '#1a1a1a', 
              border: '1px solid #262626', 
              borderRadius: '8px', 
              padding: '32px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <BookOpen style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Quick Start Guide</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: '#3b82f6', 
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>1</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Add Your FAQs</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: '#a0a0a0', marginLeft: '32px', lineHeight: '1.6' }}>
                    Go to your dashboard and add frequently asked questions. The bot will automatically match customer messages to your FAQs.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: '#3b82f6', 
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>2</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Test Your Bot</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: '#a0a0a0', marginLeft: '32px', lineHeight: '1.6' }}>
                    Send a test message to {formData.whatsappNumber} from another WhatsApp number to see your bot in action!
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: '#3b82f6', 
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>3</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Customize Settings</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: '#a0a0a0', marginLeft: '32px', lineHeight: '1.6' }}>
                    Adjust business hours, timezone, and after-hours messages to match your business schedule.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: '#3b82f6', 
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>4</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>View Analytics</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: '#a0a0a0', marginLeft: '32px', lineHeight: '1.6' }}>
                    Track message volume, FAQ matches, and customer engagement from your dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
              <button
                onClick={handleGoToDashboard}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Go to Dashboard
                <ChevronRight style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
              </button>
              <Link href="/" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', position: 'relative' }}>
      <PlexusBackground />
      
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
            <MessageSquare style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
            <span style={{ fontSize: '16px', fontWeight: 600 }}>WhatsApp FAQ Bot</span>
          </Link>
          <Link href="/" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ 
        position: 'fixed', 
        top: '60px', 
        left: 0, 
        right: 0, 
        height: '4px', 
        background: '#1a1a1a',
        zIndex: 40
      }}>
        <div style={{ 
          height: '100%', 
          background: '#3b82f6', 
          width: `${(currentStep <= 4 ? currentStep / 4 : 100) * 100}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '120px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div className="container-md" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Step Indicator */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '8px' }}>
              Step {currentStep} of 4
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
              {currentStep === 1 && 'Create Your Account'}
              {currentStep === 2 && 'WhatsApp Setup'}
              {currentStep === 3 && 'Business Hours'}
              {currentStep === 4 && 'Review & Create'}
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0' }}>
              {currentStep === 1 && 'Set up your business account'}
              {currentStep === 2 && 'Connect your WhatsApp number'}
              {currentStep === 3 && 'Configure your business hours'}
              {currentStep === 4 && 'Review your information and create your workspace'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="card animate-fade-in" style={{ padding: '32px' }}>
            {error && (
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
                <p style={{ fontSize: '14px', color: '#f87171' }}>{error}</p>
              </div>
            )}

            {/* Step 1: Business Info */}
            {currentStep === 1 && (
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
                    style={{ width: '100%' }}
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
                    style={{ width: '100%' }}
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
                    style={{ width: '100%' }}
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="fashion">Fashion Store</option>
                    <option value="logistics">Logistics</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    className="input"
                    style={{ width: '100%' }}
                  />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            {/* Step 2: WhatsApp Setup */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                    placeholder="e.g., +2348107060160 or 08107060160"
                    className="input"
                    style={{ width: '100%' }}
                  />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Include country code if outside Nigeria. You'll scan a QR code to connect this number.
                  </p>
                </div>

                <div style={{ 
                  padding: '16px', 
                  borderRadius: '8px', 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  border: '1px solid rgba(59, 130, 246, 0.2)' 
                }}>
                  <p style={{ fontSize: '14px', color: '#a0a0a0', lineHeight: '1.6' }}>
                    <strong style={{ color: '#3b82f6' }}>💡 What happens next?</strong><br />
                    After creating your workspace, you'll be redirected to your dashboard where you can scan a QR code to connect your WhatsApp number. The bot will then be ready to answer customer questions!
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Business Hours */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label htmlFor="timezone" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Timezone *
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    required
                    value={formData.timezone}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%' }}
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                    <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="businessHoursStart" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                      Business Hours Start *
                    </label>
                    <select
                      id="businessHoursStart"
                      name="businessHoursStart"
                      required
                      value={formData.businessHoursStart}
                      onChange={handleChange}
                      className="input"
                      style={{ width: '100%' }}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="businessHoursEnd" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                      Business Hours End *
                    </label>
                    <select
                      id="businessHoursEnd"
                      name="businessHoursEnd"
                      required
                      value={formData.businessHoursEnd}
                      onChange={handleChange}
                      className="input"
                      style={{ width: '100%' }}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="afterHoursMessage" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    After-Hours Message (Optional)
                  </label>
                  <textarea
                    id="afterHoursMessage"
                    name="afterHoursMessage"
                    value={formData.afterHoursMessage}
                    onChange={handleChange}
                    placeholder="Message to send when customers message outside business hours"
                    className="input"
                    style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ 
                  padding: '20px', 
                  borderRadius: '8px', 
                  background: '#1a1a1a', 
                  border: '1px solid #262626' 
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Review Your Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ color: '#a0a0a0', fontSize: '14px' }}>Business Name:</span>
                      <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500 }}>{formData.businessName}</p>
                    </div>
                    <div>
                      <span style={{ color: '#a0a0a0', fontSize: '14px' }}>Email:</span>
                      <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500 }}>{formData.email}</p>
                    </div>
                    <div>
                      <span style={{ color: '#a0a0a0', fontSize: '14px' }}>WhatsApp Number:</span>
                      <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500 }}>{formData.whatsappNumber}</p>
                    </div>
                    <div>
                      <span style={{ color: '#a0a0a0', fontSize: '14px' }}>Business Type:</span>
                      <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500 }}>{formData.niche}</p>
                    </div>
                    <div>
                      <span style={{ color: '#a0a0a0', fontSize: '14px' }}>Business Hours:</span>
                      <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500 }}>
                        {formData.businessHoursStart}:00 - {formData.businessHoursEnd}:00 ({formData.timezone})
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  padding: '16px', 
                  borderRadius: '8px', 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  border: '1px solid rgba(59, 130, 246, 0.2)' 
                }}>
                  <p style={{ fontSize: '14px', color: '#a0a0a0', lineHeight: '1.6' }}>
                    <strong style={{ color: '#3b82f6' }}>✅ 14-Day Free Trial</strong><br />
                    You'll start with a 14-day free trial. No credit card required. You can upgrade anytime from your dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <ChevronLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                    {currentStep === 4 ? 'Creating...' : 'Next'}
                  </>
                ) : (
                  <>
                    {currentStep === 4 ? 'Create Workspace' : 'Next'}
                    <ChevronRight style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}

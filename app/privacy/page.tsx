'use client'

import Link from 'next/link'
import { MessageSquare, ArrowLeft, Shield } from 'lucide-react'
import PlexusBackground from '../components/PlexusBackground'

export default function PrivacyPage() {
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
            <Shield style={{ width: '40px', height: '40px', color: '#3b82f6', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }} className="md:w-12 md:h-12 md:mb-6" />
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-5xl md:mb-4 md:px-0">
              Privacy Policy
            </h1>
            <p style={{ fontSize: '14px', color: '#a0a0a0', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-lg md:px-0">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="card md:p-6" style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', padding: '24px' }}>
            <div style={{ lineHeight: 1.8, color: '#e0e0e0' }}>
              <p style={{ marginBottom: '24px', fontSize: '16px' }}>
                At WhatsApp FAQ Bot, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                1. Information We Collect
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                When you sign up for our service, we collect:
              </p>
              <ul style={{ marginLeft: '24px', marginBottom: '24px', fontSize: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Business name and contact information</li>
                <li style={{ marginBottom: '8px' }}>WhatsApp phone number</li>
                <li style={{ marginBottom: '8px' }}>Email address</li>
                <li style={{ marginBottom: '8px' }}>Business address (optional)</li>
                <li style={{ marginBottom: '8px' }}>Social media handles (optional)</li>
              </ul>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                2. How We Use Your Information
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                We use your information to:
              </p>
              <ul style={{ marginLeft: '24px', marginBottom: '24px', fontSize: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Set up and manage your WhatsApp FAQ bot</li>
                <li style={{ marginBottom: '8px' }}>Send you service-related communications</li>
                <li style={{ marginBottom: '8px' }}>Provide customer support</li>
                <li style={{ marginBottom: '8px' }}>Improve our services</li>
              </ul>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                3. Data Storage and Security
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                Your data is stored securely on our servers. We implement industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                4. WhatsApp Data
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                Our bot processes messages sent to your WhatsApp number. Message content is processed in real-time and is not stored permanently. We do not access your personal WhatsApp conversations beyond what is necessary to provide the FAQ bot service.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                5. Third-Party Services
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                We use third-party services including:
              </p>
              <ul style={{ marginLeft: '24px', marginBottom: '24px', fontSize: '16px' }}>
                <li style={{ marginBottom: '8px' }}><strong>Resend:</strong> For sending email notifications</li>
                <li style={{ marginBottom: '8px' }}><strong>Vercel:</strong> For hosting our web platform</li>
                <li style={{ marginBottom: '8px' }}><strong>WhatsApp Web:</strong> For bot functionality</li>
              </ul>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                These services have their own privacy policies. We recommend reviewing them.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                6. Your Rights
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                You have the right to:
              </p>
              <ul style={{ marginLeft: '24px', marginBottom: '24px', fontSize: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Access your personal information</li>
                <li style={{ marginBottom: '8px' }}>Request correction of inaccurate data</li>
                <li style={{ marginBottom: '8px' }}>Request deletion of your account and data</li>
                <li style={{ marginBottom: '8px' }}>Opt-out of marketing communications</li>
              </ul>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                7. Data Retention
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                We retain your information for as long as your account is active or as needed to provide services. You can request deletion of your data at any time by contacting us.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                8. Changes to This Policy
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                9. Contact Us
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p style={{ marginBottom: '24px', fontSize: '16px' }}>
                <strong>Email:</strong> <a href="mailto:support@exonec.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>support@exonec.com</a><br />
                <strong>Website:</strong> <Link href="/contact" style={{ color: '#3b82f6', textDecoration: 'none' }}>Contact Page</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

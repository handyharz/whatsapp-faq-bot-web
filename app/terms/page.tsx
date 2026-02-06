'use client'

import Link from 'next/link'
import { MessageSquare, ArrowLeft, FileText } from 'lucide-react'
import PlexusBackground from '../components/PlexusBackground'

export default function TermsPage() {
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
            <FileText style={{ width: '40px', height: '40px', color: '#3b82f6', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }} className="md:w-12 md:h-12 md:mb-6" />
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-5xl md:mb-4 md:px-0">
              Terms of Service
            </h1>
            <p style={{ fontSize: '14px', color: '#a0a0a0', paddingLeft: '16px', paddingRight: '16px' }} className="md:text-lg md:px-0">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="card md:p-6" style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', padding: '24px' }}>
            <div style={{ lineHeight: 1.8, color: '#e0e0e0' }}>
              <p style={{ marginBottom: '24px', fontSize: '16px' }}>
                By using WhatsApp FAQ Bot, you agree to be bound by these Terms of Service. Please read them carefully.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                1. Acceptance of Terms
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                By accessing or using WhatsApp FAQ Bot, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our service.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                2. Description of Service
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                WhatsApp FAQ Bot is an automated customer support service that uses WhatsApp to answer frequently asked questions for businesses. The service processes incoming messages and responds based on predefined FAQ templates.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                3. User Responsibilities
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                You agree to:
              </p>
              <ul style={{ marginLeft: '24px', marginBottom: '24px', fontSize: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Provide accurate and complete information when signing up</li>
                <li style={{ marginBottom: '8px' }}>Maintain the security of your account credentials</li>
                <li style={{ marginBottom: '8px' }}>Use the service in compliance with WhatsApp's Terms of Service</li>
                <li style={{ marginBottom: '8px' }}>Not use the service for illegal or harmful purposes</li>
                <li style={{ marginBottom: '8px' }}>Not spam or abuse the service</li>
              </ul>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                4. Service Availability
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                We strive to provide reliable service but do not guarantee uninterrupted or error-free operation. The service may be unavailable due to maintenance, technical issues, or factors beyond our control.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                5. WhatsApp Compliance
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                Our service uses WhatsApp Web protocol. You must comply with WhatsApp's Terms of Service. We are not responsible for any actions taken by WhatsApp, including account restrictions or bans.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                6. Pricing and Payment
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                Currently, WhatsApp FAQ Bot is offered as a free trial. Future paid plans may be introduced with advance notice. You will be notified of any pricing changes before they take effect.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                7. Intellectual Property
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                All content, features, and functionality of WhatsApp FAQ Bot are owned by us and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our service without permission.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                8. Limitation of Liability
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                To the maximum extent permitted by law, WhatsApp FAQ Bot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                9. Termination
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason. You may cancel your account at any time by contacting us.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                10. Changes to Terms
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                We may modify these Terms of Service at any time. We will notify you of significant changes via email or through our website. Continued use of the service after changes constitutes acceptance.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                11. Governing Law
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                These Terms of Service are governed by the laws of Nigeria. Any disputes shall be resolved in Nigerian courts.
              </p>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: '#ffffff' }} className="md:text-2xl md:mt-8 md:mb-4">
                12. Contact Information
              </h2>
              <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                For questions about these Terms of Service, please contact us:
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

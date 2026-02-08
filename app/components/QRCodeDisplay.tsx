'use client'

import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Loader2, RefreshCw } from 'lucide-react'

interface QRCodeDisplayProps {
  pollingInterval?: number // Poll every N milliseconds (default: 3000)
  onConnected?: () => void // Callback when connection is detected
}

export default function QRCodeDisplay({ pollingInterval = 3000, onConnected }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPolling, setIsPolling] = useState(true)

  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/qr-code', {
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch QR code')
      }

      if (data.qrCode) {
        setQrCode(data.qrCode)
        setError('')
        setLoading(false)
        setIsPolling(true) // Keep polling if QR code exists
      } else {
        // No QR code means bot is connected or connecting
        setQrCode(null)
        setError('')
        setLoading(false)
        // Don't stop polling immediately - keep checking in case connection drops
        // Only call onConnected callback, don't stop polling
        if (onConnected) {
          onConnected()
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load QR code')
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchQRCode()

    // Poll for QR code updates
    if (isPolling) {
      const interval = setInterval(fetchQRCode, pollingInterval)
      return () => clearInterval(interval)
    }
  }, [isPolling, pollingInterval])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        background: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #262626'
      }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ color: '#a0a0a0', fontSize: '14px' }}>Loading QR code...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px',
        background: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #ef4444',
        textAlign: 'center'
      }}>
        <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
        <button
          onClick={fetchQRCode}
          className="btn btn-secondary"
          style={{ fontSize: '14px' }}
        >
          <RefreshCw style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Retry
        </button>
      </div>
    )
  }

  if (!qrCode) {
    return (
      <div style={{ 
        padding: '32px',
        background: '#1a1a1a',
        borderRadius: '8px',
        border: '2px solid #10b981',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          background: 'rgba(16, 185, 129, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <p style={{ color: '#10b981', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
          ✅ WhatsApp is Connected!
        </p>
        <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '12px' }}>
          Your bot is already connected and ready to receive messages.
        </p>
        <p style={{ color: '#666', fontSize: '12px' }}>
          No QR code needed - you can proceed to the next step.
        </p>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '32px',
      background: '#1a1a1a',
      borderRadius: '8px',
      border: '1px solid #262626'
    }}>
      <div style={{ 
        padding: '20px', 
        background: '#ffffff', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <QRCodeSVG 
          value={qrCode} 
          size={256}
          level="M"
          includeMargin={true}
        />
      </div>
      <p style={{ color: '#a0a0a0', fontSize: '14px', textAlign: 'center', marginBottom: '8px' }}>
        Scan this QR code with WhatsApp
      </p>
      <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>
        Open WhatsApp → Settings → Linked Devices → Link a Device
      </p>
      <p style={{ color: '#666', fontSize: '11px', textAlign: 'center' }}>
        ⏱️ QR code expires in ~20-30 seconds. A new one will appear automatically.
      </p>
      <button
        onClick={fetchQRCode}
        className="btn btn-secondary"
        style={{ marginTop: '16px', fontSize: '12px' }}
      >
        <RefreshCw style={{ width: '14px', height: '14px', marginRight: '6px' }} />
        Refresh QR Code
      </button>
    </div>
  )
}

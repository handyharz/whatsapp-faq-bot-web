'use client'

import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Loader2, RefreshCw, Wifi, WifiOff, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { fetchBackendAPI } from '../lib/fetch-utils'

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'reconnecting' | 'unknown'

// Helper to format relative time (e.g., "2 minutes ago", "just now")
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 10) return 'just now'
  if (diffSecs < 60) return `${diffSecs} second${diffSecs === 1 ? '' : 's'} ago`
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  return date.toLocaleString()
}

interface WhatsAppConnectionProps {
  pollingInterval?: number // Poll status every N milliseconds (default: 3000)
  autoConnect?: boolean // Automatically start connection on mount (default: false)
  onStatusChange?: (status: ConnectionStatus) => void // Callback when status changes
}

export default function WhatsAppConnection({ 
  pollingInterval = 3000,
  autoConnect = false,
  onStatusChange
}: WhatsAppConnectionProps) {
  const [status, setStatus] = useState<ConnectionStatus>('unknown')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')
  const [lastConnectedAt, setLastConnectedAt] = useState<Date | null>(null)
  const [lastDisconnectedAt, setLastDisconnectedAt] = useState<Date | null>(null)
  const [disconnectReason, setDisconnectReason] = useState<string | null>(null)
  const [connectionHealth, setConnectionHealth] = useState<'operational' | 'degraded' | 'unknown'>('unknown')
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null)
  const [lastSuccessfulOutbound, setLastSuccessfulOutbound] = useState<Date | null>(null)
  const [lastInboundMessage, setLastInboundMessage] = useState<Date | null>(null)

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/client/whatsapp/status', {
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch connection status')
      }

      if (data.success) {
        const newStatus = data.status || 'disconnected'
        const oldStatus = status
        
        setStatus(newStatus)
        
        // Notify parent component of status change
        if (onStatusChange && newStatus !== oldStatus) {
          onStatusChange(newStatus)
        }
        
        // Update QR code if available (Baileys generates new QR codes when old ones expire)
        if (data.qrCode) {
          setQrCode(data.qrCode)
        } else if (newStatus === 'connected') {
          // Clear QR code when connected
          setQrCode(null)
        }
        
        setLastConnectedAt(data.lastConnectedAt ? new Date(data.lastConnectedAt) : null)
        setLastDisconnectedAt(data.lastDisconnectedAt ? new Date(data.lastDisconnectedAt) : null)
        setDisconnectReason(data.disconnectReason || null)
        setError('')
      }
    } catch (err: any) {
      console.error('Status fetch error:', err)
      // Don't set error on status fetch - just log it
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    setConnecting(true)
    setError('')
    
    try {
      const response = await fetch('/api/client/whatsapp/connect', {
        method: 'POST',
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to connect WhatsApp')
      }

      if (data.success) {
        if (data.connected) {
          // Already connected
          setStatus('connected')
          setQrCode(null)
        } else if (data.qrCode) {
          // QR code generated
          setStatus('connecting')
          setQrCode(data.qrCode)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect WhatsApp')
      console.error('Connect error:', err)
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect WhatsApp? You will need to scan the QR code again to reconnect.')) {
      return
    }

    setConnecting(true)
    setError('')
    
    try {
      const response = await fetch('/api/client/whatsapp/disconnect', {
        method: 'POST',
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to disconnect WhatsApp')
      }

      if (data.success) {
        setStatus('disconnected')
        setQrCode(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect WhatsApp')
      console.error('Disconnect error:', err)
    } finally {
      setConnecting(false)
    }
  }

  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/client/whatsapp/qr', {
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch QR code')
      }

      if (data.success && data.qrCode) {
        setQrCode(data.qrCode)
      } else if (data.connected) {
        setStatus('connected')
        setQrCode(null)
      }
    } catch (err: any) {
      console.error('QR fetch error:', err)
    }
  }

  useEffect(() => {
    // Initial status fetch
    fetchStatus()

    // Auto-connect if enabled
    if (autoConnect && status === 'disconnected') {
      handleConnect()
    }
  }, [autoConnect])

  useEffect(() => {
    // Poll for status updates (only if not loading and not manually connecting)
    if (!loading && !connecting) {
      const interval = setInterval(fetchStatus, pollingInterval)
      return () => clearInterval(interval)
    }
  }, [loading, connecting, pollingInterval])

  // Poll for QR code updates when connecting
  // Note: QR codes expire in ~20-30 seconds, and Baileys automatically generates new ones
  // We poll every 2 seconds to catch new QR codes when they're regenerated
  useEffect(() => {
    if (status === 'connecting') {
      const interval = setInterval(fetchQRCode, 2000) // Poll QR every 2 seconds when connecting
      return () => clearInterval(interval)
    }
  }, [status])

  // Health check when connected (every 30 seconds)
  // CRITICAL: Stop polling when tab is inactive to avoid WhatsApp rate limiting
  useEffect(() => {
    if (status === 'connected') {
      let interval: NodeJS.Timeout | null = null
      let isTabVisible = true

      const checkHealth = async () => {
        // Don't check if tab is hidden (defensive rate limiting)
        if (!isTabVisible) {
          return
        }

        try {
          const response = await fetch('/api/client/whatsapp/health', {
            credentials: 'include',
          })
          const data = await response.json()
          
          if (data.success) {
            setConnectionHealth(data.status || 'unknown') // 'operational' | 'degraded' | 'unknown'
            setLastHealthCheck(data.lastChecked ? new Date(data.lastChecked) : null)
            setLastSuccessfulOutbound(data.lastSuccessfulOutbound ? new Date(data.lastSuccessfulOutbound) : null)
            setLastInboundMessage(data.lastInboundMessage ? new Date(data.lastInboundMessage) : null)
          }
        } catch (err) {
          console.error('Health check error:', err)
          setConnectionHealth('unknown')
        }
      }

      // Handle page visibility changes
      const handleVisibilityChange = () => {
        isTabVisible = !document.hidden
        if (isTabVisible && status === 'connected') {
          // Tab became visible - check immediately
          checkHealth()
        }
      }

      // Check immediately
      checkHealth()

      // Then check every 30 seconds (only when tab is visible)
      interval = setInterval(() => {
        if (isTabVisible) {
          checkHealth()
        }
      }, 30000)

      // Listen for visibility changes
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        if (interval) clearInterval(interval)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    } else {
      setConnectionHealth('unknown')
      setLastHealthCheck(null)
      setLastSuccessfulOutbound(null)
      setLastInboundMessage(null)
    }
  }, [status])

  // Poll for QR code updates when connecting
  // Note: QR codes expire in ~20-30 seconds, and Baileys automatically generates new ones
  // We poll every 2 seconds to catch new QR codes when they're regenerated
  useEffect(() => {
    if (status === 'connecting') {
      const interval = setInterval(fetchQRCode, 2000) // Poll QR every 2 seconds when connecting
      return () => clearInterval(interval)
    }
  }, [status])

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
        <p style={{ color: '#a0a0a0', fontSize: '14px' }}>Loading connection status...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '24px',
      background: '#1a1a1a',
      borderRadius: '8px',
      border: '1px solid #262626'
    }}>
      {/* Status Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {status === 'connected' ? (
            <CheckCircle2 style={{ width: '24px', height: '24px', color: '#10b981' }} />
          ) : status === 'connecting' || status === 'reconnecting' ? (
            <Loader2 style={{ width: '24px', height: '24px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          ) : (
            <XCircle style={{ width: '24px', height: '24px', color: '#ef4444' }} />
          )}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
              WhatsApp Connection
            </h3>
            <p style={{ color: '#a0a0a0', fontSize: '14px' }}>
              {status === 'connected' && 'Connected and ready'}
              {status === 'connecting' && 'Connecting...'}
              {status === 'reconnecting' && 'Reconnecting...'}
              {status === 'disconnected' && 'Not connected'}
              {status === 'unknown' && 'Unknown status'}
            </p>
          </div>
        </div>
        
        {status === 'connected' && (
          <button
            onClick={handleDisconnect}
            disabled={connecting}
            className="btn btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Disconnect
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0 }} />
          <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Connection Info */}
      {status === 'connected' && lastConnectedAt && (
        <div style={{ 
          padding: '12px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10b981',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          <p style={{ color: '#10b981', fontSize: '12px', margin: 0 }}>
            Connected since {lastConnectedAt.toLocaleString()}
          </p>
        </div>
      )}

      {status === 'disconnected' && lastDisconnectedAt && (
        <div style={{ 
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>
            Disconnected {lastDisconnectedAt.toLocaleString()}
            {disconnectReason && ` - ${disconnectReason}`}
          </p>
        </div>
      )}

      {/* QR Code Display */}
      {status === 'connecting' && qrCode && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '24px',
          background: '#0a0a0a',
          borderRadius: '8px',
          border: '1px solid #262626',
          marginBottom: '16px'
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
          <p style={{ color: '#666', fontSize: '11px', textAlign: 'center', marginBottom: '12px' }}>
            ⏱️ QR codes expire in ~20-30 seconds. We automatically refresh every 2 seconds to show the latest QR code.
          </p>
          <button
            onClick={fetchQRCode}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <RefreshCw style={{ width: '14px', height: '14px', marginRight: '6px' }} />
            Refresh QR Code
          </button>
        </div>
      )}

      {/* Connect Button */}
      {status === 'disconnected' && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '12px 24px', minWidth: '200px' }}
          >
            {connecting ? (
              <>
                <Loader2 style={{ width: '18px', height: '18px', marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                Connecting...
              </>
            ) : (
              <>
                <Wifi style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                Connect WhatsApp
              </>
            )}
          </button>
          <p style={{ color: '#666', fontSize: '12px', marginTop: '12px' }}>
            Connect your WhatsApp to start receiving messages from customers
          </p>
        </div>
      )}

      {/* Connected Status */}
      {status === 'connected' && (
        <div style={{ 
          padding: '24px',
          background: connectionHealth === 'degraded' || connectionHealth === 'unknown'
            ? 'rgba(245, 158, 11, 0.1)' 
            : 'rgba(16, 185, 129, 0.1)',
          border: `2px solid ${connectionHealth === 'degraded' || connectionHealth === 'unknown' ? '#f59e0b' : '#10b981'}`,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: connectionHealth === 'degraded' || connectionHealth === 'unknown'
              ? 'rgba(245, 158, 11, 0.2)'
              : 'rgba(16, 185, 129, 0.2)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            {connectionHealth === 'degraded' || connectionHealth === 'unknown' ? (
              <AlertCircle style={{ width: '32px', height: '32px', color: '#f59e0b' }} />
            ) : (
              <CheckCircle2 style={{ width: '32px', height: '32px', color: '#10b981' }} />
            )}
          </div>
          <p style={{ 
            color: connectionHealth === 'degraded' || connectionHealth === 'unknown' ? '#f59e0b' : '#10b981', 
            fontSize: '18px', 
            fontWeight: 600, 
            marginBottom: '8px' 
          }}>
            {connectionHealth === 'operational' 
              ? '✅ Connection Active' 
              : connectionHealth === 'degraded'
              ? '⚠️ Connection May Be Experiencing Issues'
              : '🔄 Checking Connection Status...'}
          </p>
          <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '12px' }}>
            {connectionHealth === 'operational' 
              ? 'Your bot is ready to receive messages. Note: Message delivery depends on your phone being online and WhatsApp running.'
              : connectionHealth === 'degraded'
              ? 'Connection is active but may have issues. Check your phone\'s internet connection and WhatsApp app status.'
              : 'Verifying connection status...'}
          </p>
          
          {/* Message Activity Metadata */}
          {(lastSuccessfulOutbound || lastInboundMessage) && (
            <div style={{ 
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#a0a0a0',
              textAlign: 'left'
            }}>
              {lastSuccessfulOutbound && (
                <p style={{ margin: 0, marginBottom: '4px' }}>
                  Last message sent: {formatRelativeTime(lastSuccessfulOutbound)}
                </p>
              )}
              {lastInboundMessage && (
                <p style={{ margin: 0, marginBottom: '4px' }}>
                  Last message received: {formatRelativeTime(lastInboundMessage)}
                </p>
              )}
              {lastHealthCheck && (
                <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>
                  Last checked: {formatRelativeTime(lastHealthCheck)}
                </p>
              )}
            </div>
          )}
          
          {(connectionHealth === 'degraded' || connectionHealth === 'unknown') && (
            <div style={{ 
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#f59e0b',
              textAlign: 'left'
            }}>
              <p style={{ margin: 0, marginBottom: '8px', fontWeight: 600 }}>
                Possible causes:
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Phone is offline or has no internet</li>
                <li>WhatsApp app is closed or restricted</li>
                <li>Background restrictions on your device</li>
              </ul>
            </div>
          )}
          
          {lastConnectedAt && (
            <p style={{ color: '#666', fontSize: '12px', marginTop: '12px' }}>
              Connected since {lastConnectedAt.toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

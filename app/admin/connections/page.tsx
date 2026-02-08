'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Loader2,
  ArrowLeft,
  Filter
} from 'lucide-react'
// Check auth by calling /api/auth/me
async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    })
    return response.ok
  } catch {
    return false
  }
}

interface ConnectionStatus {
  _id?: string;
  workspaceId: string;
  status: 'connected' | 'disconnected' | 'reconnecting' | 'connecting';
  lastConnectedAt: string;
  lastDisconnectedAt?: string;
  disconnectReason?: string;
  notified: boolean;
  businessName: string;
  email: string;
  phoneNumbers: string[];
}

interface ConnectionStats {
  total: number;
  connected: number;
  disconnected: number;
  reconnecting: number;
  connecting: number;
}

export default function ConnectionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [connections, setConnections] = useState<ConnectionStatus[]>([])
  const [stats, setStats] = useState<ConnectionStats | null>(null)
  const [filter, setFilter] = useState<'all' | 'disconnected'>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.push('/admin/login')
        return
      }
      fetchConnections()
    }
    verifyAuth()
  }, [router])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConnections(true) // Silent refresh
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchConnections = async (silent = false) => {
    if (!silent) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    setError('')

    try {
      const response = await fetch('/api/admin/connection-status', {
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch connection status')
      }

      setConnections(data.connections || [])
      setStats(data.stats || null)
    } catch (err: any) {
      setError(err.message || 'Failed to load connection status')
      console.error('Connection status error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981' }} />
      case 'disconnected':
        return <WifiOff style={{ width: '20px', height: '20px', color: '#ef4444' }} />
      case 'reconnecting':
        return <RefreshCw style={{ width: '20px', height: '20px', color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
      case 'connecting':
        return <Clock style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
      default:
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#6b7280' }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return '#10b981'
      case 'disconnected':
        return '#ef4444'
      case 'reconnecting':
        return '#f59e0b'
      case 'connecting':
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  const filteredConnections = filter === 'disconnected' 
    ? connections.filter(c => c.status === 'disconnected')
    : connections

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', padding: '24px' }}>
      <div className="container-md" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#a0a0a0', textDecoration: 'none', marginBottom: '8px' }}>
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Back to Admin
            </Link>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Connection Status</h1>
            <p style={{ color: '#a0a0a0', fontSize: '16px' }}>Monitor WhatsApp bot connections across all workspaces</p>
          </div>
          <button
            onClick={() => fetchConnections()}
            disabled={refreshing}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw style={{ width: '16px', height: '16px', animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '8px' }}>Total Workspaces</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>{stats.total}</div>
            </div>
            <div style={{ background: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '8px' }}>Connected</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981' }}>{stats.connected}</div>
            </div>
            <div style={{ background: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '8px' }}>Disconnected</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#ef4444' }}>{stats.disconnected}</div>
            </div>
            <div style={{ background: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '8px' }}>Reconnecting</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>{stats.reconnecting}</div>
            </div>
          </div>
        )}

        {/* Error Message */}
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

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <Filter style={{ width: '16px', height: '16px', color: '#a0a0a0' }} />
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            All ({connections.length})
          </button>
          <button
            onClick={() => setFilter('disconnected')}
            className={filter === 'disconnected' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Disconnected ({connections.filter(c => c.status === 'disconnected').length})
          </button>
        </div>

        {/* Connections Table */}
        <div style={{ background: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', overflow: 'hidden' }}>
          {filteredConnections.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#a0a0a0' }}>
              <Wifi style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.5 }} />
              <p>No connections found</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #262626' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Business</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Phone</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Last Connected</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Last Disconnected</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredConnections.map((connection) => (
                  <tr key={connection.workspaceId} style={{ borderBottom: '1px solid #262626' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(connection.status)}
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: 500,
                          color: getStatusColor(connection.status),
                          textTransform: 'capitalize'
                        }}>
                          {connection.status}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 500 }}>{connection.businessName}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{connection.workspaceId}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{connection.email}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {connection.phoneNumbers.length > 0 ? connection.phoneNumbers[0] : 'N/A'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#a0a0a0' }}>
                      {new Date(connection.lastConnectedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#a0a0a0' }}>
                      {connection.lastDisconnectedAt 
                        ? new Date(connection.lastDisconnectedAt).toLocaleString()
                        : '—'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#a0a0a0', maxWidth: '200px' }}>
                      {connection.disconnectReason ? (
                        <span style={{ 
                          display: 'inline-block',
                          padding: '4px 8px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {connection.disconnectReason}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Auto-refresh indicator */}
        {refreshing && (
          <div style={{ 
            position: 'fixed', 
            bottom: '24px', 
            right: '24px', 
            background: '#1a1a1a', 
            border: '1px solid #262626', 
            borderRadius: '8px', 
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#a0a0a0'
          }}>
            <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            Refreshing...
          </div>
        )}
      </div>
    </div>
  )
}

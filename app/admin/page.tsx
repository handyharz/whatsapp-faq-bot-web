'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, BarChart3, MessageSquare, TrendingUp, Search, 
  Filter, RefreshCw, Loader2, Eye, Edit, CheckCircle, XCircle, Clock, Plus, X, Mail, Phone, AlertCircle, DollarSign, Receipt
} from 'lucide-react'
import PlexusBackground from '../components/PlexusBackground'
import ConfirmModal from '../components/ConfirmModal'

interface Client {
  clientId: string
  businessName: string
  niche: string
  email: string
  whatsappNumber: string
  subscription: {
    status: string
    tier: string
  }
  faqsCount: number
  createdAt: string
}

interface PlatformStats {
  clients: {
    total: number
    active: number
    trial: number
    expired: number
  }
  messages: {
    total: number
    last24h: number
  }
  tiers: Record<string, number>
}

function AdminContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [transactionStats, setTransactionStats] = useState<any>(null)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    variant?: 'danger' | 'success' | 'warning' | 'info'
    showInput?: boolean
    inputLabel?: string
    inputPlaceholder?: string
    onConfirm: (inputValue?: string) => void
    inputValue?: string
    onInputChange?: (value: string) => void
    confirmText?: string
    cancelText?: string
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  })
  
  // Create client form state
  const [formData, setFormData] = useState({
    businessName: '',
    niche: 'restaurant',
    whatsappNumber: '',
    email: '',
    address: '',
    instagram: '',
    facebook: '',
    twitter: '',
    website: '',
    tiktok: '',
    subscriptionTier: 'trial',
  })

  useEffect(() => {
    // Check authentication first
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.success || data.user?.role !== 'admin') {
          router.push('/admin/login')
          return
        }

        loadData()
        loadPendingRequests()
      })
      .catch(() => {
        router.push('/admin/login')
      })
  }, [router])
  
  const loadPendingRequests = async () => {
    setLoadingRequests(true)
    try {
      const res = await fetch('/api/admin/pending-number-changes', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setPendingRequests(data.requests || [])
      } else {
        console.error('Failed to load pending requests:', data.error)
      }
    } catch (err) {
      console.error('Failed to load pending requests:', err)
    } finally {
      setLoadingRequests(false)
    }
  }
  
  const handleApproveRequest = (clientId: string) => {
    const request = pendingRequests.find(r => r.clientId === clientId)
    setConfirmModal({
      isOpen: true,
      title: 'Approve WhatsApp Number Change',
      message: `Are you sure you want to approve the WhatsApp number change request for ${request?.businessName || 'this client'}?`,
      variant: 'success',
      confirmText: 'Approve',
      cancelText: 'Cancel',
      onConfirm: async (inputValue?: string) => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        setProcessingRequest(clientId)
        setUpdateError('')
        setUpdateSuccess('')
        try {
          const res = await fetch(`/api/admin/pending-number-changes/${clientId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          })
          const data = await res.json()
          
          if (data.success) {
            setUpdateSuccess(`WhatsApp number change approved for ${data.client.businessName}`)
            setTimeout(() => setUpdateSuccess(''), 5000)
            loadPendingRequests()
            loadData() // Refresh client list
          } else {
            setUpdateError(data.error || 'Failed to approve request')
            setTimeout(() => setUpdateError(''), 5000)
          }
        } catch (err: any) {
          setUpdateError('Failed to approve request: ' + (err.message || 'Network error'))
          setTimeout(() => setUpdateError(''), 5000)
        } finally {
          setProcessingRequest(null)
        }
      },
    })
  }
  
  const handleDeclineRequest = (clientId: string) => {
    const request = pendingRequests.find(r => r.clientId === clientId)
    setConfirmModal({
      isOpen: true,
      title: 'Decline WhatsApp Number Change',
      message: `Are you sure you want to decline the WhatsApp number change request for ${request?.businessName || 'this client'}?`,
      variant: 'danger',
      confirmText: 'Decline',
      cancelText: 'Cancel',
      showInput: true,
      inputLabel: 'Reason (optional)',
      inputPlaceholder: 'Please provide a reason for declining this request...',
      inputValue: '',
      onInputChange: (value: string) => {
        setConfirmModal(prev => ({ ...prev, inputValue: value }))
      },
      onConfirm: async (inputValue?: string) => {
        const reason = inputValue || undefined
        setConfirmModal({ ...confirmModal, isOpen: false })
        setProcessingRequest(clientId)
        setUpdateError('')
        setUpdateSuccess('')
        try {
          const res = await fetch(`/api/admin/pending-number-changes/${clientId}/decline`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ reason: reason || undefined }),
          })
          const data = await res.json()
          
          if (data.success) {
            setUpdateSuccess(`WhatsApp number change request declined for ${data.client.businessName}`)
            setTimeout(() => setUpdateSuccess(''), 5000)
            loadPendingRequests()
          } else {
            setUpdateError(data.error || 'Failed to decline request')
            setTimeout(() => setUpdateError(''), 5000)
          }
        } catch (err: any) {
          setUpdateError('Failed to decline request: ' + (err.message || 'Network error'))
          setTimeout(() => setUpdateError(''), 5000)
        } finally {
          setProcessingRequest(null)
        }
      },
    })
  }

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [clientsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/clients?status=${statusFilter !== 'all' ? statusFilter : ''}&tier=${tierFilter !== 'all' ? tierFilter : ''}&search=${search}`, { credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/stats', { credentials: 'include' }).then(r => r.json()),
      ])
      
      if (clientsRes.success) {
        setClients(clientsRes.clients || [])
      } else {
        setError(clientsRes.error || 'Failed to load clients')
      }
      
      if (statsRes.success) {
        setStats(statsRes.stats)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadTransactions = async () => {
    setLoadingTransactions(true)
    try {
      const [transactionsRes, statsRes] = await Promise.all([
        fetch('/api/admin/transactions?limit=50', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/transactions/stats', { credentials: 'include' }).then(r => r.json()),
      ])
      
      if (transactionsRes.success) {
        setTransactions(transactionsRes.transactions || [])
      }
      
      if (statsRes.success) {
        setTransactionStats(statsRes.stats)
      }
    } catch (err) {
      console.error('Failed to load transactions:', err)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      active: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
      trial: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
      expired: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
      cancelled: { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' },
    }
    
    const color = colors[status] || colors.cancelled
    const Icon = status === 'active' ? CheckCircle : status === 'trial' ? Clock : XCircle
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
      }}>
        <Icon style={{ width: '14px', height: '14px' }} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTierBadge = (tier: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      trial: { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' },
      starter: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
      professional: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.2)', text: '#a855f7' },
      enterprise: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
    }
    
    const color = colors[tier] || colors.trial
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
      }}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    )
  }

  if (loading && !stats) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="container-md" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Admin Access Required</h1>
          <p style={{ color: '#a0a0a0', marginBottom: '24px' }}>Please provide an admin token to access this page.</p>
          <Link href="/" className="btn btn-primary">Back to Home</Link>
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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff' }}>
            <Users style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
            <span style={{ fontSize: '16px', fontWeight: 600 }}>Admin Dashboard</span>
          </Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
              style={{ fontSize: '14px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Create Client
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="btn"
              style={{ fontSize: '14px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a1a', border: '1px solid #262626' }}
            >
              <RefreshCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:pt-32 md:pb-20 md:px-6">
        <PlexusBackground />
        <div className="container-lg" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '32px' }} className="md:mb-12">
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }} className="md:text-5xl">
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0' }} className="md:text-xl">
              Manage clients, subscriptions, and view platform analytics
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#f87171' }}>{error}</p>
            </div>
          )}

          {/* Success/Error Messages */}
          {updateSuccess && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#22c55e' }}>{updateSuccess}</p>
            </div>
          )}
          {updateError && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#f87171' }}>{updateError}</p>
            </div>
          )}

          {/* Pending WhatsApp Number Change Requests */}
          {pendingRequests.length > 0 && (
            <div className="card" style={{ marginBottom: '32px', padding: '24px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <AlertCircle style={{ width: '24px', height: '24px', color: '#fbbf24' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Pending WhatsApp Number Change Requests</h2>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  background: 'rgba(251, 191, 36, 0.2)', 
                  fontSize: '12px', 
                  fontWeight: 600,
                  color: '#fbbf24'
                }}>
                  {pendingRequests.length}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingRequests.map((request) => (
                  <div key={request.clientId} style={{ 
                    padding: '16px', 
                    background: 'rgba(26, 26, 26, 0.5)', 
                    borderRadius: '8px',
                    border: '1px solid #262626'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="md:flex-row md:items-center md:justify-between">
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{request.businessName}</h3>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            background: request.subscription.status === 'trial' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                            fontSize: '11px',
                            color: request.subscription.status === 'trial' ? '#3b82f6' : '#22c55e'
                          }}>
                            {request.subscription.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>
                          {request.email}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone style={{ width: '14px', height: '14px', color: '#666' }} />
                            <span style={{ fontSize: '13px', color: '#a0a0a0' }}>
                              Current: <strong style={{ color: '#ffffff' }}>{request.currentNumber}</strong>
                            </span>
                          </div>
                          <span style={{ color: '#666' }}>→</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                            <span style={{ fontSize: '13px', color: '#a0a0a0' }}>
                              Requested: <strong style={{ color: '#3b82f6' }}>{request.requestedNumber}</strong>
                            </span>
                          </div>
                        </div>
                        {request.reason && (
                          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                            Reason: {request.reason}
                          </p>
                        )}
                        <p style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                          Requested: {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }} className="md:mt-0">
                        <button
                          onClick={() => handleApproveRequest(request.clientId)}
                          disabled={processingRequest === request.clientId}
                          style={{
                            padding: '8px 16px',
                            background: '#22c55e',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: processingRequest === request.clientId ? 'not-allowed' : 'pointer',
                            opacity: processingRequest === request.clientId ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {processingRequest === request.clientId ? (
                            <>
                              <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle style={{ width: '14px', height: '14px' }} />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.clientId)}
                          disabled={processingRequest === request.clientId}
                          style={{
                            padding: '8px 16px',
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: processingRequest === request.clientId ? 'not-allowed' : 'pointer',
                            opacity: processingRequest === request.clientId ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {processingRequest === request.clientId ? (
                            <>
                              <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle style={{ width: '14px', height: '14px' }} />
                              Decline
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Stats */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }} className="md:grid-cols-4 md:gap-6 md:mb-12">
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Users style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Total Clients</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                  {stats.clients.total}
                </p>
                <p style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '4px' }}>
                  {stats.clients.active} active, {stats.clients.trial} trial
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <CheckCircle style={{ width: '24px', height: '24px', color: '#22c55e' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Active Clients</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>
                  {stats.clients.active}
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <MessageSquare style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Total Messages</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                  {stats.messages.total.toLocaleString()}
                </p>
                <p style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '4px' }}>
                  {stats.messages.last24h} in last 24h
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <TrendingUp style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Trial Clients</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                  {stats.clients.trial}
                </p>
              </div>
            </div>
          )}

          {/* Transaction Stats */}
          {transactionStats && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }} className="md:grid-cols-2 md:gap-6 md:mb-12">
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <DollarSign style={{ width: '24px', height: '24px', color: '#22c55e' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Total Revenue</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>
                  ₦{parseFloat(transactionStats.totalRevenueNaira || '0').toLocaleString()}
                </p>
                <p style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '4px' }}>
                  {transactionStats.successful} successful payments
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Receipt style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Total Transactions</h3>
                </div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                  {transactionStats.total}
                </p>
                <p style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '4px' }}>
                  {transactionStats.successful} successful, {transactionStats.failed} failed
                </p>
              </div>
            </div>
          )}

          {/* Transactions Section */}
          <div className="card" style={{ marginBottom: '32px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Receipt style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Transaction Records</h2>
              </div>
              <button
                onClick={() => {
                  if (!showTransactions) {
                    loadTransactions()
                  }
                  setShowTransactions(!showTransactions)
                }}
                className="btn btn-secondary"
                style={{ fontSize: '14px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {showTransactions ? 'Hide' : 'Show'} Transactions
              </button>
            </div>

            {showTransactions && (
              <>
                {loadingTransactions ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : transactions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <Receipt style={{ width: '48px', height: '48px', color: '#666', margin: '0 auto 16px' }} />
                    <p style={{ fontSize: '16px', color: '#a0a0a0' }}>No transactions yet</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #262626' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Date</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Client</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Tier</th>
                          <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Amount</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Status</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn) => (
                          <tr key={txn._id || txn.transactionId} style={{ borderBottom: '1px solid #262626' }}>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#a0a0a0' }}>
                              {new Date(txn.createdAt).toLocaleDateString()} {new Date(txn.createdAt).toLocaleTimeString()}
                            </td>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#ffffff' }}>
                              {txn.clientName || 'Unknown'}
                            </td>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#a0a0a0' }}>
                              {txn.tier ? txn.tier.charAt(0).toUpperCase() + txn.tier.slice(1) : '-'}
                            </td>
                            <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: '#22c55e', textAlign: 'right' }}>
                              ₦{((txn.amount || 0) / 100).toLocaleString()}
                            </td>
                            <td style={{ padding: '12px' }}>
                              {txn.status === 'success' ? (
                                <span style={{ 
                                  padding: '4px 12px', 
                                  borderRadius: '6px', 
                                  fontSize: '12px', 
                                  fontWeight: 600,
                                  background: 'rgba(34, 197, 94, 0.1)',
                                  border: '1px solid rgba(34, 197, 94, 0.2)',
                                  color: '#22c55e'
                                }}>
                                  Success
                                </span>
                              ) : (
                                <span style={{ 
                                  padding: '4px 12px', 
                                  borderRadius: '6px', 
                                  fontSize: '12px', 
                                  fontWeight: 600,
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  color: '#ef4444'
                                }}>
                                  {txn.status}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '12px', fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                              {txn.reference?.substring(0, 20)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Filters */}
          <div className="card md:flex-row md:items-center" style={{ marginBottom: '24px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#666' }} />
              <input
                type="text"
                className="input"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadData()}
                style={{ paddingLeft: '40px' }}
              />
            </div>
            
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              className="input"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Tiers</option>
              <option value="trial">Trial</option>
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
            
            <button
              onClick={loadData}
              className="btn btn-primary"
              style={{ padding: '10px 20px' }}
            >
              <Filter style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Filter
            </button>
          </div>

          {/* Clients Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #262626' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Business</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Contact</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Subscription</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>FAQs</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#a0a0a0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#a0a0a0' }}>
                        {loading ? 'Loading...' : 'No clients found'}
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.clientId} style={{ borderBottom: '1px solid #262626' }}>
                        <td style={{ padding: '16px' }}>
                          <div>
                            <p style={{ fontWeight: 600, marginBottom: '4px' }}>{client.businessName}</p>
                            <p style={{ fontSize: '12px', color: '#a0a0a0' }}>{client.niche}</p>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div>
                            <p style={{ fontSize: '14px', marginBottom: '4px' }}>{client.email}</p>
                            <p style={{ fontSize: '12px', color: '#a0a0a0' }}>{client.whatsappNumber}</p>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {getStatusBadge(client.subscription.status)}
                            {getTierBadge(client.subscription.tier)}
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ fontSize: '14px' }}>{client.faqsCount}</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setEditingClient(client)}
                              style={{ padding: '8px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.1)', border: 'none', color: '#22c55e', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                              title="Edit client"
                            >
                              <Edit style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button
                              onClick={async () => {
                                setSendingEmail(client.clientId)
                                try {
                                  const response = await fetch('/api/admin/send-welcome-email', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    credentials: 'include',
                                    body: JSON.stringify({
                                      businessName: client.businessName,
                                      email: client.email,
                                      whatsappNumber: client.whatsappNumber,
                                    }),
                                  })
                                  const data = await response.json()
                                  if (data.success) {
                                    alert(`Welcome email sent to ${client.email}`)
                                  } else {
                                    alert(`Failed to send email: ${data.error || 'Unknown error'}`)
                                  }
                                } catch (err: any) {
                                  alert(`Failed to send email: ${err.message}`)
                                } finally {
                                  setSendingEmail(null)
                                }
                              }}
                              disabled={sendingEmail === client.clientId}
                              style={{ 
                                padding: '8px', 
                                borderRadius: '6px', 
                                background: sendingEmail === client.clientId ? 'rgba(107, 114, 128, 0.1)' : 'rgba(168, 85, 247, 0.1)', 
                                border: 'none', 
                                color: sendingEmail === client.clientId ? '#6b7280' : '#a855f7', 
                                cursor: sendingEmail === client.clientId ? 'not-allowed' : 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center' 
                              }}
                              title="Send welcome email"
                            >
                              {sendingEmail === client.clientId ? (
                                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                              ) : (
                                <Mail style={{ width: '16px', height: '16px' }} />
                              )}
                            </button>
                            <Link
                              href={`/admin/client/${client.clientId}`}
                              style={{ padding: '8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                              title="View details"
                            >
                              <Eye style={{ width: '16px', height: '16px' }} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Create Client Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }} onClick={() => !creating && setShowCreateModal(false)}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #262626',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Create New Client</h2>
              <button
                onClick={() => !creating && setShowCreateModal(false)}
                disabled={creating}
                style={{ background: 'transparent', border: 'none', color: '#a0a0a0', cursor: 'pointer', padding: '8px' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {createError && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', color: '#f87171' }}>
                {createError}
              </div>
            )}

            {createSuccess && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '6px', color: '#22c55e' }}>
                {createSuccess}
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault()
              setCreating(true)
              setCreateError('')
              setCreateSuccess('')

              try {
                const response = await fetch('/api/admin/clients', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    businessName: formData.businessName,
                    niche: formData.niche,
                    whatsappNumber: formData.whatsappNumber,
                    email: formData.email,
                    address: formData.address || undefined,
                    socialMedia: {
                      instagram: formData.instagram || undefined,
                      facebook: formData.facebook || undefined,
                      twitter: formData.twitter || undefined,
                      website: formData.website || undefined,
                      tiktok: formData.tiktok || undefined,
                    },
                    subscriptionTier: formData.subscriptionTier,
                  }),
                })

                const data = await response.json()

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to create client')
                }

                // Send welcome email to client with password setup link
                try {
                  // Get the password reset token from the created client
                  // We need to fetch the full client to get the token
                  const clientDetailsRes = await fetch(`/api/admin/client/${data.client.clientId}`, {
                    credentials: 'include',
                  })
                  const clientDetails = await clientDetailsRes.json()
                  
                  const passwordSetupUrl = clientDetails.client?.passwordResetToken
                    ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.exonec.com'}/reset-password?token=${clientDetails.client.passwordResetToken}&email=${encodeURIComponent(data.client.email)}`
                    : undefined

                  const emailResponse = await fetch('/api/admin/send-welcome-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                      businessName: data.client.businessName,
                      email: data.client.email,
                      whatsappNumber: data.client.whatsappNumber,
                      passwordSetupUrl,
                    }),
                  })
                  
                  const emailData = await emailResponse.json()
                  if (emailData.success) {
                    setCreateSuccess(`Client "${data.client.businessName}" created successfully! Welcome email sent.`)
                  } else {
                    setCreateSuccess(`Client "${data.client.businessName}" created successfully! (Note: Welcome email failed to send)`)
                  }
                } catch (emailErr) {
                  // Client created but email failed - still show success
                  setCreateSuccess(`Client "${data.client.businessName}" created successfully! (Note: Welcome email failed to send)`)
                }

                setFormData({
                  businessName: '',
                  niche: 'restaurant',
                  whatsappNumber: '',
                  email: '',
                  address: '',
                  instagram: '',
                  facebook: '',
                  twitter: '',
                  website: '',
                  tiktok: '',
                  subscriptionTier: 'trial',
                })
                
                // Reload clients list
                setTimeout(() => {
                  loadData()
                  setShowCreateModal(false)
                  setCreateSuccess('')
                }, 2000)
              } catch (err: any) {
                setCreateError(err.message || 'Failed to create client')
              } finally {
                setCreating(false)
              }
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="input"
                    placeholder="Abuja Ram Syua"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Niche *</label>
                  <select
                    required
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="input"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="fashion">Fashion</option>
                    <option value="logistics">Logistics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="input"
                    placeholder="08107060160"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="primetaker10@gmail.com"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input"
                    placeholder="Aminu Kano Wuse 2 Abuja"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Social Media</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="input"
                      placeholder="Instagram: @harzkane"
                    />
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="input"
                      placeholder="Facebook: harzkane"
                    />
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="input"
                      placeholder="Twitter/X: @harzkane"
                    />
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="input"
                      placeholder="Website: https://harzkane.com"
                    />
                    <input
                      type="text"
                      value={formData.tiktok}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                      className="input"
                      placeholder="TikTok: @harzkane"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Subscription Tier</label>
                  <select
                    value={formData.subscriptionTier}
                    onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value })}
                    className="input"
                  >
                    <option value="trial">Trial</option>
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {creating ? (
                      <>
                        <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite', marginRight: '8px' }} />
                        Creating...
                      </>
                    ) : (
                      'Create Client'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => !creating && setShowCreateModal(false)}
                    disabled={creating}
                    className="btn"
                    style={{ background: '#1a1a1a', border: '1px solid #262626' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }} onClick={() => !updating && setEditingClient(null)}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #262626',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Edit Client</h2>
              <button
                onClick={() => !updating && setEditingClient(null)}
                disabled={updating}
                style={{ background: 'transparent', border: 'none', color: '#a0a0a0', cursor: 'pointer', padding: '8px' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {updateError && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', color: '#f87171' }}>
                {updateError}
              </div>
            )}

            {updateSuccess && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '6px', color: '#22c55e' }}>
                {updateSuccess}
              </div>
            )}

            <EditClientForm
              client={editingClient}
              onUpdate={async (updates) => {
                setUpdating(true)
                setUpdateError('')
                setUpdateSuccess('')

                try {
                  // Fetch full client details first
                  const clientRes = await fetch(`/api/admin/client/${editingClient.clientId}`, {
                    credentials: 'include',
                  })
                  const clientData = await clientRes.json()

                  if (!clientRes.ok) {
                    throw new Error(clientData.error || 'Failed to fetch client details')
                  }

                  const fullClient = clientData.client

                  const response = await fetch(`/api/admin/client/${editingClient.clientId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                      businessName: updates.businessName,
                      niche: updates.niche,
                      whatsappNumber: updates.whatsappNumber,
                      email: updates.email,
                      address: updates.address || undefined,
                      socialMedia: {
                        instagram: updates.instagram || undefined,
                        facebook: updates.facebook || undefined,
                        twitter: updates.twitter || undefined,
                        website: updates.website || undefined,
                        tiktok: updates.tiktok || undefined,
                      },
                      subscriptionTier: updates.subscriptionTier,
                    }),
                  })

                  const data = await response.json()

                  if (!response.ok) {
                    throw new Error(data.error || 'Failed to update client')
                  }

                  setUpdateSuccess('Client updated successfully!')
                  
                  // Reload clients list
                  setTimeout(() => {
                    loadData()
                    setEditingClient(null)
                    setUpdateSuccess('')
                  }, 1500)
                } catch (err: any) {
                  setUpdateError(err.message || 'Failed to update client')
                } finally {
                  setUpdating(false)
                }
              }}
              onCancel={() => !updating && setEditingClient(null)}
              updating={updating}
            />
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant || 'info'}
        confirmText={confirmModal.confirmText || (confirmModal.variant === 'success' ? 'Approve' : confirmModal.variant === 'danger' ? 'Decline' : 'Confirm')}
        cancelText={confirmModal.cancelText || 'Cancel'}
        showInput={confirmModal.showInput}
        inputLabel={confirmModal.inputLabel}
        inputPlaceholder={confirmModal.inputPlaceholder}
        inputValue={confirmModal.inputValue || ''}
        onInputChange={confirmModal.onInputChange}
      />
    </div>
  )
}

// Add CSS for spin animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `
  if (!document.head.querySelector('style[data-spin-animation]')) {
    style.setAttribute('data-spin-animation', 'true')
    document.head.appendChild(style)
  }
}

// Edit Client Form Component
function EditClientForm({ 
  client, 
  onUpdate, 
  onCancel, 
  updating 
}: { 
  client: Client
  onUpdate: (updates: any) => Promise<void>
  onCancel: () => void
  updating: boolean
}) {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    businessName: client.businessName || '',
    niche: client.niche || 'restaurant',
    whatsappNumber: client.whatsappNumber ? client.whatsappNumber.replace('+234', '0') : '',
    email: client.email || '',
    address: '',
    instagram: '',
    facebook: '',
    twitter: '',
    website: '',
    tiktok: '',
    subscriptionTier: client.subscription?.tier || 'trial',
  })

  useEffect(() => {
    // Fetch full client details
    fetch(`/api/admin/client/${client.clientId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.client) {
          const c = data.client
          setFormData({
            businessName: c.businessName,
            niche: c.niche,
            whatsappNumber: c.whatsappNumber.replace('+234', '0'),
            email: c.email,
            address: c.address || '',
            instagram: c.socialMedia?.instagram || '',
            facebook: c.socialMedia?.facebook || '',
            twitter: c.socialMedia?.twitter || '',
            website: c.socialMedia?.website || '',
            tiktok: c.socialMedia?.tiktok || '',
            subscriptionTier: c.subscription?.tier || 'trial',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [client.clientId])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await onUpdate(formData)
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Business Name *</label>
          <input
            type="text"
            required
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="input"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Niche *</label>
          <select
            required
            value={formData.niche}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            className="input"
          >
            <option value="restaurant">Restaurant</option>
            <option value="fashion">Fashion</option>
            <option value="logistics">Logistics</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>WhatsApp Number *</label>
          <input
            type="text"
            required
            value={formData.whatsappNumber}
            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
            className="input"
            placeholder="08107060160"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="input"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Social Media</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="input"
              placeholder="Instagram"
            />
            <input
              type="text"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="input"
              placeholder="Facebook"
            />
            <input
              type="text"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="input"
              placeholder="Twitter/X"
            />
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="input"
              placeholder="Website"
            />
            <input
              type="text"
              value={formData.tiktok}
              onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
              className="input"
              placeholder="TikTok"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Subscription Tier</label>
          <select
            value={formData.subscriptionTier}
            onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value })}
            className="input"
          >
            <option value="trial">Trial</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            type="submit"
            disabled={updating}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {updating ? (
              <>
                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite', marginRight: '8px' }} />
                Updating...
              </>
            ) : (
              'Update Client'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={updating}
            className="btn"
            style={{ background: '#1a1a1a', border: '1px solid #262626' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  )
}

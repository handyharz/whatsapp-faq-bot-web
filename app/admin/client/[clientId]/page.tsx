'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Globe, Edit, Save, X } from 'lucide-react'
import PlexusBackground from '../../../components/PlexusBackground'
import ConfirmModal from '../../../components/ConfirmModal'

function ClientDetailsContent() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.clientId as string
  
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [updateError, setUpdateError] = useState('')

  useEffect(() => {
    // Check authentication first
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.success || data.user?.role !== 'admin') {
          router.push('/admin/login')
          return
        }

        // Fetch client details
        fetch(`/api/admin/client/${clientId}`, { credentials: 'include' })
          .then(r => r.json())
          .then(clientData => {
            if (clientData.success) {
              setClient(clientData.client)
              setEditData({
                businessName: clientData.client.businessName,
                niche: clientData.client.niche,
                email: clientData.client.email,
                whatsappNumber: clientData.client.whatsappNumber,
                address: clientData.client.address || '',
                socialMedia: clientData.client.socialMedia || {},
              })
            } else {
              setError(clientData.error || 'Client not found')
            }
            setLoading(false)
          })
          .catch(err => {
            setError('Failed to load client details')
            setLoading(false)
          })
      })
      .catch(() => {
        router.push('/admin/login')
      })
  }, [clientId, router])

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    // Reset edit data to original
    if (client) {
      setEditData({
        businessName: client.businessName,
        niche: client.niche,
        email: client.email,
        whatsappNumber: client.whatsappNumber,
        address: client.address || '',
        socialMedia: client.socialMedia || {},
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setUpdateError('')
    setUpdateSuccess('')

    try {
      const response = await fetch(`/api/admin/client/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editData),
      })

      const data = await response.json()

      if (data.success) {
        setClient(data.client)
        setEditing(false)
        setUpdateSuccess('Client updated successfully!')
        setTimeout(() => setUpdateSuccess(''), 5000)
      } else {
        setUpdateError(data.error || 'Failed to update client')
      }
    } catch (err) {
      setUpdateError('Failed to update client')
    } finally {
      setSaving(false)
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (error || !client) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="container-md" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Client Not Found</h1>
          <p style={{ color: '#a0a0a0', marginBottom: '24px' }}>{error || 'The client you are looking for does not exist'}</p>
          <Link href="/admin" className="btn btn-primary">Back to Admin Dashboard</Link>
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
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff' }}>
            <ArrowLeft style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span className="hidden sm:inline">Back to Admin Dashboard</span>
          </Link>
          {!editing ? (
            <button
              onClick={handleEdit}
              className="btn btn-primary"
              style={{ fontSize: '14px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Edit style={{ width: '16px', height: '16px' }} />
              Edit Client
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
                style={{ fontSize: '14px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <X style={{ width: '16px', height: '16px' }} />
                Cancel
              </button>
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
                    Save
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '16px', paddingRight: '16px', position: 'relative', overflow: 'hidden' }} className="md:pt-32 md:pb-20 md:px-6">
        <PlexusBackground />
        <div className="container-lg" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '32px' }} className="md:mb-12">
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }} className="md:text-5xl">
              {editing ? 'Edit Client' : client.businessName}
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0' }} className="md:text-xl">
              {editing ? 'Update client information' : 'Client details and subscription information'}
            </p>
          </div>

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

          {/* Client Information */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Client Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="md:grid-cols-2">
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                  Business Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    className="input"
                    value={editData.businessName}
                    onChange={(e) => setEditData({ ...editData, businessName: e.target.value })}
                    style={{ width: '100%' }}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>{client.businessName}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                  Niche
                </label>
                {editing ? (
                  <select
                    className="input"
                    value={editData.niche}
                    onChange={(e) => setEditData({ ...editData, niche: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="fashion">Fashion</option>
                    <option value="logistics">Logistics</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>{client.niche.charAt(0).toUpperCase() + client.niche.slice(1)}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                  <Mail style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px' }} />
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    className="input"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    style={{ width: '100%' }}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>{client.email}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                  <Phone style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px' }} />
                  WhatsApp Number
                </label>
                {editing ? (
                  <input
                    type="text"
                    className="input"
                    value={editData.whatsappNumber}
                    onChange={(e) => setEditData({ ...editData, whatsappNumber: e.target.value })}
                    style={{ width: '100%' }}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>{client.whatsappNumber}</p>
                )}
              </div>

              {client.address && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                    <MapPin style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px' }} />
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      className="input"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      style={{ width: '100%', minHeight: '80px' }}
                    />
                  ) : (
                    <p style={{ fontSize: '16px', color: '#ffffff' }}>{client.address}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Subscription Information */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Subscription Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="md:grid-cols-2">
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                  Status
                </label>
                <div>{getStatusBadge(client.subscription?.status || 'unknown')}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                  Tier
                </label>
                <div>{getTierBadge(client.subscription?.tier || 'trial')}</div>
              </div>

              {client.subscription?.trialStartDate && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                    Trial Start Date
                  </label>
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>
                    {new Date(client.subscription.trialStartDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {client.subscription?.trialEndDate && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                    Trial End Date
                  </label>
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>
                    {new Date(client.subscription.trialEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {client.subscription?.subscriptionStartDate && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                    Subscription Start Date
                  </label>
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>
                    {new Date(client.subscription.subscriptionStartDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {client.subscription?.subscriptionEndDate && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                    Subscription End Date
                  </label>
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>
                    {new Date(client.subscription.subscriptionEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {client.subscription?.lastPaymentDate && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a0a0a0' }}>
                    Last Payment Date
                  </label>
                  <p style={{ fontSize: '16px', color: '#ffffff' }}>
                    {new Date(client.subscription.lastPaymentDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FAQs Information */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>FAQs</h2>
            <p style={{ fontSize: '16px', color: '#ffffff', marginBottom: '8px' }}>
              Total FAQs: <strong>{client.faqsCount || client.faqs?.length || 0}</strong>
            </p>
            {client.faqs && client.faqs.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#a0a0a0' }}>FAQ List</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {client.faqs.slice(0, 10).map((faq: any, index: number) => (
                    <div key={index} style={{ padding: '12px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #262626' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: '#ffffff' }}>
                        Keywords: {faq.keywords?.join(', ') || 'N/A'}
                      </p>
                      <p style={{ fontSize: '13px', color: '#a0a0a0' }}>
                        {faq.answer?.substring(0, 100)}{faq.answer?.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                  {client.faqs.length > 10 && (
                    <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                      ... and {client.faqs.length - 10} more FAQs
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ClientDetailsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <ClientDetailsContent />
    </Suspense>
  )
}

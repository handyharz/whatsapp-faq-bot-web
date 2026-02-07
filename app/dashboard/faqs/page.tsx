'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Loader2, FileText } from 'lucide-react'
import PlexusBackground from '../../components/PlexusBackground'
import ConfirmModal from '../../components/ConfirmModal'

interface FAQ {
  keywords: string[]
  answer: string
  category?: string
}

function FAQsContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [faqLimit, setFaqLimit] = useState<number | null>(null)
  const [currentTier, setCurrentTier] = useState<string>('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [editingKeywordsText, setEditingKeywordsText] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFAQ, setNewFAQ] = useState<FAQ>({ keywords: [], answer: '', category: '' })
  const [newKeywordsText, setNewKeywordsText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean
    index: number | null
  }>({
    isOpen: false,
    index: null,
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

        // Fetch FAQs with limit info
        fetch('/api/client/faqs', { credentials: 'include' })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              setFaqs(data.faqs || [])
              setFaqLimit(data.limit)
              setCurrentTier(data.tier || '')
            } else {
              setError(data.error || 'Failed to load FAQs')
            }
            setLoading(false)
          })
          .catch(err => {
            setError('Failed to load FAQs')
            setLoading(false)
          })
      })
      .catch(() => {
        router.push('/login')
      })
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/client/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ faqs }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('FAQs saved successfully!')
        setEditingIndex(null)
        setEditingFAQ(null)
        setShowAddForm(false)
        setNewFAQ({ keywords: [], answer: '', category: '' })
        // Update limit info if provided
        if (data.limit !== undefined) {
          setFaqLimit(data.limit)
        }
        if (data.currentCount !== undefined) {
          // Update FAQs count
          setFaqs(data.faqs || [])
        }
      } else {
        // Check if it's a limit error
        if (data.currentLimit !== undefined && data.requestedCount !== undefined) {
          setError(data.message || `FAQ limit exceeded. Your ${data.tier} plan allows up to ${data.currentLimit} FAQs. Please upgrade your plan.`)
        } else {
          setError(data.error || 'Failed to save FAQs')
        }
      }
    } catch (err) {
      setError('Failed to save FAQs')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditingFAQ({ ...faqs[index] })
    setEditingKeywordsText(faqs[index].keywords.join(', '))
  }

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editingFAQ) return
    
    // Parse keywords from text
    const keywords = editingKeywordsText.split(',').map(k => k.trim()).filter(k => k)
    if (keywords.length === 0 || !editingFAQ.answer) {
      setError('Please fill in keywords and answer')
      return
    }
    
    // Save original state for potential rollback
    const originalFaqs = [...faqs]
    
    // Update local state immediately for better UX
    const updated = [...faqs]
    updated[editingIndex] = { ...editingFAQ, keywords }
    setFaqs(updated)
    
    // Save to database immediately
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/client/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ faqs: updated }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('FAQ updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
        setEditingIndex(null)
        setEditingFAQ(null)
        setEditingKeywordsText('')
      } else {
        setError(data.error || 'Failed to save FAQ')
        // Revert local state on error
        setFaqs(originalFaqs)
      }
    } catch (err) {
      setError('Failed to save FAQ')
      // Revert local state on error
      setFaqs(originalFaqs)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingFAQ(null)
    setEditingKeywordsText('')
  }

  const handleDelete = (index: number) => {
    setDeleteConfirmModal({
      isOpen: true,
      index,
    })
  }
  
  const confirmDelete = async (index: number) => {
    const updated = faqs.filter((_, i) => i !== index)
    setFaqs(updated)
    setDeleteConfirmModal({ isOpen: false, index: null })
    
    // Save to database
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/client/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ faqs: updated }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('FAQ deleted successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to delete FAQ')
        // Revert on error
        setFaqs(faqs)
      }
    } catch (err) {
      setError('Failed to delete FAQ')
      // Revert on error
      setFaqs(faqs)
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = () => {
    // Check if limit is reached
    if (faqLimit !== null && faqs.length >= faqLimit) {
      setError(`FAQ limit reached! Your ${currentTier} plan allows up to ${faqLimit} FAQs. Please upgrade your plan to add more FAQs.`)
      return
    }

    // Parse keywords from text
    const keywords = newKeywordsText.split(',').map(k => k.trim()).filter(k => k)
    if (keywords.length === 0 || !newFAQ.answer) {
      setError('Please fill in keywords and answer')
      return
    }
    setFaqs([...faqs, { ...newFAQ, keywords }])
    setNewFAQ({ keywords: [], answer: '', category: '' })
    setNewKeywordsText('')
    setShowAddForm(false)
  }

  const isLimitReached = faqLimit !== null && faqs.length >= faqLimit

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              {saving ? (
                <>
                  <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block' }} />
                  Save Changes
                </>
              )}
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
              Manage FAQs
            </h1>
            <p style={{ fontSize: '16px', color: '#a0a0a0', marginBottom: '8px' }} className="md:text-xl">
              Edit your FAQ questions and answers
            </p>
            {faqLimit !== null && (
              <p style={{ fontSize: '14px', color: '#666' }}>
                {faqs.length} / {faqLimit} FAQs used ({currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} plan)
                {isLimitReached && (
                  <span style={{ color: '#f87171', marginLeft: '8px' }}>
                    • Limit reached! <Link href="/dashboard/upgrade" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Upgrade</Link> to add more
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#f87171' }}>{error}</p>
            </div>
          )}

          {success && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#22c55e' }}>{success}</p>
            </div>
          )}

          {/* Add FAQ Button */}
          {!showAddForm && (
            <button
              onClick={() => {
                if (isLimitReached) {
                  setError(`FAQ limit reached! Your ${currentTier} plan allows up to ${faqLimit} FAQs. Please upgrade your plan to add more FAQs.`)
                } else {
                  setShowAddForm(true)
                }
              }}
              disabled={isLimitReached}
              className="btn btn-primary"
              style={{ 
                marginBottom: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                opacity: isLimitReached ? 0.5 : 1,
                cursor: isLimitReached ? 'not-allowed' : 'pointer'
              }}
            >
              <Plus style={{ width: '18px', height: '18px' }} />
              Add New FAQ
            </button>
          )}

          {/* Add FAQ Form */}
          {showAddForm && (
            <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Add New FAQ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Keywords (comma-separated) *
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="hello, hi, hey"
                    value={newKeywordsText}
                    onChange={(e) => setNewKeywordsText(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Answer *
                  </label>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Your answer here..."
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="greeting, pricing, etc."
                    value={newFAQ.category || ''}
                    onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={handleAdd} className="btn btn-primary">
                    Add FAQ
                  </button>
                  <button onClick={() => { setShowAddForm(false); setNewFAQ({ keywords: [], answer: '', category: '' }); setNewKeywordsText('') }} className="btn" style={{ background: '#1a1a1a', border: '1px solid #262626' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FAQs List */}
          {faqs.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <FileText style={{ width: '48px', height: '48px', color: '#666', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', color: '#a0a0a0', marginBottom: '16px' }}>No FAQs yet</p>
              <button 
                onClick={() => {
                  if (isLimitReached) {
                    setError(`FAQ limit reached! Your ${currentTier} plan allows up to ${faqLimit} FAQs. Please upgrade your plan to add more FAQs.`)
                  } else {
                    setShowAddForm(true)
                  }
                }}
                disabled={isLimitReached}
                className="btn btn-primary"
                style={{ opacity: isLimitReached ? 0.5 : 1, cursor: isLimitReached ? 'not-allowed' : 'pointer' }}
              >
                Add Your First FAQ
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, index) => (
                <div key={index} className="card" style={{ padding: '24px' }}>
                  {editingIndex === index ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                          Keywords
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={editingKeywordsText}
                          onChange={(e) => setEditingKeywordsText(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                          Answer
                        </label>
                        <textarea
                          className="input"
                          rows={4}
                          value={editingFAQ?.answer || ''}
                          onChange={(e) => setEditingFAQ({ ...editingFAQ!, answer: e.target.value })}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                          Category
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={editingFAQ?.category || ''}
                          onChange={(e) => setEditingFAQ({ ...editingFAQ!, category: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handleSaveEdit} className="btn btn-primary">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="btn" style={{ background: '#1a1a1a', border: '1px solid #262626' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                              {faq.category || 'uncategorized'}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '8px' }}>
                            <strong>Keywords:</strong> {faq.keywords.join(', ')}
                          </p>
                          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{faq.answer}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button
                            onClick={() => handleEdit(index)}
                            style={{ padding: '8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                          >
                            <Edit2 style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            style={{ padding: '8px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal({ isOpen: false, index: null })}
        onConfirm={() => {
          if (deleteConfirmModal.index !== null) {
            confirmDelete(deleteConfirmModal.index)
          }
        }}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default function FAQsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <FAQsContent />
    </Suspense>
  )
}

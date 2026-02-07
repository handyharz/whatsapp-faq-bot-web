'use client'

import React from 'react'
import { X, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (inputValue?: string) => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'success' | 'warning' | 'info'
  showInput?: boolean
  inputLabel?: string
  inputPlaceholder?: string
  inputValue?: string
  onInputChange?: (value: string) => void
  inputRequired?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  showInput = false,
  inputLabel,
  inputPlaceholder,
  inputValue = '',
  onInputChange,
  inputRequired = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: XCircle,
      iconColor: '#ef4444',
      confirmBg: '#ef4444',
      confirmHover: '#dc2626',
      border: 'rgba(239, 68, 68, 0.2)',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
    success: {
      icon: CheckCircle,
      iconColor: '#22c55e',
      confirmBg: '#22c55e',
      confirmHover: '#16a34a',
      border: 'rgba(34, 197, 94, 0.2)',
      bg: 'rgba(34, 197, 94, 0.1)',
    },
    warning: {
      icon: AlertCircle,
      iconColor: '#fbbf24',
      confirmBg: '#fbbf24',
      confirmHover: '#f59e0b',
      border: 'rgba(251, 191, 36, 0.2)',
      bg: 'rgba(251, 191, 36, 0.1)',
    },
    info: {
      icon: AlertCircle,
      iconColor: '#3b82f6',
      confirmBg: '#3b82f6',
      confirmHover: '#2563eb',
      border: 'rgba(59, 130, 246, 0.2)',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
  }

  const style = variantStyles[variant]
  const Icon = style.icon

  const handleConfirm = () => {
    if (showInput && inputRequired && !inputValue.trim()) {
      return // Don't allow confirmation if input is required but empty
    }
    onConfirm()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter' && (!showInput || inputValue.trim())) {
      handleConfirm()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        style={{
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          border: `1px solid ${style.border}`,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: style.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon style={{ width: '24px', height: '24px', color: style.iconColor }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, marginBottom: '8px', color: '#ffffff' }}>
              {title}
            </h3>
            <p style={{ fontSize: '14px', color: '#a0a0a0', margin: 0, lineHeight: '1.5' }}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#262626'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#666'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Input field (if showInput is true) */}
        {showInput && (
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#a0a0a0',
              }}
            >
              {inputLabel || 'Reason'}
            </label>
            <textarea
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={inputPlaceholder || 'Enter reason...'}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#262626')}
              autoFocus
            />
            {inputRequired && !inputValue.trim() && (
              <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', margin: 0 }}>
                This field is required
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#1a1a1a',
              border: '1px solid #262626',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#262626'
              e.currentTarget.style.borderColor = '#404040'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1a1a1a'
              e.currentTarget.style.borderColor = '#262626'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={showInput && inputRequired && !inputValue.trim()}
            style={{
              padding: '10px 20px',
              background: showInput && inputRequired && !inputValue.trim() ? '#404040' : style.confirmBg,
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: showInput && inputRequired && !inputValue.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              opacity: showInput && inputRequired && !inputValue.trim() ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!(showInput && inputRequired && !inputValue.trim())) {
                e.currentTarget.style.background = style.confirmHover
              }
            }}
            onMouseLeave={(e) => {
              if (!(showInput && inputRequired && !inputValue.trim())) {
                e.currentTarget.style.background = style.confirmBg
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BASE_URL, IMAGEURLS } from '@/config'
import {
  getCadServiceStatusColor,
  getCadServiceStatusLabel,
  normalizeCadServiceStatus,
} from '@/Components/AdminPannel/cadServiceStatusConfig'
import styles from './CadPartnerPortal.module.css'

function shortRequestId(id) {
  const value = String(id || '')
  if (value.length <= 10) return value
  return `${value.slice(0, 6)}…${value.slice(-4)}`
}

function accessStorageKey(requestId) {
  return `cad-partner-access:${requestId}`
}

function CadPartnerPortal({ requestId }) {
  const otpInputs = useMemo(() => Array(4).fill().map(() => React.createRef()), [])
  const [bootstrapping, setBootstrapping] = useState(true)
  const [locked, setLocked] = useState(true)
  const [error, setError] = useState('')
  const [payload, setPayload] = useState(null)
  const [authStep, setAuthStep] = useState('email') // email | otp
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const applyUnlockedPayload = useCallback((data, requestKey) => {
    setPayload(data)
    setLocked(false)
    setAuthError('')
    setError('')
    if (data?.access_token && requestKey) {
      try {
        sessionStorage.setItem(accessStorageKey(requestKey), data.access_token)
      } catch {
        // ignore storage failures
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!requestId) {
        setError('Invalid partner link.')
        setBootstrapping(false)
        return
      }

      setBootstrapping(true)
      setError('')
      setAuthError('')

      let storedToken = ''
      try {
        storedToken = sessionStorage.getItem(accessStorageKey(requestId)) || ''
      } catch {
        storedToken = ''
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/v1/cad-creator/cad-service-partner-page/${requestId}`,
          storedToken
            ? { headers: { 'x-cad-partner-token': storedToken } }
            : undefined,
        )

        if (!response.data?.meta?.success) {
          throw new Error(response.data?.meta?.message || 'Request not found')
        }

        const data = response.data.data || {}
        if (!cancelled) {
          if (data.locked || !data.request) {
            setLocked(true)
            setPayload(null)
          } else {
            applyUnlockedPayload(data, requestId)
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.meta?.message
            || err.message
            || 'Unable to load this partner page.'
          if (String(message).toLowerCase().includes('session expired')) {
            try {
              sessionStorage.removeItem(accessStorageKey(requestId))
            } catch {
              // ignore
            }
            setLocked(true)
            setPayload(null)
            setAuthStep('email')
            setAuthError(message)
          } else if (err.response?.data?.data?.locked) {
            setLocked(true)
            setPayload(null)
          } else {
            setError(message)
          }
        }
      } finally {
        if (!cancelled) setBootstrapping(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [requestId, applyUnlockedPayload])

  const resetOtp = () => {
    setOtp(['', '', '', ''])
    otpInputs.forEach((ref) => {
      if (ref.current) ref.current.value = ''
    })
  }

  const handleRequestOtp = async (event) => {
    event.preventDefault()
    const nextEmail = email.trim().toLowerCase()
    if (!nextEmail) {
      setAuthError('Enter your registered vendor email.')
      return
    }

    setAuthLoading(true)
    setAuthError('')
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad-creator/cad-service-partner-page/${requestId}/request-otp`,
        { email: nextEmail },
      )
      if (!response.data?.meta?.success) {
        throw new Error(response.data?.meta?.message || 'Failed to send OTP.')
      }
      setEmail(response.data.data?.email || nextEmail)
      resetOtp()
      setAuthStep('otp')
      toast.success('OTP sent to your email.')
    } catch (err) {
      setAuthError(
        err.response?.data?.meta?.message
          || err.message
          || 'Failed to send OTP.',
      )
      toast.error(
        err.response?.data?.meta?.message
          || err.message
          || 'Failed to send OTP.',
      )
    } finally {
      setAuthLoading(false)
    }
  }

  const handleResendOtp = async () => {
    const nextEmail = email.trim().toLowerCase()
    if (!nextEmail) {
      setAuthError('Enter your registered vendor email.')
      setAuthStep('email')
      return
    }

    setAuthLoading(true)
    setAuthError('')
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad-creator/cad-service-partner-page/${requestId}/request-otp`,
        { email: nextEmail },
      )
      if (!response.data?.meta?.success) {
        throw new Error(response.data?.meta?.message || 'Failed to resend OTP.')
      }
      resetOtp()
      toast.success('OTP resent to your email.')
    } catch (err) {
      setAuthError(
        err.response?.data?.meta?.message
          || err.message
          || 'Failed to resend OTP.',
      )
      toast.error(
        err.response?.data?.meta?.message
          || err.message
          || 'Failed to resend OTP.',
      )
    } finally {
      setAuthLoading(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    const nextEmail = email.trim().toLowerCase()
    const enteredOtp = otp.join('')
    if (!nextEmail) {
      setAuthError('Enter your registered vendor email.')
      setAuthStep('email')
      return
    }
    if (enteredOtp.length !== 4) {
      setAuthError('Enter the 4-digit OTP sent to your email.')
      return
    }

    setAuthLoading(true)
    setAuthError('')
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad-creator/cad-service-partner-page/${requestId}/verify-otp`,
        { email: nextEmail, otp: enteredOtp },
      )
      if (!response.data?.meta?.success || !response.data?.data?.request) {
        throw new Error(response.data?.meta?.message || 'Unable to unlock')
      }
      applyUnlockedPayload(response.data.data, requestId)
      resetOtp()
    } catch (err) {
      resetOtp()
      setAuthError(
        err.response?.data?.meta?.message
          || err.message
          || 'Invalid OTP. Please try again.',
      )
    } finally {
      setAuthLoading(false)
    }
  }

  const handleOtpChange = (value, idx) => {
    const digit = value.replace(/[^0-9]/g, '').slice(0, 1)
    const next = [...otp]
    next[idx] = digit
    setOtp(next)
    if (authError) setAuthError('')
    if (digit && idx < otpInputs.length - 1) {
      otpInputs[idx + 1].current?.focus()
    }
  }

  const handleOtpKeyDown = (event, idx) => {
    if (event.key !== 'Backspace') return
    if (otp[idx]) {
      const next = [...otp]
      next[idx] = ''
      setOtp(next)
      return
    }
    if (idx > 0) {
      otpInputs[idx - 1].current?.focus()
      const next = [...otp]
      next[idx - 1] = ''
      setOtp(next)
    }
  }

  if (bootstrapping) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCard}>Loading partner request…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCard}>
          <div className={styles.stateEyebrow}>Partner portal</div>
          <h1 className={styles.stateTitle}>Request unavailable</h1>
          <p className={styles.stateText}>{error}</p>
        </div>
      </div>
    )
  }

  if (locked || !payload?.request) {
    return (
      <div className={styles.lockPage}>
        <div className={styles.lockCard}>
          <Link href="/" className={styles.lockBrand} aria-label="Marathon home">
            <Image
              src={IMAGEURLS.logo}
              alt="Marathon"
              width={160}
              height={30}
              className={styles.brandLogo}
              priority
            />
          </Link>
          <div className={styles.lockEyebrow}>Partner access</div>

          {authStep === 'email' ? (
            <>
              <h1 className={styles.lockTitle}>Verify with email OTP</h1>
              <p className={styles.lockLead}>
                This link was shared with your agency for request{' '}
                <strong>{shortRequestId(requestId)}</strong>. Enter your registered
                vendor email to receive a one-time code.
              </p>
              <form onSubmit={handleRequestOtp} className={styles.lockForm}>
                <label className={styles.lockLabel} htmlFor="partner-email">
                  Vendor email
                </label>
                <input
                  id="partner-email"
                  type="email"
                  autoComplete="email"
                  className={styles.lockInput}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (authError) setAuthError('')
                  }}
                  placeholder="you@agency.com"
                  disabled={authLoading}
                />
                {authError ? <div className={styles.lockError}>{authError}</div> : null}
                <button type="submit" className={styles.lockButton} disabled={authLoading}>
                  {authLoading ? 'Sending OTP…' : 'Send OTP →'}
                </button>
              </form>
            </>
          ) : null}

          {authStep === 'otp' ? (
            <>
              <h1 className={styles.lockTitle}>Enter verification code</h1>
              <p className={styles.lockLead}>
                We sent a 4-digit OTP to <strong>{email}</strong>. Enter it below to
                unlock this request. Access stays open for 12 hours.
              </p>
              <form onSubmit={handleVerifyOtp} className={styles.lockForm}>
                <label className={styles.lockLabel} htmlFor="partner-otp-0">
                  One-time code
                </label>
                <div className={styles.otpRow}>
                  {otpInputs.map((ref, idx) => (
                    <input
                      key={`otp-${idx}`}
                      id={idx === 0 ? 'partner-otp-0' : undefined}
                      ref={ref}
                      type="text"
                      inputMode="numeric"
                      autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                      maxLength={1}
                      className={styles.otpInput}
                      value={otp[idx]}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      disabled={authLoading}
                    />
                  ))}
                </div>
                {authError ? <div className={styles.lockError}>{authError}</div> : null}
                <button
                  type="submit"
                  className={styles.lockButton}
                  disabled={authLoading || otp.join('').length !== 4}
                >
                  {authLoading ? 'Verifying…' : 'Unlock request →'}
                </button>
              </form>
              <button
                type="button"
                className={styles.lockSecondaryLink}
                onClick={handleResendOtp}
                disabled={authLoading}
              >
                Resend OTP
              </button>
              <button
                type="button"
                className={styles.lockSecondaryLink}
                onClick={() => {
                  resetOtp()
                  setAuthError('')
                  setAuthStep('email')
                }}
                disabled={authLoading}
              >
                Use a different email
              </button>
            </>
          ) : null}
        </div>
      </div>
    )
  }

  const request = payload.request
  const vendorName = payload.vendor?.name || 'Matched partner'
  const status = normalizeCadServiceStatus(request.standalone_page_status)
  const statusColor = getCadServiceStatusColor(status)
  const statusLabel = getCadServiceStatusLabel(status)
  const activityLog = Array.isArray(payload.activity_log) ? payload.activity_log : []
  const partnerNotes = Array.isArray(payload.partner_notes) ? payload.partner_notes : []
  const files = Array.isArray(request.files) ? request.files : []

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandRow}>
            <Link href="/" className={styles.brandLink} aria-label="Marathon home">
              <Image
                src={IMAGEURLS.logo}
                alt="Marathon"
                width={160}
                height={30}
                className={styles.brandLogo}
                priority
              />
            </Link>
            <span className={styles.portalBadge}>Agency Partner Portal</span>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.partnerLabel}>{vendorName}</span>
            <span className={styles.requestChip} title={request.id}>
              {shortRequestId(request.id)}
            </span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.statusHero}>
          <div>
            <div className={styles.statusEyebrow}>Current status</div>
            <div className={styles.statusRow}>
              <span
                className={styles.statusPill}
                style={{ backgroundColor: `${statusColor}22`, color: statusColor }}
              >
                {statusLabel}
              </span>
              <span className={styles.statusNote}>{request.status_note}</span>
            </div>
          </div>
          <div className={styles.statusMeta}>
            <div>
              <div className={styles.metaLabel}>Submitted</div>
              <div className={styles.metaValue}>{request.submitted}</div>
            </div>
            <div>
              <div className={styles.metaLabel}>Target timeline</div>
              <div className={styles.metaValue}>{request.timeline}</div>
            </div>
          </div>
        </section>

        <div className={styles.contentStack}>
          <section className={styles.card}>
            <div className={styles.cardEyebrow}>Request details</div>
            <h1 className={styles.cardTitle}>{request.title}</h1>

            <div className={styles.detailGrid}>
              <div className={styles.detailTile}>
                <div className={styles.tileLabel}>Project type</div>
                <div className={styles.tileValue}>{request.project_type}</div>
              </div>
              <div className={styles.detailTile}>
                <div className={styles.tileLabel}>CAD tool</div>
                <div className={styles.tileValue}>{request.cad_tool}</div>
              </div>
              <div className={styles.detailTile}>
                <div className={styles.tileLabel}>Budget</div>
                <div className={styles.tileValue}>{request.budget}</div>
              </div>
            </div>

            <blockquote className={styles.brief}>“{request.brief}”</blockquote>

            <div className={styles.filesBlock}>
              <div className={styles.tileLabel}>Reference files</div>
              <div className={styles.fileList}>
                {files.length === 0 ? (
                  <span className={styles.noFiles}>No reference files attached</span>
                ) : (
                  files.map((file) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fileChip}
                    >
                      <span aria-hidden="true">📎</span>
                      {file.name || 'Download file'}
                    </a>
                  ))
                )}
              </div>
            </div>

            <div className={styles.ndaNote}>
              You are seeing this because you were selected as a matched partner for this request.
              Owner contact details are withheld. NDA terms apply where noted by Marathon before
              final file handover.
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardEyebrow}>Marathon notes</div>
            <h2 className={styles.activityTitle}>Updates for this request</h2>

            {partnerNotes.length === 0 ? (
              <p className={styles.noFiles}>No notes posted yet.</p>
            ) : (
              <div className={styles.notesList}>
                {partnerNotes.map((item) => (
                  <article key={item.id} className={styles.noteItem}>
                    {item.date ? (
                      <div className={styles.noteDate}>{item.date}</div>
                    ) : null}
                    <p className={styles.noteText}>{item.note}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className={styles.card}>
            <div className={styles.cardEyebrow}>Activity log</div>
            <h2 className={styles.activityTitle}>What&apos;s happened on this request</h2>

            {activityLog.length === 0 ? (
              <p className={styles.noFiles}>No partner-visible activity yet.</p>
            ) : (
              <div className={styles.timeline}>
                {activityLog.map((event, index) => (
                  <div key={`${event.date}-${index}`} className={styles.timelineRow}>
                    <div className={styles.timelineDate}>{event.date}</div>
                    <div className={styles.timelineRail}>
                      <span
                        className={styles.timelineDot}
                        style={{ backgroundColor: event.dotColor || '#7C3AED' }}
                      />
                      {index < activityLog.length - 1 ? (
                        <span className={styles.timelineLine} />
                      ) : null}
                    </div>
                    <div className={styles.timelineBody}>
                      <strong>{event.actor}</strong> {event.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className={styles.anonNote}>
              Other agencies appear as anonymous labels — no partner names are shared with each other.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default CadPartnerPortal

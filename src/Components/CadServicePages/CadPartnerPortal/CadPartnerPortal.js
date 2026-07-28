'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
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
  const [bootstrapping, setBootstrapping] = useState(true)
  const [unlocking, setUnlocking] = useState(false)
  const [locked, setLocked] = useState(true)
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState('')
  const [error, setError] = useState('')
  const [payload, setPayload] = useState(null)
  const [authMode, setAuthMode] = useState('login') // login | change-email | change-password
  const [changeEmail, setChangeEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changeError, setChangeError] = useState('')
  const [changeSuccess, setChangeSuccess] = useState('')
  const [changeLoading, setChangeLoading] = useState(false)

  const applyUnlockedPayload = useCallback((data, requestKey) => {
    setPayload(data)
    setLocked(false)
    setPasscodeError('')
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
      setPasscodeError('')

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
            setPasscodeError(message)
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

  const handleUnlock = async (event) => {
    event.preventDefault()
    const code = passcode.trim()
    if (!code) {
      setPasscodeError('Enter your access passcode.')
      return
    }

    setUnlocking(true)
    setPasscodeError('')
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad-creator/cad-service-partner-page/${requestId}/unlock`,
        { password: code },
      )
      if (!response.data?.meta?.success || !response.data?.data?.request) {
        throw new Error(response.data?.meta?.message || 'Unable to unlock')
      }
      applyUnlockedPayload(response.data.data, requestId)
      setPasscode('')
    } catch (err) {
      setPasscodeError(
        err.response?.data?.meta?.message
          || err.message
          || "That passcode doesn't match. Try again.",
      )
    } finally {
      setUnlocking(false)
    }
  }

  const resetChangePasswordForm = () => {
    setChangeEmail('')
    setNewPassword('')
    setConfirmPassword('')
    setChangeError('')
    setChangeSuccess('')
    setChangeLoading(false)
  }

  const openChangePassword = () => {
    resetChangePasswordForm()
    setAuthMode('change-email')
  }

  const backToLogin = () => {
    resetChangePasswordForm()
    setAuthMode('login')
  }

  const handleVerifyChangeEmail = async (event) => {
    event.preventDefault()
    const email = changeEmail.trim().toLowerCase()
    if (!email) {
      setChangeError('Enter your registered vendor email.')
      return
    }

    setChangeLoading(true)
    setChangeError('')
    setChangeSuccess('')
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad-creator/cad-service-partner-page/${requestId}/verify-vendor-email`,
        { email },
      )
      if (!response.data?.meta?.success || !response.data?.data?.can_change_password) {
        throw new Error(
          response.data?.meta?.message
            || 'This email is not registered as a vendor. Please enter the correct vendor email.',
        )
      }
      setChangeEmail(response.data.data.email || email)
      setAuthMode('change-password')
    } catch (err) {
      setChangeError(
        err.response?.data?.meta?.message
          || err.message
          || 'This email is not registered as a vendor. Please enter the correct vendor email.',
      )
    } finally {
      setChangeLoading(false)
    }
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()
    const email = changeEmail.trim().toLowerCase()
    const nextPassword = newPassword.trim()
    const nextConfirm = confirmPassword.trim()

    if (!email) {
      setChangeError('Enter your registered vendor email.')
      return
    }
    if (!nextPassword) {
      setChangeError('Enter a new password.')
      return
    }
    if (nextPassword.length < 6) {
      setChangeError('Password must be at least 6 characters.')
      return
    }
    if (nextPassword !== nextConfirm) {
      setChangeError('New password and confirm password do not match.')
      return
    }

    setChangeLoading(true)
    setChangeError('')
    setChangeSuccess('')
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad-creator/cad-service-partner-page/${requestId}/change-password`,
        {
          email,
          new_password: nextPassword,
          confirm_password: nextConfirm,
        },
      )
      if (!response.data?.meta?.success) {
        throw new Error(response.data?.meta?.message || 'Failed to change password.')
      }
      setChangeSuccess(
        response.data.meta.message
          || 'Password saved successfully. You can now unlock with this password.',
      )
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        resetChangePasswordForm()
        setAuthMode('login')
      }, 1600)
    } catch (err) {
      setChangeError(
        err.response?.data?.meta?.message
          || err.message
          || 'Failed to change password.',
      )
    } finally {
      setChangeLoading(false)
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

          {authMode === 'login' ? (
            <>
              <h1 className={styles.lockTitle}>Enter your access code</h1>
              <p className={styles.lockLead}>
                This link was shared with your agency for request{' '}
                <strong>{shortRequestId(requestId)}</strong>. Enter the passcode Marathon
                sent you to view live status and project details.
              </p>
              <form onSubmit={handleUnlock} className={styles.lockForm}>
                <label className={styles.lockLabel} htmlFor="partner-passcode">
                  Access passcode
                </label>
                <input
                  id="partner-passcode"
                  type="password"
                  autoComplete="current-password"
                  className={styles.lockInput}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value)
                    if (passcodeError) setPasscodeError('')
                  }}
                  placeholder="Enter passcode"
                  disabled={unlocking}
                />
                {passcodeError ? <div className={styles.lockError}>{passcodeError}</div> : null}
                <button type="submit" className={styles.lockButton} disabled={unlocking}>
                  {unlocking ? 'Unlocking…' : 'Unlock request →'}
                </button>
              </form>
              <button
                type="button"
                className={styles.lockSecondaryLink}
                onClick={openChangePassword}
              >
                Change/create password
              </button>
            </>
          ) : null}

          {authMode === 'change-email' ? (
            <>
              <h1 className={styles.lockTitle}>Change/create password</h1>
              <p className={styles.lockLead}>
                Enter your registered vendor email. If it matches our records, you can
                change or create a password.
              </p>
              <form onSubmit={handleVerifyChangeEmail} className={styles.lockForm}>
                <label className={styles.lockLabel} htmlFor="partner-change-email">
                  Vendor email
                </label>
                <input
                  id="partner-change-email"
                  type="email"
                  autoComplete="email"
                  className={styles.lockInput}
                  value={changeEmail}
                  onChange={(e) => {
                    setChangeEmail(e.target.value)
                    if (changeError) setChangeError('')
                  }}
                  placeholder="you@agency.com"
                  disabled={changeLoading}
                />
                {changeError ? <div className={styles.lockError}>{changeError}</div> : null}
                <button type="submit" className={styles.lockButton} disabled={changeLoading}>
                  {changeLoading ? 'Checking…' : 'Continue →'}
                </button>
              </form>
              <button
                type="button"
                className={styles.lockSecondaryLink}
                onClick={backToLogin}
                disabled={changeLoading}
              >
                Back to unlock
              </button>
            </>
          ) : null}

          {authMode === 'change-password' ? (
            <>
              <h1 className={styles.lockTitle}>Change/create password</h1>
              <p className={styles.lockLead}>
                Email verified for <strong>{changeEmail}</strong>. Enter a password to
                unlock partner requests.
              </p>
              <form onSubmit={handleChangePassword} className={styles.lockForm}>
                <label className={styles.lockLabel} htmlFor="partner-new-password">
                  New password
                </label>
                <input
                  id="partner-new-password"
                  type="password"
                  autoComplete="new-password"
                  className={styles.lockInput}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (changeError) setChangeError('')
                  }}
                  placeholder="At least 6 characters"
                  disabled={changeLoading}
                />
                <label
                  className={styles.lockLabel}
                  htmlFor="partner-confirm-password"
                  style={{ marginTop: 14 }}
                >
                  Confirm new password
                </label>
                <input
                  id="partner-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  className={styles.lockInput}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (changeError) setChangeError('')
                  }}
                  placeholder="Re-enter new password"
                  disabled={changeLoading}
                />
                {changeError ? <div className={styles.lockError}>{changeError}</div> : null}
                {changeSuccess ? (
                  <div className={styles.lockSuccess}>{changeSuccess}</div>
                ) : null}
                <button type="submit" className={styles.lockButton} disabled={changeLoading}>
                  {changeLoading ? 'Saving…' : 'Save password'}
                </button>
              </form>
              <button
                type="button"
                className={styles.lockSecondaryLink}
                onClick={() => {
                  setNewPassword('')
                  setConfirmPassword('')
                  setChangeError('')
                  setChangeSuccess('')
                  setAuthMode('change-email')
                }}
                disabled={changeLoading}
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

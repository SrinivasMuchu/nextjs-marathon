'use client'

import React, { useEffect, useState } from 'react'
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

function CadPartnerPortal({ requestId }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payload, setPayload] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get(
          `${BASE_URL}/v1/cad-creator/cad-service-partner-page/${requestId}`,
        )
        if (!response.data?.meta?.success || !response.data?.data?.request) {
          throw new Error(response.data?.meta?.message || 'Request not found')
        }
        if (!cancelled) {
          setPayload(response.data.data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.meta?.message
              || err.message
              || 'Unable to load this partner page.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (requestId) load()
    return () => {
      cancelled = true
    }
  }, [requestId])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCard}>Loading partner request…</div>
      </div>
    )
  }

  if (error || !payload?.request) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCard}>
          <div className={styles.stateEyebrow}>Partner portal</div>
          <h1 className={styles.stateTitle}>Request unavailable</h1>
          <p className={styles.stateText}>{error || 'This partner link is invalid or no longer available.'}</p>
        </div>
      </div>
    )
  }

  const request = payload.request
  const status = normalizeCadServiceStatus(request.standalone_page_status)
  const statusColor = getCadServiceStatusColor(status)
  const statusLabel = getCadServiceStatusLabel(status)
  const activityLog = Array.isArray(payload.activity_log) ? payload.activity_log : []
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
            <span className={styles.partnerLabel}>Matched partner</span>
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

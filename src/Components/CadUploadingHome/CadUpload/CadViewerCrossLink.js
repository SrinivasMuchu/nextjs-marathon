import React from 'react'
import Link from 'next/link'
import { ArrowRight, Box } from 'lucide-react'
import styles from './CadViewerCrossLink.module.css'

function WireframeArt() {
  return (
    <svg
      className={styles.visualArt}
      viewBox="0 0 280 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern id="viewerGrid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="280" height="220" fill="url(#viewerGrid)" />
      <ellipse cx="140" cy="168" rx="78" ry="22" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <path
        d="M62 168V118C62 102 90 90 140 90C190 90 218 102 218 118V168"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.6"
      />
      <ellipse cx="140" cy="118" rx="78" ry="22" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.6" />
      <path
        d="M96 118V78C96 66 114 58 140 58C166 58 184 66 184 78V118"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.6"
      />
      <ellipse cx="140" cy="78" rx="44" ry="14" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.6" />
      <ellipse cx="140" cy="58" rx="44" ry="14" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.8" />
      <circle cx="90" cy="160" r="4" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
      <circle cx="190" cy="160" r="4" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
      <circle cx="140" cy="178" r="4" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
      <path
        d="M118 58L118 42M140 50L140 34M162 58L162 42"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CadViewerCrossLink({ variant = 'default' }) {
  const isCompact = variant === 'compact'

  return (
    <section
      className={`${styles.bannerWrap} ${isCompact ? styles.bannerWrapCompact : ''}`}
      aria-labelledby="cad-viewer-cross-link-title"
    >
      <div className={`${styles.banner} ${isCompact ? styles.bannerCompact : ''}`}>
        <div className={styles.content}>
          <span className={styles.iconBadge} aria-hidden>
            <Box size={26} strokeWidth={2.2} />
          </span>
          <h3 id="cad-viewer-cross-link-title" className={styles.title}>
            Need to preview before converting?
          </h3>
          <p className={styles.copy}>
            Open your CAD file in the Marathon OS 3D viewer first to inspect geometry, check scale
            and confirm the model before converting it to another format.
          </p>
          <Link href="/tools/3d-cad-viewer" className={styles.cta}>
            Open CAD Viewer
            <ArrowRight size={22} strokeWidth={2.4} aria-hidden />
          </Link>
        </div>
        {!isCompact ? (
          <div className={styles.visual}>
            <WireframeArt />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default CadViewerCrossLink

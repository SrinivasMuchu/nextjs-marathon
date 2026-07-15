import React from 'react'
import Link from 'next/link'
import { ArrowRight, Box, FileText, Headphones } from 'lucide-react'
import { TOOL_LIBRARY_CROSS_LINKS } from '@/data/crossTemplateLinks'
import styles from './CrossTemplateLinks.module.css'

const ICON_MAP = {
  box: Box,
  file: FileText,
  headset: Headphones,
}

export default function ToolLibraryCrossLinks({
  title = 'Explore Marathon OS CAD resources',
  variant = 'light',
}) {
  const bandClass =
    variant === 'dark'
      ? `${styles.toolLibraryBand} ${styles.toolLibraryBandDark} ${styles.toolLibraryBandCards}`
      : `${styles.toolLibraryBand} ${styles.toolLibraryBandCards}`

  return (
    <section className={bandClass} aria-labelledby="tool-library-cross-links">
      <h2 id="tool-library-cross-links" className={styles.toolLibraryTitle}>
        {title}
      </h2>
      <div className={styles.toolLibraryCards}>
        {TOOL_LIBRARY_CROSS_LINKS.map((link) => {
          const Icon = ICON_MAP[link.icon] || Box
          return (
            <Link key={link.href} href={link.href} className={styles.toolLibraryCard}>
              <span className={styles.toolLibraryCardIcon} aria-hidden>
                <Icon size={22} strokeWidth={2.2} />
              </span>
              <span className={styles.toolLibraryCardBody}>
                <span className={styles.toolLibraryCardLabel}>{link.label}</span>
                {link.description ? (
                  <span className={styles.toolLibraryCardDesc}>{link.description}</span>
                ) : null}
              </span>
              <ArrowRight
                className={styles.toolLibraryCardArrow}
                size={18}
                strokeWidth={2.4}
                aria-hidden
              />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

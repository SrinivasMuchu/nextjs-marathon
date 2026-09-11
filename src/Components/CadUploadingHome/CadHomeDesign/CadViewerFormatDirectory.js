import React from 'react'
import Link from 'next/link'
import styles from './CadViewerFormatSections.module.css'

function CadViewerFormatDirectory({ uniquePage }) {
  if (!uniquePage?.formatDirectory?.length) return null

  return (
    <section className={`${styles.section} ${styles.sectionMuted}`} aria-labelledby="viewer-format-directory">
      <div className={styles.innerWide}>
        <h2 id="viewer-format-directory" className={styles.heading}>
          {uniquePage.formatDirectoryHeading}
        </h2>
        {uniquePage.formatDirectoryIntro ? (
          <p className={styles.copy}>{uniquePage.formatDirectoryIntro}</p>
        ) : null}
        <div className={styles.relatedCards}>
          {uniquePage.formatDirectory.map((row) => (
            <Link key={row.href} href={row.href} className={styles.relatedCard}>
              <strong>{row.title}</strong>
              {row.description ? <span>{row.description}</span> : null}
              {row.cta ? <em>{row.cta}</em> : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CadViewerFormatDirectory

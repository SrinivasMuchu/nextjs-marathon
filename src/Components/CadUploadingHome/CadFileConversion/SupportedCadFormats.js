'use client'

import React from 'react'
import { CONVERTER_FILTER_EVENT, CONVERTER_HUB_PAGE } from '@/data/converterHubPage'
import styles from './CadConverterSections.module.css'

function openFormatDirectory(filter) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONVERTER_FILTER_EVENT, { detail: { filter } }))
  }
}

function SupportedCadFormats() {
  return (
    <section className={styles.formatsSection} aria-labelledby="supported-cad-formats">
      <div className={styles.formatsInner}>
        <p className={styles.formatsEyebrow}>{CONVERTER_HUB_PAGE.formatsEyebrow}</p>
        <h2 id="supported-cad-formats" className={styles.heading}>
          {CONVERTER_HUB_PAGE.formatsHeading}
        </h2>
        <p className={styles.formatsIntro}>{CONVERTER_HUB_PAGE.formatsIntro}</p>
        <ul className={styles.formatList}>
          {CONVERTER_HUB_PAGE.formats.map(({ label, filter, description, extensions, cta }) => (
            <li key={label} className={styles.formatCard}>
              <div className={styles.formatCardTop}>
                <span className={styles.formatBadge}>{label}</span>
              </div>
              <h3>{label}</h3>
              <p>{description}</p>
              <p>Extensions: {extensions}</p>
              <a
                className={styles.formatCta}
                href="#cad-converter-types-heading"
                onClick={() => openFormatDirectory(filter)}
              >
                {cta}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SupportedCadFormats

import React from 'react'
import CtaButtons from './CtaButtons'
import styles from './CtaSection.module.css'

function CtaSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Get CAD talent assigned this week.</h2>
      <p className={styles.sub}>
        Send your requirements. We&apos;ll reply within 24 hours with next steps.
      </p>
      <CtaButtons />
    </section>
  )
}

export default CtaSection

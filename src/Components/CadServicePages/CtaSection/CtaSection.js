import React from 'react'
import CtaButtons from './CtaButtons'
import styles from './CtaSection.module.css'

function CtaSection() {
  return (
    <section className={styles.finalWrap}>
      <div className={styles.narrow}>
        <div className={styles.finalCta}>
          <div>
            <h2 className={styles.title}>Have a CAD requirement ready to move?</h2>
            <p className={styles.sub}>
              Share one clear brief. Marathon will help you find relevant agency options, coordinate the initial
              questions and make the selection process easier for your team.
            </p>
          </div>
          <CtaButtons />
        </div>
      </div>
    </section>
  )
}

export default CtaSection

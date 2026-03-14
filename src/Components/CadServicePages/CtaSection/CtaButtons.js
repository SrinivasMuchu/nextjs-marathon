"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './CtaSection.module.css'

function CtaButtons() {
  const handleRequestQuote = () => {
    const formSection = document.querySelector('[data-cad-form]')
    formSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.ctaButtons}>
      <button
        type="button"
        className={styles.ctaBtnPrimary}
        onClick={handleRequestQuote}
      >
        Request CAD Quote
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
      <Link href="/library" className={styles.ctaBtnOutline}>
        View Sample Work
      </Link>
    </div>
  )
}

export default CtaButtons

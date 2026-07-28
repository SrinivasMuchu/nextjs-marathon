'use client'

import React from 'react'
import styles from './StickyCta.module.css'

function StickyCta() {
  const scrollToQuote = () => {
    const el = document.getElementById('cad-quote')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button type="button" className={styles.stickyCta} onClick={scrollToQuote}>
      Submit CAD brief <span>→</span>
    </button>
  )
}

export default StickyCta

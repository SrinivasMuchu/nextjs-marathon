"use client"

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useCadForm } from '../CadFormContext'
import styles from './CtaSection.module.css'

function CtaButtons() {
  const { openFormPopup } = useCadForm()

  return (
    <div className={styles.ctaButtons}>
      <button
        type="button"
        className={styles.ctaBtnPrimary}
        onClick={openFormPopup}
      >
        Request CAD Quote
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export default CtaButtons

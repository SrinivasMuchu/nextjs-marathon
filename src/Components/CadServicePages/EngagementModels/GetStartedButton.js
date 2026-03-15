"use client"

import React from 'react'
import { useCadForm } from '../CadFormContext'
import styles from './EngagementModels.module.css'

function GetStartedButton({ primary = false }) {
  const { openFormPopup } = useCadForm()

  return (
    <button
      type="button"
      className={`${styles.cta} ${primary ? styles.ctaSolid : styles.ctaOutline}`}
      onClick={openFormPopup}
    >
      Get Started →
    </button>
  )
}

export default GetStartedButton

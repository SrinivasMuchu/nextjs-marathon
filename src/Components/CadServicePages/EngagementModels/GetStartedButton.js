"use client"

import React from 'react'
import styles from './EngagementModels.module.css'

function GetStartedButton({ primary = false }) {
  const handleClick = () => {
    const formSection = document.querySelector('[data-cad-form]')
    formSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={`${styles.cta} ${primary ? styles.ctaSolid : styles.ctaOutline}`}
      onClick={handleClick}
    >
      Get Started →
    </button>
  )
}

export default GetStartedButton

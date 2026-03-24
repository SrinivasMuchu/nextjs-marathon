"use client"

import React from 'react'
import Link from 'next/link'
import styles from './EngagementModels.module.css'

const CAD_SERVICES_QUOTE_HREF = '/cad-services#cad-quote'

function GetStartedButton({ primary = false }) {
  return (
    <Link
      href={CAD_SERVICES_QUOTE_HREF}
      className={`${styles.cta} ${primary ? styles.ctaSolid : styles.ctaOutline}`}
    >
      Get Started →
    </Link>
  )
}

export default GetStartedButton

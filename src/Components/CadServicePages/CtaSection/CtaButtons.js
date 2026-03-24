"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './CtaSection.module.css'

const CAD_SERVICES_QUOTE_HREF = '/cad-services'

function CtaButtons() {
  return (
    <div className={styles.ctaButtons}>
      <Link href={CAD_SERVICES_QUOTE_HREF} className={styles.ctaBtnPrimary}>
        Request CAD Quote
        <ArrowRight size={16} strokeWidth={2.5} />
      </Link>
    </div>
  )
}

export default CtaButtons

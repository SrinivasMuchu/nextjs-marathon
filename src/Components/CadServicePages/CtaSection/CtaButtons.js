"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCadForm, isCadServicesRoute } from '../CadFormContext'
import styles from './CtaSection.module.css'

const CAD_SERVICES_QUOTE_HREF = '/cad-services#cad-quote'

function CtaButtons() {
  const pathname = usePathname()
  const { openFormPopup } = useCadForm()
  const samePage = isCadServicesRoute(pathname)

  const scrollToQuote = () => {
    const el = document.getElementById('cad-quote')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    openFormPopup('cta_section')
  }

  return (
    <div className={styles.ctaButtons}>
      {samePage ? (
        <>
          <button type="button" className={styles.ctaBtnPrimary} onClick={scrollToQuote}>
            Submit My CAD Brief →
          </button>
          <a className={styles.ctaBtnOutline} href="#process">
            See How It Works
          </a>
        </>
      ) : (
        <>
          <Link href={CAD_SERVICES_QUOTE_HREF} className={styles.ctaBtnPrimary}>
            Submit My CAD Brief →
          </Link>
          <Link href="/cad-services#process" className={styles.ctaBtnOutline}>
            See How It Works
          </Link>
        </>
      )}
    </div>
  )
}

export default CtaButtons

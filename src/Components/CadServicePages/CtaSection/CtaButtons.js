"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCadForm, isCadServicesRoute } from '../CadFormContext'
import styles from './CtaSection.module.css'

const CAD_SERVICES_QUOTE_HREF = '/cad-services'

function CtaButtons() {
  const pathname = usePathname()
  const { openFormPopup } = useCadForm()
  const samePage = isCadServicesRoute(pathname)
  const content = (
    <>
      Request CAD Quote
      <ArrowRight size={16} strokeWidth={2.5} />
    </>
  )

  return (
    <div className={styles.ctaButtons}>
      {samePage ? (
        <button type="button" className={styles.ctaBtnPrimary} onClick={() => openFormPopup()}>
          {content}
        </button>
      ) : (
        <Link href={CAD_SERVICES_QUOTE_HREF} className={styles.ctaBtnPrimary}>
          {content}
        </Link>
      )}
    </div>
  )
}

export default CtaButtons

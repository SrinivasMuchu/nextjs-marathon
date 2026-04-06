"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCadForm, isCadServicesRoute } from '../CadFormContext'
import styles from './EngagementModels.module.css'

const CAD_SERVICES_QUOTE_HREF = '/cad-services'

function GetStartedButton({ primary = false }) {
  const pathname = usePathname()
  const { openFormPopup } = useCadForm()
  const samePage = isCadServicesRoute(pathname)
  const className = `${styles.cta} ${primary ? styles.ctaSolid : styles.ctaOutline}`

  if (samePage) {
    return (
      <button type="button" className={className} onClick={() => openFormPopup()}>
        Get Started →
      </button>
    )
  }

  return (
    <Link href={CAD_SERVICES_QUOTE_HREF} className={className}>
      Get Started →
    </Link>
  )
}

export default GetStartedButton

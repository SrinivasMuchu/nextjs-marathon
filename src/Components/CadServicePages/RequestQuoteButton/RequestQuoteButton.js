"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCadForm, isCadServicesRoute } from '../CadFormContext'
import styles from './RequestQuoteButton.module.css'

const CAD_SERVICES_QUOTE_HREF = '/cad-services'

function RequestQuoteButton({ variant = 'light' }) {
  const pathname = usePathname()
  const { openFormPopup } = useCadForm()
  const samePage = isCadServicesRoute(pathname)
  const className = variant === 'dark' ? styles.btnDark : styles.btnLight
  const content = (
    <>
      Request CAD Quote
      <ArrowRight size={16} strokeWidth={2.5} />
    </>
  )

  if (samePage) {
    return (
      <button type="button" className={className} onClick={() => openFormPopup()}>
        {content}
      </button>
    )
  }

  return (
    <Link href={CAD_SERVICES_QUOTE_HREF} className={className}>
      {content}
    </Link>
  )
}

export default RequestQuoteButton

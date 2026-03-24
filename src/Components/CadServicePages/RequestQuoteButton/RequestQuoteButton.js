"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './RequestQuoteButton.module.css'

const CAD_SERVICES_QUOTE_HREF = '/cad-services#cad-quote'

function RequestQuoteButton({ variant = 'light' }) {
  return (
    <Link
      href={CAD_SERVICES_QUOTE_HREF}
      className={variant === 'dark' ? styles.btnDark : styles.btnLight}
    >
      Request CAD Quote
      <ArrowRight size={16} strokeWidth={2.5} />
    </Link>
  )
}

export default RequestQuoteButton

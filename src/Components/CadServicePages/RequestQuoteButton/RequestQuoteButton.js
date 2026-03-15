"use client"

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useCadForm } from '../CadFormContext'
import styles from './RequestQuoteButton.module.css'

function RequestQuoteButton({ variant = 'light' }) {
  const { openFormPopup } = useCadForm()

  return (
    <button
      type="button"
      className={variant === 'dark' ? styles.btnDark : styles.btnLight}
      onClick={openFormPopup}
    >
      Request CAD Quote
      <ArrowRight size={16} strokeWidth={2.5} />
    </button>
  )
}

export default RequestQuoteButton

'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useCadForm } from '@/Components/CadServicePages/CadFormContext'
import styles from './CadArticleDescribeProjectButton.module.css'

export default function CadArticleDescribeProjectButton({
  children,
  className = '',
  showArrow = true,
}) {
  const { openFormPopup } = useCadForm()

  return (
    <button
      type="button"
      className={[styles.btn, className].filter(Boolean).join(' ')}
      onClick={() => openFormPopup()}
    >
      {children}
      {showArrow ? <ArrowRight size={18} strokeWidth={2.5} aria-hidden /> : null}
    </button>
  )
}

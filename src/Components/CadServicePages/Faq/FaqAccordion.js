"use client"

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './Faq.module.css'

function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className={styles.faqList}>
      {items.map((item, index) => (
        <div key={index} className={styles.faqItem}>
          <button
            type="button"
            className={`${styles.faqQ} ${openIndex === index ? styles.faqQOpen : ''}`}
            onClick={() => toggle(index)}
          >
            {item.question}
            <ChevronDown
              className={styles.faqChevron}
              size={18}
              strokeWidth={2}
            />
          </button>
          <div
            className={`${styles.faqA} ${openIndex === index ? styles.faqAOpen : ''}`}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FaqAccordion

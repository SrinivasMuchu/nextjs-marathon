import React from 'react'
import styles from './Faq.module.css'

function FaqAccordion({ items }) {
  return (
    <div className={styles.faqList}>
      {items.map((item, index) => (
        <div key={index} className={styles.faqItem}>
          <div className={styles.faqQ}>{item.question}</div>
          <div className={styles.faqA}>{item.answer}</div>
        </div>
      ))}
    </div>
  )
}

export default FaqAccordion

import React from 'react'
import styles from './Faq.module.css'

function FaqAccordion({ items }) {
  return (
    <div className={styles.faqList}>
      {items.map((item) => (
        <div key={item.question} className={styles.details}>
          <div className={styles.summary}>{item.question}</div>
          <p className={styles.answer}>{item.answer}</p>
        </div>
      ))}
    </div>
  )
}

export default FaqAccordion

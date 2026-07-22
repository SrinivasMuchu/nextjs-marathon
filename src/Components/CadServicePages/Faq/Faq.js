import React from 'react'
import { cadServicesFaqQuestions } from '@/data/cadServicesFaqs'
import FaqAccordion from './FaqAccordion'
import styles from './Faq.module.css'

function Faq() {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Frequently asked questions</div>
        <h2 className={styles.title}>What clients usually want to know before submitting a brief</h2>
        <FaqAccordion items={cadServicesFaqQuestions} />
      </div>
    </section>
  )
}

export default Faq

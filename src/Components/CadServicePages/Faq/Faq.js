import React from 'react'
import { cadServicesFaqQuestions } from '@/data/cadServicesFaqs'
import FaqAccordion from './FaqAccordion'
import RequestQuoteButton from '../RequestQuoteButton/RequestQuoteButton'
import styles from './Faq.module.css'

function Faq() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>FAQ</span>
        <h2 className={styles.title}>Frequently asked questions</h2>
        <p className={styles.sub}>
          Everything you need to know before getting started.
        </p>
      </div>
      <FaqAccordion items={cadServicesFaqQuestions} />
      <div className={styles.ctaWrap}>
        <RequestQuoteButton variant="light" />
      </div>
    </section>
  )
}

export default Faq

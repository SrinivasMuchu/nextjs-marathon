import React from 'react'
import styles from './ConverterFaq.module.css'

function ConverterFaq({
  faqQuestions,
  eyebrow = 'Frequently asked questions',
  title = 'Everything to know before converting',
  description = 'Quick answers about formats, pricing, file limits, conversion quality and privacy.',
}) {
  if (!faqQuestions?.length) return null

  return (
    <section className={styles.section} aria-labelledby="converter-faq-heading">
      <div className={styles.inner}>
        <header className={styles.copy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="converter-faq-heading" className={styles.heading}>
            {title}
          </h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </header>

        <ul className={styles.list}>
          {faqQuestions.map((item, index) => (
            <li key={index} className={styles.item}>
              <article className={styles.card}>
                <h3 className={styles.question}>{item.question}</h3>
                <div className={styles.divider} aria-hidden />
                <p className={styles.answer}>{item.answer}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ConverterFaq

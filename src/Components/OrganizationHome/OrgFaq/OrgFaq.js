import React from 'react';
import styles from './OrgFaq.module.css';

/**
 * FAQ block. Data from server modules (e.g. @/data/cadToolFaqs).
 * Static layout: every question and answer is always visible (no accordion / toggle).
 */
function OrgFaq({ faqQuestions, description, title = 'Frequently asked questions' }) {
  if (!faqQuestions?.length) return null;

  return (
    <section className={styles.section} aria-labelledby="org-faq-heading">
      <div className={styles.inner}>
        <h2 id="org-faq-heading" className={styles.pageTitle}>
          {title}
        </h2>
        {description ? <p className={styles.intro}>{description}</p> : null}

        <ul className={styles.list}>
          {faqQuestions.map((item, index) => (
            <li key={index} className={styles.item}>
              <article className={styles.card}>
                <h3 className={styles.question}>{item.question}</h3>
                <p className={styles.answer}>{item.answer}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default OrgFaq;

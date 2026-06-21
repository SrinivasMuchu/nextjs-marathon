import React from 'react';
import styles from './Faq.module.css';

/** Always-visible FAQ row (no accordion) so answers are in raw HTML for crawlers. */
function FaqItem({ question, answer }) {
  return (
    <div className={styles.faqItem}>
      <div className={styles.faqQuestion} role="heading" aria-level={3}>
        <span className={styles.faqQuestionText}>{question}</span>
      </div>
      <div className={styles.faqAnswer}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default FaqItem;

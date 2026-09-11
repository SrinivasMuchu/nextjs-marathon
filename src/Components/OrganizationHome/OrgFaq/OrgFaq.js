import React from 'react';
import Link from 'next/link';
import styles from './OrgFaq.module.css';

function AnswerText({ item }) {
  const nodes = [];
  if (item.links?.length) {
    let remaining = item.answer;
    item.links.forEach((link) => {
      const index = remaining.indexOf(link.label);
      if (index === -1 || typeof remaining !== 'string') return;
      nodes.push(remaining.slice(0, index));
      nodes.push(
        <Link key={link.href} href={link.href} className={styles.answerLink}>
          {link.label}
        </Link>
      );
      remaining = remaining.slice(index + link.label.length);
    });
    nodes.push(remaining);
  }

  return (
    <>
      <p className={styles.answer}>{item.links?.length ? nodes : item.answer}</p>
      {item.ctaHref && item.cta ? (
        <p className={styles.answer}>
          <Link href={item.ctaHref} className={styles.answerLink}>
            {item.cta}
          </Link>
        </p>
      ) : null}
      {item.ctas?.length
        ? item.ctas.map((cta) => (
            <p key={cta.href} className={styles.answer}>
              <Link href={cta.href} className={styles.answerLink}>
                {cta.label}
              </Link>
            </p>
          ))
        : null}
    </>
  );
}

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
                <AnswerText item={item} />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default OrgFaq;

import React from 'react';
import Link from 'next/link';
import styles from './HowItWorks.module.css';

function HowItWorks({ steps, title }) {
  if (!steps?.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.stepsList}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepItem}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <p className={styles.stepText}>
                {step.link ? (
                  <>
                    {step.textPrefix}
                    <Link href={step.link.href}>{step.link.label}</Link>.
                  </>
                ) : (
                  step.text
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HowItWorks.module.css';

function HowItWorks({
  steps,
  title,
  label,
  mainHeading,
  primaryCta,
  secondaryCta,
}) {
  if (!steps?.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <p className={styles.label}>How it works</p>
         <h2 className={styles.mainHeading}>No downloads. No plugins. Works right from your browser.</h2>
        {title && <p className={styles.subHeading}>{title}</p>}

        <div className={styles.stepsList}>
          {steps.map((step, index) => {
            let stepTitle = step.title;
            let stepDescription = step.description;
            if (!stepTitle && typeof step.text === 'string') {
              stepTitle = step.text.replace(/\s*\([^)]*\).*$/, '').trim();
            }
            if (!stepTitle) stepTitle = step.textPrefix ? `Step ${index + 1}` : 'Step';
            if (!stepDescription && typeof step.text === 'string') stepDescription = step.text;
            if (!stepDescription && step.textPrefix && step.link) {
              stepDescription = `${step.textPrefix}${step.link.label}.`;
            }
            if (!stepDescription) stepDescription = '';
            const num = String(index + 1).padStart(2, '0');

            return (
              <div key={index} className={styles.stepCard}>
                <span className={styles.stepBadge}>{num}</span>
                <h3 className={styles.stepTitle}>{stepTitle}</h3>
               
                {step.image && (
                  <div className={styles.stepIcon}>
                    <Image
                      src={step.image}
                      alt=""
                      width={240}
                      height={240}
                      sizes="120px"
                      className={styles.stepIconImg}
                    />
                  </div>
                )}
                 <p className={styles.stepDescription}>{stepDescription}</p>
              </div>
            );
          })}
        </div>

        {(primaryCta || secondaryCta) && (
          <div className={styles.ctaRow}>
            {primaryCta?.href && (
              <Link href={primaryCta.href} className={styles.primaryCta}>
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta?.href && (
              <Link href={secondaryCta.href} className={styles.secondaryCta}>
                {secondaryCta.label} →
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HowItWorks;

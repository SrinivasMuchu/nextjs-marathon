'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Upload } from 'lucide-react';
import styles from './HowItWorks.module.css';

function HowItWorks({
  steps,
  title,
  label,
  mainHeading,
  primaryCta,
  secondaryCta,
  variant,
}) {
  if (!steps?.length) return null;

  if (variant === 'cadViewer') {
    const eyebrow = label || 'How it works';
    const heading = title || 'How to view CAD files online';
    const subtitle =
      mainHeading || 'No downloads. No plugins. Works right from your browser.';

    return (
      <section className={styles.cadViewerSection}>
        <div className={styles.cadViewerInner}>
          <p className={styles.cadViewerEyebrow}>{eyebrow}</p>
          <h2 className={styles.cadViewerHeading}>{heading}</h2>
          <p className={styles.cadViewerSubtitle}>{subtitle}</p>

          <div className={styles.cadViewerStepsRow}>
            {steps.map((step, index) => {
              let stepTitle = step.title;
              let stepDescription = step.description;
              if (!stepTitle && typeof step.text === 'string') {
                stepTitle = step.text.replace(/\s*\([^)]*\).*$/, '').trim();
              }
              if (!stepTitle) stepTitle = step.textPrefix ? `Step ${index + 1}` : 'Step';
              if (!stepDescription && typeof step.text === 'string') {
                stepDescription = step.text;
              }
              if (!stepDescription && step.textPrefix && step.link) {
                stepDescription = `${step.textPrefix}${step.link.label}.`;
              }
              if (!stepDescription) stepDescription = '';
              const num = String(index + 1).padStart(2, '0');

              return (
                <React.Fragment key={index}>
                  {index > 0 ? (
                    <div className={styles.cadViewerArrow} aria-hidden>
                      <ChevronRight size={22} strokeWidth={2} className={styles.cadViewerArrowIcon} />
                    </div>
                  ) : null}
                  <div className={styles.cadViewerStep}>
                    <div className={styles.cadViewerIconWrap}>
                      <span className={styles.cadViewerBadge}>{num}</span>
                      {step.image ? (
                        <div className={styles.cadViewerIconBox}>
                          <Image
                            src={step.image}
                            alt=""
                            width={240}
                            height={240}
                            sizes="56px"
                            className={styles.cadViewerIconImg}
                          />
                        </div>
                      ) : null}
                    </div>
                    <h3 className={styles.cadViewerStepTitle}>{stepTitle}</h3>
                    <p className={styles.cadViewerStepDesc}>{stepDescription}</p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {(primaryCta?.href || secondaryCta?.href) && (
            <div className={styles.cadViewerCtaRow}>
              {primaryCta?.href ? (
                <Link href={primaryCta.href} className={styles.cadViewerPrimaryCta}>
                  <Upload size={18} strokeWidth={2.2} aria-hidden />
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta?.href ? (
                <Link href={secondaryCta.href} className={styles.cadViewerSecondaryCta}>
                  {secondaryCta.label}
                  <span className={styles.cadViewerSecondaryArrow} aria-hidden>
                    →
                  </span>
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <p className={styles.label}>How it works</p>
        <h2 className={styles.mainHeading}>
          No downloads. No plugins. Works right from your browser.
        </h2>
        {title ? <p className={styles.subHeading}>{title}</p> : null}

        <div className={styles.stepsList}>
          {steps.map((step, index) => {
            let stepTitle = step.title;
            let stepDescription = step.description;
            if (!stepTitle && typeof step.text === 'string') {
              stepTitle = step.text.replace(/\s*\([^)]*\).*$/, '').trim();
            }
            if (!stepTitle) stepTitle = step.textPrefix ? `Step ${index + 1}` : 'Step';
            if (!stepDescription && typeof step.text === 'string') {
              stepDescription = step.text;
            }
            if (!stepDescription && step.textPrefix && step.link) {
              stepDescription = `${step.textPrefix}${step.link.label}.`;
            }
            if (!stepDescription) stepDescription = '';
            const num = String(index + 1).padStart(2, '0');

            return (
              <div key={index} className={styles.stepCard}>
                <span className={styles.stepBadge}>{num}</span>
                <h3 className={styles.stepTitle}>{stepTitle}</h3>

                {step.image ? (
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
                ) : null}
                <p className={styles.stepDescription}>{stepDescription}</p>
              </div>
            );
          })}
        </div>

        {(primaryCta || secondaryCta) && (
          <div className={styles.ctaRow}>
            {primaryCta?.href ? (
              <Link href={primaryCta.href} className={styles.primaryCta}>
                {primaryCta.label}
              </Link>
            ) : null}
            {secondaryCta?.href ? (
              <Link href={secondaryCta.href} className={styles.secondaryCta}>
                {secondaryCta.label} →
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export default HowItWorks;

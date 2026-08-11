import React from 'react';
import {
  CONVERTER_CREDIT_PACKS,
  CONVERTER_SINGLE_DOWNLOAD_PRICE,
} from '@/lib/converterCreditPacks';
import styles from './ConverterPricingSection.module.css';

function ConverterPricingSection() {
  return (
    <section className={styles.section} aria-labelledby="converter-pricing-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Pricing</p>
          <h2 id="converter-pricing-heading" className={styles.heading}>
            Pay as you go, cheaper by the pack
          </h2>
          <p className={styles.description}>
            Files under 5 MB are always free. For everything else, buy credits —{' '}
            <strong>1 credit downloads any file, any size, and credits never expire.</strong>
          </p>
        </header>

        <div className={styles.grid}>
          {CONVERTER_CREDIT_PACKS.map((pack) => (
            <article
              key={pack.id}
              className={`${styles.card} ${pack.featured ? styles.cardFeatured : ''}`}
            >
              {pack.featured ? (
                <span className={styles.popularBadge}>★ Most popular</span>
              ) : null}
              <p className={styles.tier}>{pack.name}</p>
              <p className={styles.credits}>
                <span className={styles.creditCount}>{pack.credits}</span>
                <span className={styles.creditLabel}>credits</span>
              </p>
              <div className={styles.priceRow}>
                <p className={styles.price}>{pack.price}</p>
                <p className={styles.perCredit}>{pack.perCredit}</p>
              </div>
              <span
                className={`${styles.saveBadge} ${pack.saveBest ? styles.saveBadgeBest : ''}`}
              >
                {pack.save}
              </span>
              <p className={styles.cardCopy}>{pack.description}</p>
              <a
                href="#cad-file-converter"
                className={`${styles.cta} ${pack.variant === 'solid' ? styles.ctaSolid : ''}`}
              >
                {pack.cta}
              </a>
            </article>
          ))}
        </div>

        <p className={styles.footer}>
          Just need one?{' '}
          <a href="#cad-file-converter" className={styles.footerLink}>
            Pay {CONVERTER_SINGLE_DOWNLOAD_PRICE} for a single download
          </a>
          <span className={styles.footerDot} aria-hidden>
            ·
          </span>
          <span className={styles.footerBreak} />
          No subscription
          <span className={styles.footerDot} aria-hidden>
            ·
          </span>
          <span className={styles.footerBreak} />
          Credits never expire
          <span className={styles.footerDot} aria-hidden>
            ·
          </span>
          <span className={styles.footerBreak} />
          GST invoice on every purchase
        </p>
      </div>
    </section>
  );
}

export default ConverterPricingSection;

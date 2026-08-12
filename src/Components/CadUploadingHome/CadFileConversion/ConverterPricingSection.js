"use client";

import React, { useEffect, useState } from 'react';
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
} from '@/lib/converterPricing';
import styles from './ConverterPricingSection.module.css';

function ConverterPricingSection() {
  const [packs, setPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        setPacks(getConverterPacksFromInfo(info));
        setSinglePriceLabel(getSinglePriceLabelFromInfo(info));
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setPacks([]);
          setSinglePriceLabel('');
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || !packs.length) {
    return null;
  }

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
          {packs.map((pack) => (
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
                <p className={styles.price}>{pack.price_label}</p>
                <p className={styles.perCredit}>{pack.per_credit_label}</p>
              </div>
              <span
                className={`${styles.saveBadge} ${pack.save_best ? styles.saveBadgeBest : ''}`}
              >
                {pack.save_label}
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

        {singlePriceLabel ? (
          <p className={styles.footer}>
            Just need one?{' '}
            <a href="#cad-file-converter" className={styles.footerLink}>
              Pay {singlePriceLabel} for a single download
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
            Invoice on every purchase
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default ConverterPricingSection;

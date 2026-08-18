"use client";

import React, { useContext, useEffect, useState } from 'react';
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
  areConverterSubscriptionsEnabled,
} from '@/lib/converterPricing';
import { contextState } from '@/Components/CommonJsx/ContextProvider';
import UserLoginPupUp from '@/Components/CommonJsx/UserLoginPupUp';
import ConverterDownloadFlow from '@/Components/History/ConverterDownloadFlow';
import { ensureConverterPackPurchase } from '@/Components/History/converterPayment';
import styles from './ConverterPricingSection.module.css';

function ConverterPricingSection() {
  const { user, setUser, setUpdatedDetails } = useContext(contextState);
  const [packs, setPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [pendingPack, setPendingPack] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        setPacks(
          areConverterSubscriptionsEnabled(info) ? getConverterPacksFromInfo(info) : [],
        );
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

  useEffect(() => {
    if (user?._id && showLogin) {
      setShowLogin(false);
    }
  }, [user?._id, showLogin]);

  const handleChoosePack = (pack) => {
    if (!pack) return;
    if (!user?._id) {
      setPendingPack(pack);
      setShowLogin(true);
      return;
    }
    setPendingPack(pack);
  };

  const closeLogin = () => {
    setShowLogin(false);
    if (typeof window !== 'undefined' && !localStorage.getItem('uuid')) {
      setPendingPack(null);
    }
  };

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
              <button
                type="button"
                className={`${styles.cta} ${pack.variant === 'solid' ? styles.ctaSolid : ''}`}
                onClick={() => handleChoosePack(pack)}
              >
                {pack.cta || `Choose ${pack.name}`}
              </button>
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

      {showLogin ? <UserLoginPupUp onClose={closeLogin} type="login" /> : null}
      {pendingPack && user?._id && !showLogin ? (
        <ConverterDownloadFlow
          mode="pack"
          pack={pendingPack}
          user={user}
          onClose={() => setPendingPack(null)}
          onPay={async (billingId) => {
            const result = await ensureConverterPackPurchase({
              packId: pendingPack.id,
              packName: pendingPack.name,
              userEmail: user?.email,
              billingId,
            });
            if (result?.credits != null) {
              setUser((prev) => ({ ...prev, converter_credits: Number(result.credits) || 0 }));
              setUpdatedDetails((value) => !value);
            }
            return result;
          }}
        />
      ) : null}
    </section>
  );
}

export default ConverterPricingSection;

"use client";

import React, { useEffect } from "react";
import PopupWrapper from "../CommonJsx/PopupWrapper";
import styles from "./ConverterCreditPlansPopup.module.css";

function ConverterCreditPlansPopup({
  packs = [],
  singlePriceLabel = "",
  onClose,
  onSelectPack,
  onSelectSingle,
}) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handlePack = (pack) => {
    if (onSelectPack) onSelectPack(pack);
    else onClose?.();
  };

  const handleSingle = () => {
    if (onSelectSingle) onSelectSingle();
    else onClose?.();
  };

  return (
    <PopupWrapper>
      <div
        className={styles.backdrop}
        onClick={onClose}
        role="presentation"
      >
        <section
          className={styles.banner}
          aria-labelledby="converter-plans-popup-heading"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close plans"
          >
            ×
          </button>

          <header className={styles.header}>
            <p className={styles.eyebrow}>Pricing</p>
            <h2 id="converter-plans-popup-heading" className={styles.heading}>
              Choose a credit pack
            </h2>
            <p className={styles.description}>
              1 credit downloads any file, any size. Credits never expire.
            </p>
          </header>

          {packs.length ? (
            <div className={styles.grid}>
              {packs.map((pack) => (
                <article
                  key={pack.id}
                  className={`${styles.card} ${pack.featured ? styles.cardFeatured : ""}`}
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
                    className={`${styles.saveBadge} ${
                      pack.save_best ? styles.saveBadgeBest : ""
                    }`}
                  >
                    {pack.save_label}
                  </span>
                  <p className={styles.copy}>{pack.description}</p>
                  <button
                    type="button"
                    className={`${styles.cta} ${
                      pack.variant === "solid" ? styles.ctaSolid : ""
                    }`}
                    onClick={() => handlePack(pack)}
                  >
                    {pack.cta}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.description}>Loading plans…</p>
          )}

          {singlePriceLabel ? (
            <p className={styles.footer}>
              Just need one?{" "}
              <button type="button" className={styles.footerLink} onClick={handleSingle}>
                Pay {singlePriceLabel} for a single download
              </button>
              {" · No subscription · Credits never expire · Invoice on every purchase"}
            </p>
          ) : null}
        </section>
      </div>
    </PopupWrapper>
  );
}

export default ConverterCreditPlansPopup;

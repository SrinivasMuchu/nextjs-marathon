"use client";

import React, { useEffect } from "react";
import PopupWrapper from "@/Components/CommonJsx/PopupWrapper";
import styles from "./TechDrawCreditCheckout.module.css";

function creditWord(n) {
  return `credit${Number(n) === 1 ? "" : "s"}`;
}

function DwgBadge() {
  return (
    <span className={styles.badge} aria-hidden="true">
      <svg viewBox="0 0 48 48" className={styles.badgeSvg}>
        <path
          d="M13 9.5h15.2L36 17.2V37a3.2 3.2 0 0 1-3.2 3.2H13A3.2 3.2 0 0 1 9.8 37V12.7A3.2 3.2 0 0 1 13 9.5z"
          fill="#fff"
          stroke="#7C3AED"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M28.2 9.8V17H35.6" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.7" strokeLinejoin="round" />
        <text x="22.8" y="32.2" textAnchor="middle" fill="#6D28D9" fontSize="8.5" fontWeight="700" fontFamily="inherit">
          DWG
        </text>
      </svg>
    </span>
  );
}

function CoinStack({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <ellipse cx="12" cy="7.2" rx="6.2" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.8 7.2v3.6c0 1.4 2.8 2.5 6.2 2.5s6.2-1.1 6.2-2.5V7.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.8 10.8v3.6c0 1.4 2.8 2.5 6.2 2.5s6.2-1.1 6.2-2.5v-3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.walletSvg} aria-hidden="true">
      <rect x="3.2" y="6.2" width="17.6" height="12.2" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.2 10h17.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.4" cy="14.2" r="1.15" fill="currentColor" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.infoSvg} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="8.3" r="0.9" fill="currentColor" />
      <path d="M12 11.2v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SparkCoins() {
  return (
    <svg viewBox="0 0 78 56" className={styles.sparkSvg} aria-hidden="true">
      <path d="M16 12l1.1 2.4 2.4 1.1-2.4 1.1L16 19l-1.1-2.4-2.4-1.1 2.4-1.1z" fill="#C4B5FD" />
      <path d="M62 8l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" fill="#DDD6FE" />
      <ellipse cx="44" cy="42" rx="16" ry="5.2" fill="#DDD6FE" />
      <path d="M28 42v-6c0-2.9 7.2-5.2 16-5.2s16 2.3 16 5.2v6" fill="#C4B5FD" />
      <ellipse cx="44" cy="36" rx="16" ry="5.2" fill="#C4B5FD" />
      <path d="M28 36v-6c0-2.9 7.2-5.2 16-5.2s16 2.3 16 5.2v6" fill="#A78BFA" />
      <ellipse cx="44" cy="30" rx="16" ry="5.2" fill="#A78BFA" />
      <ellipse cx="44" cy="30" rx="9" ry="2.2" fill="#EDE9FE" opacity="0.85" />
    </svg>
  );
}

/**
 * Drawing-only "how do you want to pay?" step, shown before the card checkout
 * when converter credits can unlock the drawing. The shared converter checkout
 * (ConverterDownloadFlow) is opened unchanged for "Pay".
 */
export default function TechDrawCreditCheckout({
  title,
  priceLabel,
  creditCost,
  credits,
  busy = false,
  error = "",
  onUseCredits,
  onPay,
  onBuyCredits,
  onClose,
}) {
  const cost = Number(creditCost) || 0;
  const balance = Number(credits) || 0;
  const enough = cost > 0 && balance >= cost;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && !busy) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  return (
    <PopupWrapper>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="techdraw-pay-title">
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
          disabled={busy}
        >
          ×
        </button>

        <div className={styles.header}>
          <DwgBadge />
          <div className={styles.heading}>
            <h2 id="techdraw-pay-title">Download your drawing set</h2>
            <p>{title || "2D technical drawing"}</p>
          </div>
        </div>

        {enough ? (
          <button type="button" className={styles.creditButton} onClick={onUseCredits} disabled={busy}>
            <span className={styles.coinBadge}>
              <CoinStack className={styles.coinSvg} />
            </span>
            <span>
              {busy
                ? "Using credits…"
                : `Use ${cost} ${creditWord(cost)} (you have ${balance})`}
            </span>
            <span className={styles.buttonArrow} aria-hidden="true">→</span>
          </button>
        ) : (
          <button type="button" className={styles.creditButton} onClick={onBuyCredits} disabled={busy}>
            <span className={styles.coinBadge}>
              <CoinStack className={styles.coinSvg} />
            </span>
            <span>{busy ? "Please wait…" : "Buy credits"}</span>
            <span className={styles.buttonArrow} aria-hidden="true">→</span>
          </button>
        )}

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.divider}><span>or</span></div>

        <button type="button" className={styles.payRow} onClick={onPay} disabled={busy}>
          <span className={styles.payIcon}>
            <WalletIcon />
          </span>
          <span className={styles.payCopy}>
            <strong>{`Pay ${priceLabel}`}</strong>
            <span>One-time payment</span>
          </span>
          <span className={styles.chevron} aria-hidden="true">›</span>
        </button>

        <div className={styles.note}>
          <span className={styles.infoIcon}>
            <InfoIcon />
          </span>
          <p>
            {enough
              ? "Re-downloading this drawing is free."
              : `Needs ${cost} ${creditWord(cost)} — you have ${balance}. Re-downloading this drawing is free.`}
          </p>
          <SparkCoins />
        </div>

        <p className={styles.trust}>
          <svg viewBox="0 0 24 24" className={styles.shieldSvg} aria-hidden="true">
            <path
              d="M12 3.2l7 2.4v6.1c0 4.2-2.8 7.2-7 8.9-4.2-1.7-7-4.7-7-8.9V5.6l7-2.4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M9.2 12.1l1.9 1.9 3.8-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Secure payment • Instant access
        </p>
      </div>
    </PopupWrapper>
  );
}

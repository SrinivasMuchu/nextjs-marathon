"use client";

import React, { useEffect } from "react";
import PopupWrapper from "@/Components/CommonJsx/PopupWrapper";
import flowStyles from "@/Components/History/ConverterDownloadFlow.module.css";
import styles from "./TechDrawCreditCheckout.module.css";

function creditWord(n) {
  return `credit${Number(n) === 1 ? "" : "s"}`;
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
      <div className={flowStyles.modal} role="dialog" aria-modal="true">
        <button
          type="button"
          className={flowStyles.closeButton}
          onClick={onClose}
          aria-label="Close"
          disabled={busy}
        >
          ×
        </button>
        <h2>Download your drawing set</h2>
        <p className={flowStyles.subtitle}>{title || "2D technical drawing"}</p>

        {enough ? (
          <button
            type="button"
            className={flowStyles.primaryButton}
            onClick={onUseCredits}
            disabled={busy}
          >
            {busy
              ? "Using credits…"
              : `Use ${cost} ${creditWord(cost)} (you have ${balance}) →`}
          </button>
        ) : (
          <div className={styles.creditNote}>
            <p>
              {balance > 0
                ? `Needs ${cost} ${creditWord(cost)} — you have ${balance}.`
                : `Or use ${cost} converter ${creditWord(cost)} instead of paying each time.`}
            </p>
            <button
              type="button"
              className={flowStyles.secondaryButton}
              onClick={onBuyCredits}
              disabled={busy}
            >
              Buy credits
            </button>
          </div>
        )}

        {error ? <p className={flowStyles.error}>{error}</p> : null}

        {enough ? <div className={styles.divider}><span>or</span></div> : null}

        <button
          type="button"
          className={enough ? flowStyles.secondaryButton : flowStyles.primaryButton}
          onClick={onPay}
          disabled={busy}
        >
          {`Pay ${priceLabel}`}
        </button>

        {enough ? (
          <p className={styles.footnote}>
            Credits come from your converter balance. Re-downloading this drawing is free.
          </p>
        ) : null}
      </div>
    </PopupWrapper>
  );
}

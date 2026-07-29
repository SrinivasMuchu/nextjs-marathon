"use client";

import React, { useMemo } from "react";
import HomeTopNav from "@/Components/HomePages/HomepageTopNav/HomeTopNav";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";
import ConverterFunnelStepper from "./ConverterFunnelStepper";
import ConverterNotifyBanner from "./ConverterNotifyBanner";
import styles from "./ConverterFunnel.module.css";

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return "—";
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function ConverterPayStep({
  job,
  fileName,
  pricing,
  userEmail,
  onPay,
  paying = false,
}) {
  const pricingDisplay = useMemo(
    () => buildConverterPricingDisplay(pricing),
    [pricing],
  );
  const outFmt = String(job?.output_format || "stl").toUpperCase();
  const inFmt = String(job?.input_format || "STEP").toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <HomeTopNav />
      <main className={styles.page}>
        <div className={styles.shell}>
          <h1 className={styles.title}>Pay to unlock your download</h1>
          <p className={styles.subtitle}>
            Converted file and report are held for 24 hours.
          </p>
          <ConverterFunnelStepper currentStep="pay" />
          <ConverterNotifyBanner email={userEmail} />

          <section className={styles.card} style={{ maxWidth: 480, margin: "0 auto" }}>
            <h2 className={styles.sectionTitle}>Order summary</h2>
            <div className={styles.orderRows}>
              <div className={styles.orderRow}>
                <span>
                  {inFmt} → {outFmt} conversion
                </span>
                <strong>{pricingDisplay.baseLabel}</strong>
              </div>
              <div className={styles.orderRow}>
                <span>File</span>
                <strong>{fileName || job?.file_name || "—"}</strong>
              </div>
              <div className={styles.orderRow}>
                <span>Output</span>
                <strong>
                  {formatFileSize(job?.output_file_size_bytes)} {outFmt}
                </strong>
              </div>
              <div className={styles.orderRow}>
                <span>Mesh report</span>
                <strong>Included</strong>
              </div>
              <div className={styles.orderRow}>
                <span>Tax</span>
                <strong>Calculated by provider</strong>
              </div>
              <div className={`${styles.orderRow} ${styles.orderTotal}`}>
                <span>Total</span>
                <strong>{pricingDisplay.totalLabel}</strong>
              </div>
            </div>

            <p className={styles.taxNote}>
              The payment provider must show the final local-currency amount and any
              applicable tax before confirmation.
            </p>

            <button
              type="button"
              className={styles.primaryBtn}
              style={{ width: "100%" }}
              onClick={onPay}
              disabled={paying}
            >
              {paying ? "Opening payment…" : `Pay ${pricingDisplay.totalLabel}`}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ConverterPayStep;

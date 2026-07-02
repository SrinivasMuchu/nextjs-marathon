"use client";

import React from "react";
import cadStyles from "../CadHomeDesign/CadHome.module.css";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";

function ConverterPricingBadge({ isFree, pricing, variant = "dark" }) {
  if (isFree) {
    return (
      <span
        className={`${cadStyles["cad-conversion-price-badge"]} ${cadStyles["cad-conversion-price-badge--free"]}`}
      >
        Free
      </span>
    );
  }

  const display = buildConverterPricingDisplay(pricing);
  return (
    <span
      className={`${cadStyles["cad-conversion-price-total"]} ${
        variant === "dark" ? cadStyles["cad-conversion-price-breakdown--dark"] : ""
      }`}
    >
      {display.totalLabel}
    </span>
  );
}

function ConverterPricingBanner({ isFree, pricing, isSampleFile }) {
  const display = buildConverterPricingDisplay(pricing);

  if (isSampleFile) {
    return (
      <div className={`${cadStyles["cad-conversion-banner"]} ${cadStyles["cad-conversion-banner--free"]}`}>
        <span className={cadStyles["cad-conversion-banner-icon"]} aria-hidden>🎁</span>
        <span>Sample file — convert and download free, no payment needed.</span>
      </div>
    );
  }

  if (isFree) {
    return (
      <div className={`${cadStyles["cad-conversion-banner"]} ${cadStyles["cad-conversion-banner--free"]}`}>
        <span className={cadStyles["cad-conversion-banner-icon"]} aria-hidden>🎁</span>
        <span>This is your free conversion — nothing to pay.</span>
      </div>
    );
  }

  return (
    <div className={`${cadStyles["cad-conversion-banner"]} ${cadStyles["cad-conversion-banner--paid"]}`}>
      <span className={cadStyles["cad-conversion-banner-icon"]} aria-hidden>ℹ️</span>
      <span>
        You&apos;ve used your free conversion. This one is{" "}
        <strong>{display.totalLabel}</strong>.
      </span>
    </div>
  );
}

export { ConverterPricingBadge, ConverterPricingBanner };

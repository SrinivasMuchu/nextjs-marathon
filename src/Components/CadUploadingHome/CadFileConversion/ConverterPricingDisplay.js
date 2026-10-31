"use client";

import React from "react";
import cadStyles from "../CadHomeDesign/CadHome.module.css";
import heroStyles from "../CadHomeDesign/CadViewerHero.module.css";
import {
  buildConverterPricingDisplay,
  getFreeConversionUseText,
  getPaidConversionReasonText,
} from "@/lib/converterPricing";

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

function ConverterPricingBanner({ isFree, pricing, isSampleFile, variant, pricingInfo }) {
  const display = buildConverterPricingDisplay(pricing);
  const bannerClass = variant === "converterHero"
    ? `${heroStyles.converterPriceBanner} ${
        isFree || isSampleFile
          ? heroStyles.converterPriceBannerFree
          : heroStyles.converterPriceBannerPaid
      }`
    : `${cadStyles["cad-conversion-banner"]} ${
        isFree || isSampleFile
          ? cadStyles["cad-conversion-banner--free"]
          : cadStyles["cad-conversion-banner--paid"]
      }`;

  if (isSampleFile) {
    return (
      <div className={bannerClass}>
        <span className={cadStyles["cad-conversion-banner-icon"]} aria-hidden>🎁</span>
        <span>Sample file — convert and download free, no payment needed.</span>
      </div>
    );
  }

  if (isFree) {
    return (
      <div className={bannerClass}>
        <span className={cadStyles["cad-conversion-banner-icon"]} aria-hidden>🎁</span>
        <span>{getFreeConversionUseText(pricingInfo)}</span>
      </div>
    );
  }

  return (
    <div className={bannerClass}>
      <span className={cadStyles["cad-conversion-banner-icon"]} aria-hidden>ℹ️</span>
      <span>
        {getPaidConversionReasonText(pricingInfo)}{" "}
        <strong>{display.totalLabel}</strong> (incl. tax) or 1 credit, charged only when you click Download.
      </span>
    </div>
  );
}

export { ConverterPricingBadge, ConverterPricingBanner };

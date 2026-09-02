"use client";

import { useEffect, useState } from "react";
import { getTwoDLibraryPricingInfo } from "@/api/twoDLibraryPaymentApi";
import styles from "./TwoDTechnicalDrawingHero.module.css";

/**
 * Shows GST-inclusive library download price from admin controls.
 * Pass `version` for techdraw-v2 designs so the versioned price is used.
 */
export default function TwoDLibraryPriceChip({ version = false }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    let cancelled = false;
    getTwoDLibraryPricingInfo()
      .then((info) => {
        if (cancelled) return;
        const priced = version
          ? info?.version_pricing?.price_label || info?.version_pricing?.price
          : info?.legacy_pricing?.price_label || info?.price_label || info?.price;
        if (priced == null) return;
        const next =
          typeof priced === "number"
            ? `$${Number(priced).toFixed(2)}`
            : String(priced);
        setLabel(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [version]);

  if (!label) return null;

  const isFree = String(label).toLowerCase().includes("free");
  return (
    <span className={`${styles.chip} ${isFree ? styles.chipFree : styles.chipAi}`}>
      {label}
    </span>
  );
}

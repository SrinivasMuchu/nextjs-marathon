"use client";

import { useEffect, useState } from "react";
import { getTwoDLibraryPricingInfo } from "@/api/twoDLibraryPaymentApi";
import styles from "./TwoDTechnicalDrawingHero.module.css";

export default function TwoDLibraryPriceChip() {
  const [label, setLabel] = useState("$3.00");

  useEffect(() => {
    let cancelled = false;
    getTwoDLibraryPricingInfo()
      .then((info) => {
        if (cancelled) return;
        setLabel(info?.price_label || "$3.00");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const isFree = String(label).toLowerCase().includes("free");
  return (
    <span className={`${styles.chip} ${isFree ? styles.chipFree : styles.chipAi}`}>
      {label}
    </span>
  );
}

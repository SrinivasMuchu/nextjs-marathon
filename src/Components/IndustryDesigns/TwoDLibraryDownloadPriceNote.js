"use client";

import { useEffect, useState } from "react";
import { getTwoDLibraryPricingInfo } from "@/api/twoDLibraryPaymentApi";
import styles from "./TwoDDrawingRightSidebar.module.css";

/** GST-inclusive download price under the sidebar download card title. */
export default function TwoDLibraryDownloadPriceNote({ version = false }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    let cancelled = false;
    getTwoDLibraryPricingInfo()
      .then((info) => {
        if (cancelled) return;
        const priced = version
          ? info?.version_pricing?.price_label
          : info?.legacy_pricing?.price_label || info?.price_label;
        if (priced) setLabel(String(priced));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [version]);

  if (!label) return null;

  return (
    <p className={styles.downloadPriceNote}>
      Drawing set download · <strong>{label}</strong>
      <span className={styles.downloadPriceHint}> incl. GST</span>
    </p>
  );
}

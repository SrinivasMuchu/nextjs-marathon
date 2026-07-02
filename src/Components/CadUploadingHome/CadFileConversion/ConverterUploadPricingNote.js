"use client";

import React, { useEffect, useState } from "react";
import heroStyles from "../CadHomeDesign/CadViewerHero.module.css";
import {
  buildConverterPricingDisplay,
  fetchConverterPricingInfo,
} from "@/lib/converterPricing";

function ConverterUploadPricingNote() {
  const [totalLabel, setTotalLabel] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const info = await fetchConverterPricingInfo();
        if (cancelled) return;
        const display = buildConverterPricingDisplay(info?.pricing);
        setTotalLabel(display.totalLabel);
      } catch {
        if (!cancelled) setTotalLabel("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <p className={heroStyles.heroUploadPricingNote}>
      Your first conversion is on us.
      {totalLabel ? (
        <>
          {" "}
          After that, it&apos;s <strong>{totalLabel}</strong> per conversion — new file or re-run.
        </>
      ) : (
        <> After that, a small fee applies per conversion — new file or re-run.</>
      )}
    </p>
  );
}

export default ConverterUploadPricingNote;

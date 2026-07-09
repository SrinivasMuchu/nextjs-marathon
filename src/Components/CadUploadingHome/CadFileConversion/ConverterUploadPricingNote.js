"use client";

import React, { useEffect, useState } from "react";
import heroStyles from "../CadHomeDesign/CadViewerHero.module.css";
import {
  buildConverterPricingDisplay,
  CONVERTER_FREE_SIZE_LIMIT_MB,
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
      Files under {CONVERTER_FREE_SIZE_LIMIT_MB} MB convert and download free.
      {totalLabel ? (
        <>
          {" "}
          Larger files are <strong>{totalLabel}</strong> per conversion — new file or re-run.
        </>
      ) : (
        <> Larger files require a small fee per conversion — new file or re-run.</>
      )}
    </p>
  );
}

export default ConverterUploadPricingNote;

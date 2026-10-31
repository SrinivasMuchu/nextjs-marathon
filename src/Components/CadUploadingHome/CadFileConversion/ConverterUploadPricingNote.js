"use client";

import React, { useEffect, useState } from "react";
import heroStyles from "../CadHomeDesign/CadViewerHero.module.css";
import {
  buildConverterPricingDisplay,
  getConverterFreePlanSummary,
  fetchConverterPricingInfo,
  getFreeConversionsStatusText,
} from "@/lib/converterPricing";

function ConverterUploadPricingNote() {
  const [totalLabel, setTotalLabel] = useState("");
  const [freeConversionsStatus, setFreeConversionsStatus] = useState("");
  const [freePlanSummary, setFreePlanSummary] = useState(getConverterFreePlanSummary(null));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const info = await fetchConverterPricingInfo();
        if (cancelled) return;
        const display = buildConverterPricingDisplay(info?.pricing);
        setTotalLabel(display.totalLabel);
        setFreeConversionsStatus(getFreeConversionsStatusText(info));
        setFreePlanSummary(getConverterFreePlanSummary(info));
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
      {freePlanSummary}
      {totalLabel ? (
        <>
          {" "}
          A single paid download is <strong>{totalLabel}</strong> or 1 credit — new file or re-run.
        </>
      ) : (
        <> After that, each download needs a small fee or 1 credit — new file or re-run.</>
      )}
      {freeConversionsStatus ? <> <strong>{freeConversionsStatus}</strong></> : null}
    </p>
  );
}

export default ConverterUploadPricingNote;

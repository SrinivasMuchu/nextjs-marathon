"use client";

import React, { useCallback } from "react";
import { getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import styles from "./CadDrawingPipeline.module.css";

export default function CadDrawingPipelineFinalCta() {
  const prices = getTechDrawPriceDisplay();
  const priceLabel = prices.baseLabel;

  const scrollToUpload = useCallback(() => {
    const el = document.getElementById("cad-pipeline-upload");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section className={styles.finalCta} aria-labelledby="cad-pipeline-final-cta-title">
      <h2 id="cad-pipeline-final-cta-title" className={styles.finalCtaTitle}>
        Stop Waiting for Drawings.
      </h2>
      <p className={styles.finalCtaDesc}>
        Upload your CAD file now. Get a complete drawing set in 4 minutes for {priceLabel}.
      </p>
      <button type="button" className={styles.finalCtaButton} onClick={scrollToUpload}>
        <span aria-hidden>⚡</span>
        Start Generating — {priceLabel}
      </button>
    </section>
  );
}

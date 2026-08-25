"use client";

import React, { useCallback } from "react";
import useTechDrawPriceDisplay from "./useTechDrawPriceDisplay";
import styles from "./CadDrawingPipeline.module.css";

export default function CadDrawingPipelineFinalCta({ initialPrices }) {
  const { baseLabel, perSetLabel } = useTechDrawPriceDisplay(initialPrices);

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
        Upload your CAD file now. Get a complete drawing set in 4 minutes for {baseLabel} ({perSetLabel}).
      </p>
      <button type="button" className={styles.finalCtaButton} onClick={scrollToUpload}>
        <span aria-hidden>⚡</span>
        Generate my 2D drawing — {baseLabel}
      </button>
    </section>
  );
}

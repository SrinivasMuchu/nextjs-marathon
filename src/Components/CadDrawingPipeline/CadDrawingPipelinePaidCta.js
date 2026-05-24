"use client";

import React, { useCallback } from "react";
import { getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import styles from "./CadDrawingPipeline.module.css";

const BENEFITS = [
  {
    title: "Up to 9 drawing sheets",
    detail: "front, top, side, isometric, section views, detail views, and BOM",
  },
  {
    title: "4 export formats",
    detail: "PDF, SVG, DXF, and high-resolution PNG all included",
  },
  {
    title: "Auto-dimensioning",
    detail: "AI places critical dimensions automatically on every view",
  },
  {
    title: "Bill of Materials",
    detail: "components, quantities, and materials extracted from your assembly",
  },
  {
    title: "Section & detail views",
    detail: "AI selects the most informative section planes for your geometry",
  },
  {
    title: "Any CAD format",
    detail: "STEP, IGES, FreeCAD, and more accepted",
  },
];

export default function CadDrawingPipelinePaidCta() {
  const prices = getTechDrawPriceDisplay();
  const priceShort = `$${Math.floor(prices.base)}`;

  const scrollToUpload = useCallback(() => {
    const el = document.getElementById("cad-pipeline-upload");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section className={styles.paidCta} aria-labelledby="cad-pipeline-paid-title">
      <p className={styles.paidCtaLabel}>Paid pipeline</p>
      <h2 id="cad-pipeline-paid-title" className={styles.paidCtaHeading}>
        Ready to Generate Your Own?
      </h2>

      <div className={styles.paidCtaCard}>
        <div className={styles.paidCtaLeft}>
          <p className={styles.paidCtaPrice}>
            <span className={styles.paidCtaPriceAmount}>{priceShort}</span>
            <span className={styles.paidCtaPriceUnit}>/ drawing set</span>
          </p>
          <h3 className={styles.paidCtaProductTitle}>2D Technical Drawing Pipeline</h3>
          <p className={styles.paidCtaProductDesc}>
            Upload your 3D CAD file and receive a complete set of production-ready 2D engineering
            drawings in under 4 minutes. No CAD expertise required.
          </p>
          <p className={styles.paidCtaReadyBadge}>
            <span aria-hidden>⏱</span> Ready in under 4 minutes
          </p>
        </div>

        <div className={styles.paidCtaRight}>
          <h3 className={styles.paidCtaBenefitsTitle}>What you get</h3>
          <ul className={styles.paidCtaBenefits}>
            {BENEFITS.map((item) => (
              <li key={item.title} className={styles.paidCtaBenefit}>
                <span className={styles.paidCtaCheck} aria-hidden>
                  ✓
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <span className={styles.paidCtaBenefitDash}> — </span>
                  {item.detail}
                </span>
              </li>
            ))}
          </ul>

          <button type="button" className={styles.paidCtaButton} onClick={scrollToUpload}>
            <span aria-hidden>📁</span>
            Upload Your CAD File — {priceShort}
          </button>
          <p className={styles.paidCtaFootnote}>
            Secure upload · Results in &lt;4 min · No subscription required
          </p>
        </div>
      </div>
    </section>
  );
}

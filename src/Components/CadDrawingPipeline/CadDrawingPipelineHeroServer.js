import React from "react";
import Link from "next/link";
import { getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import { CAD_DRAWING_PIPELINE_H1, CAD_DRAWING_PIPELINE_HERO_COPY } from "@/data/cadDrawingPipelinePage";
import styles from "./CadDrawingPipeline.module.css";

const HERO_STATS = [
  { value: "15k+", label: "CAD files processed", accent: false },
  { value: "9 sheets", label: "Per drawing set", accent: true },
  { value: "4 min", label: "Average processing time", accent: true },
  { value: null, label: "Per drawing set", accent: true, priceKey: true },
  { value: "4 formats", label: "PDF · SVG · DXF · PNG", accent: true },
];

export default function CadDrawingPipelineHeroServer() {
  const prices = getTechDrawPriceDisplay();

  return (
    <section className={styles.hero} aria-labelledby="cad-pipeline-hero-title">
      <div className={styles.heroInner}>
        <p className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} aria-hidden />
          AI-generated technical drawings
        </p>

        <h1 id="cad-pipeline-hero-title" className={styles.heroTitle}>
          {CAD_DRAWING_PIPELINE_H1}
        </h1>

        <p className={styles.heroDesc}>{CAD_DRAWING_PIPELINE_HERO_COPY}</p>

        <div className={styles.heroActions}>
          <Link href="#cad-pipeline-upload" className={styles.heroCtaPrimary}>
            <span aria-hidden>⚡</span>
            Generate 2D Drawings — {prices.baseLabel}
          </Link>
          <Link href="/library/2d-technical-drawings" className={styles.heroCtaSecondary}>
            Browse Library
          </Link>
        </div>

        <div className={styles.heroStats} role="list">
          {HERO_STATS.map((stat) => (
            <div key={`${stat.label}-${stat.value ?? "price"}`} className={styles.heroStat} role="listitem">
              <div className={stat.accent ? styles.heroStatValueAccent : styles.heroStatValue}>
                {stat.priceKey ? prices.baseLabel : stat.value}
              </div>
              <div className={styles.heroStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

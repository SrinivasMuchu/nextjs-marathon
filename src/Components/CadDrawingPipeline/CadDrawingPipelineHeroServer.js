import React from "react";
import Link from "next/link";
import { getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import { PIPELINE_H1, PIPELINE_HERO_COPY } from "@/data/cadDrawingPipelinePage";
import styles from "./CadDrawingPipeline.module.css";

export default function CadDrawingPipelineHeroServer() {
  const { baseLabel, perSetLabel } = getTechDrawPriceDisplay();
  const heroStats = [
    { value: "9 sheets", label: "Per drawing set", accent: true },
    { value: "4 min", label: "Average processing time", accent: true },
    { value: baseLabel, label: "Per drawing set", accent: true },
    { value: "4 formats", label: "PDF · SVG · DXF · PNG", accent: true },
  ];

  return (
    <section className={styles.hero} aria-labelledby="cad-pipeline-hero-title">
      <div className={styles.heroInner}>
        <p className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} aria-hidden />
          AI-generated technical drawings
        </p>

        <h1 id="cad-pipeline-hero-title" className={styles.heroTitle}>
          {PIPELINE_H1}
        </h1>

        <p className={styles.heroDesc}>{PIPELINE_HERO_COPY}</p>

        <div className={styles.heroActions}>
          <Link href="#cad-pipeline-upload" className={styles.heroCtaPrimary}>
            <span aria-hidden>⚡</span>
            Generate My Drawing — {baseLabel}
          </Link>
          <Link href="/library/2d-technical-drawings" className={styles.heroCtaSecondary}>
            Browse 2D technical drawings
          </Link>
        </div>

        <p className={styles.heroPriceNote}>{perSetLabel}</p>

        <div className={styles.heroStats} role="list">
          {heroStats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className={styles.heroStat} role="listitem">
              <div className={stat.accent ? styles.heroStatValueAccent : styles.heroStatValue}>
                {stat.value}
              </div>
              <div className={styles.heroStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

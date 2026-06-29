"use client";

import React from "react";
import Link from "next/link";
import { getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import styles from "./CadDrawingPipeline.module.css";

const HERO_STATS = [
  { value: "15k+", label: "CAD files processed", accent: false },
  { value: "9 sheets", label: "Per drawing set", accent: true },
  { value: "4 min", label: "Average processing time", accent: true },
  { value: null, label: "Per drawing set", accent: true, priceKey: true },
  { value: "4 formats", label: "PDF · SVG · DXF · PNG", accent: true },
];

export default function CadDrawingPipelineHero({
  priceShort = getTechDrawPriceDisplay().baseLabel,
  ctaLabel,
  onGenerateClick,
}) {
  const generateLabel = ctaLabel || `Generate My Drawing — ${priceShort}`;

  return (
    <section className={styles.hero} aria-labelledby="cad-pipeline-hero-title">
      <div className={styles.heroInner}>
        <p className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} aria-hidden />
          AI-generated technical drawings
        </p>

        <h1 id="cad-pipeline-hero-title" className={styles.heroTitle}>
          <span className={styles.heroTitleLine}>15,000+ CAD Files.</span>
          <span className={styles.heroTitleAccent}>Instant 2D Technical Drawings.</span>
        </h1>

        <p className={styles.heroDesc}>
          Browse our library of AI-generated engineering drawings — multi-view orthographic
          sheets, dimensioned views, section cuts, and editable FCStd files, all produced
          automatically from 3D CAD.
        </p>

        <div className={styles.heroActions}>
          <button type="button" className={styles.heroCtaPrimary} onClick={onGenerateClick}>
            <span aria-hidden>⚡</span>
            {generateLabel}
          </button>
          <Link href="/library/2d-technical-drawings" className={styles.heroCtaSecondary}>
            Browse Library
          </Link>
        </div>

        <div className={styles.heroStats} role="list">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.priceKey ? "price-stat" : stat.value}
              className={styles.heroStat}
              role="listitem"
            >
              <div
                className={
                  stat.accent ? styles.heroStatValueAccent : styles.heroStatValue
                }
              >
                {stat.priceKey ? priceShort : stat.value}
              </div>
              <div className={styles.heroStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Check, CircleDollarSign, FileOutput, RefreshCw } from "lucide-react";
import styles from "./ConversionPricingPanel.module.css";

const FOOTNOTES = [
  "Invoice on every purchase",
  "Credits never expire",
  "Secure checkout",
];

function ConversionPricingPanel({
  packs = [],
  singlePriceLabel = "",
  drawingPriceLabel = "",
  onChoosePack,
}) {
  if (!packs.length) return null;

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.outer}>
        <div className={styles.shell}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>
          <CircleDollarSign size={14} aria-hidden="true" />
          SIMPLE CONVERSION PRICING
        </p>
        <h2 className={styles.title}>Choose a credit pack.</h2>
        <p className={styles.lead}>
          One credit downloads one standard format conversion, up to 300 MB. Credits never
          expire.
        </p>
      </header>

      <div className={styles.packGrid}>
        {packs.map((pack) => (
          <article
            key={pack.id}
            className={`${styles.pack} ${pack.featured ? styles.packFeatured : ""}`}
          >
            {pack.featured ? <span className={styles.popularPill}>★ MOST POPULAR</span> : null}
            <span className={styles.packName}>{pack.name}</span>
            <div className={styles.packCredits}>
              <strong>{pack.credits}</strong>
              <span>credits</span>
            </div>
            <div className={styles.packPrice}>
              <strong>{pack.price_label}</strong>
              <span>{pack.per_credit_label}</span>
            </div>
            <span
              className={`${styles.savingPill} ${pack.save_best ? styles.savingPillBest : ""}`}
            >
              {pack.save_label}
            </span>
            <p>{pack.description}</p>
            <button
              type="button"
              className={`${styles.packButton} ${pack.featured ? styles.packButtonFeatured : ""}`}
              onClick={() => onChoosePack?.(pack)}
            >
              {pack.cta || `Choose ${pack.name}`}
            </button>
          </article>
        ))}
      </div>

      <div className={styles.directHead}>
        <span>PAY FOR ONE RESULT</span>
        <strong>No subscription. No expiring balance.</strong>
      </div>

      <div className={styles.directGrid}>
        <Link className={styles.directCard} href="/tools/3d-cad-file-converter">
          <span className={styles.directIcon}>
            <RefreshCw size={20} aria-hidden="true" />
          </span>
          <div>
            <small>ONE STANDARD FORMAT CONVERSION</small>
            <h3>Any supported route, one download</h3>
            <p>Use STEP to STL, STL to STEP and more than 60 specialist tools.</p>
          </div>
          <span className={styles.directPrice}>
            <strong>{singlePriceLabel}</strong>
            <small>single download</small>
          </span>
          <ArrowRight size={18} className={styles.directArrow} aria-hidden="true" />
        </Link>

        <Link className={`${styles.directCard} ${styles.directCardDrawing}`} href="/tools/cad-drawing-pipeline">
          <span className={styles.directIcon}>
            <FileOutput size={20} aria-hidden="true" />
          </span>
          <div>
            <small>STEP OR STP TO 2D</small>
            <h3>Multi-view technical drawing set</h3>
            <p>Create 2D outputs in PDF, SVG, DXF or PNG from a 3D model.</p>
          </div>
          <span className={styles.directPrice}>
            <strong>{drawingPriceLabel}</strong>
            <small>per drawing set</small>
          </span>
          <ArrowRight size={18} className={styles.directArrow} aria-hidden="true" />
        </Link>
      </div>

      <p className={styles.footnote}>
        {FOOTNOTES.map((item, index) => (
          <span key={item}>
            {index > 0 ? <span className={styles.footnoteDot}>·</span> : null}
            <Check size={14} aria-hidden="true" />
            {item}
          </span>
        ))}
      </p>
        </div>
      </div>
    </section>
  );
}

export default ConversionPricingPanel;

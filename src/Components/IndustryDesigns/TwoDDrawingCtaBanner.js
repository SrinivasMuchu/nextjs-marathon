"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchTechDrawPriceDisplay,
  getTechDrawPriceDisplay,
} from "@/api/cadDrawingPipelineApi";
import TwoDDrawingCtaBannerButton from "./TwoDDrawingCtaBannerButton";
import styles from "./TwoDDrawingCtaBanner.module.css";

const defaultChecks = [
  "Ready in under 4 minutes",
  "9 sheets · editable FCStd + PDF, SVG, DXF",
  "No subscription · pay per file",
];

/**
 * Server shell + client upload button only. Responsive: stacks on narrow viewports; CTA row wraps.
 * Price comes from admin `techdraw_upload_price`.
 */
export default function TwoDDrawingCtaBanner({
  generateHref = "/tools/cad-drawing-pipeline",
  secondaryHref = "",
  title = "Have your own 3D CAD file?",
  description = "Upload a STEP, STP, IGES or FreeCAD file and generate a 2D drawing set with PDF, SVG and DXF outputs.",
  buttonLabel = "Generate my 2D drawing",
  secondaryButtonLabel = "View existing 2D drawings",
  priceSubtext = "per drawing set",
  turnaround = "4 min",
  turnaroundLabel = "avg. turnaround",
  checks = defaultChecks,
}) {
  const [prices, setPrices] = useState(() => getTechDrawPriceDisplay());

  useEffect(() => {
    let cancelled = false;
    fetchTechDrawPriceDisplay().then((next) => {
      if (!cancelled) setPrices(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const eyebrow = `Paid Pipeline · ${prices.perSetLabel}`;

  return (
    <section className={styles.banner} aria-labelledby="two-d-cta-heading">
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="two-d-cta-heading" className={styles.title}>
            {title}
          </h2>
          <p className={styles.desc}>{description}</p>
          <div className={styles.ctaRow}>
            <div className={styles.ctaButtons}>
              <TwoDDrawingCtaBannerButton href={generateHref}>
                {buttonLabel}
              </TwoDDrawingCtaBannerButton>
              {secondaryHref ? (
                <Link href={secondaryHref} className={styles.btnOutline}>
                  {secondaryButtonLabel}
                </Link>
              ) : null}
            </div>
            <ul className={styles.checks}>
              {checks.map((line) => (
                <li key={line}>✓ {line}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.priceBig}>{prices.totalLabel}</div>
          <div className={styles.priceSub}>{priceSubtext} incl. GST</div>
          <div className={styles.timeBadge}>
            <div className={styles.timeVal}>{turnaround}</div>
            <div className={styles.timeKey}>{turnaroundLabel}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

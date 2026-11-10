"use client";

import Link from "next/link";
import { useCallback } from "react";
import useTechDrawPriceDisplay from "./useTechDrawPriceDisplay";
import styles from "./CadDrawingPipeline.module.css";

export default function CadDrawingPipelineCompare({ initialPrices }) {
  const { totalLabel } = useTechDrawPriceDisplay(initialPrices);
  const price = totalLabel || "";

  const rows = [
    ["Views and sections", "good", "Standard views and sections", "good", "Chosen for the part, with details"],
    ["Dimensions", "good", "Overall and main features", "good", "Every manufacturing dimension, from datums"],
    ["Tolerances and fits", "bad", "Not added", "good", "Yes"],
    ["GD&T", "bad", "Not added", "good", "Yes"],
    ["Threads, finish, material notes", "bad", "Not added", "good", "Yes"],
    ["Turnaround", "plain", "Usually minutes", "plain", "Usually a few days"],
    ["Price", "plain", price ? `${price} per set` : "", "plain", "Quoted per part"],
    [
      "Best for",
      "plain",
      "Quotes, reference, documentation, simple fabrication, a starting point to edit",
      "plain",
      "Machined parts, inspection, supplier contracts",
    ],
  ];

  const scrollToUpload = useCallback(() => {
    document.getElementById("cad-pipeline-upload")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <section className={styles.compareBand} aria-labelledby="cad-pipeline-compare-title">
      <div className={styles.compareInner}>
        <p className={styles.pricingEyebrow}>Set expectations</p>
        <h2 id="cad-pipeline-compare-title" className={styles.compareTitle}>
          Automated drawings vs production drawings
        </h2>
        <p className={styles.compareLede}>
          An automated drawing describes the geometry exactly. A production drawing also describes
          what matters about it: which sizes are critical, how much they may vary, and how the part
          should be finished. Know which one you need before you send it to a machinist.
        </p>

        <div className={styles.compareTableWrap}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">
                  <span className={styles.compareAutoHead}>Automated drawing set (this tool)</span>
                </th>
                <th scope="col" className={styles.compareProdHead}>
                  Production drawing (drafted)
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, autoTone, auto, prodTone, prod]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td className={styles[`compare${autoTone[0].toUpperCase()}${autoTone.slice(1)}`]}>{auto}</td>
                  <td className={styles[`compare${prodTone[0].toUpperCase()}${prodTone.slice(1)}`]}>{prod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.compareActions}>
          <button type="button" className={styles.comparePrimary} onClick={scrollToUpload}>
            Generate a drawing set
          </button>
          <Link className={styles.compareOutline} href="/cad-services">
            Get a production drawing
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { TwoDDrawingReportBody } from "./TwoDDrawingReportBody";
import sheetStyles from "./TwoDDrawingSheetDownloads.module.css";
import styles from "./TwoDDrawingDetailsModal.module.css";

/**
 * Inline cover + review report between sheet downloads and the paid CTA.
 * Intended for versioned (techdraw-v2) library designs only.
 */
export default function TwoDDrawingReportSection({ details }) {
  if (!details?.sheetIndex?.length && !details?.coverTitle) return null;

  return (
    <section
      id="drawing-report"
      className={sheetStyles.section}
      aria-labelledby="drawing-report-heading"
    >
      <p className={sheetStyles.eyebrow}>Drawing report</p>
      <h2 id="drawing-report-heading" className={sheetStyles.title}>
        Drawing details &amp; review
      </h2>
      <p className={sheetStyles.desc}>
        Cover summary and review report for this versioned drawing set.
      </p>
      <div className={styles.inlineReportCard}>
        <TwoDDrawingReportBody details={details} />
      </div>
    </section>
  );
}

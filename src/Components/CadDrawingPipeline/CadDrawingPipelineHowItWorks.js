"use client";

import React from "react";
import FallbackImageClient from "@/Components/CommonJsx/FallbackImageClient";
import { techdrawFileApiUrl } from "@/lib/techDraw/techdrawFileApi";
import { PIPELINE_HOW_IT_WORKS_COPY } from "@/data/cadDrawingPipelinePage";
import {
  PIPELINE_DEMO_3D_SPRITE_URL,
  PIPELINE_DEMO_DESIGN_ID,
} from "./pipelineConstants";
import styles from "./CadDrawingPipeline.module.css";

const demo2dSvgUrl = techdrawFileApiUrl(PIPELINE_DEMO_DESIGN_ID, {
  sheet: 1,
  ext: "svg",
});

export default function CadDrawingPipelineHowItWorks() {
  return (
    <section className={styles.howItWorks} aria-labelledby="cad-pipeline-how-title">
      <p className={styles.howItWorksLabel}>How it works</p>
      <h2 id="cad-pipeline-how-title" className={styles.howItWorksTitle}>
        From 3D CAD to Engineering Drawings
      </h2>
      <p className={styles.howItWorksDesc}>{PIPELINE_HOW_IT_WORKS_COPY}</p>

      <div className={styles.howItWorksCompare}>
        <article className={styles.howItWorksCard}>
          <div className={styles.howItWorksCardHead}>
            <span className={styles.howItWorksCardLabel}>3D CAD model</span>
            <span className={styles.howItWorksBadge}>Input</span>
          </div>
          <div className={styles.howItWorksPreview}>
            <FallbackImageClient
              className={styles.howItWorksImg}
              src={PIPELINE_DEMO_3D_SPRITE_URL}
              alt="Example 3D CAD model preview"
            />
          </div>
        </article>

        <div className={styles.howItWorksArrow} aria-hidden>
          →
        </div>

        <article className={styles.howItWorksCard}>
          <div className={styles.howItWorksCardHead}>
            <span className={styles.howItWorksCardLabel}>AI-generated 2D drawing</span>
            <span className={styles.howItWorksBadge}>Output</span>
          </div>
          <div className={`${styles.howItWorksPreview} ${styles.howItWorksPreviewOutput}`}>
            <FallbackImageClient
              className={`${styles.howItWorksImg} ${styles.howItWorksImg2d}`}
              src={demo2dSvgUrl}
              alt="Example AI-generated 2D technical drawing sheet 1"
            />
          </div>
        </article>
      </div>
    </section>
  );
}

"use client";

import { Clock, Layers } from "lucide-react";
import heroStyles from "@/Components/CadUploadingHome/CadHomeDesign/CadViewerHero.module.css";
import useTechDrawPriceDisplay from "./useTechDrawPriceDisplay";
import styles from "./CadDrawingPipeline.module.css";

/** Combined hero shell: title block + upload slot. Price from admin techdraw_upload_price. */
export default function CadDrawingPipelineHeroSection({
  children,
  priceLabel: priceLabelProp,
  initialPrices,
}) {
  const prices = useTechDrawPriceDisplay(initialPrices);
  const priceLabel = priceLabelProp || prices.baseLabel;

  const valuePills = [
    {
      id: "price",
      icon: "$",
      iconType: "text",
      label: `${priceLabel} per drawing set`,
    },
    { id: "eta", icon: Clock, iconType: "lucide", label: "Ready in under 4 minutes" },
    {
      id: "formats",
      icon: Layers,
      iconType: "lucide",
      label: "PDF · SVG · DXF · PNG",
      mono: true,
    },
  ];

  return (
    <section
      className={`${heroStyles.heroPage} ${styles.pipelineHeroShell}`}
      id="cad-pipeline-upload"
      aria-labelledby="cad-pipeline-hero-title"
    >
      <div className={`${heroStyles.heroInner} ${styles.pipelineHeroInner}`}>
        <div className={styles.pipelineHeroIntro}>
          <p className={styles.pipelineHeroBadge}>
            <span className={styles.pipelineHeroBadgeDot} aria-hidden />
            Automated STEP to 2D pipeline
          </p>

          <h1 id="cad-pipeline-hero-title" className={styles.pipelineHeroTitle}>
            <span className={styles.pipelineHeroTitleLine}>15,000+ CAD files.</span>
            <span className={styles.pipelineHeroTitleAccent}>Instant 2D technical drawings.</span>
          </h1>

          <p className={styles.pipelineHeroDescription}>
            Upload a STEP file and get multi-view orthographic sheets, dimensioned views, section
            cuts, and editable FCStd files, all produced automatically from your 3D CAD.
          </p>
        </div>

        <div className={styles.pipelineValuePills} role="list">
          {valuePills.map((pill) => {
            const Icon = pill.iconType === "lucide" ? pill.icon : null;
            return (
              <div key={pill.id} className={styles.pipelineValuePill} role="listitem">
                <span className={styles.pipelineValuePillIcon} aria-hidden>
                  {pill.iconType === "text" ? (
                    pill.icon
                  ) : Icon ? (
                    <Icon size={pill.id === "formats" ? 16 : 17} strokeWidth={1.9} />
                  ) : null}
                </span>
                <span
                  className={
                    pill.mono ? styles.pipelineValuePillLabelMono : styles.pipelineValuePillLabel
                  }
                >
                  {pill.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.pipelineUploadSlot}>{children}</div>
      </div>
    </section>
  );
}

"use client";

import useTechDrawPriceDisplay from "./useTechDrawPriceDisplay";
import styles from "./CadDrawingPipeline.module.css";

function TrustIcon({ type }) {
  const common = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": true };
  if (type === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3.5 5.5 6.2v5.3c0 4.2 2.7 7.2 6.5 8.8 3.8-1.6 6.5-4.6 6.5-8.8V6.2L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "files") {
    return (
      <svg {...common}>
        <path d="M7 7h10M7 12h10M7 17h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8.5V12l2.5 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="6" y="10.5" width="12" height="8.5" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 10.5V8.2a3 3 0 0 1 6 0v2.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function CadDrawingPipelineHeroSection({
  children,
  priceLabel: priceLabelProp,
  initialPrices,
}) {
  const prices = useTechDrawPriceDisplay(initialPrices);
  const priceLabel = priceLabelProp || prices.totalLabel;

  return (
    <section
      className={styles.heroBand}
      id="cad-pipeline-upload"
      aria-labelledby="cad-pipeline-hero-title"
    >
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <div className={styles.heroBadges}>
            {priceLabel ? (
              <span className={styles.heroPriceBadge}>{priceLabel} per drawing set</span>
            ) : null}
            <span className={styles.heroOutlineBadge}>STEP → 2D drawing</span>
            <span className={styles.heroBadgeBreak} />
            <span className={styles.heroOutlineBadge}>No software installation</span>
          </div>

          <h1 id="cad-pipeline-hero-title" className={styles.heroTitle}>
            Convert STEP to 2D drawings online
          </h1>
          <p className={styles.heroLede}>
            Upload a STEP or STP (.step, .stp) model and get a complete technical drawing set:
            front, top and side views, an isometric view, section cuts, dimensions and a title
            block. Download it as PDF, DXF, SVG and PNG, plus an editable FreeCAD file. No CAD
            software or drafting skills needed.
          </p>

          <ul className={styles.heroTrust}>
            <li>
              <TrustIcon type="shield" />
              Encrypted uploads
            </li>
            <li>
              <TrustIcon type="files" />
              Files up to 100 MB
            </li>
            <li>
              <TrustIcon type="clock" />
              Ready in under 4 minutes
            </li>
            <li>
              <TrustIcon type="lock" />
              Automatically deleted within 7 days
            </li>
          </ul>
        </div>

        <div className={styles.heroSlot}>{children}</div>
      </div>
    </section>
  );
}

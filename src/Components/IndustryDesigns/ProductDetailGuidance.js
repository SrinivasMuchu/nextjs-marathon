import React from "react";
import {
  getLibraryProductUseCases,
  LIBRARY_BEFORE_USING_COPY,
} from "@/lib/seo/libraryProductDetail";
import styles from "./ProductDetailSections.module.css";

export default function ProductDetailGuidance({ design }) {
  const useCases = getLibraryProductUseCases(design);
  if (!useCases.length) return null;

  return (
    <section className={styles.panel} aria-label="CAD model usage guidance">
      <div className={styles.panelBlock}>
        <h2 className={styles.heading} id="product-use-cases-heading">
          What you can use this CAD model for
        </h2>
        <ul className={styles.useCaseGrid} aria-labelledby="product-use-cases-heading">
          {useCases.map((item) => (
            <li key={item} className={styles.useCaseItem}>
              <span className={styles.useCaseCheck} aria-hidden>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.panelDivider} role="presentation" />

      <div className={styles.panelBlock}>
        <h2 className={styles.heading} id="before-using-heading">
          Before using this CAD file
        </h2>
        <p className={styles.warningCopy} id="before-using-copy">
          {LIBRARY_BEFORE_USING_COPY}
        </p>
      </div>
    </section>
  );
}

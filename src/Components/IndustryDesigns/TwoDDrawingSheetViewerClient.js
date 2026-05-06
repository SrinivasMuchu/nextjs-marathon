"use client";

import { useCallback, useState } from "react";
import styles from "./TwoDDrawingSheetViewerClient.module.css";

function previewSrc(sheet) {
  if (!sheet) return "";
  const candidates = sheet.previewCandidates || [];
  if (candidates.length) return candidates[0];
  if (sheet.src) return sheet.src;
  return "";
}

function previewErrorHandler(sheet) {
  return (e) => {
    // On error just show placeholder; no complex fallback chain.
    e.currentTarget.style.display = "none";
  };
}

export default function TwoDDrawingSheetViewerClient({ sheets = [] }) {
  const [cur, setCur] = useState(0);
  const [viewMode, setViewMode] = useState("svg");
  const safeSheets = sheets.length ? sheets : [{ src: "", label: "Sheet 1" }];
  const total = safeSheets.length;

  const go = useCallback(
    (delta) => {
      setCur((i) => (i + delta + total) % total);
    },
    [total]
  );

  const goTo = useCallback(
    (i) => {
      setCur(((i % total) + total) % total);
    },
    [total]
  );

  const active = safeSheets[cur];

  return (
    <div className={styles.viewer}>
      <div className={styles.viewerBar}>
        <div className={styles.badge}>
          <span className={styles.badgeIcon} aria-hidden>
            M
          </span>
          Preview · 2D Drawing Sheets
        </div>
        <div className={styles.viewerBarRight}>
          <div className={styles.modeSwitch} role="tablist" aria-label="Preview mode">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "svg"}
              className={`${styles.modeBtn} ${viewMode === "svg" ? styles.modeBtnActive : ""}`}
              onClick={() => setViewMode("svg")}
            >
              SVG
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "pdf"}
              className={`${styles.modeBtn} ${viewMode === "pdf" ? styles.modeBtnActive : ""}`}
              onClick={() => setViewMode("pdf")}
            >
              PDF
            </button>
          </div>
          <span className={styles.counter} aria-live="polite">
            {cur + 1} / {total}
          </span>
        </div>
      </div>

      <div className={styles.stage}>
        {viewMode === "pdf" && active?.pdfUrl ? (
          <iframe
            key={`pdf-${cur}`}
            className={styles.stagePdf}
            src={active.pdfUrl}
            title={`${active.label} PDF`}
          />
        ) : previewSrc(active) ? (
          <img
            key={cur}
            className={styles.stageImg}
            src={previewSrc(active)}
            alt={active.label}
            onError={previewErrorHandler(active)}
          />
        ) : (
          <div className={styles.placeholder}>{active.label}</div>
        )}
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navLeft}`}
          onClick={() => go(-1)}
          aria-label="Previous sheet"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navRight}`}
          onClick={() => go(1)}
          aria-label="Next sheet"
        >
          ›
        </button>
        <div className={styles.pill}>{active.label}</div>
      </div>

      <div className={styles.thumbRow} role="tablist" aria-label="Drawing sheets">
        {safeSheets.map((s, i) => (
          <button
            key={`${s.label}-${i}`}
            type="button"
            role="tab"
            aria-selected={i === cur}
            className={`${styles.thumb} ${i === cur ? styles.thumbActive : ""}`}
            onClick={() => goTo(i)}
          >
            {previewSrc(s) ? (
              <img
                key={`${s.label}-${i}`}
                src={previewSrc(s)}
                alt=""
                onError={previewErrorHandler(s)}
              />
            ) : (
              <>thumb {i + 1}</>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

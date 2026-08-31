"use client";

import { DEFAULT_SHEET_DOWNLOAD_ROWS } from "./twoDDrawingPageDefaults";
import styles from "./TwoDDrawingSheetDownloads.module.css";

const FORMATS = [
  { key: "pdf", label: "PDF", className: styles.pdf },
  { key: "svg", label: "SVG", className: styles.svg },
  { key: "dxf", label: "DXF", className: styles.dxf },
];

export default function TwoDDrawingSheetDownloads({ rows, onDownload }) {
  void DEFAULT_SHEET_DOWNLOAD_ROWS;
  const safeRows = Array.isArray(rows) ? rows : [];
  if (!safeRows.length) return null;

  const open = (href) => {
    if (!href) return;
    if (onDownload) onDownload(href);
    else window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <section className={styles.section} aria-labelledby="sheet-downloads-heading">
      <p className={styles.eyebrow}>Downloads</p>
      <h2 id="sheet-downloads-heading" className={styles.title}>
        Download Individual Sheets
      </h2>
      <p className={styles.desc}>
        Each sheet available in PDF, SVG, and DXF. Click a format badge to download.
      </p>

      <div className={styles.list}>
        {safeRows.map((row) => (
          <div key={row.name} className={styles.row}>
            <div className={styles.name}>{row.name}</div>
            <div className={styles.badges}>
              {FORMATS.map(({ key, label, className }) => {
                const href = row[key];
                if (!href) return null;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.badge} ${className}`}
                    onClick={() => open(href)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

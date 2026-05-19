import { DEFAULT_SHEET_DOWNLOAD_ROWS } from "./twoDDrawingPageDefaults";
import styles from "./TwoDDrawingSheetDownloads.module.css";

const FORMATS = [
  { key: "pdf", label: "PDF", className: styles.pdf },
  { key: "svg", label: "SVG", className: styles.svg },
  { key: "dxf", label: "DXF", className: styles.dxf },
];

/**
 * Server component: per-sheet format links. Responsive: title full width, badges wrap below on narrow screens.
 */
export default function TwoDDrawingSheetDownloads({ rows }) {
  void DEFAULT_SHEET_DOWNLOAD_ROWS;
  const safeRows = Array.isArray(rows) ? rows : [];
  if (!safeRows.length) return null;
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
                  <a
                    key={key}
                    href={href}
                    className={`${styles.badge} ${className}`}
                    download
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

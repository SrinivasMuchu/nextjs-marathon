"use client";

import styles from "./TwoDDrawingRightSidebar.module.css";

export default function TwoDDrawingDownloadButtons({
  onPdf,
  onZip,
  pdfHref,
  freecadHref,
  zipHref,
  pdfLabel = "⬇ Download All PDFs",
  freecadLabel = "🛠 Download FreeCAD (.FCStd)",
  zipLabel = "📦 Download All Formats (.zip)",
}) {
  const handlePdf = () => {
    if (onPdf) onPdf();
    else if (pdfHref) window.open(pdfHref, "_blank", "noopener,noreferrer");
  };
  const handleZip = () => {
    if (onZip) onZip();
    else if (zipHref) window.open(zipHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.downloadActions}>
      <button type="button" className={styles.btnPrimary} onClick={handlePdf}>
        {pdfLabel}
      </button>
      {freecadHref ? (
        <a
          href={freecadHref}
          className={styles.btnSecondary}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          {freecadLabel}
        </a>
      ) : null}
      {zipHref && !onZip ? (
        <a
          href={zipHref}
          className={styles.btnSecondary}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          {zipLabel}
        </a>
      ) : (
        <button type="button" className={styles.btnSecondary} onClick={handleZip}>
          {zipLabel}
        </button>
      )}
    </div>
  );
}

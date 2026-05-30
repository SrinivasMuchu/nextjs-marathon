"use client";

import styles from "./TwoDDrawingRightSidebar.module.css";
import { sendGAtagEvent } from "@/common.helper";
import { CAD_2D_DRAWING_EVENT } from "@/config";

export default function TwoDDrawingDownloadButtons({
  onPdf,
  onZip,
  pdfHref,
  freecadHref,
  zipHref,
  showPdfButton = true,
  pdfLabel = "⬇ Download All PDFs",
  freecadLabel = "🛠 Download FreeCAD (.FCStd)",
  zipLabel = "📦 Download All Formats (.zip)",
}) {
  const trackDownloadClick = (eventName) => {
    sendGAtagEvent({
      event_name: eventName,
      event_category: CAD_2D_DRAWING_EVENT,
    });
  };

  const handlePdf = () => {
    trackDownloadClick("techdraw_download_pdf_click");
    if (onPdf) onPdf();
    else if (pdfHref) window.open(pdfHref, "_blank", "noopener,noreferrer");
  };
  const handleZip = () => {
    trackDownloadClick("techdraw_download_zip_click");
    if (onZip) onZip();
    else if (zipHref) window.open(zipHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.downloadActions}>
      {showPdfButton ? (
        <button type="button" className={styles.btnPrimary} onClick={handlePdf}>
          {pdfLabel}
        </button>
      ) : null}
      {freecadHref ? (
        <a
          href={freecadHref}
          className={styles.btnSecondary}
          download
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackDownloadClick("techdraw_download_freecad_click")}
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
          onClick={() => trackDownloadClick("techdraw_download_zip_click")}
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

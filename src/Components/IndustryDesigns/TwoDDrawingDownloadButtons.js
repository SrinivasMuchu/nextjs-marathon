"use client";

import styles from "./TwoDDrawingRightSidebar.module.css";
import { sendGAtagEvent } from "@/common.helper";
import { CAD_2D_DRAWING_EVENT } from "@/config";

export default function TwoDDrawingDownloadButtons({
  onPdf,
  onZip,
  onSvg,
  onDxf,
  onFreecad,
  pdfHref,
  svgHref,
  dxfHref,
  freecadHref,
  zipHref,
  showPdfButton = true,
  pdfLabel = "Download all PDFs",
  svgLabel = "Download all SVG files",
  dxfLabel = "Download all DXF files",
  freecadLabel = "Download FreeCAD source file",
  zipLabel = "Download all formats as ZIP",
}) {
  const trackDownloadClick = (eventName) => {
    sendGAtagEvent({
      event_name: eventName,
      event_category: CAD_2D_DRAWING_EVENT,
    });
  };

  const open = (href, handler) => {
    if (handler) {
      handler();
      return;
    }
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  };

  const handlePdf = () => {
    trackDownloadClick("techdraw_download_pdf_click");
    open(pdfHref, onPdf);
  };
  const handleZip = () => {
    trackDownloadClick("techdraw_download_zip_click");
    open(zipHref, onZip);
  };

  const handleSvg = () => {
    trackDownloadClick("techdraw_download_svg_click");
    open(svgHref, onSvg);
  };
  const handleDxf = () => {
    trackDownloadClick("techdraw_download_dxf_click");
    open(dxfHref, onDxf);
  };
  const handleFreecad = (e) => {
    e.preventDefault();
    trackDownloadClick("techdraw_download_freecad_click");
    open(freecadHref, onFreecad);
  };

  return (
    <div className={styles.downloadActions}>
      {showPdfButton ? (
        <button type="button" className={styles.btnPrimary} onClick={handlePdf}>
          {pdfLabel}
        </button>
      ) : null}
      {svgHref ? (
        <button type="button" className={styles.btnSecondary} onClick={handleSvg}>
          {svgLabel}
        </button>
      ) : null}
      {dxfHref ? (
        <button type="button" className={styles.btnSecondary} onClick={handleDxf}>
          {dxfLabel}
        </button>
      ) : null}
      {freecadHref ? (
        <button type="button" className={styles.btnSecondary} onClick={handleFreecad}>
          {freecadLabel}
        </button>
      ) : null}
      <button type="button" className={styles.btnSecondary} onClick={handleZip}>
        {zipLabel}
      </button>
    </div>
  );
}

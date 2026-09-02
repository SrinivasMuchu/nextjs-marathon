"use client";

import styles from "./TwoDDrawingRightSidebar.module.css";
import { sendGAtagEvent } from "@/common.helper";
import { CAD_2D_DRAWING_EVENT } from "@/config";
import { useTwoDLibraryDownload, TwoDLibraryPaywallModals } from "./useTwoDLibraryDownload";

export default function TwoDDrawingDownloadButtons({
  onPdf,
  onZip,
  onSvg,
  onDxf,
  onFreecad,
  onRequestDownload: onRequestDownloadProp,
  designId,
  designTitle,
  gateLibraryDownloads = false,
  pdfHref,
  svgHref,
  dxfHref,
  freecadHref,
  zipHref,
  showPdfButton = true,
  busy: busyProp = false,
  pdfLabel = "Download all PDFs",
  svgLabel = "Download all SVG files",
  dxfLabel = "Download all DXF files",
  freecadLabel = "Download FreeCAD source file",
  zipLabel = "Download all formats as ZIP",
}) {
  const libraryPaywall = useTwoDLibraryDownload({
    designId,
    designTitle,
    enabled: gateLibraryDownloads && !onRequestDownloadProp,
  });
  const requestDownload = onRequestDownloadProp || libraryPaywall.requestDownload;
  const busy = busyProp || libraryPaywall.busy;
  const gated = Boolean(onRequestDownloadProp || gateLibraryDownloads);

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
  const gatedClick = (eventName, href, filename) => {
    trackDownloadClick(eventName);
    if (gated) {
      requestDownload(href, filename);
      return true;
    }
    return false;
  };

  const handlePdf = () => {
    if (gatedClick("techdraw_download_pdf_click", pdfHref, "techdraw-pdfs.zip")) return;
    if (onPdf) onPdf();
    else if (pdfHref) window.open(pdfHref, "_blank", "noopener,noreferrer");
  };
  const handleZip = () => {
    if (gatedClick("techdraw_download_zip_click", zipHref, "techdraw.zip")) return;
    if (onZip) onZip();
    else if (zipHref) window.open(zipHref, "_blank", "noopener,noreferrer");
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
    if (gatedClick("techdraw_download_svg_click", svgHref, "techdraw-svg.zip")) return;
    if (svgHref) window.open(svgHref, "_blank", "noopener,noreferrer");
  };
  const handleDxf = () => {
    if (gatedClick("techdraw_download_dxf_click", dxfHref, "techdraw-dxf.zip")) return;
    if (dxfHref) window.open(dxfHref, "_blank", "noopener,noreferrer");
  };
  const handleFreecad = (event) => {
    if (gatedClick("techdraw_download_freecad_click", freecadHref, "technical_drawing_simple.FCStd")) {
      event.preventDefault();
    }
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
    <>
      <div className={styles.downloadActions}>
        {showPdfButton ? (
          <button type="button" className={styles.btnPrimary} onClick={handlePdf} disabled={busy}>
            {pdfLabel}
          </button>
        ) : null}
        {svgHref ? (
          <button type="button" className={styles.btnSecondary} onClick={handleSvg} disabled={busy}>
            {svgLabel}
          </button>
        ) : null}
        {dxfHref ? (
          <button type="button" className={styles.btnSecondary} onClick={handleDxf} disabled={busy}>
            {dxfLabel}
          </button>
        ) : null}
        {freecadHref ? (
          gated ? (
            <button type="button" className={styles.btnSecondary} onClick={handleFreecad} disabled={busy}>
              {freecadLabel}
            </button>
          ) : (
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
          )
        ) : null}
        {zipHref && !onZip && !gated ? (
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
          <button type="button" className={styles.btnSecondary} onClick={handleZip} disabled={busy}>
            {zipLabel}
          </button>
        )}
      </div>
      {gateLibraryDownloads && !onRequestDownloadProp ? (
        <TwoDLibraryPaywallModals {...libraryPaywall.paywall} />
      ) : null}
    </>
  );
}

import Link from "next/link";
import TwoDDrawingDownloadButtons from "./TwoDDrawingDownloadButtons";
// CTA temporarily disabled — re-enable along with the commented JSX block below.
// import TwoDDrawingUploadGenerateButton from "./TwoDDrawingUploadGenerateButton";
import styles from "./TwoDDrawingRightSidebar.module.css";

/**
 * Right column: downloads, notices, link to 3D, drawing info.
 *
 * The "Generate Your Own" CTA that used to live in this sidebar is currently
 * COMMENTED OUT — the full-width <TwoDDrawingCtaBanner /> rendered by the
 * parent serves as the single conversion surface on this page (mirrors the
 * 3D design page). To bring the sidebar CTA back, uncomment:
 *   - the `TwoDDrawingUploadGenerateButton` import above,
 *   - the JSX block marked "[disabled] Generate Your Own CTA" in render(),
 *   - and pass `generateHref` from the parent again.
 */
export default function TwoDDrawingRightSidebar({
  cadModelHref = "/library/industrial-ip67-ethernet-m12-angle-conne-698ec00809bd85d18216b084",
  // generateHref = "/tools/cad-drawing-pipeline", // used by the disabled sidebar CTA
  pdfHref,
  freecadHref,
  zipHref,
  showDownloadAllPdfs = true,
  showCadModelLink = true,
  drawingInfo = {
    viewsAnalysed: 6,
    sheetsGenerated: 9,
    sectionCuts: 2,
    exportFormats: 3,
    generatedLabel: "Generated: 14 Feb 2026 · Projection: First Angle",
  },
}) {
  const nSheets = drawingInfo.sheetsGenerated ?? 0;
  const sheetWord = nSheets === 1 ? "1 sheet" : `${nSheets} sheets`;
  const filesWord = nSheets === 1 ? "1 file" : `${nSheets} files`;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.cardTitle}>Download All Sheets</div>
          <TwoDDrawingDownloadButtons
            pdfHref={pdfHref}
            freecadHref={freecadHref}
            zipHref={zipHref}
            showPdfButton={showDownloadAllPdfs}
          />

          <div className={styles.formatGrid}>
            <div className={styles.formatCell}>
              <span className={styles.fmtPdf}>PDF</span>
              <span className={styles.fmtMeta}>{sheetWord}</span>
            </div>
            <div className={styles.formatCell}>
              <span className={styles.fmtSvg}>SVG</span>
              <span className={styles.fmtMeta}>{filesWord}</span>
            </div>
            <div className={styles.formatCell}>
              <span className={styles.fmtDxf}>DXF</span>
              <span className={styles.fmtMeta}>{filesWord}</span>
            </div>
          </div>
          {showCadModelLink && cadModelHref ? (
            <Link href={cadModelHref} prefetch className={styles.backLinkBtn}>
              <span className={styles.backLinkBtnIcon} aria-hidden>
                🧊
              </span>
              <span>Open 3D CAD model</span>
              <span aria-hidden className={styles.backLinkBtnArrow}>
                →
              </span>
            </Link>
          ) : null}
          <div className={styles.noticeBlue}>
            <span aria-hidden>ℹ️</span>
            <p>
              These are <strong>2D engineering drawings</strong> derived from the 3D CAD
              geometry. Verify critical dimensions against the source model before
              manufacturing.
            </p>
          </div>
          <div className={styles.noticePurple}>
            <span aria-hidden>🤖</span>
            <p>
              Views, section cuts, and detail areas were <strong>selected by AI</strong>{" "}
              based on analysis of 6 rendered views of the 3D model.
            </p>
          </div>
        </div>

      </div>

      {/* [disabled] Generate Your Own CTA — uncomment to restore the sidebar CTA card.
          Currently superseded by the full-width <TwoDDrawingCtaBanner /> rendered
          by the parent (TwoDTechnicalDrawingContent), to match the 3D design page.
      <div className={styles.ctaCard}>
        <div className={styles.ctaEyebrow}>Generate Your Own</div>
        <h3 className={styles.ctaTitle}>
          Have a CAD file?
          <br />
          Get 2D drawings in 4 min.
        </h3>
        <p className={styles.ctaDesc}>
          Upload any STEP or CAD file. AI analyses the geometry and generates a full 2D
          drawing set — editable FCStd, PDF, SVG, DXF.
        </p>
        <div className={styles.priceRow}>
          <span className={styles.priceBig}>$4</span>
          <span className={styles.priceSub}>per drawing set</span>
        </div>
        <TwoDDrawingUploadGenerateButton href={generateHref} />
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>⏱ &lt;4 minutes</span>
          <span className={styles.metaItem}>📄 {sheetWord}</span>
          <span className={styles.metaItem}>📦 4 formats</span>
        </div>
      </div>
      */}

      {/* <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.cardTitle}>Drawing Info</div>
          <div className={styles.infoGrid}>
            <div>
              <div className={styles.infoVal}>{drawingInfo.viewsAnalysed}</div>
              <div className={styles.infoKey}>Views Analysed</div>
            </div>
            <div>
              <div className={styles.infoVal}>{drawingInfo.sheetsGenerated}</div>
              <div className={styles.infoKey}>Sheets Generated</div>
            </div>
            <div>
              <div className={styles.infoVal}>{drawingInfo.sectionCuts}</div>
              <div className={styles.infoKey}>Section Cuts</div>
            </div>
            <div>
              <div className={styles.infoVal}>{drawingInfo.exportFormats}</div>
              <div className={styles.infoKey}>Export Formats</div>
            </div>
          </div>
          <div className={styles.infoFooter}>{drawingInfo.generatedLabel}</div>
        </div>
      </div> */}
    </aside>
  );
}

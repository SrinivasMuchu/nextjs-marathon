"use client";

import TwoDAiDrawingAnalysis from "./TwoDAiDrawingAnalysis";
import TwoDDrawingViewCards from "./TwoDDrawingViewCards";
import TwoDDrawingSectionDetailCards from "./TwoDDrawingSectionDetailCards";
import TwoDDrawingSheetDownloads from "./TwoDDrawingSheetDownloads";
import TwoDDrawingCtaBanner from "./TwoDDrawingCtaBanner";
import TwoDDrawingTransparencyBlock from "./TwoDDrawingTransparencyBlock";
import TwoDDrawingPreviewPanel from "./TwoDDrawingPreviewPanel";
import TwoDDrawingRightSidebar from "./TwoDDrawingRightSidebar";
import { DEFAULT_2D_SHEETS } from "./twoDDrawingPageDefaults";
import layoutStyles from "./TwoDDrawingMainLayout.module.css";

function EmptyDeliverablesNotice({ generateHref }) {
  return (
    <section
      aria-live="polite"
      style={{
        background: "#fff7ed",
        border: "1px solid #fdba74",
        borderRadius: 12,
        padding: "20px 22px",
        margin: "24px 0",
        color: "#7c2d12",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 6,
          color: "#9a3412",
        }}
      >
        Drawing files aren&apos;t available for this job
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
        We couldn&apos;t generate any usable drawing views for this design.
        This usually happens when the source CAD didn&apos;t produce visible
        geometry for any projected view, or when one of the export steps was
        interrupted. Please retry the upload — if the issue keeps happening,
        contact support.
      </p>
      {generateHref ? (
        <a
          href={generateHref}
          style={{
            display: "inline-block",
            marginTop: 14,
            background: "#9a3412",
            color: "#fff",
            padding: "9px 16px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Try a new upload
        </a>
      ) : null}
    </section>
  );
}

/**
 * Client-safe main content for dashboard pipeline results (no async TwoDMoreDesignsSection).
 */
export default function TwoDTechnicalDrawingContentClient({
  sheets = DEFAULT_2D_SHEETS,
  cadModelHref,
  generateHref,
  pdfHref,
  freecadHref,
  zipHref,
  showDownloadAllPdfs = true,
  showCadModelLink = true,
  drawingInfo,
  viewCards,
  sectionDetailGroups,
  bomRows,
  sheetDownloadRows,
  transparencyMetaStats,
  transparencyIntroParagraphs,
  hasRenderableSheets = true,
  wasFilteredEmpty = false,
}) {
  const showArtifacts = hasRenderableSheets && !wasFilteredEmpty;
  return (
    <>
      {showArtifacts ? (
        <div className={layoutStyles.mainGrid}>
          <TwoDDrawingPreviewPanel sheets={sheets} />
          <TwoDDrawingRightSidebar
            cadModelHref={cadModelHref}
            generateHref={generateHref}
            pdfHref={pdfHref}
            freecadHref={freecadHref}
            zipHref={zipHref}
            showDownloadAllPdfs={showDownloadAllPdfs}
            showCadModelLink={showCadModelLink}
            drawingInfo={drawingInfo}
          />
        </div>
      ) : (
        <EmptyDeliverablesNotice generateHref={generateHref} />
      )}
      <TwoDAiDrawingAnalysis />
      {showArtifacts ? (
        <>
          <TwoDDrawingViewCards views={viewCards} />
          <TwoDDrawingSectionDetailCards groups={sectionDetailGroups} />
          <TwoDDrawingSheetDownloads rows={sheetDownloadRows} />
        </>
      ) : null}
      <TwoDDrawingCtaBanner generateHref={generateHref} />
      <TwoDDrawingTransparencyBlock
        metaStats={transparencyMetaStats}
        introParagraphs={transparencyIntroParagraphs}
      />
    </>
  );
}

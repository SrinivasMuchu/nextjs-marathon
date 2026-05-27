import TwoDAiDrawingAnalysis from "./TwoDAiDrawingAnalysis";
import TwoDDrawingViewCards from "./TwoDDrawingViewCards";
import TwoDDrawingSectionDetailCards from "./TwoDDrawingSectionDetailCards";
// import TwoDDrawingBomTable from "./TwoDDrawingBomTable";
import TwoDDrawingSheetDownloads from "./TwoDDrawingSheetDownloads";
import TwoDDrawingCtaBanner from "./TwoDDrawingCtaBanner";
import TwoDDrawingTransparencyBlock from "./TwoDDrawingTransparencyBlock";
import TwoDDrawingPreviewPanel from "./TwoDDrawingPreviewPanel";
import TwoDDrawingRightSidebar from "./TwoDDrawingRightSidebar";
import TwoDMoreDesignsSection from "./TwoDMoreDesignsSection";
import TwoDDrawingAnalyticsTracker from "./TwoDDrawingAnalyticsTracker";
import { DEFAULT_2D_SHEETS } from "./twoDDrawingPageDefaults";
import layoutStyles from "./TwoDDrawingMainLayout.module.css";
import { Suspense } from "react";

/**
 * Inline notice rendered when every candidate sheet was filtered out by
 * Layer B (blank projection or missing S3 file). Kept self-contained so we
 * don't need a new CSS module for one banner.
 */
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
 * Server component: two-column main area (preview + sidebar) and AI analysis block.
 */
export default function TwoDTechnicalDrawingContent({
  sheets = DEFAULT_2D_SHEETS,
  cadModelHref,
  generateHref,
  pdfHref,
  freecadHref,
  zipHref,
  drawingInfo,
  viewCards,
  sectionDetailGroups,
  bomRows,
  sheetDownloadRows,
  transparencyMetaStats,
  transparencyIntroParagraphs,
  currentDesignId,
  hasRenderableSheets = true,
  wasFilteredEmpty = false,
}) {
  // When the bundle had sheets in geometry_per_sheet.json but every one of
  // them was filtered out (blank projection / missing S3 file), don't show
  // the empty preview grid + empty cards + empty downloads — show a single
  // failure notice and skip the artifact panels entirely. The hero, AI
  // explanation, transparency block, and "more designs" section stay so
  // the page chrome still looks intact.
  const showArtifacts = hasRenderableSheets && !wasFilteredEmpty;

  return (
    <>
      {showArtifacts ? (
        <div className={layoutStyles.mainGrid}>
          <TwoDDrawingPreviewPanel sheets={sheets} />
          <TwoDDrawingRightSidebar
            cadModelHref={cadModelHref}
            // generateHref={generateHref} // re-enable when the sidebar CTA below is uncommented
            pdfHref={pdfHref}
            freecadHref={freecadHref}
            zipHref={zipHref}
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
          {/* <TwoDDrawingBomTable rows={bomRows} /> */}
          <TwoDDrawingSheetDownloads rows={sheetDownloadRows} />
        </>
      ) : null}
      <TwoDDrawingCtaBanner generateHref={generateHref} />
      <TwoDDrawingTransparencyBlock
        metaStats={transparencyMetaStats}
        introParagraphs={transparencyIntroParagraphs}
      />
      <Suspense fallback={null}>
        <TwoDMoreDesignsSection currentDesignId={currentDesignId} />
      </Suspense>
    </div>
  );
}

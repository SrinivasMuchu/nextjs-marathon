import TwoDAiDrawingAnalysis from "./TwoDAiDrawingAnalysis";
import TwoDDrawingViewCards from "./TwoDDrawingViewCards";
import TwoDDrawingSectionDetailCards from "./TwoDDrawingSectionDetailCards";
// import TwoDDrawingBomTable from "./TwoDDrawingBomTable";
import TwoDDrawingSheetDownloads from "./TwoDDrawingSheetDownloads";
import TwoDDrawingTransparencyBlock from "./TwoDDrawingTransparencyBlock";
import TwoDDrawingPreviewPanel from "./TwoDDrawingPreviewPanel";
import TwoDDrawingRightSidebar from "./TwoDDrawingRightSidebar";
import TwoDMoreDesignsSection from "./TwoDMoreDesignsSection";
import { DEFAULT_2D_SHEETS } from "./twoDDrawingPageDefaults";
import layoutStyles from "./TwoDDrawingMainLayout.module.css";
import { Suspense } from "react";

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
}) {
  return (
    <>
      <div className={layoutStyles.mainGrid}>
        <TwoDDrawingPreviewPanel sheets={sheets} />
        <TwoDDrawingRightSidebar
          cadModelHref={cadModelHref}
          generateHref={generateHref}
          pdfHref={pdfHref}
          freecadHref={freecadHref}
          zipHref={zipHref}
          drawingInfo={drawingInfo}
        />
      </div>
      <TwoDAiDrawingAnalysis />
      <TwoDDrawingViewCards views={viewCards} />
      <TwoDDrawingSectionDetailCards groups={sectionDetailGroups} />
      {/* <TwoDDrawingBomTable rows={bomRows} /> */}
      <TwoDDrawingSheetDownloads rows={sheetDownloadRows} />
      {/* <TwoDDrawingCtaBanner generateHref={generateHref} /> */}
      <TwoDDrawingTransparencyBlock
        metaStats={transparencyMetaStats}
        introParagraphs={transparencyIntroParagraphs}
      />
      <Suspense fallback={null}>
        <TwoDMoreDesignsSection currentDesignId={currentDesignId} />
      </Suspense>
    </>
  );
}

"use client";

import TwoDAiDrawingAnalysis from "./TwoDAiDrawingAnalysis";
import TwoDDrawingViewCards from "./TwoDDrawingViewCards";
import TwoDDrawingSectionDetailCards from "./TwoDDrawingSectionDetailCards";
import TwoDDrawingSheetDownloads from "./TwoDDrawingSheetDownloads";
import TwoDDrawingTransparencyBlock from "./TwoDDrawingTransparencyBlock";
import TwoDDrawingPreviewPanel from "./TwoDDrawingPreviewPanel";
import TwoDDrawingRightSidebar from "./TwoDDrawingRightSidebar";
import { DEFAULT_2D_SHEETS } from "./twoDDrawingPageDefaults";
import layoutStyles from "./TwoDDrawingMainLayout.module.css";

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
          showDownloadAllPdfs={showDownloadAllPdfs}
          showCadModelLink={showCadModelLink}
          drawingInfo={drawingInfo}
        />
      </div>
      <TwoDAiDrawingAnalysis />
      <TwoDDrawingViewCards views={viewCards} />
      <TwoDDrawingSectionDetailCards groups={sectionDetailGroups} />
      <TwoDDrawingSheetDownloads rows={sheetDownloadRows} />
      <TwoDDrawingTransparencyBlock
        metaStats={transparencyMetaStats}
        introParagraphs={transparencyIntroParagraphs}
      />
    </>
  );
}

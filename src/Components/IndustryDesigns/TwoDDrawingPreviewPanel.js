import TwoDDrawingSheetViewerClient from "./TwoDDrawingSheetViewerClient";

/**
 * Left column: drawing preview. Shell is server; interactivity lives in the client viewer.
 */
export default function TwoDDrawingPreviewPanel({ sheets }) {
  return <TwoDDrawingSheetViewerClient sheets={sheets} />;
}

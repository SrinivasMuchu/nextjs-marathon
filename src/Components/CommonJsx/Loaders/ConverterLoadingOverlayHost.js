"use client";

import React from "react";
import { createPortal } from "react-dom";
import CubeLoader from "./CubeLoader";
import { useConverterLoadingOverlay } from "@/lib/converterLoadingOverlay";

const overlayShellStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9998,
  background: "linear-gradient(180deg, #f7f5ff 0%, #ffffff 42%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
};

function ConverterLoadingOverlayHost() {
  const overlay = useConverterLoadingOverlay();

  if (typeof document === "undefined" || !overlay?.open) return null;

  return createPortal(
    <div style={overlayShellStyle}>
      <CubeLoader
        type="convert"
        uploadingMessage={overlay.uploadingMessage}
        uploadProgressPercent={overlay.uploadProgressPercent}
        progressPercent={overlay.progressPercent}
        conversionSteps={overlay.conversionSteps}
        fileName={overlay.fileName}
        outputFormat={overlay.outputFormat}
        fileSize={overlay.fileSize}
        isSampleFile={overlay.isSampleFile}
        onCancel={overlay.onCancel}
      />
    </div>,
    document.body
  );
}

export default ConverterLoadingOverlayHost;

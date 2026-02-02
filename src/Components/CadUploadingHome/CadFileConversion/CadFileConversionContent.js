"use client"
import React ,{ useContext } from "react";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import CadFileUploads from './CadFileUploads'

/** Derive initial allowed formats from conversion segment (e.g. "step-to-stl" -> [".step"]) for stable first-paint and CLS */
function getInitialAllowedFormats(conversionParams) {
  if (!conversionParams || typeof conversionParams !== 'string') return [];
  const segment = conversionParams.split('/').filter(Boolean).pop() || conversionParams;
  const parts = segment.split(/-to-|_to_|_/i);
  const from = (parts[0] || '').replace(/\.\w+$/, '');
  return from ? [`.${from}`] : [];
}

function CadFileConversionContent({ convert, conversionParams }) {
    const { allowedFormats } = useContext(contextState);
    const initialAllowedFormats = convert && conversionParams ? getInitialAllowedFormats(conversionParams) : [];
  return (
    <CadFileUploads
      convert={convert}
      allowedFormats={allowedFormats}
      initialAllowedFormats={initialAllowedFormats}
    />
  )
}

export default CadFileConversionContent
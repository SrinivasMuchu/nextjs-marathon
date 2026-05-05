"use client";

import {
  techdrawAssetProxyUrl,
  techdrawPreviewCandidatesWithFallback,
} from "@/lib/techDraw/techdrawPreviewProxy";

/**
 * Remote sheet preview: tries svg/ first, then screenshots/ and png_dim/ (see mapper).
 * Uses same-origin proxy so CloudFront attachment/octet-stream responses still paint in &lt;img&gt;.
 */
export default function TwoDDrawingRemoteSheetImg({
  src,
  previewCandidates,
  fallbackSrc,
  alt,
  className,
}) {
  const list =
    Array.isArray(previewCandidates) && previewCandidates.length > 0
      ? techdrawPreviewCandidatesWithFallback(previewCandidates)
      : src
        ? [src, techdrawAssetProxyUrl(src), fallbackSrc, fallbackSrc ? techdrawAssetProxyUrl(fallbackSrc) : null].filter(Boolean)
        : [];
  if (!list.length) return null;
  return (
    <img
      className={className}
      src={list[0]}
      alt={alt}
      onError={(e) => {
        const i = parseInt(e.currentTarget.getAttribute("data-preview-attempt") || "0", 10);
        if (i + 1 < list.length) {
          e.currentTarget.setAttribute("data-preview-attempt", String(i + 1));
          e.currentTarget.src = list[i + 1];
        }
      }}
    />
  );
}

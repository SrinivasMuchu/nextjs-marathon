"use client";

import { useAuthedTechDrawSrc } from "@/lib/techDraw/authTechDrawFetch";

/**
 * Remote sheet preview. Customer-upload files are fetched with the signed-in user.
 */
export default function TwoDDrawingRemoteSheetImg({
  src,
  previewCandidates,
  fallbackSrc,
  alt,
  className,
}) {
  const list = Array.isArray(previewCandidates) && previewCandidates.length > 0
    ? previewCandidates
    : src
      ? [src, fallbackSrc].filter(Boolean)
      : [];
  const resolved = useAuthedTechDrawSrc(list[0] || "");
  if (!list.length || !resolved) return null;
  return (
    <img
      className={className}
      src={resolved}
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

"use client";

/**
 * Remote sheet preview: simple direct <img> using provided URL(s).
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

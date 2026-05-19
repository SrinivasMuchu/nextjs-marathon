import React from "react";
import Script from "next/script";
import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";

const SITE_URL = "https://marathon-os.com";

/**
 * WebPage JSON-LD for individual 2D technical drawing routes, matching the WebPage
 * node emitted alongside Product/3DModel on standard library design pages.
 */
function TwoDTechnicalDrawingPageJsonLd({
  designRoute,
  designId,
  pageTitle,
  description,
}) {
  const path = `/library/2d-technical-drawings/${encodeURIComponent(String(designRoute || "").trim())}`;
  const pageUrl = `${SITE_URL}${path}`;
  const previewImage =
    designId && TECH_DRAW_LIBRARY_PREFIX
      ? `${TECH_DRAW_LIBRARY_PREFIX}/${designId}/svg/sheet_1.svg`
      : undefined;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: `${pageTitle} — free 2D CAD drawings (PDF, SVG, DXF)`,
    description,
    ...(previewImage ? { image: previewImage } : {}),
  };

  return (
    <Script
      id="json-ld-2d-technical-drawing-webpage"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
    />
  );
}

export default TwoDTechnicalDrawingPageJsonLd;

import React from "react";
import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";
import { SITE_URL } from "@/lib/seo/schema";

/**
 * CreativeWork + ImageObject JSON-LD for individual 2D technical drawing pages.
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

  const graph = [
    {
      "@type": "CreativeWork",
      "@id": `${pageUrl}#creativework`,
      url: pageUrl,
      name: pageTitle,
      description,
      encodingFormat: ["application/pdf", "image/svg+xml", "application/dxf"],
      ...(previewImage
        ? {
            image: { "@id": `${pageUrl}#primary-image` },
            thumbnailUrl: previewImage,
          }
        : {}),
    },
  ];

  if (previewImage) {
    graph.push({
      "@type": "ImageObject",
      "@id": `${pageUrl}#primary-image`,
      contentUrl: previewImage,
      name: `${pageTitle} — sheet preview`,
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default TwoDTechnicalDrawingPageJsonLd;

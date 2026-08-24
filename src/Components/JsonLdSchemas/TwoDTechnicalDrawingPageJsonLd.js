import React from "react";
import { SITE_URL } from "@/lib/seo/schema";
import { resolveLibraryTechDrawRoot } from "@/lib/techDraw/techDrawCdnRoots";

/**
 * CreativeWork + ImageObject JSON-LD for individual 2D technical drawing pages.
 */
function TwoDTechnicalDrawingPageJsonLd({
  designRoute,
  designId,
  pageTitle,
  description,
  version = false,
  outputS3Prefix = "",
}) {
  const path = `/library/2d-technical-drawings/${encodeURIComponent(String(designRoute || "").trim())}`;
  const pageUrl = `${SITE_URL}${path}`;
  const baseUrl = designId
    ? resolveLibraryTechDrawRoot({
        designId,
        version: Boolean(version),
        outputS3Prefix,
      })
    : "";
  const previewImage = baseUrl ? `${baseUrl}/svg/sheet_1.svg` : undefined;
  const encodingFormat = version
    ? ["image/svg+xml", "application/dxf"]
    : ["application/pdf", "image/svg+xml", "application/dxf"];

  const graph = [
    {
      "@type": "CreativeWork",
      "@id": `${pageUrl}#creativework`,
      url: pageUrl,
      name: pageTitle,
      description,
      encodingFormat,
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

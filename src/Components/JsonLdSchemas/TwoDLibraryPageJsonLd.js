import React from "react";

const SITE_URL = "https://marathon-os.com";
const LIBRARY_URL = `${SITE_URL}/library/2d-technical-drawings`;

function TwoDLibraryPageJsonLd({ designs = [], pagination = {}, page = 1, limit = 24 }) {
  const totalPages = pagination?.total_pages ?? 1;
  const numberOfItems = totalPages * limit;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "2D Technical Drawing Library",
    description:
      "Browse free 2D technical drawings generated from 3D CAD models. Download engineering drawing sheets in PDF, SVG and DXF formats for mechanical, robotics, automotive and industrial designs.",
    url: LIBRARY_URL,
    numberOfItems,
    itemListOrder: "https://schema.org/ItemListOrderUnordered",
    itemListElement: designs.map((design, index) => ({
      "@type": "ListItem",
      position: (page - 1) * limit + index + 1,
      item: {
        "@type": "webpage",
        "@id": `${SITE_URL}/library/2d-technical-drawings/${design.route}`,
        name: design.page_title || "2D Technical Drawing",
        url: `${SITE_URL}/library/2d-technical-drawings/${design.route}`,
      },
    })),
  };

  return (
    <script
      id="json-ld-2d-library-itemlist"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
    />
  );
}

export default TwoDLibraryPageJsonLd;


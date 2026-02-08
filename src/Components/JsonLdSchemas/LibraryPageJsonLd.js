import React from 'react';
import Script from 'next/script';

const SITE_URL = 'https://marathon-os.com';
const LIBRARY_URL = `${SITE_URL}/library`;

/**
 * Renders ItemList JSON-LD for the library page.
 * @param {Object} props
 * @param {Array<{ _id: string, route: string, page_title?: string }>} props.designs - List of designs on current page
 * @param {Object} props.pagination - { totalPages }
 * @param {number} props.page - Current page (1-based)
 * @param {number} props.limit - Items per page
 */
function LibraryPageJsonLd({ designs = [], pagination = {}, page = 1, limit = 20 }) {
  const totalPages = pagination?.totalPages ?? 1;
  const numberOfItems = totalPages * limit;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CAD Design Library',
    description: 'Browse Marathon OS CAD Design Library. Search and filter by category or tags, preview 3D CAD models and download files for engineering workflows.',
    url: LIBRARY_URL,
    numberOfItems,
    itemListOrder: 'https://schema.org/ItemListOrderUnordered',
    itemListElement: designs.map((design, index) => ({
      '@type': 'ListItem',
      position: (page - 1) * limit + index + 1,
      item: {
        '@type': 'webpage',
        '@id': `${SITE_URL}/library/${design.route}`,
        name: design.page_title || 'CAD Design',
        url: `${SITE_URL}/library/${design.route}`,
      },
    })),
  };

  return (
    <Script
      id="json-ld-library-itemlist"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
    />
  );
}

export default LibraryPageJsonLd;

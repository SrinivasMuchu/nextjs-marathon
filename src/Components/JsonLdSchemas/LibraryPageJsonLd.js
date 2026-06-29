import React from 'react';

const SITE_URL = 'https://marathon-os.com';
const DEFAULT_LIST_URL = `${SITE_URL}/library`;
const DEFAULT_LIST_TITLE = 'CAD Design Library';
const DEFAULT_LIST_DESCRIPTION =
  'Browse Marathon OS CAD Design Library. Search and filter by category or tags, preview 3D CAD models and download files for engineering workflows.';

/**
 * Renders ItemList JSON-LD for library-style listing pages (main library, 2D library, etc.).
 * @param {Object} props
 * @param {Array<{ _id: string, route: string, page_title?: string }>} props.designs - List of designs on current page
 * @param {Object} props.pagination - { totalPages }
 * @param {number} props.page - Current page (1-based)
 * @param {number} props.limit - Items per page
 * @param {string} [props.listUrl] - Canonical URL of the ItemList page
 * @param {string} [props.listTitle] - ItemList name
 * @param {string} [props.listDescription] - ItemList description
 * @param {string} [props.defaultItemName] - Fallback name for each list item
 * @param {string} [props.scriptId] - Script element id (must be unique per page)
 * @param {(design: object) => string} [props.getItemPath] - Site path for each design (leading slash, no origin), e.g. (d) => `/library/${d.route}`
 */
function LibraryPageJsonLd({
  designs = [],
  pagination = {},
  page = 1,
  limit = 20,
  listUrl = DEFAULT_LIST_URL,
  listTitle = DEFAULT_LIST_TITLE,
  listDescription = DEFAULT_LIST_DESCRIPTION,
  defaultItemName = 'CAD Design',
  scriptId = 'json-ld-library-itemlist',
  getItemPath,
}) {
  const totalPages = pagination?.totalPages ?? 1;
  const numberOfItems = totalPages * limit;
  const resolvePath =
    getItemPath ||
    ((design) => `/library/${design.route}`);

  const itemListId = `${listUrl}#itemlist`;
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': itemListId,
    name: listTitle,
    description: listDescription,
    url: listUrl,
    numberOfItems,
    itemListOrder: 'https://schema.org/ItemListOrderUnordered',
    itemListElement: designs.map((design, index) => {
      const path = resolvePath(design);
      const itemFullUrl = `${SITE_URL}${path}`;
      return {
        '@type': 'ListItem',
        position: (page - 1) * limit + index + 1,
        item: {
          '@type': 'webpage',
          '@id': itemFullUrl,
          name: design.page_title || defaultItemName,
          url: itemFullUrl,
        },
      };
    }),
  };

  return (
    <script
      id={scriptId}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
    />
  );
}

export default LibraryPageJsonLd;

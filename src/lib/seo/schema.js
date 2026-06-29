export const SITE_URL = 'https://marathon-os.com';

/**
 * @param {Array<{ label: string, href?: string }>} links
 */
export function buildBreadcrumbListSchema(links = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...links.map((item, index) => {
        const isLast = index === links.length - 1;
        return {
          '@type': 'ListItem',
          position: index + 2,
          name: item.label,
          ...(isLast || !item.href ? {} : { item: `${SITE_URL}${item.href}` }),
        };
      }),
    ],
  };
}

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.url - Full URL
 * @param {string} [props.description]
 * @param {string} [props.mainEntityId] - Fragment id of linked ItemList
 */
export function buildCollectionPageSchema({ name, url, description, mainEntityId }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
    ...(description ? { description } : {}),
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
  };
}

/**
 * @param {string | string[]} imageUrls
 * @param {string} [name]
 */
export function buildImageObjectSchemas(imageUrls, name = 'Preview image') {
  const urls = (Array.isArray(imageUrls) ? imageUrls : [imageUrls]).filter(Boolean);
  return urls.map((contentUrl, index) => ({
    '@type': 'ImageObject',
    ...(urls.length === 1 ? { '@id': '#primary-image' } : {}),
    contentUrl,
    name: urls.length > 1 ? `${name} ${index + 1}` : name,
  }));
}

export function jsonLdScriptProps(schema) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  };
}

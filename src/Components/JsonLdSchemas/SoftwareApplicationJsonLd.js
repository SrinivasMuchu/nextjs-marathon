import React from 'react';

/**
 * SoftwareApplication JSON-LD in initial HTML (server-rendered).
 */
function SoftwareApplicationJsonLd({
  name,
  url,
  description,
  price = '0',
  priceCurrency = 'USD',
  offers,
}) {
  if (!name || !url) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory: 'EngineeringApplication',
    operatingSystem: 'Web',
    url,
    ...(description ? { description } : {}),
    offers: offers || {
      '@type': 'Offer',
      price,
      priceCurrency,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default SoftwareApplicationJsonLd;

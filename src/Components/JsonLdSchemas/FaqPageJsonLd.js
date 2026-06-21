import React from 'react';

/**
 * FAQPage JSON-LD in initial HTML (server-rendered).
 * Pass the same faqSchemaData used by OrgFaq.
 */
function FaqPageJsonLd({ faqSchemaData }) {
  if (!faqSchemaData?.length) return null;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqSchemaData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  );
}

export default FaqPageJsonLd;

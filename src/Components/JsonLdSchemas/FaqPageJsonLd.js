import React from 'react';
import Script from 'next/script';
/**
 * Renders FAQPage JSON-LD script. Pass the same faqSchemaData used by OrgFaq.
 * Each item should have { question: string, answer: string } for valid schema.
 */
function FaqPageJsonLd({ faqSchemaData }) {
 

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqSchemaData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Script
        id="json-ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
  );
}

export default FaqPageJsonLd;

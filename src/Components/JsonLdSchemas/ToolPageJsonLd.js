import React from 'react';
import SoftwareApplicationJsonLd from './SoftwareApplicationJsonLd';
import BreadcrumbListJsonLd from './BreadcrumbListJsonLd';

/**
 * SoftwareApplication + BreadcrumbList for main Marathon OS tool pages.
 */
export default function ToolPageJsonLd({
  name,
  url,
  description,
  price = '0',
  priceCurrency = 'USD',
  breadcrumbLinks = [],
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name={name}
        url={url}
        description={description}
        price={price}
        priceCurrency={priceCurrency}
      />
      <BreadcrumbListJsonLd links={breadcrumbLinks} />
    </>
  );
}

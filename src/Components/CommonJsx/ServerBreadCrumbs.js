import React from 'react';
import { buildBreadcrumbListSchema } from '@/lib/seo/schema';

function ServerBreadCrumbs({ links = [] }) {
  const breadcrumbList = buildBreadcrumbListSchema(links);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}

export default ServerBreadCrumbs;

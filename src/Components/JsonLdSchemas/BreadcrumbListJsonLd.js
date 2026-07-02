import React from 'react';
import { buildBreadcrumbListSchema, jsonLdScriptProps } from '@/lib/seo/schema';

/**
 * @param {{ links?: Array<{ label: string, href?: string }>, scriptId?: string }} props
 */
export default function BreadcrumbListJsonLd({ links = [], scriptId }) {
  if (!links.length) return null;
  return (
    <script
      {...(scriptId ? { id: scriptId } : {})}
      {...jsonLdScriptProps(buildBreadcrumbListSchema(links))}
    />
  );
}

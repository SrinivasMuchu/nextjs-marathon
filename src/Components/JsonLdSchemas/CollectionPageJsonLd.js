import React from 'react';
import { buildCollectionPageSchema, jsonLdScriptProps } from '@/lib/seo/schema';

/**
 * @param {{ name: string, url: string, description?: string, mainEntityId?: string, scriptId?: string }} props
 */
export default function CollectionPageJsonLd({
  name,
  url,
  description,
  mainEntityId,
  scriptId = 'json-ld-collection-page',
}) {
  if (!name || !url) return null;
  return (
    <script
      id={scriptId}
      {...jsonLdScriptProps(
        buildCollectionPageSchema({ name, url, description, mainEntityId })
      )}
    />
  );
}

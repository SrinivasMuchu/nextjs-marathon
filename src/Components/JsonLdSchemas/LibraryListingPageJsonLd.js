import React from 'react';
import CollectionPageJsonLd from './CollectionPageJsonLd';
import LibraryPageJsonLd from './LibraryPageJsonLd';

/**
 * CollectionPage + ItemList for library-style listing pages.
 */
export default function LibraryListingPageJsonLd({
  collectionName,
  collectionUrl,
  collectionDescription,
  mainEntityId,
  designs,
  pagination,
  page,
  limit,
  listTitle,
  listDescription,
  defaultItemName,
  scriptId,
  getItemPath,
}) {
  const itemListId = mainEntityId || `${collectionUrl}#itemlist`;

  return (
    <>
      <CollectionPageJsonLd
        name={collectionName || listTitle}
        url={collectionUrl}
        description={collectionDescription || listDescription}
        mainEntityId={itemListId}
        scriptId={`${scriptId || 'json-ld-library'}-collection`}
      />
      <LibraryPageJsonLd
        designs={designs}
        pagination={pagination}
        page={page}
        limit={limit}
        listUrl={collectionUrl}
        listTitle={listTitle}
        listDescription={listDescription}
        defaultItemName={defaultItemName}
        scriptId={scriptId}
        getItemPath={getItemPath}
      />
    </>
  );
}

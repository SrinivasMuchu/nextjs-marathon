import React from 'react';
import {
  LIBRARY_BROWSE_PARTS_META,
  TWO_D_BROWSE_PARTS_META,
} from '@/data/libraryHubSections';
import LibraryBrowsePartsSection from './LibraryBrowsePartsSection';
import LibraryBuildKitsSection from './LibraryBuildKitsSection';

/** Server-only hub discovery blocks below the category scroller. */
export default function LibraryDiscoverySections({
  browsePartsTags = [],
  libraryMode = '3d',
}) {
  const partsMeta = libraryMode === '2d' ? TWO_D_BROWSE_PARTS_META : LIBRARY_BROWSE_PARTS_META;

  return (
    <>
      <LibraryBrowsePartsSection
        tags={browsePartsTags}
        title={partsMeta.title}
        subtitle={partsMeta.subtitle}
        seeAllHref={partsMeta.seeAllHref}
        seeAllLabel={partsMeta.seeAllLabel}
        libraryMode={libraryMode}
      />
      {libraryMode === '3d' ? <LibraryBuildKitsSection /> : null}
    </>
  );
}

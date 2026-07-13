import React from 'react';
import {
  LIBRARY_BROWSE_PARTS_META,
  TWO_D_BROWSE_PARTS_META,
} from '@/data/libraryHubSections';
import LibraryBrowsePartsSection from './LibraryBrowsePartsSection';
import LibraryBuildKitsSection from './LibraryBuildKitsSection';

/** Hub discovery blocks below the category scroller. */
export default function LibraryDiscoverySections({
  browsePartsTags = [],
  buildKitClusters = [],
  libraryMode = '3d',
  activeTag = '',
  activeClusterId = '',
  categoryName = null,
  filterState = {},
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
        activeTag={activeTag}
        categoryName={categoryName}
      />
      {buildKitClusters.length > 0 ? (
        <LibraryBuildKitsSection
          clusters={buildKitClusters}
          libraryMode={libraryMode}
          activeClusterId={activeClusterId}
          filterState={filterState}
        />
      ) : null}
    </>
  );
}

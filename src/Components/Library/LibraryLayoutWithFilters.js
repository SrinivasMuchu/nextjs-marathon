'use client';

import React, { useState } from 'react';
import LibraryFiltersWrapper from './LibraryFiltersWrapper';
import FilterListIcon from '@mui/icons-material/FilterList';
import styles from './Library.module.css';
import panelStyles from './LibraryFiltersPanel.module.css';

export default function LibraryLayoutWithFilters({
  filterProps,
  toolbarLeft,
  toolbarSort,
  children,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className={styles['library-layout-full']}>
      <main className={styles['library-content']}>
        <div className={styles['library-content-head']}>
          {toolbarLeft}
          <div className={styles['library-toolbar-actions']}>
            <button
              type="button"
              className={`${panelStyles.filtersTrigger} ${panelOpen ? panelStyles.filtersTriggerActive : ''}`}
              onClick={() => setPanelOpen((open) => !open)}
              aria-expanded={panelOpen}
              aria-controls="library-filters-panel"
            >
              <FilterListIcon fontSize="small" aria-hidden />
              <span>Filters</span>
            </button>
            {toolbarSort ? (
              <div className={styles['library-content-sort']}>
                <span className={styles['library-content-sort-label']}>Sort by:</span>
                {toolbarSort}
              </div>
            ) : null}
          </div>
        </div>

        {panelOpen ? (
          <div
            id="library-filters-panel"
            className={panelStyles.filtersPanel}
            role="region"
            aria-label="Library filters"
          >
            <LibraryFiltersWrapper
              {...filterProps}
              variant="panel"
              panelOpen={panelOpen}
              onClosePanel={() => setPanelOpen(false)}
            />
          </div>
        ) : null}

        {children}
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import LibraryFiltersWrapper from './LibraryFiltersWrapper';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Library.module.css';

const COLUMN_BREAKPOINT = 900;

function useIsColumn() {
  const [isColumn, setIsColumn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${COLUMN_BREAKPOINT}px)`);
    const update = () => setIsColumn(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isColumn;
}

export default function LibraryLayoutWithFilters({
  filterProps,
  contentHead,
  children,
}) {
  const isColumn = useIsColumn();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [sheetOpen]);

  return (
    <div className={styles['library-layout']}>
      {!isColumn && (
        <aside className={styles['library-filters']}>
          <LibraryFiltersWrapper {...filterProps} />
        </aside>
      )}

      <main className={styles['library-content']}>
        <div className={styles['library-content-head']}>
          {isColumn && (
            <button
              type="button"
              className={styles['library-filters-mobile-trigger']}
              onClick={() => setSheetOpen(true)}
              aria-label="Open filters"
            >
              <FilterListIcon fontSize="small" aria-hidden />
              <span>Filters</span>
            </button>
          )}
          {contentHead}
        </div>
        {children}
      </main>

      {isColumn && (
        <>
          <div
            className={`${styles['library-filters-sheet-backdrop']} ${sheetOpen ? styles['library-filters-sheet-backdrop-open'] : ''}`}
            aria-hidden
            onClick={() => setSheetOpen(false)}
          />
          <div
            className={`${styles['library-filters-sheet-panel']} ${sheetOpen ? styles['library-filters-sheet-panel-open'] : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="library-filters-sheet-title"
          >
            <div className={styles['library-filters-sheet-header']}>
              <h2 id="library-filters-sheet-title" className={styles['library-filters-sheet-title']}>
                Filters
              </h2>
              <button
                type="button"
                className={styles['library-filters-sheet-close']}
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
              >
                <CloseIcon fontSize="medium" />
              </button>
            </div>
            <div className={styles['library-filters-sheet-body']}>
              <LibraryFiltersWrapper {...filterProps} inSheet sheetOpen={sheetOpen} onCloseSheet={() => setSheetOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import {
  TWO_D_FILTER_CATEGORIES,
  TWO_D_FREE_PAID,
  TWO_D_OUTPUT_FORMATS,
  TWO_D_PROJECTION_TYPES,
  TWO_D_SHEET_FILTERS,
  TWO_D_SOURCE_FORMATS,
  buildTwoDLibraryHref,
} from '@/data/twoDLibraryPage';
import styles from './TwoDLibrary.module.css';
import libraryStyles from './Library.module.css';

function FilterGroup({ title, children }) {
  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterGroupTitle}>{title}</h3>
      {children}
    </div>
  );
}

function FilterLink({ href, active, children }) {
  return (
    <Link href={href} className={`${styles.filterOption} ${active ? styles.filterOptionActive : ''}`}>
      {children}
    </Link>
  );
}

function TwoDLibraryFiltersPanel({
  basePath,
  searchParams,
  inSheet = false,
  onCloseSheet,
}) {
  const current = searchParams || {};
  const build = (overrides) =>
    buildTwoDLibraryHref({
      basePath,
      search: current.search,
      category: current.category,
      source_format: current.source_format,
      output_format: current.output_format,
      sheets: current.sheets,
      projection: current.projection,
      free_paid: current.free_paid,
      recently_generated: current.recently_generated,
      ...overrides,
    });

  return (
    <div className={styles.filtersPanel}>
      {inSheet ? (
        <div className={libraryStyles['library-filters-sheet-header']}>
          <h2 className={libraryStyles['library-filters-sheet-title']}>Filters</h2>
          <button type="button" className={libraryStyles['library-filters-sheet-close']} onClick={onCloseSheet} aria-label="Close filters">
            <CloseIcon fontSize="small" />
          </button>
        </div>
      ) : null}

      <FilterGroup title="Category">
        {TWO_D_FILTER_CATEGORIES.map((item) => (
          <FilterLink key={item.value || 'all'} href={build({ category: item.value || undefined, page: 1 })} active={(current.category || '') === item.value}>
            {item.label}
          </FilterLink>
        ))}
      </FilterGroup>

      <FilterGroup title="Source CAD format">
        {TWO_D_SOURCE_FORMATS.map((item) => (
          <FilterLink key={item.value || 'all'} href={build({ source_format: item.value || undefined, page: 1 })} active={(current.source_format || '') === item.value}>
            {item.label}
          </FilterLink>
        ))}
      </FilterGroup>

      <FilterGroup title="Output format">
        {TWO_D_OUTPUT_FORMATS.map((item) => (
          <FilterLink key={item.value || 'all'} href={build({ output_format: item.value || undefined, page: 1 })} active={(current.output_format || '') === item.value}>
            {item.label}
          </FilterLink>
        ))}
      </FilterGroup>

      <FilterGroup title="Number of sheets">
        {TWO_D_SHEET_FILTERS.map((item) => (
          <FilterLink key={item.value || 'all'} href={build({ sheets: item.value || undefined, page: 1 })} active={(current.sheets || '') === item.value}>
            {item.label}
          </FilterLink>
        ))}
      </FilterGroup>

      <FilterGroup title="Projection type">
        {TWO_D_PROJECTION_TYPES.map((item) => (
          <FilterLink key={item.value || 'all'} href={build({ projection: item.value || undefined, page: 1 })} active={(current.projection || '') === item.value}>
            {item.label}
          </FilterLink>
        ))}
      </FilterGroup>

      <FilterGroup title="Free or paid">
        {TWO_D_FREE_PAID.map((item) => (
          <FilterLink key={item.value || 'all'} href={build({ free_paid: item.value || undefined, page: 1 })} active={(current.free_paid || '') === item.value}>
            {item.label}
          </FilterLink>
        ))}
      </FilterGroup>

      <FilterGroup title="Recently generated">
        <FilterLink href={build({ recently_generated: undefined, page: 1 })} active={!current.recently_generated}>
          All time
        </FilterLink>
        <FilterLink href={build({ recently_generated: '1', page: 1 })} active={current.recently_generated === '1'}>
          Recently generated
        </FilterLink>
      </FilterGroup>

      <Link href={basePath} className={styles.clearFilters}>
        Clear all filters
      </Link>
    </div>
  );
}

export default function TwoDLibraryLayoutWithFilters({
  basePath,
  searchParams,
  total,
  children,
}) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [isColumn, setIsColumn] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setIsColumn(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  React.useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        searchParams?.category ||
          searchParams?.source_format ||
          searchParams?.output_format ||
          searchParams?.sheets ||
          searchParams?.projection ||
          searchParams?.free_paid ||
          searchParams?.recently_generated ||
          searchParams?.search
      ),
    [searchParams]
  );

  return (
    <div className={libraryStyles['library-layout']}>
      {!isColumn && (
        <aside className={libraryStyles['library-filters']}>
          <TwoDLibraryFiltersPanel basePath={basePath} searchParams={searchParams} />
        </aside>
      )}

      <main className={libraryStyles['library-content']}>
        <div className={libraryStyles['library-content-head']}>
          {isColumn && (
            <button
              type="button"
              className={libraryStyles['library-filters-mobile-trigger']}
              onClick={() => setSheetOpen(true)}
              aria-label="Open filters"
            >
              <FilterListIcon fontSize="small" aria-hidden />
              <span>Filters{hasActiveFilters ? ' (active)' : ''}</span>
            </button>
          )}
          <span className={libraryStyles['library-resources-count']}>
            2D Designs ({total} results)
          </span>
        </div>
        {children}
      </main>

      {isColumn && (
        <>
          <div
            className={`${libraryStyles['library-filters-sheet-backdrop']} ${sheetOpen ? libraryStyles['library-filters-sheet-backdrop-open'] : ''}`}
            aria-hidden
            onClick={() => setSheetOpen(false)}
          />
          <div
            className={`${libraryStyles['library-filters-sheet-panel']} ${sheetOpen ? libraryStyles['library-filters-sheet-panel-open'] : ''}`}
            role="dialog"
            aria-modal="true"
          >
            <TwoDLibraryFiltersPanel
              basePath={basePath}
              searchParams={searchParams}
              inSheet
              onCloseSheet={() => setSheetOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchBar from './SearchFilter';
import styles from './Library.module.css';
import { getLibraryPathWithQuery } from '@/common.helper';
import { LIBRARY_FILE_FORMAT_FILTERS } from '@/data/libraryPage';
import {
  TWO_D_OUTPUT_FORMAT_FILTER_OPTIONS,
  TWO_D_PROJECTION_FILTERS,
  get2DLibraryPathWithQuery,
} from '@/data/twoDLibraryPage';

const RECENCY_RADIO = [
  { value: '', label: 'All Time' },
  { value: '24h', label: 'Last 24h' },
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'year', label: 'Last Year' },
];

const FREE_PAID_RADIO = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

const TAGS_PAGE_SIZE = 10;

function buildFiltersListUrl(libraryListMode, params) {
  if (libraryListMode === '2d') {
    return get2DLibraryPathWithQuery(params);
  }
  return getLibraryPathWithQuery(params);
}

export default function LibraryFilters({
  category,
  tags,
  allCategories = [],
  allTags = [],
  initialSearchQuery = '',
  initialSort,
  initialRecency,
  initialFreePaid,
  initialFileFormat,
  initialTwoDims = '',
  libraryListMode = '3d',
  resetListHref = '/library',
  fileFormatLabel = 'File Format',
  fileFormatOptions = LIBRARY_FILE_FORMAT_FILTERS,
  show2DExtraFilters = false,
  initialOutputFormat = '',
  initialProjection = '',
  hasActiveFilters,
  tagsHasMore,
  onLoadMoreTags,
  loadingTags = false,
  tagSearch: tagSearchProp,
  onTagSearchChange,
  inSheet,
  sheetOpen,
  onCloseSheet,
}) {
  const router = useRouter();
  const [tagSearchLocal, setTagSearchLocal] = useState('');
  const [tagsVisibleCount, setTagsVisibleCount] = useState(TAGS_PAGE_SIZE);

  /* When sheet is open, hold selections in local state until Apply is clicked */
  const [localSearch, setLocalSearch] = useState(initialSearchQuery || '');
  const [localSort, setLocalSort] = useState(initialSort || 'newest');
  const [localRecency, setLocalRecency] = useState(initialRecency || '');
  const [localFreePaid, setLocalFreePaid] = useState(initialFreePaid || '');
  const [localFormats, setLocalFormats] = useState(() =>
    (initialFileFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean)
  );
  const [localCategory, setLocalCategory] = useState(category || '');
  const [localTag, setLocalTag] = useState(tags || '');
  const [localOutputFormats, setLocalOutputFormats] = useState(() =>
    (initialOutputFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean)
  );
  const [localProjection, setLocalProjection] = useState(initialProjection || '');
  const prevSheetOpenRef = React.useRef(false);

  /* Sync local state from URL when sheet opens (mobile) */
  useEffect(() => {
    if (inSheet && sheetOpen && !prevSheetOpenRef.current) {
      setLocalSearch(initialSearchQuery || '');
      setLocalSort(initialSort || 'newest');
      setLocalRecency(initialRecency || '');
      setLocalFreePaid(initialFreePaid || '');
      setLocalFormats((initialFileFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean));
      setLocalCategory(category || '');
      setLocalTag(tags || '');
      setLocalOutputFormats((initialOutputFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean));
      setLocalProjection(initialProjection || '');
    }
    prevSheetOpenRef.current = !!sheetOpen;
  }, [inSheet, sheetOpen, initialSearchQuery, initialSort, initialRecency, initialFreePaid, initialFileFormat, initialTwoDims, initialOutputFormat, initialProjection, category, tags]);

  const tagSearch = typeof onTagSearchChange === 'function' ? (tagSearchProp ?? '') : tagSearchLocal;
  const setTagSearch = typeof onTagSearchChange === 'function' ? onTagSearchChange : setTagSearchLocal;

  const useTagsApiPagination = typeof onLoadMoreTags === 'function';

  /* Desktop: build URL from current URL state (props). Sheet: use local state. */
  const buildListUrl = useMemo(() => {
    const baseParams = {
      categoryName: category || null,
      tagName: tags || null,
      search: initialSearchQuery,
      sort: initialSort,
      recency: initialRecency,
      free_paid: initialFreePaid,
      file_format: initialFileFormat,
      two_dims: initialTwoDims,
      output_format: initialOutputFormat,
      projection: initialProjection,
      page: 1,
    };
    return (overrides = {}) =>
      buildFiltersListUrl(libraryListMode, { ...baseParams, ...overrides });
  }, [
    category,
    tags,
    initialSearchQuery,
    initialSort,
    initialRecency,
    initialFreePaid,
    initialFileFormat,
    initialTwoDims,
    initialOutputFormat,
    initialProjection,
    libraryListMode,
  ]);

  const buildLibraryUrl = buildListUrl;

  const selectedFormats = inSheet ? localFormats : (initialFileFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean);
  const selectedOutputFormats = inSheet
    ? localOutputFormats
    : (initialOutputFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean);
  const displayTag = inSheet ? localTag : tags;
  const displayRecency = inSheet ? localRecency : initialRecency;
  const displayFreePaid = inSheet ? localFreePaid : initialFreePaid;
  const displayProjection = inSheet ? localProjection : initialProjection;

  /* URL for Apply Filters – used as Link href on mobile so navigation is a real link */
  const applyFiltersUrl = useMemo(
    () =>
      buildFiltersListUrl(libraryListMode, {
        categoryName: (localCategory || category) || null,
        tagName: localTag || null,
        search: (localSearch || '').trim() || undefined,
        sort: localSort || undefined,
        recency: localRecency || undefined,
        free_paid: localFreePaid || undefined,
        file_format: localFormats.length ? localFormats.join(',') : undefined,
        output_format: localOutputFormats.length ? localOutputFormats.join(',') : undefined,
        projection: localProjection || undefined,
        two_dims: libraryListMode === '3d' ? initialTwoDims || undefined : undefined,
        page: 1,
      }),
    [
      category,
      localCategory,
      localTag,
      localSearch,
      localSort,
      localRecency,
      localFreePaid,
      localFormats,
      localOutputFormats,
      localProjection,
      initialTwoDims,
      libraryListMode,
    ]
  );

  /* Normalize tags array (backend may not return count; we only need the list) */
  const tagsList = useMemo(() => (Array.isArray(allTags) ? allTags : []), [allTags]);

  const filteredTags = useMemo(() => {
    if (typeof onTagSearchChange === 'function') return tagsList;
    const q = (tagSearch || '').trim().toLowerCase();
    if (!q) return tagsList;
    return tagsList.filter((t) => {
      const label = t?.cad_tag_label ?? t?.cad_tag_name ?? t?.label ?? t?.name ?? '';
      return String(label).toLowerCase().includes(q);
    });
  }, [tagsList, tagSearch, onTagSearchChange]);

  const tagsToShow = useMemo(
    () => (useTagsApiPagination ? filteredTags : filteredTags.slice(0, tagsVisibleCount)),
    [filteredTags, tagsVisibleCount, useTagsApiPagination]
  );
  const hasMoreTags = useTagsApiPagination
    ? !!tagsHasMore
    : tagsVisibleCount < filteredTags.length ||
      (filteredTags.length >= TAGS_PAGE_SIZE && tagsVisibleCount === TAGS_PAGE_SIZE);

  const loadMoreTags = useTagsApiPagination
    ? () => onLoadMoreTags()
    : () => setTagsVisibleCount((prev) => prev + TAGS_PAGE_SIZE);

  useEffect(() => {
    setTagsVisibleCount(TAGS_PAGE_SIZE);
  }, [tagSearch]);

  const toggleFileFormat = (formatValue, checked) => {
    const current = selectedFormats;
    const next = checked ? [...current, formatValue] : current.filter((f) => f !== formatValue);
    if (inSheet) {
      setLocalFormats(next);
      return;
    }
    router.push(buildLibraryUrl({ file_format: next.length ? next.join(',') : undefined }));
  };

  const toggleOutputFormat = (formatValue, checked) => {
    const current = selectedOutputFormats;
    const next = checked ? [...current, formatValue] : current.filter((f) => f !== formatValue);
    if (inSheet) {
      setLocalOutputFormats(next);
      return;
    }
    router.push(buildLibraryUrl({ output_format: next.length ? next.join(',') : undefined }));
  };

  return (
    <div className={styles['library-filters-inner']}>
      {!inSheet && (
        <div className={styles['library-filters-head']}>
          <h2 className={styles['library-filters-title']}>Filters</h2>
          {hasActiveFilters && (
            <Link href={resetListHref} className={styles['library-filters-reset']}>
              Reset filters
            </Link>
          )}
        </div>
      )}
      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Search</span>
        <div className={styles['library-filters-search']}>
          {inSheet ? (
            <div className={styles['library-filters-tag-search']}>
              <SearchIcon className={styles['library-filters-tag-search-icon']} />
              <input
                type="text"
                placeholder="Search designs..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className={styles['library-filters-tag-search-input']}
                aria-label="Search designs"
              />
            </div>
          ) : (
            <SearchBar initialSearchQuery={initialSearchQuery} placeholder="Search designs..." />
          )}
        </div>
      </div>

      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Recency</span>
        <div className={styles['library-filters-radio-group']} role="radiogroup" aria-label="Recency">
          {RECENCY_RADIO.map(({ value, label }) => {
            const isActive = (displayRecency || '') === value;
            const url = buildLibraryUrl({ recency: value || undefined });
            return inSheet ? (
              <label key={value || 'all'} className={styles['library-filters-radio-label']}>
                <input
                  type="radio"
                  name="recency"
                  checked={isActive}
                  onChange={() => setLocalRecency(value)}
                  className={styles['library-filters-radio']}
                />
                <span>{label}</span>
              </label>
            ) : (
              <Link
                key={value || 'all'}
                href={url}
                className={styles['library-filters-radio-label'] + (isActive ? ` ${styles['library-filters-radio-active']}` : '')}
                aria-checked={isActive}
                role="radio"
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Free / Paid</span>
        <div className={styles['library-filters-radio-group']} role="radiogroup" aria-label="Free or Paid">
          {FREE_PAID_RADIO.map(({ value, label }) => {
            const isActive = (displayFreePaid || '') === value;
            const url = buildLibraryUrl({ free_paid: value || undefined });
            return inSheet ? (
              <label key={value || 'all'} className={styles['library-filters-radio-label']}>
                <input
                  type="radio"
                  name="free_paid"
                  checked={isActive}
                  onChange={() => setLocalFreePaid(value)}
                  className={styles['library-filters-radio']}
                />
                <span>{label}</span>
              </label>
            ) : (
              <Link
                key={value || 'all'}
                href={url}
                className={styles['library-filters-radio-label'] + (isActive ? ` ${styles['library-filters-radio-active']}` : '')}
                aria-checked={isActive}
                role="radio"
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Tags</span>
        <div className={styles['library-filters-tag-search']}>
          <SearchIcon className={styles['library-filters-tag-search-icon']} />
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className={styles['library-filters-tag-search-input']}
            aria-label="Search tags"
          />
        </div>
        <div className={styles['library-filters-tags-scroll']}>
          <div className={styles['library-filters-tag-pills']}>
            {tagsToShow.map((tag) => {
              const tagValue = tag?.cad_tag_name ?? tag?.name ?? tag?._id ?? '';
              const tagLabel = tag?.cad_tag_label ?? tag?.cad_tag_name ?? tag?.label ?? tag?.name ?? String(tagValue);
              const isActive = displayTag === tagValue;
              /* With category: /library/categoryname/tagname; without: /library/tag/tagname */
              const tagUrl = buildLibraryUrl({ categoryName: category || null, tagName: isActive ? null : tagValue });
              return inSheet ? (
                <button
                  key={tagValue}
                  type="button"
                  className={styles['library-filters-tag-pill'] + (isActive ? ` ${styles['library-filters-tag-pill-active']}` : '')}
                  onClick={() => setLocalTag(isActive ? '' : tagValue)}
                >
                  {tagLabel}
                </button>
              ) : (
                <Link
                  key={tagValue}
                  href={tagUrl}
                  className={styles['library-filters-tag-pill'] + (isActive ? ` ${styles['library-filters-tag-pill-active']}` : '')}
                >
                  {tagLabel}
                </Link>
              );
            })}
          </div>
        </div>
        {hasMoreTags && (
          <button
            type="button"
            className={styles['library-filters-show-more']}
            onClick={loadMoreTags}
            disabled={loadingTags}
          >
            {loadingTags ? 'Loading...' : 'Show more'}
            <ExpandMoreIcon fontSize="small" />
          </button>
        )}
      </div>

      {/* Category filter – mobile sheet: radio, applied on \"Apply Filters\" */}
      <div className={styles['library-filters-section-category']}>
        <span className={styles['library-filters-label']}>Category</span>
        <div className={styles['library-filters-checkbox-group']}>
          {/* All categories option */}
          <label className={styles['library-filters-checkbox-label']}>
            <input
              type="radio"
              name="category-filter"
              checked={(localCategory || '') === ''}
              onChange={() => setLocalCategory('')}
              className={styles['library-filters-checkbox']}
            />
            <span>All categories</span>
          </label>

          {allCategories.map((cat) => (
            <label key={cat.industry_category_name} className={styles['library-filters-checkbox-label']}>
              <input
                type="radio"
                name="category-filter"
                checked={localCategory === cat.industry_category_name}
                onChange={() => setLocalCategory(cat.industry_category_name)}
                className={styles['library-filters-checkbox']}
              />
              <span>{cat.industry_category_label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Source CAD format — hidden on 2D library for now */}
      {libraryListMode !== '2d' && (
      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>{fileFormatLabel}</span>
        <div className={styles['library-filters-format-chips']}>
          {fileFormatOptions.map(({ value, label }) => {
            const isActive = selectedFormats.includes(value);
            const nextFormats = isActive
              ? selectedFormats.filter((f) => f !== value)
              : [...selectedFormats, value];
            const formatUrl = buildLibraryUrl({
              file_format: nextFormats.length ? nextFormats.join(',') : undefined,
            });
            return inSheet ? (
              <button
                key={value}
                type="button"
                className={
                  styles['library-filters-format-chip'] +
                  (isActive ? ` ${styles['library-filters-format-chip-active']}` : '')
                }
                onClick={() => toggleFileFormat(value, !isActive)}
              >
                {label}
              </button>
            ) : (
              <Link
                key={value}
                href={formatUrl}
                className={
                  styles['library-filters-format-chip'] +
                  (isActive ? ` ${styles['library-filters-format-chip-active']}` : '')
                }
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
      )}

      {/* Output format + projection type — hidden on 2D library for now */}
      {false && show2DExtraFilters && (
        <>
          <div className={styles['library-filters-section']}>
            <span className={styles['library-filters-label']}>Output format</span>
            <div className={styles['library-filters-format-chips']}>
              {TWO_D_OUTPUT_FORMAT_FILTER_OPTIONS.map(({ value, label }) => {
                const isActive = selectedOutputFormats.includes(value);
                const nextFormats = isActive
                  ? selectedOutputFormats.filter((f) => f !== value)
                  : [...selectedOutputFormats, value];
                const formatUrl = buildLibraryUrl({
                  output_format: nextFormats.length ? nextFormats.join(',') : undefined,
                });
                return inSheet ? (
                  <button
                    key={value}
                    type="button"
                    className={
                      styles['library-filters-format-chip'] +
                      (isActive ? ` ${styles['library-filters-format-chip-active']}` : '')
                    }
                    onClick={() => toggleOutputFormat(value, !isActive)}
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    key={value}
                    href={formatUrl}
                    className={
                      styles['library-filters-format-chip'] +
                      (isActive ? ` ${styles['library-filters-format-chip-active']}` : '')
                    }
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={styles['library-filters-section']}>
            <span className={styles['library-filters-label']}>Projection type</span>
            <div className={styles['library-filters-radio-group']} role="radiogroup" aria-label="Projection type">
              {TWO_D_PROJECTION_FILTERS.map(({ value, label }) => {
                const isActive = (displayProjection || '') === value;
                const url = buildLibraryUrl({ projection: value || undefined });
                return inSheet ? (
                  <label key={value || 'any-projection'} className={styles['library-filters-radio-label']}>
                    <input
                      type="radio"
                      name="projection-type"
                      checked={isActive}
                      onChange={() => setLocalProjection(value)}
                      className={styles['library-filters-radio']}
                    />
                    <span>{label}</span>
                  </label>
                ) : (
                  <Link
                    key={value || 'any-projection'}
                    href={url}
                    className={styles['library-filters-radio-label'] + (isActive ? ` ${styles['library-filters-radio-active']}` : '')}
                    aria-checked={isActive}
                    role="radio"
                  >
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {inSheet && (
        <div className={styles['library-filters-sheet-footer']}>
          <Link
            href={applyFiltersUrl}
            className={styles['library-filters-sheet-apply']}
            onClick={() => typeof onCloseSheet === 'function' && onCloseSheet()}
          >
            Apply Filters
          </Link>
        </div>
      )}
    </div>
  );
}

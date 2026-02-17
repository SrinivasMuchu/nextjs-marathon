'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchBar from './SearchFilter';
import styles from './Library.module.css';
import { getLibraryPathWithQuery } from '@/common.helper';

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

const FILE_FORMAT_CHECKBOXES = [
  { value: 'STEP', label: '.STEP' },
  { value: 'STP', label: '.STP' },
  { value: 'STL', label: '.STL' },
  { value: 'PLY', label: '.PLY' },
  { value: 'OFF', label: '.OFF' },
  { value: 'IGS', label: '.IGS' },
  { value: 'IGES', label: '.IGES' },
  { value: 'BRP', label: '.BRP' },
  { value: 'BREP', label: '.BREP' },
  { value: 'OBJ', label: '.OBJ' },
  { value: 'DXF', label: '.DXF' },
  { value: 'DWG', label: '.DWG' },
];

const SORT_RADIO = [
  { value: 'newest', label: 'Newest First' },
  { value: 'views', label: 'Most Views' },
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'oldest', label: 'Oldest First' },
];

const TAGS_PAGE_SIZE = 10;

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
  const prevSheetOpenRef = React.useRef(false);

  /* Sync local state from URL when sheet opens */
  useEffect(() => {
    if (inSheet && sheetOpen && !prevSheetOpenRef.current) {
      setLocalSearch(initialSearchQuery || '');
      setLocalSort(initialSort || 'newest');
      setLocalRecency(initialRecency || '');
      setLocalFreePaid(initialFreePaid || '');
      setLocalFormats((initialFileFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean));
      setLocalCategory(category || '');
      setLocalTag(tags || '');
    }
    prevSheetOpenRef.current = !!sheetOpen;
  }, [inSheet, sheetOpen, initialSearchQuery, initialSort, initialRecency, initialFreePaid, initialFileFormat, tags]);

  const tagSearch = typeof onTagSearchChange === 'function' ? (tagSearchProp ?? '') : tagSearchLocal;
  const setTagSearch = typeof onTagSearchChange === 'function' ? onTagSearchChange : setTagSearchLocal;

  const useTagsApiPagination = typeof onLoadMoreTags === 'function';

  const selectedFormats = inSheet ? localFormats : (initialFileFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean);
  const displayTag = inSheet ? localTag : tags;

  const buildLibraryUrl = useCallback(
    (overrides = {}) =>
      getLibraryPathWithQuery({
        categoryName: category || null,
        tagName: tags || null,
        search: initialSearchQuery,
        sort: initialSort,
        recency: initialRecency,
        free_paid: initialFreePaid,
        file_format: initialFileFormat,
        page: 1,
        ...overrides,
      }),
    [category, tags, initialSearchQuery, initialSort, initialRecency, initialFreePaid, initialFileFormat]
  );

  const navigateAndMaybeCloseSheet = (url) => {
    router.push(url);
    if (inSheet && typeof onCloseSheet === 'function') onCloseSheet();
  };

  const updateParam = (key, value) => {
    if (inSheet) return; /* in sheet we use local state; apply on Apply button */
    navigateAndMaybeCloseSheet(buildLibraryUrl({ [key]: value || undefined }));
  };

  const applySheetFilters = useCallback(() => {
    const url = getLibraryPathWithQuery({
      categoryName: (localCategory || category) || null,
      tagName: localTag || null,
      search: (localSearch || '').trim() || undefined,
      sort: localSort || undefined,
      recency: localRecency || undefined,
      free_paid: localFreePaid || undefined,
      file_format: localFormats.length ? localFormats.join(',') : undefined,
      page: 1,
    });
    router.push(url);
    if (typeof onCloseSheet === 'function') onCloseSheet();
  }, [category, localTag, localSearch, localSort, localRecency, localFreePaid, localFormats, onCloseSheet, router]);

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
    navigateAndMaybeCloseSheet(buildLibraryUrl({ file_format: next.length ? next.join(',') : undefined }));
  };

  const toggleCategory = (catValue) => {
    if (category === catValue) {
      navigateAndMaybeCloseSheet(buildLibraryUrl({ categoryName: null, tagName: null }));
    } else {
      navigateAndMaybeCloseSheet(buildLibraryUrl({ categoryName: catValue, tagName: null }));
    }
  };

  return (
    <div className={styles['library-filters-inner']}>
      {!inSheet && (
        <div className={styles['library-filters-head']}>
          <h2 className={styles['library-filters-title']}>Filters</h2>
          {hasActiveFilters && (
            <Link href="/library" className={styles['library-filters-reset']}>
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
          {RECENCY_RADIO.map(({ value, label }) => (
            <label key={value || 'all'} className={styles['library-filters-radio-label']}>
              <input
                type="radio"
                name="recency"
                checked={(inSheet ? localRecency : initialRecency || '') === value}
                onChange={() => inSheet ? setLocalRecency(value) : updateParam('recency', value)}
                className={styles['library-filters-radio']}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Free / Paid</span>
        <div className={styles['library-filters-radio-group']} role="radiogroup" aria-label="Free or Paid">
          {FREE_PAID_RADIO.map(({ value, label }) => (
            <label key={value || 'all'} className={styles['library-filters-radio-label']}>
              <input
                type="radio"
                name="free_paid"
                checked={(inSheet ? localFreePaid : initialFreePaid || '') === value}
                onChange={() => inSheet ? setLocalFreePaid(value) : updateParam('free_paid', value)}
                className={styles['library-filters-radio']}
              />
              <span>{label}</span>
            </label>
          ))}
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
              return (
                <button
                  key={tagValue}
                  type="button"
                  className={styles['library-filters-tag-pill'] + (isActive ? ` ${styles['library-filters-tag-pill-active']}` : '')}
                  onClick={() => {
                    if (inSheet) {
                      setLocalTag(isActive ? '' : tagValue);
                      return;
                    }
                    navigateAndMaybeCloseSheet(buildLibraryUrl({ tagName: isActive ? '' : tagValue }));
                  }}
                >
                  {tagLabel}
                </button>
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
              checked={(inSheet ? localCategory : category || '') === ''}
              onChange={() => {
                if (inSheet) {
                  setLocalCategory('');
                } else {
                  toggleCategory(null);
                }
              }}
              className={styles['library-filters-checkbox']}
            />
            <span>All categories</span>
          </label>

          {allCategories.map((cat) => (
            <label key={cat.industry_category_name} className={styles['library-filters-checkbox-label']}>
              <input
                type="radio"
                name="category-filter"
                checked={(inSheet ? localCategory : category) === cat.industry_category_name}
                onChange={() => {
                  if (inSheet) {
                    setLocalCategory(cat.industry_category_name);
                  } else {
                    toggleCategory(cat.industry_category_name);
                  }
                }}
                className={styles['library-filters-checkbox']}
              />
              <span>{cat.industry_category_label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>File Format</span>
        <div className={styles['library-filters-checkbox-group']}>
          {FILE_FORMAT_CHECKBOXES.map(({ value, label }) => (
            <label key={value} className={styles['library-filters-checkbox-label']}>
              <input
                type="checkbox"
                checked={selectedFormats.includes(value)}
                onChange={(e) => toggleFileFormat(value, e.target.checked)}
                className={styles['library-filters-checkbox']}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {inSheet && (
        <div className={styles['library-filters-sheet-footer']}>
          <button
            type="button"
            className={styles['library-filters-sheet-apply']}
            onClick={applySheetFilters}
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

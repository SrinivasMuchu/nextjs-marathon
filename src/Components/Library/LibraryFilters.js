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
  { value: 'views', label: 'Most Views' },
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'newest', label: 'Newest First' },
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
}) {
  const router = useRouter();
  const [tagSearchLocal, setTagSearchLocal] = useState('');
  const [tagsVisibleCount, setTagsVisibleCount] = useState(TAGS_PAGE_SIZE);

  const tagSearch = typeof onTagSearchChange === 'function' ? (tagSearchProp ?? '') : tagSearchLocal;
  const setTagSearch = typeof onTagSearchChange === 'function' ? onTagSearchChange : setTagSearchLocal;

  const useTagsApiPagination = typeof onLoadMoreTags === 'function';

  const selectedFormats = (initialFileFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean);

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

  const updateParam = (key, value) => {
    router.push(buildLibraryUrl({ [key]: value || undefined }));
  };

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
    router.push(buildLibraryUrl({ file_format: next.length ? next.join(',') : undefined }));
  };

  const toggleCategory = (catValue) => {
    if (category === catValue) {
      router.push(buildLibraryUrl({ categoryName: null, tagName: null }));
    } else {
      router.push(buildLibraryUrl({ categoryName: catValue, tagName: null }));
    }
  };

  return (
    <div className={styles['library-filters-inner']}>
      <div className={styles['library-filters-head']}>
        <h2 className={styles['library-filters-title']}>Filters</h2>
        {hasActiveFilters && (
          <Link href="/library" className={styles['library-filters-reset']}>
            Reset filters
          </Link>
        )}
      </div>

      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Search</span>
        <div className={styles['library-filters-search']}>
          <SearchBar initialSearchQuery={initialSearchQuery} placeholder="Search designs..." />
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
                checked={(initialRecency || '') === value}
                onChange={() => updateParam('recency', value)}
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
                checked={(initialFreePaid || '') === value}
                onChange={() => updateParam('free_paid', value)}
                className={styles['library-filters-radio']}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Tags</span>
        <div className={styles['library-filters-tags-scroll']}>
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
          <div className={styles['library-filters-tag-pills']}>
            {tagsToShow.map((tag) => {
              const tagValue = tag?.cad_tag_name ?? tag?.name ?? tag?._id ?? '';
              const tagLabel = tag?.cad_tag_label ?? tag?.cad_tag_name ?? tag?.label ?? tag?.name ?? String(tagValue);
              return (
                <button
                  key={tagValue}
                  type="button"
                  className={styles['library-filters-tag-pill'] + (tags === tagValue ? ` ${styles['library-filters-tag-pill-active']}` : '')}
                  onClick={() => router.push(buildLibraryUrl({ tagName: tags === tagValue ? '' : tagValue }))}
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

      {/* Category filter - commented out (categories are at top of page)
      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Category</span>
        <div className={styles['library-filters-checkbox-group']}>
          {allCategories.map((cat) => (
            <label key={cat.industry_category_name} className={styles['library-filters-checkbox-label']}>
              <input
                type="checkbox"
                checked={category === cat.industry_category_name}
                onChange={() => toggleCategory(cat.industry_category_name)}
                className={styles['library-filters-checkbox']}
              />
              <span>{cat.industry_category_label}</span>
            </label>
          ))}
        </div>
      </div>
      */}

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

      <div className={styles['library-filters-section']}>
        <span className={styles['library-filters-label']}>Sort By</span>
        <div className={styles['library-filters-radio-group']} role="radiogroup" aria-label="Sort by">
          {SORT_RADIO.map(({ value, label }) => (
            <label key={value} className={styles['library-filters-radio-label']}>
              <input
                type="radio"
                name="sort"
                checked={(initialSort || 'views') === value}
                onChange={() => updateParam('sort', value)}
                className={styles['library-filters-radio']}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

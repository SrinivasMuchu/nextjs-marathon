'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchBar from './SearchFilter';
import styles from './Library.module.css';
import panelStyles from './LibraryFiltersPanel.module.css';
import { getLibraryPathWithQuery, isValidLibraryTagSlug, sendGAtagEvent } from '@/common.helper';
import { CAD_LIBRARY_EVENT } from '@/config';
import { LIBRARY_FILE_FORMAT_FILTERS } from '@/data/libraryPage';
import {
  TWO_D_OUTPUT_FORMAT_FILTER_OPTIONS,
  TWO_D_PROJECTION_FILTERS,
  get2DLibraryPathWithQuery,
} from '@/data/twoDLibraryPage';
import { getLibraryClusterPath } from '@/api/libraryClustersApi';

function trackLibraryFilterTagClick({ tagValue, tagLabel, isClear, libraryListMode }) {
  sendGAtagEvent({
    event_name: isClear ? 'library_tag_clear_click' : 'library_tag_click',
    event_category: CAD_LIBRARY_EVENT,
    event_label: tagLabel || tagValue || 'all',
    tag_name: tagValue || '',
    library_mode: libraryListMode,
    source: 'filters',
  });
}

const RECENCY_RADIO = [
  { value: '', label: 'All time' },
  { value: '24h', label: '24h' },
  { value: 'week', label: 'week' },
  { value: 'month', label: 'month' },
  { value: 'year', label: 'year' },
];

const OUTPUT_RADIO_3D = [
  { value: '', label: 'All' },
  { value: 'solids', label: 'Solids' },
  { value: 'meshes', label: 'Meshes' },
  { value: '2d', label: '2D' },
];

const OUTPUT_RADIO_2D = [
  { value: '', label: 'All' },
  { value: 'pdf', label: 'PDF' },
  { value: 'vector', label: 'Vector' },
];

const PANEL_FILE_FORMATS_3D = [
  { value: 'STEP', label: '.STEP' },
  { value: 'STL', label: '.STL' },
  { value: 'IGES', label: '.IGES' },
  { value: 'OBJ', label: '.OBJ' },
  { value: 'DWG', label: '.DWG' },
  { value: 'DXF', label: '.DXF' },
];

const SOLID_FORMATS = ['STEP', 'STP', 'IGES', 'IGS', 'BREP', 'BRP'];
const MESH_FORMATS = ['STL', 'OBJ', 'PLY', 'OFF'];

function deriveOutputType(twoDims, fileFormat, libraryListMode, outputFormat = '') {
  if (libraryListMode === '2d') {
    const formats = (outputFormat || '')
      .split(',')
      .map((f) => f.trim().toUpperCase())
      .filter(Boolean);
    if (formats.length === 1 && formats[0] === 'PDF') return 'pdf';
    if (formats.some((f) => ['SVG', 'DXF'].includes(f))) return 'vector';
    return '';
  }

  if (['1', 'true', 'yes'].includes(String(twoDims || '').trim().toLowerCase())) {
    return '2d';
  }

  const formats = (fileFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean);
  if (!formats.length) return '';
  if (formats.every((f) => SOLID_FORMATS.includes(f))) return 'solids';
  if (formats.every((f) => MESH_FORMATS.includes(f))) return 'meshes';
  return '';
}

function formatsForOutputType(outputType, libraryListMode) {
  if (libraryListMode === '2d') {
    if (outputType === 'pdf') return ['PDF'];
    if (outputType === 'vector') return ['SVG', 'DXF'];
    return [];
  }

  if (outputType === 'solids') return ['STEP', 'IGES', 'BREP'];
  if (outputType === 'meshes') return ['STL', 'OBJ', 'PLY'];
  return [];
}

const FREE_PAID_RADIO = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

const TAGS_PAGE_SIZE = 10;

function buildFiltersListUrl(libraryListMode, params) {
  const {
    cluster_slug,
    cluster_id: _clusterId,
    categoryName,
    tagName,
    ...queryParams
  } = params || {};

  if (cluster_slug) {
    const path = getLibraryClusterPath({ cluster_slug }, libraryListMode);
    const searchParams = new URLSearchParams();
    if (queryParams.search) searchParams.set('search', queryParams.search);
    if (queryParams.page && queryParams.page > 1) {
      searchParams.set('page', String(queryParams.page));
    }
    if (queryParams.sort) searchParams.set('sort', queryParams.sort);
    if (queryParams.recency) searchParams.set('recency', queryParams.recency);
    if (queryParams.free_paid) searchParams.set('free_paid', queryParams.free_paid);
    if (queryParams.file_format) searchParams.set('file_format', queryParams.file_format);
    if (queryParams.output_format) searchParams.set('output_format', queryParams.output_format);
    if (queryParams.projection) searchParams.set('projection', queryParams.projection);
    const td = String(queryParams.two_dims || '').trim().toLowerCase();
    if (td === '1' || td === 'true' || td === 'yes') searchParams.set('two_dims', '1');
    const qs = searchParams.toString();
    return qs ? `${path}?${qs}` : path;
  }

  if (libraryListMode === '2d') {
    return get2DLibraryPathWithQuery({ categoryName, tagName, ...queryParams });
  }
  return getLibraryPathWithQuery({ categoryName, tagName, ...queryParams });
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
  initialClusterId = '',
  initialClusterSlug = '',
  hasActiveFilters,
  tagsHasMore,
  onLoadMoreTags,
  loadingTags = false,
  tagSearch: tagSearchProp,
  onTagSearchChange,
  inSheet,
  sheetOpen,
  onCloseSheet,
  variant = 'sidebar',
  panelOpen,
  onClosePanel,
}) {
  const router = useRouter();
  const [tagSearchLocal, setTagSearchLocal] = useState('');
  const [tagsVisibleCount, setTagsVisibleCount] = useState(TAGS_PAGE_SIZE);

  /* When sheet is open, hold selections in local state until Apply is clicked */
  const [localSearch, setLocalSearch] = useState(initialSearchQuery || '');
  const [localSort, setLocalSort] = useState(initialSort || 'newest');
  const [localRecency, setLocalRecency] = useState(initialRecency || '');
  const [localFreePaid, setLocalFreePaid] = useState(initialFreePaid || '');
  const [localFormats, setLocalFormats] = useState(() => {
    const first = (initialFileFormat || '')
      .split(',')
      .map((f) => f.trim().toUpperCase())
      .filter(Boolean)[0];
    return first ? [first] : [];
  });
  const [localCategory, setLocalCategory] = useState(category || '');
  const [localTag, setLocalTag] = useState(tags || '');
  const [localOutputFormats, setLocalOutputFormats] = useState(() =>
    (initialOutputFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean)
  );
  const [localProjection, setLocalProjection] = useState(initialProjection || '');
  const [localClusterId, setLocalClusterId] = useState(initialClusterId || '');
  const [localClusterSlug, setLocalClusterSlug] = useState(initialClusterSlug || '');
  const [localOutputType, setLocalOutputType] = useState(() =>
    deriveOutputType(initialTwoDims, initialFileFormat, libraryListMode, initialOutputFormat)
  );
  const prevSheetOpenRef = React.useRef(false);
  const prevPanelOpenRef = React.useRef(false);
  const isDeferredApply = inSheet || variant === 'panel';

  /* Sync local state from URL when sheet/panel opens */
  useEffect(() => {
    const shouldSync =
      (inSheet && sheetOpen && !prevSheetOpenRef.current) ||
      (variant === 'panel' && panelOpen && !prevPanelOpenRef.current);

    if (shouldSync) {
      setLocalSearch(initialSearchQuery || '');
      setLocalSort(initialSort || 'newest');
      setLocalRecency(initialRecency || '');
      setLocalFreePaid(initialFreePaid || '');
      {
        const first = (initialFileFormat || '')
          .split(',')
          .map((f) => f.trim().toUpperCase())
          .filter(Boolean)[0];
        setLocalFormats(first ? [first] : []);
      }
      setLocalCategory(category || '');
      setLocalTag(tags || '');
      setLocalOutputFormats((initialOutputFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean));
      setLocalProjection(initialProjection || '');
      setLocalClusterId(initialClusterId || '');
      setLocalClusterSlug(initialClusterSlug || '');
      setLocalOutputType(
        deriveOutputType(initialTwoDims, initialFileFormat, libraryListMode, initialOutputFormat)
      );
    }
    prevSheetOpenRef.current = !!sheetOpen;
    prevPanelOpenRef.current = !!panelOpen;
  }, [inSheet, sheetOpen, variant, panelOpen, initialSearchQuery, initialSort, initialRecency, initialFreePaid, initialFileFormat, initialTwoDims, initialOutputFormat, initialProjection, initialClusterId, initialClusterSlug, category, tags, libraryListMode]);

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
      cluster_id: initialClusterId || undefined,
      cluster_slug: initialClusterSlug || undefined,
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
    initialClusterId,
    initialClusterSlug,
    libraryListMode,
  ]);

  const buildLibraryUrl = buildListUrl;

  /* File format is single-select only (SEO: multi-format URLs return 410). */
  const selectedFormats = (() => {
    const raw = isDeferredApply
      ? localFormats
      : (initialFileFormat || '')
          .split(',')
          .map((f) => f.trim().toUpperCase())
          .filter(Boolean);
    return raw.length ? [raw[0]] : [];
  })();
  const selectedFormat = selectedFormats[0] || '';
  const selectedOutputFormats = isDeferredApply
    ? localOutputFormats
    : (initialOutputFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean);
  const displayTag = isDeferredApply ? localTag : tags;
  const displayRecency = isDeferredApply ? localRecency : initialRecency;
  const displayFreePaid = isDeferredApply ? localFreePaid : initialFreePaid;
  const displayProjection = isDeferredApply ? localProjection : initialProjection;
  const displayOutputType = isDeferredApply
    ? localOutputType
    : deriveOutputType(initialTwoDims, initialFileFormat, libraryListMode, initialOutputFormat);

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
        file_format:
          libraryListMode === '2d'
            ? undefined
            : localFormats[0] || undefined,
        output_format: undefined,
        projection: libraryListMode === '2d' ? undefined : localProjection || undefined,
        cluster_id: localClusterId || undefined,
        cluster_slug: localClusterSlug || undefined,
        two_dims:
          libraryListMode === '3d' && localOutputType === '2d'
            ? '1'
            : undefined,
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
      localClusterId,
      localClusterSlug,
      localOutputType,
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
    /* Single-select: selecting a format replaces any previous choice; unchecking clears. */
    const next = checked ? [formatValue] : [];
    if (isDeferredApply) {
      setLocalFormats(next);
      return;
    }
    router.push(buildLibraryUrl({ file_format: next[0] || undefined }));
  };

  const toggleOutputFormat = (formatValue, checked) => {
    const current = selectedOutputFormats;
    const next = checked ? [...current, formatValue] : current.filter((f) => f !== formatValue);
    if (isDeferredApply) {
      setLocalOutputFormats(next);
      return;
    }
    router.push(buildLibraryUrl({ output_format: next.length ? next.join(',') : undefined }));
  };

  const resolvedApplyFormat = useMemo(() => {
    if (localFormats[0]) return localFormats[0];
    return '';
  }, [localFormats]);

  const panelApplyUrl = useMemo(
    () =>
      buildFiltersListUrl(libraryListMode, {
        categoryName: (localCategory || category) || null,
        tagName: localTag || null,
        search: (localSearch || '').trim() || undefined,
        sort: localSort || undefined,
        recency: localRecency || undefined,
        free_paid: localFreePaid || undefined,
        file_format:
          libraryListMode === '3d' && resolvedApplyFormat
            ? resolvedApplyFormat
            : undefined,
        output_format: undefined,
        projection: libraryListMode === '2d' ? undefined : localProjection || undefined,
        cluster_id: localClusterId || undefined,
        cluster_slug: localClusterSlug || undefined,
        two_dims: libraryListMode === '3d' && localOutputType === '2d' ? '1' : undefined,
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
      resolvedApplyFormat,
      localOutputFormats,
      localProjection,
      localClusterId,
      localClusterSlug,
      localOutputType,
      libraryListMode,
    ]
  );

  const handleOutputTypeChange = (value) => {
    setLocalOutputType(value);
    if (libraryListMode === '2d') {
      const nextFormats = formatsForOutputType(value, libraryListMode);
      setLocalOutputFormats(nextFormats);
      return;
    }
    /* 3D: output type is a UI hint only; keep a single file format (or clear if incompatible). */
    const allowed = formatsForOutputType(value, libraryListMode);
    if (!value) {
      return;
    }
    if (allowed.length && localFormats[0] && !allowed.includes(localFormats[0])) {
      setLocalFormats([]);
    }
  };

  if (variant === 'panel') {
    const outputOptions = libraryListMode === '2d' ? OUTPUT_RADIO_2D : OUTPUT_RADIO_3D;
    const formatOptions =
      libraryListMode === '2d'
        ? TWO_D_OUTPUT_FORMAT_FILTER_OPTIONS.map(({ value, label }) => ({
            value,
            label: `.${label}`,
          }))
        : PANEL_FILE_FORMATS_3D;
    const selectedPanelFormats =
      libraryListMode === '2d' ? selectedOutputFormats : selectedFormats;
    const showOutputAndFormatFilters = libraryListMode !== '2d';

    return (
      <div className={panelStyles.panelInner}>
        <div className={panelStyles.panelGrid}>
          <div className={panelStyles.panelSection}>
            <span className={panelStyles.panelLabel}>Price</span>
            <div className={panelStyles.segmentRow} role="radiogroup" aria-label="Price">
              {FREE_PAID_RADIO.map(({ value, label }) => {
                const isActive = (displayFreePaid || '') === value;
                return (
                  <button
                    key={value || 'all-price'}
                    type="button"
                    className={`${panelStyles.segmentButton} ${isActive ? panelStyles.segmentButtonActive : ''}`}
                    onClick={() => setLocalFreePaid(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={panelStyles.panelSection}>
            <span className={panelStyles.panelLabel}>Uploaded</span>
            <div className={panelStyles.segmentRow} role="radiogroup" aria-label="Uploaded">
              {RECENCY_RADIO.map(({ value, label }) => {
                const isActive = (displayRecency || '') === value;
                return (
                  <button
                    key={value || 'all-time'}
                    type="button"
                    className={`${panelStyles.segmentButton} ${isActive ? panelStyles.segmentButtonActive : ''}`}
                    onClick={() => setLocalRecency(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {showOutputAndFormatFilters ? (
            <>
              <div className={panelStyles.panelSection}>
                <span className={panelStyles.panelLabel}>Output</span>
                <div className={panelStyles.segmentRow} role="radiogroup" aria-label="Output">
                  {outputOptions.map(({ value, label }) => {
                    const isActive = (displayOutputType || '') === value;
                    return (
                      <button
                        key={value || 'all-output'}
                        type="button"
                        className={`${panelStyles.segmentButton} ${isActive ? panelStyles.segmentButtonActive : ''}`}
                        onClick={() => handleOutputTypeChange(value)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`${panelStyles.panelSection} ${panelStyles.panelSectionSpan2}`}>
                <span className={panelStyles.panelLabel}>File format</span>
                <div className={panelStyles.formatRow} role="radiogroup" aria-label="File format">
                  {formatOptions.map(({ value, label }) => {
                    const isActive = selectedPanelFormats[0] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        className={`${panelStyles.formatChip} ${isActive ? panelStyles.formatChipActive : ''}`}
                        onClick={() => {
                          if (libraryListMode === '2d') {
                            toggleOutputFormat(value, !isActive);
                            return;
                          }
                          toggleFileFormat(value, !isActive);
                          if (!isActive) {
                            setLocalOutputType(
                              deriveOutputType(undefined, value, libraryListMode)
                            );
                          }
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          <div className={`${panelStyles.panelSection} ${panelStyles.panelSectionFull}`}>
            <span className={panelStyles.panelLabel}>Tags</span>
            <div className={panelStyles.tagSearch}>
              <SearchIcon className={panelStyles.tagSearchIcon} fontSize="small" aria-hidden />
              <input
                type="text"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className={panelStyles.tagSearchInput}
                aria-label="Search tags"
              />
            </div>
            <div className={panelStyles.tagsRow}>
              <button
                type="button"
                className={`${panelStyles.formatChip} ${!displayTag ? panelStyles.formatChipActive : ''}`}
                onClick={() => {
                  trackLibraryFilterTagClick({
                    tagValue: '',
                    tagLabel: 'All tags',
                    isClear: true,
                    libraryListMode,
                  });
                  setLocalTag('');
                }}
              >
                All tags
              </button>
              {tagsToShow.map((tag) => {
                const tagValue = tag?.cad_tag_name ?? tag?.name ?? '';
                if (!tagValue || !isValidLibraryTagSlug(tagValue)) return null;
                const tagLabel =
                  tag?.cad_tag_label ??
                  tag?.cad_tag_name ??
                  tag?.label ??
                  tag?.name ??
                  String(tagValue);
                const isActive = displayTag === tagValue;
                return (
                  <button
                    key={tagValue}
                    type="button"
                    className={`${panelStyles.formatChip} ${isActive ? panelStyles.formatChipActive : ''}`}
                    onClick={() => {
                      trackLibraryFilterTagClick({
                        tagValue,
                        tagLabel,
                        isClear: isActive,
                        libraryListMode,
                      });
                      setLocalTag(isActive ? '' : tagValue);
                    }}
                  >
                    {tagLabel}
                  </button>
                );
              })}
            </div>
            {hasMoreTags ? (
              <button
                type="button"
                className={panelStyles.showMoreTags}
                onClick={loadMoreTags}
                disabled={loadingTags}
              >
                {loadingTags ? 'Loading...' : 'Show more tags'}
                <ExpandMoreIcon fontSize="small" />
              </button>
            ) : null}
          </div>
        </div>

        <div className={panelStyles.panelFooter}>
          <Link href={resetListHref} className={panelStyles.clearLink}>
            ↺ Clear all filters
          </Link>
          <Link
            href={panelApplyUrl}
            className={panelStyles.doneButton}
            onClick={() => typeof onClosePanel === 'function' && onClosePanel()}
          >
            ✓ Done
          </Link>
        </div>
      </div>
    );
  }

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
              const tagValue = tag?.cad_tag_name ?? tag?.name ?? '';
              if (!tagValue || !isValidLibraryTagSlug(tagValue)) return null;
              const tagLabel = tag?.cad_tag_label ?? tag?.cad_tag_name ?? tag?.label ?? tag?.name ?? String(tagValue);
              const isActive = displayTag === tagValue;
              /* With category: /library/{categorySlug}/{tagSlug}; without: /library/tag/{tagSlug} */
              const tagUrl = buildLibraryUrl({ categoryName: category || null, tagName: isActive ? null : tagValue });
              return inSheet ? (
                <button
                  key={tagValue}
                  type="button"
                  className={styles['library-filters-tag-pill'] + (isActive ? ` ${styles['library-filters-tag-pill-active']}` : '')}
                  onClick={() => {
                    trackLibraryFilterTagClick({
                      tagValue,
                      tagLabel,
                      isClear: isActive,
                      libraryListMode,
                    });
                    setLocalTag(isActive ? '' : tagValue);
                  }}
                >
                  {tagLabel}
                </button>
              ) : (
                <Link
                  key={tagValue}
                  href={tagUrl}
                  className={styles['library-filters-tag-pill'] + (isActive ? ` ${styles['library-filters-tag-pill-active']}` : '')}
                  onClick={() => {
                    trackLibraryFilterTagClick({
                      tagValue,
                      tagLabel,
                      isClear: isActive,
                      libraryListMode,
                    });
                  }}
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
        <div className={styles['library-filters-format-chips']} role="radiogroup" aria-label={fileFormatLabel}>
          {fileFormatOptions.map(({ value, label }) => {
            const isActive = selectedFormat === value;
            const formatUrl = buildLibraryUrl({
              file_format: isActive ? undefined : value,
            });
            return inSheet ? (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isActive}
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
                role="radio"
                aria-checked={isActive}
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

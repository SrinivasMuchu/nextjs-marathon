'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  fetchLibraryFiltersTagsPage,
  TAGS_PAGE_SIZE,
  isLibraryFiltersTagsRanked,
} from '@/api/cadTagsApi';
import LibraryFilters from './LibraryFilters';

/**
 * Client wrapper that fetches tags from the API (backend pagination).
 * Source is controlled by LIBRARY_FILTERS_TAGS_MODE ('ranked' | 'all'):
 * same search + show-more behavior either way.
 */
export default function LibraryFiltersWrapper({
  initialTags = [],
  initialHasMore = false,
  initialSearchQuery = '',
  category = '',
  tags: selectedTag,
  library2d = false,
  inSheet,
  sheetOpen,
  onCloseSheet,
  variant,
  panelOpen,
  onClosePanel,
  ...libraryFiltersProps
}) {
  const [allTags, setAllTags] = useState(Array.isArray(initialTags) ? initialTags : []);
  const [hasMoreTags, setHasMoreTags] = useState(!!initialHasMore);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const tagSearchRef = useRef(tagSearch);
  const categoryRef = useRef(category);
  const isFirstTagSearchEffect = useRef(true);
  const rankedOnly = isLibraryFiltersTagsRanked();

  tagSearchRef.current = tagSearch;
  categoryRef.current = category;

  /* Ensure selected tag is in the list so its pill is visible and can show active state */
  const allTagsWithSelected = useMemo(() => {
    if (!selectedTag || typeof selectedTag !== 'string') return allTags;
    const exists = allTags.some(
      (t) => (t?.cad_tag_name ?? t?.name ?? '') === selectedTag
    );
    if (exists) return allTags;
    return [
      { cad_tag_name: selectedTag, cad_tag_label: selectedTag },
      ...allTags,
    ];
  }, [allTags, selectedTag]);

  useEffect(() => {
    if (isFirstTagSearchEffect.current) {
      isFirstTagSearchEffect.current = false;
      return;
    }
    const t = setTimeout(() => {
      const search = tagSearchRef.current.trim() || null;
      const cat = rankedOnly ? null : categoryRef.current?.trim() || null;
      fetchLibraryFiltersTagsPage(0, TAGS_PAGE_SIZE, search, cat, library2d)
        .then(({ data, hasMore }) => {
          setAllTags(data);
          setHasMoreTags(hasMore);
        })
        .catch(() => {
          setAllTags([]);
          setHasMoreTags(false);
        });
    }, 300);
    return () => clearTimeout(t);
  }, [tagSearch, library2d, rankedOnly]);

  /* When category changes (all-tags mode only), refetch first page */
  useEffect(() => {
    if (rankedOnly) return;
    const cat = (category || '').trim() || null;
    fetchLibraryFiltersTagsPage(
      0,
      TAGS_PAGE_SIZE,
      tagSearchRef.current.trim() || null,
      cat,
      library2d
    )
      .then(({ data, hasMore }) => {
        setAllTags(data);
        setHasMoreTags(hasMore);
      })
      .catch(() => {
        setAllTags([]);
        setHasMoreTags(false);
      });
  }, [category, library2d, rankedOnly]);

  const onLoadMoreTags = useCallback(async () => {
    if (loadingTags || !hasMoreTags) return;
    setLoadingTags(true);
    try {
      const offset = allTags.length;
      const search = tagSearchRef.current.trim() || null;
      const cat = rankedOnly ? null : categoryRef.current?.trim() || null;
      const { data: next, hasMore } = await fetchLibraryFiltersTagsPage(
        offset,
        TAGS_PAGE_SIZE,
        search,
        cat,
        library2d
      );
      setAllTags((prev) => [...prev, ...next]);
      setHasMoreTags(hasMore);
    } catch (err) {
      setHasMoreTags(false);
    } finally {
      setLoadingTags(false);
    }
  }, [allTags.length, hasMoreTags, loadingTags, library2d, rankedOnly]);

  return (
    <LibraryFilters
      {...libraryFiltersProps}
      category={category}
      tags={selectedTag}
      initialSearchQuery={initialSearchQuery}
      allTags={allTagsWithSelected}
      tagsHasMore={hasMoreTags}
      onLoadMoreTags={onLoadMoreTags}
      loadingTags={loadingTags}
      tagSearch={tagSearch}
      onTagSearchChange={setTagSearch}
      inSheet={inSheet}
      sheetOpen={sheetOpen}
      onCloseSheet={onCloseSheet}
      variant={variant}
      panelOpen={panelOpen}
      onClosePanel={onClosePanel}
    />
  );
}

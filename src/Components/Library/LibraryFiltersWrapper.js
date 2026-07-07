'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { fetchCadTagsPage, TAGS_PAGE_SIZE } from '@/api/cadTagsApi';
import LibraryFilters from './LibraryFilters';

/**
 * Client wrapper that fetches tags from the API. Supports:
 * - Tag search: when user types, fetches with search param (debounced).
 * - Show more: fetches next page (with current search if any).
 * - Ensures the currently selected tag is always in the list so its pill can show as active.
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
      const cat = categoryRef.current?.trim() || null;
      fetchCadTagsPage(0, TAGS_PAGE_SIZE, search, cat, library2d)
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
  }, [tagSearch, library2d]);

  /* When category changes, refetch first page of tags for the new category */
  useEffect(() => {
    const cat = (category || '').trim() || null;
    fetchCadTagsPage(0, TAGS_PAGE_SIZE, tagSearchRef.current.trim() || null, cat, library2d)
      .then(({ data, hasMore }) => {
        setAllTags(data);
        setHasMoreTags(hasMore);
      })
      .catch(() => {
        setAllTags([]);
        setHasMoreTags(false);
      });
  }, [category, library2d]);

  const onLoadMoreTags = useCallback(async () => {
    if (loadingTags || !hasMoreTags) return;
    setLoadingTags(true);
    try {
      const offset = allTags.length;
      const search = tagSearchRef.current.trim() || null;
      const cat = categoryRef.current?.trim() || null;
      const { data: next, hasMore } = await fetchCadTagsPage(offset, TAGS_PAGE_SIZE, search, cat, library2d);
      setAllTags((prev) => [...prev, ...next]);
      setHasMoreTags(hasMore);
    } catch (err) {
      setHasMoreTags(false);
    } finally {
      setLoadingTags(false);
    }
  }, [allTags.length, hasMoreTags, loadingTags, library2d]);

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

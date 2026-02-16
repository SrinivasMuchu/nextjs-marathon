'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { fetchCadTagsPage, TAGS_PAGE_SIZE } from '@/api/cadTagsApi';
import LibraryFilters from './LibraryFilters';

/**
 * Client wrapper that fetches tags from the API. Supports:
 * - Tag search: when user types, fetches with search param (debounced).
 * - Show more: fetches next page (with current search if any).
 */
export default function LibraryFiltersWrapper({
  initialTags = [],
  initialHasMore = false,
  initialSearchQuery = '',
  ...libraryFiltersProps
}) {
  const [allTags, setAllTags] = useState(Array.isArray(initialTags) ? initialTags : []);
  const [hasMoreTags, setHasMoreTags] = useState(!!initialHasMore);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const tagSearchRef = useRef(tagSearch);
  const isFirstTagSearchEffect = useRef(true);

  tagSearchRef.current = tagSearch;

  useEffect(() => {
    if (isFirstTagSearchEffect.current) {
      isFirstTagSearchEffect.current = false;
      return;
    }
    const t = setTimeout(() => {
      fetchCadTagsPage(0, TAGS_PAGE_SIZE, tagSearchRef.current.trim() || null)
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
  }, [tagSearch]);

  const onLoadMoreTags = useCallback(async () => {
    if (loadingTags || !hasMoreTags) return;
    setLoadingTags(true);
    try {
      const offset = allTags.length;
      const search = tagSearchRef.current.trim() || null;
      const { data: next, hasMore } = await fetchCadTagsPage(offset, TAGS_PAGE_SIZE, search);
      setAllTags((prev) => [...prev, ...next]);
      setHasMoreTags(hasMore);
    } catch (err) {
      setHasMoreTags(false);
    } finally {
      setLoadingTags(false);
    }
  }, [allTags.length, hasMoreTags, loadingTags]);

  return (
    <LibraryFilters
      {...libraryFiltersProps}
      initialSearchQuery={initialSearchQuery}
      allTags={allTags}
      tagsHasMore={hasMoreTags}
      onLoadMoreTags={onLoadMoreTags}
      loadingTags={loadingTags}
      tagSearch={tagSearch}
      onTagSearchChange={setTagSearch}
    />
  );
}

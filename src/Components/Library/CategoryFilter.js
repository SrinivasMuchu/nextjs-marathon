'use client';

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import { getLibraryPathWithQuery } from "@/common.helper";

const CategoryFilter = ({ allCategories, initialSelectedCategories, allTags, initialTagSelectedOption, showOnly }) => {
  const showTags = showOnly === undefined || showOnly === 'tags';
  const showCategory = showOnly === undefined || showOnly === 'category';

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSelectedOption = allCategories
    .filter((cat) => initialSelectedCategories?.includes(cat.industry_category_name))
    .map((cat) => ({
      value: cat.industry_category_name,
      label: cat.industry_category_label,
    }))[0] || null;

  const initialTagSelected = allTags.find(
    (tag) => tag.cad_tag_name === initialTagSelectedOption
  );

  const [selectedTagOption, setSelectedTagOption] = useState(initialTagSelected ? {
    value: initialTagSelected.cad_tag_name,
    label: initialTagSelected.cad_tag_label,
  } : null);
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);

  const [tagOptions, setTagOptions] = useState(() =>
    allTags.map((t) => ({ value: t.cad_tag_name, label: t.cad_tag_label }))
  );
  const [tagsHasMore, setTagsHasMore] = useState(() => allTags.length >= TAGS_PAGE_SIZE);
  const [tagsLoadingMore, setTagsLoadingMore] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [tagsSearching, setTagsSearching] = useState(false);
  const tagsOffsetRef = useRef(allTags.length);
  const tagSearchDebounceRef = useRef(null);

  useEffect(() => {
    setTagOptions(allTags.map((t) => ({ value: t.cad_tag_name, label: t.cad_tag_label })));
    tagsOffsetRef.current = allTags.length;
    setTagsHasMore(allTags.length >= TAGS_PAGE_SIZE);
  }, [allTags]);

  // Server-side search: when tagSearchTerm changes, fetch from API (or reset to browse mode)
  useEffect(() => {
    const term = (tagSearchTerm || '').trim();
    if (!term) {
      setTagOptions(allTags.map((t) => ({ value: t.cad_tag_name, label: t.cad_tag_label })));
      tagsOffsetRef.current = allTags.length;
      setTagsHasMore(allTags.length >= TAGS_PAGE_SIZE);
      return;
    }
    const abort = new AbortController();
    setTagsSearching(true);
    const params = new URLSearchParams({
      offset: '0',
      limit: String(TAGS_PAGE_SIZE),
      search: term,
    });
    fetch(`${BASE_URL}/v1/cad/get-cad-tags?${params.toString()}`, { signal: abort.signal })
      .then((res) => res.json())
      .then((json) => {
        const nextTags = json?.data || [];
        const options = nextTags.map((t) => ({ value: t.cad_tag_name, label: t.cad_tag_label }));
        setTagOptions(options);
        tagsOffsetRef.current = nextTags.length;
        setTagsHasMore(nextTags.length >= TAGS_PAGE_SIZE);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Tag search failed', err);
      })
      .finally(() => setTagsSearching(false));
    return () => abort.abort();
  }, [tagSearchTerm, allTags]);

  const onTagInputChange = useCallback((newValue) => {
    if (tagSearchDebounceRef.current) clearTimeout(tagSearchDebounceRef.current);
    tagSearchDebounceRef.current = setTimeout(() => {
      setTagSearchTerm(newValue || '');
      tagSearchDebounceRef.current = null;
    }, TAGS_SEARCH_DEBOUNCE_MS);
  }, []);

  const loadMoreTags = useCallback(async () => {
    if (tagsLoadingMore || !tagsHasMore) return;
    setTagsLoadingMore(true);
    try {
      const offset = tagsOffsetRef.current;
      const term = (tagSearchTerm || '').trim();
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(TAGS_PAGE_SIZE),
      });
      if (term) params.set('search', term);
      const res = await fetch(`${BASE_URL}/v1/cad/get-cad-tags?${params.toString()}`);
      const json = await res.json();
      const nextTags = json?.data || [];
      const newOffset = offset + nextTags.length;
      tagsOffsetRef.current = newOffset;
      setTagsHasMore(nextTags.length >= TAGS_PAGE_SIZE);
      if (nextTags.length > 0) {
        const nextOptions = nextTags.map((t) => ({
          value: t.cad_tag_name,
          label: t.cad_tag_label,
        }));
        setTagOptions((prev) => {
          const seen = new Set(prev.map((o) => o.value));
          const added = nextOptions.filter((o) => !seen.has(o.value));
          return prev.concat(added);
        });
      }
    } catch (err) {
      console.error('Failed to load more tags', err);
    } finally {
      setTagsLoadingMore(false);
    }
  }, [tagsLoadingMore, tagsHasMore, tagSearchTerm]);

  const onTagMenuScrollToBottom = useCallback(() => {
    loadMoreTags();
  }, [loadMoreTags]);

  // Reset filters when URL parameters change
  useEffect(() => {
    const hasCategory = searchParams.has('category');
    const hasTags = searchParams.has('tags');
    
    if (!hasCategory && !hasTags) {
      setSelectedOption(null);
      setSelectedTagOption(null);
    } else {
      // Update state based on current URL parameters
      const currentCategory = searchParams.get('category');
      const currentTags = searchParams.get('tags');
      
      if (currentCategory) {
        const categoryOption = allCategories
          .filter((cat) => cat.industry_category_name === currentCategory)
          .map((cat) => ({
            value: cat.industry_category_name,
            label: cat.industry_category_label,
          }))[0] || null;
        setSelectedOption(categoryOption);
        setSelectedTagOption(null);
      } else {
        setSelectedOption(null);
      }
      
      if (currentTags) {
        const tagFromAll = allTags.find(tag => tag.cad_tag_name === currentTags);
        const option = tagFromAll
          ? { value: tagFromAll.cad_tag_name, label: tagFromAll.cad_tag_label }
          : tagOptions.find(o => o.value === currentTags) || null;
        setSelectedTagOption(option);
        setSelectedOption(null);
      } else {
        setSelectedTagOption(null);
      }
    }
  }, [searchParams, allCategories, allTags, tagOptions]);

  const handleChange = (selected) => {
    setSelectedOption(selected);
    setSelectedTagOption(null);
    const selectedValue = selected?.value;

    if (typeof window !== 'undefined') {
      const sp = searchParams;
      const url = getLibraryPathWithQuery({
        categoryName: selectedValue || null,
        tagName: null,
        search: sp.get('search'),
        page: 1,
        limit: sp.get('limit') || '20',
        sort: sp.get('sort'),
        recency: sp.get('recency'),
        free_paid: sp.get('free_paid'),
        file_format: sp.get('file_format'),
      });
      router.push(url);
    }
  };

  const handleTagChange = (selected) => {
    setSelectedTagOption(selected);
    setSelectedOption(null);
    const selectedValue = selected?.value;

    if (typeof window !== 'undefined') {
      const sp = searchParams;
      const url = getLibraryPathWithQuery({
        categoryName: null,
        tagName: selectedValue || null,
        search: sp.get('search'),
        page: 1,
        limit: sp.get('limit') || '20',
        sort: sp.get('sort'),
        recency: sp.get('recency'),
        free_paid: sp.get('free_paid'),
        file_format: sp.get('file_format'),
      });
      router.push(url);
    }
  };

  const options = allCategories.map((category) => ({
    value: category.industry_category_name,
    label: category.industry_category_label,
  }));

  const selectStyle = {
    control: (base) => ({ ...base, width: '100%', minHeight: 40 }),
    container: (base) => ({ ...base, width: '100%' }),
  };

  return (
    <>
      {showTags && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          <Select
            id="tag-select"
            inputId="tag-select-input"
            aria-label="Filter by Tags"
            options={tagOptions}
            value={selectedTagOption}
            onChange={handleTagChange}
            placeholder="Select a tag..."
            isClearable
            styles={selectStyle}
          />
        </div>
      )}
      {showCategory && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          <Select
            id="category-select"
            inputId="category-select-input"
            aria-label="Filter by Category"
            options={options}
            value={selectedOption}
            onChange={handleChange}
            placeholder="Select a category..."
            isClearable
            styles={selectStyle}
          />
        </div>
      )}
    </>
  );
};

export default CategoryFilter;

'use client';

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import { BASE_URL } from "@/config";

const TAGS_PAGE_SIZE = 10;
const TAGS_SEARCH_DEBOUNCE_MS = 300;

const CategoryFilter = ({ allCategories, initialSelectedCategories, allTags, totalTagCount = 0, initialTagSelectedOption }) => {

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
  const [tagsHasMore, setTagsHasMore] = useState(() => {
    const total = totalTagCount ?? 0;
    return total > 0 && allTags.length < total;
  });
  const [tagsLoadingMore, setTagsLoadingMore] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [tagsSearching, setTagsSearching] = useState(false);
  const tagsOffsetRef = useRef(allTags.length);
  const tagSearchDebounceRef = useRef(null);

  useEffect(() => {
    setTagOptions(allTags.map((t) => ({ value: t.cad_tag_name, label: t.cad_tag_label })));
    tagsOffsetRef.current = allTags.length;
    const total = totalTagCount ?? 0;
    setTagsHasMore(total > 0 && allTags.length < total);
  }, [allTags, totalTagCount]);

  // Server-side search: when tagSearchTerm changes, fetch from API (or reset to browse mode)
  useEffect(() => {
    const term = (tagSearchTerm || '').trim();
    if (!term) {
      setTagOptions(allTags.map((t) => ({ value: t.cad_tag_name, label: t.cad_tag_label })));
      tagsOffsetRef.current = allTags.length;
      const total = totalTagCount ?? 0;
      setTagsHasMore(total > 0 && allTags.length < total);
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
        const total = json?.total ?? 0;
        const options = nextTags.map((t) => ({ value: t.cad_tag_name, label: t.cad_tag_label }));
        setTagOptions(options);
        tagsOffsetRef.current = nextTags.length;
        setTagsHasMore(nextTags.length < total);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Tag search failed', err);
      })
      .finally(() => setTagsSearching(false));
    return () => abort.abort();
  }, [tagSearchTerm, allTags, totalTagCount]);

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
      const total = json?.total ?? 0;
      const newOffset = offset + nextTags.length;
      tagsOffsetRef.current = newOffset;
      setTagsHasMore(newOffset < total);
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
    setSelectedTagOption(null); // Reset tags when category is selected
    const selectedValue = selected?.value;

    if (typeof window !== 'undefined') {
      const existingParams = new URLSearchParams(window.location.search);

      // Remove tags when category is selected
      existingParams.delete('tags');

      if (selectedValue) {
        existingParams.set('category', selectedValue);
      } else {
        existingParams.delete('category');
      }

      existingParams.set('page', '1');
      existingParams.set('limit', '20');

      router.push(`/library?${existingParams.toString()}`);
    }
  };

  const handleTagChange = (selected) => {
    setSelectedTagOption(selected);
    setSelectedOption(null); // Reset category when tags is selected
    const selectedValue = selected?.value;

    if (typeof window !== 'undefined') {
      const existingParams = new URLSearchParams(window.location.search);

      // Remove category when tags is selected
      existingParams.delete('category');

      if (selectedValue) {
        existingParams.set('tags', selectedValue);
      } else {
        existingParams.delete('tags');
      }

      existingParams.set('page', '1');
      existingParams.set('limit', '20');

      router.push(`/library?${existingParams.toString()}`);
    }
  };

  const options = allCategories.map((category) => ({
    value: category.industry_category_name,
    label: category.industry_category_label,
  }));

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="category-select-input" style={{ display: "block", marginRight: "8px" }}>
          Filter by Category:
        </label>
        <Select
          id="category-select"
          inputId="category-select-input"
          aria-label="Filter by Category"
          options={options}
          value={selectedOption}
          onChange={handleChange}
          placeholder="Select a category..."
          isClearable
          styles={{
            control: (base) => ({ ...base, minWidth: 240 }),
          }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="tag-select-input" style={{ display: "block", marginRight: "8px" }}>
          Filter by Tags:
        </label>
        <Select
          id="tag-select"
          inputId="tag-select-input"
          aria-label="Filter by Tags"
          options={tagOptions}
          value={selectedTagOption}
          onChange={handleTagChange}
          onInputChange={onTagInputChange}
          onMenuScrollToBottom={onTagMenuScrollToBottom}
          onMenuClose={() => setTagSearchTerm('')}
          filterOption={() => true}
          placeholder="Select a tag..."
          isClearable
          isLoading={tagsLoadingMore || tagsSearching}
          styles={{
            control: (base) => ({ ...base, minWidth: 240 }),
          }}
        />
      </div>
    </>
  );
};

export default CategoryFilter;

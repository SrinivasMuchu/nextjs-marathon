'use client';

import React, { useState, useEffect } from "react";
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
        const tagOption = allTags.find(tag => tag.cad_tag_name === currentTags);
        setSelectedTagOption(tagOption ? {
          value: tagOption.cad_tag_name,
          label: tagOption.cad_tag_label,
        } : null);
        setSelectedOption(null);
      } else {
        setSelectedTagOption(null);
      }
    }
  }, [searchParams, allCategories, allTags]);

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

  const tagOptions = allTags.map((tags) => ({
    value: tags.cad_tag_name,
    label: tags.cad_tag_label,
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

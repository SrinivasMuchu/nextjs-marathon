'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";

const CategoryFilter = ({ allCategories, initialSelectedCategories, allTags, initialTagSelectedOption }) => {

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

  const tagOptions = allTags.map((tags) => ({
    value: tags.cad_tag_name,
    label: tags.cad_tag_label,
  }));

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="category-select" style={{ display: "block", marginRight: "8px" }}>
          Filter by Category:
        </label>
        <Select
          id="category-select"
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
        <label htmlFor="tag-select" style={{ display: "block", marginRight: "8px" }}>
          Filter by Tags:
        </label>
        <Select
          id="tag-select"
          options={tagOptions}
          value={selectedTagOption}
          onChange={handleTagChange}
          placeholder="Select a tag..."
          isClearable
          styles={{
            control: (base) => ({ ...base, minWidth: 240 }),
          }}
        />
      </div>
    </>
  );
};

export default CategoryFilter;

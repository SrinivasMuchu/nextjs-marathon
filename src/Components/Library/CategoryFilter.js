'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

const CategoryFilter = ({ allCategories, initialSelectedCategories, allTags,initialTagSelectedOption }) => {

  const router = useRouter();

  const initialSelectedOption = allCategories
    .filter((cat) => initialSelectedCategories?.includes(cat.industry_category_name))
    .map((cat) => ({
      value: cat.industry_category_name,
      label: cat.industry_category_label,
    }))[0] || null;

 const initialTagSelected = allTags.find(
  (tag) => tag.cad_tag_name === initialTagSelectedOption
);

const [selectedTagOption, setSelectedTagOption] = useState(initialTagSelected);


  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  // const [selectedTagOption, setSelectedTagOption] = useState(initialTagSelectedOption);


  const handleChange = (selected) => {
    setSelectedOption(selected);
    const selectedValue = selected?.value;

    if (typeof window !== 'undefined') {
      const existingParams = new URLSearchParams(window.location.search);

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
    const selectedValue = selected?.value;

    if (typeof window !== 'undefined') {
      const existingParams = new URLSearchParams(window.location.search);

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
        styles={{
          control: (base) => ({ ...base, minWidth: 240 }),
        }}
      />
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <label htmlFor="category-select" style={{ display: "block", marginRight: "8px" }}>
        Filter by Tags:
      </label>
      <Select
        
        options={tagOptions}
        value={selectedTagOption}
        onChange={handleTagChange}
        placeholder="Select a tag..."
        styles={{
          control: (base) => ({ ...base, minWidth: 240 }),
        }}
      />
    </div>
    </>
    
  );
};

export default CategoryFilter;

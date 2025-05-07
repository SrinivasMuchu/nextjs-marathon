'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

const CategoryFilter = ({ allCategories, initialSelectedCategories }) => {
  const router = useRouter();

  const initialSelectedOptions = allCategories
    .filter((cat) => initialSelectedCategories?.includes(cat.industry_category_name))
    .map((cat) => ({
      value: cat.industry_category_name,
      label: cat.industry_category_label,
    }));

  const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions || []);

  const handleChange = (selected) => {
    setSelectedOptions(selected || []);
    const selectedValues = (selected || []).map((opt) => opt.value);
  
    if (typeof window !== 'undefined') {
      const existingParams = new URLSearchParams(window.location.search);
  
      if (selectedValues.length > 0) {
        existingParams.set('category', selectedValues.join(','));
      } else {
        existingParams.delete('category');
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

  // Custom styles
  const customStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "#610bee",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#ffffff",
      fontWeight: "500",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "#ffffff",
      ':hover': {
        backgroundColor: "#4b08b0",
        color: "#ffffff",
      },
    }),
  };

  return (
    <div style={{display: "flex",alignItems: "center", }}>  
      <label htmlFor="category-select" style={{ display: "block", marginBottom: "8px" }}>
        Filter by Category:
      </label>
      <Select
        id="category-select"
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select categories..."
        styles={customStyles}
      />
    </div>
  );
};

export default CategoryFilter;

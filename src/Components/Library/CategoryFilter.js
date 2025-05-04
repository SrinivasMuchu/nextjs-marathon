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
    const params = new URLSearchParams({
      category: selectedValues.join(","),
      page: 1,
      limit: 100,
    });

    try {
      router.push(`/library?${params.toString()}`);
    } catch (error) {
      console.error("Error during router.push:", error);
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

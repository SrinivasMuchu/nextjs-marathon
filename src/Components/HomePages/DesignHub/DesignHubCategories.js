'use client'

import React from 'react'
import styles from './DesignHub.module.css'

function DesignHubCategories({
  categories = [],
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <div className={styles.designHubCategoriesContainer}>
      <div className={styles.designHubCategoriesList}>
        {categories.length > 0 ? (
          categories.map((category) => {
            const categoryName = category.industry_category_name || category.name
            const isSelected = selectedCategory === categoryName

            return (
              <button
                key={category.id || category._id}
                className={`${styles.designHubCategoryButton} ${
                  isSelected ? styles.designHubCategoryButtonActive : ''
                }`}
                onClick={() => onCategoryChange(categoryName)}
              >
                {category.icon && (
                  <span className={styles.designHubCategoryIcon}>
                    {category.icon}
                  </span>
                )}
                <span className={styles.designHubCategoryName}>
                  {category.name ||
                    category.industry_category_label ||
                    category.title}
                </span>
              </button>
            )
          })
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  )
}

export default DesignHubCategories
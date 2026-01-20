'use client'

import React, { useRef, useState } from 'react'
import styles from './DesignHub.module.css'

function DesignHubCategories({
  categories = [],
  selectedCategory,
  onCategoryChange,
}) {
  const listRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    if (!listRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - listRef.current.offsetLeft)
    setScrollLeft(listRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !listRef.current) return
    e.preventDefault()
    const x = e.pageX - listRef.current.offsetLeft
    const walk = (x - startX) * 1 // scroll speed
    listRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <div className={styles.designHubCategoriesContainer}>
      <div
        ref={listRef}
        className={`${styles.designHubCategoriesList} ${
          isDragging ? styles.designHubCategoriesListDragging : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
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
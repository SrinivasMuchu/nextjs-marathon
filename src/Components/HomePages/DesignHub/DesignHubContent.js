'use client'

import React, { useContext, useMemo } from 'react'
import { contextState } from '../../CommonJsx/ContextProvider'
import DesignHubCategories from './DesignHubCategories'
import DesignHubDesignsWrapper from './DesignHubDesignsWrapper'
import ViewAllDesigns from './ViewAllDesigns'

function DesignHubContent({ categories = [], designsByCategory = {} }) {
  const { selectedCategory, setSelectedCategory } = useContext(contextState)

  const getCategoryName = (category) =>
    category?.industry_category_name ||
    category?.name ||
    category?.industry_category_label ||
    category?.title

  const activeCategory = useMemo(() => {
    if (selectedCategory) return selectedCategory

    if (categories.length > 0) {
      // Prefer "3D Printing" (case-insensitive) as initial default if it exists
      const preferred =
        categories.find((cat) =>
          (getCategoryName(cat) || '').toLowerCase().includes('3d printing')
        ) || categories[0]

      return getCategoryName(preferred) || '3d printing'
    }

    // Absolute fallback when no categories are available
    return '3d printing'
  }, [selectedCategory, categories])

  const activeDesigns = designsByCategory[activeCategory] || []

  return (
    <>
      <DesignHubCategories
        categories={categories}
        selectedCategory={activeCategory}
        onCategoryChange={setSelectedCategory}
      />
      <DesignHubDesignsWrapper
        activeCategory={activeCategory}
        designsByCategory={designsByCategory}
        activeDesigns={activeDesigns}
      />
      <ViewAllDesigns />
    </>
  )
}

export default DesignHubContent

'use client'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { contextState } from '../../CommonJsx/ContextProvider'
import DesignHubCategories from './DesignHubCategories'
import DesignHubDesignsWrapper from './DesignHubDesignsWrapper'
import ViewAllDesigns from './ViewAllDesigns'

function DesignHubContent({ categories = [], designsByCategory = {}, initialCategory = '' }) {
  const { setSelectedCategory } = useContext(contextState)

  const getCategoryName = (category) =>
    category?.industry_category_name ||
    category?.name ||
    category?.industry_category_label ||
    category?.title

  const fallbackCategory = useMemo(() => {
    if (categories.length > 0) {
      const preferred =
        categories.find((cat) =>
          (getCategoryName(cat) || '').toLowerCase().includes('3d printing')
        ) || categories[0]

      return getCategoryName(preferred) || '3d printing'
    }

    return '3d printing'
  }, [categories])

  const [activeCategory, setActiveCategory] = useState(initialCategory || fallbackCategory)

  useEffect(() => {
    setActiveCategory(initialCategory || fallbackCategory)
  }, [initialCategory, fallbackCategory])

  const activeDesigns = designsByCategory[activeCategory] || []

  return (
    <>
      <DesignHubCategories
        categories={categories}
        selectedCategory={activeCategory}
        onCategoryChange={(categoryName) => {
          setActiveCategory(categoryName)
          setSelectedCategory(categoryName)
        }}
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

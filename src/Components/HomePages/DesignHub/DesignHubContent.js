'use client'

import React, { useContext, useMemo } from 'react'
import { contextState } from '../../CommonJsx/ContextProvider'
import DesignHubCategories from './DesignHubCategories'
import DesignHubDesignsWrapper from './DesignHubDesignsWrapper'
import ViewAllDesigns from './ViewAllDesigns'

function DesignHubContent({ categories = [], designsByCategory = {} }) {
  const { selectedCategory, setSelectedCategory } = useContext(contextState)

  const activeCategory = useMemo(() => {
    if (selectedCategory) return selectedCategory
    if (categories.length > 0) {
      const first = categories[0]
      return first.industry_category_name || first.name || 'automotive'
    }
    return 'automotive'
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

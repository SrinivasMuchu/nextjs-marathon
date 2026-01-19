'use client'

import React, { useContext } from 'react'
import { contextState } from '../../CommonJsx/ContextProvider'
import DesignHubCategories from './DesignHubCategories'
import DesignHubDesignsWrapper from './DesignHubDesignsWrapper'
import ViewAllDesigns from './ViewAllDesigns'

function DesignHubContent() {
  const { selectedCategory, setSelectedCategory } = useContext(contextState)

  return (
    <>
      <DesignHubCategories 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      <DesignHubDesignsWrapper />
      <ViewAllDesigns />
    </>
  )
}

export default DesignHubContent

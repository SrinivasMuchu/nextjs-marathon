'use client'

import React, { useContext } from 'react'
import { contextState } from '../../CommonJsx/ContextProvider'
import DesignHubDesigns from './DesignHubDesigns'

function DesignHubDesignsWrapper() {
  const { selectedCategory } = useContext(contextState)
  // Use category from context, default to 'automotive'
  const activeCategory = selectedCategory || 'automotive'

  return <DesignHubDesigns category={activeCategory} />
}

export default DesignHubDesignsWrapper

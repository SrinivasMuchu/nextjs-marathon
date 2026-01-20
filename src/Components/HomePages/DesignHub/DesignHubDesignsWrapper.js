'use client'

import React, { useContext } from 'react'
import { contextState } from '../../CommonJsx/ContextProvider'
import DesignHubDesigns from './DesignHubDesigns'

function DesignHubDesignsWrapper({
  activeCategory,
  designsByCategory = {},
  activeDesigns,
}) {
  const { selectedCategory } = useContext(contextState)
  // Prefer the activeCategory passed from parent, fall back to context or default
  const resolvedCategory = activeCategory || selectedCategory || 'automotive'

  const designs =
    activeDesigns || designsByCategory[resolvedCategory] || []

  return <DesignHubDesigns designs={designs} />
}

export default DesignHubDesignsWrapper

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
  // Prefer the activeCategory from parent, then context, then first available key
  const resolvedCategory =
    activeCategory ||
    selectedCategory ||
    Object.keys(designsByCategory)[0] ||
    ''

  const designs =
    activeDesigns && activeDesigns.length > 0
      ? activeDesigns
      : designsByCategory[resolvedCategory] || []

  return <DesignHubDesigns designs={designs} />
}

export default DesignHubDesignsWrapper

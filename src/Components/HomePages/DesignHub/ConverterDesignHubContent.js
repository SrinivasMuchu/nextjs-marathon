'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import HoverImageSequenceHome from '../../CommonJsx/RotatedHomePageDesigns'
import styles from './ConverterDesignHub.module.css'

function getCategoryName(category) {
  return (
    category?.industry_category_name ||
    category?.name ||
    category?.industry_category_label ||
    category?.title ||
    ''
  )
}

function ConverterDesignHubContent({
  categories = [],
  designsByCategory = {},
  headingLevel = 2,
}) {
  const preferredCategory =
    categories.find((category) => getCategoryName(category).toLowerCase().includes('3d printing')) ||
    categories[0]
  const initialCategory = getCategoryName(preferredCategory) || Object.keys(designsByCategory)[0] || ''
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const HeadingTag = headingLevel === 3 ? 'h3' : 'h2'

  const designs = useMemo(() => {
    const selected = designsByCategory[activeCategory] || []
    if (selected.length) return selected.slice(0, 6)
    const fallback = Object.values(designsByCategory).find((items) => items?.length)
    return (fallback || []).slice(0, 6)
  }, [activeCategory, designsByCategory])

  return (
    <section className={styles.section} aria-labelledby="converter-design-hub-heading">
      <div className={styles.panel}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Marathon OS Design Hub</p>
            <HeadingTag id="converter-design-hub-heading" className={styles.heading}>
              Find a model before building from scratch
            </HeadingTag>
            <p className={styles.description}>
              Browse engineering categories and recent 3D-printing models. Preview and validate
              every downloaded file before production use.
            </p>
          </div>
          <Link href="/library" className={styles.viewAll}>
            View all designs <ArrowRight size={13} />
          </Link>
        </header>

        <div className={styles.categories} aria-label="Design categories">
          {categories.map((category) => {
            const categoryName = getCategoryName(category)
            if (!categoryName) return null
            const active = categoryName === activeCategory
            return (
              <button
                key={category.id || category._id || categoryName}
                type="button"
                className={`${styles.category} ${active ? styles.categoryActive : ''}`}
                onClick={() => setActiveCategory(categoryName)}
              >
                <span aria-hidden>◆</span>
                {category.name || category.industry_category_label || category.title || categoryName}
              </button>
            )
          })}
        </div>

        <div className={styles.grid}>
          {designs.map((design) => (
            <Link key={design._id} href={`/library/${design.route}`} className={styles.card}>
              <span className={styles.tag}>{activeCategory || 'Engineering'}</span>
              <div className={styles.designImage}>
                <HoverImageSequenceHome design={design} loading="lazy" />
              </div>
              <h4>{design.page_title}</h4>
              <div className={styles.cardMeta}>
                <span>{String(design.file_type || 'CAD').toUpperCase()} engineering model</span>
                <strong>Free</strong>
              </div>
            </Link>
          ))}
          {!designs.length ? (
            <p className={styles.empty}>Designs are currently unavailable. Browse the complete CAD library instead.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ConverterDesignHubContent


import React from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { popularCadConverterTypes } from '@/common.helper'
import styles from './CadConverterTypes.module.css'

const FORMAT_FILTERS = ['All', 'STEP', 'IGES', 'OBJ', 'PLY', 'STL', 'OFF', 'BREP', '3DM', 'DWG', 'DXF']

function CadConverterTypes({ activeFormat = 'All', query = '' }) {
  const selectedFormat = FORMAT_FILTERS.includes(activeFormat.toUpperCase())
    ? activeFormat.toUpperCase()
    : 'All'
  const normalizedQuery = query.trim().toLowerCase()
  const filteredTools = popularCadConverterTypes.filter((item) => {
    // When searching, ignore the selected format and filter by search only.
    if (normalizedQuery) {
      return `${item.from} to ${item.to} ${item.description}`.toLowerCase().includes(normalizedQuery)
    }

    return selectedFormat === 'All' || item.from === selectedFormat
  })

  return (
    <section className={styles.section} aria-labelledby="cad-converter-types-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.label}>Popular conversions</p>
          <h2 id="cad-converter-types-heading" className={styles.mainHeading}>
            Browse every CAD converter type
          </h2>
          <p className={styles.intro}>
            Filter by source format or search for the exact conversion you need. The directory
            stays compact while preserving internal links to every converter page.
          </p>
        </header>

        <div className={styles.directory}>
          <div className={styles.toolbar}>
            <div className={styles.filters} aria-label="Filter converters by source format">
              {FORMAT_FILTERS.map((format) => {
                const params = new URLSearchParams()
                if (format !== 'All') params.set('converterFormat', format)
                const href = `${params.size ? `?${params.toString()}` : ''}#cad-converter-types-heading`

                return (
                  <Link
                    key={format}
                    href={href}
                    className={`${styles.filterButton} ${
                      selectedFormat === format && !normalizedQuery ? styles.filterButtonActive : ''
                    }`}
                    aria-current={selectedFormat === format && !normalizedQuery ? 'true' : undefined}
                  >
                    {format}
                  </Link>
                )
              })}
            </div>
            <form className={styles.search} method="get">
              <Search size={15} strokeWidth={2} aria-hidden />
              <input
                type="search"
                name="converterSearch"
                defaultValue={query}
                placeholder="Search STEP to STL..."
                aria-label="Search converter types"
              />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className={styles.grid}>
            {filteredTools.map((item) => (
              <Link
                key={item.path}
                href={`/tools/convert-${item.path.slice(1)}`}
                className={styles.card}
              >
                <div className={styles.badgeRow} aria-hidden>
                  <span className={styles.pillFrom}>{item.from}</span>
                  <ArrowRight size={13} strokeWidth={2} className={styles.arrowIcon} />
                  <span className={styles.pillTo}>{item.to}</span>
                </div>
                <div className={styles.cardContent}>
                  <h3>{item.from} to {item.to}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
            {filteredTools.length === 0 ? (
              <p className={styles.empty}>No converters match your search.</p>
            ) : null}
          </div>
          <div className={styles.resultCount}>
            Showing {filteredTools.length} converter{filteredTools.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CadConverterTypes

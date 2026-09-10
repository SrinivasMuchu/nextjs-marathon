'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { popularCadConverterTypes } from '@/common.helper'
import { CONVERTER_FILTER_EVENT, CONVERTER_HUB_PAGE } from '@/data/converterHubPage'
import styles from './CadConverterTypes.module.css'

function CadConverterTypes() {
  const [selectedFormat, setSelectedFormat] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onFilter = (event) => {
      const filter = event?.detail?.filter
      if (!filter) return
      setSelectedFormat(filter)
      setQuery('')
    }
    window.addEventListener(CONVERTER_FILTER_EVENT, onFilter)
    return () => window.removeEventListener(CONVERTER_FILTER_EVENT, onFilter)
  }, [])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredTools = useMemo(() => popularCadConverterTypes.filter((item) => {
    if (normalizedQuery) {
      return `${item.from} to ${item.to} ${item.description}`.toLowerCase().includes(normalizedQuery)
    }
    return selectedFormat === 'All' || item.from === selectedFormat
  }), [normalizedQuery, selectedFormat])

  const groupedTools = useMemo(() => {
    const groups = []
    const seen = new Map()
    filteredTools.forEach((item) => {
      if (!seen.has(item.from)) {
        seen.set(item.from, [])
        groups.push({ from: item.from, items: seen.get(item.from) })
      }
      seen.get(item.from).push(item)
    })
    const order = CONVERTER_HUB_PAGE.directoryFilters
    return groups.sort((a, b) => {
      const aIndex = order.indexOf(a.from)
      const bIndex = order.indexOf(b.from)
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex)
    })
  }, [filteredTools])

  return (
    <section className={styles.section} aria-labelledby="cad-converter-types-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.label}>{CONVERTER_HUB_PAGE.directoryEyebrow}</p>
          <h2 id="cad-converter-types-heading" className={styles.mainHeading}>
            {CONVERTER_HUB_PAGE.directoryHeading}
          </h2>
          <p className={styles.intro}>{CONVERTER_HUB_PAGE.directoryIntro}</p>
        </header>

        <div className={styles.directory} data-nosnippet>
          <div className={styles.toolbar}>
            <div className={styles.filters} aria-label="Filter converters by source format">
              {CONVERTER_HUB_PAGE.directoryFilters.map((format) => (
                <button
                  key={format}
                  type="button"
                  className={`${styles.filterButton} ${
                    selectedFormat === format && !normalizedQuery ? styles.filterButtonActive : ''
                  }`}
                  onClick={() => {
                    setSelectedFormat(format)
                    setQuery('')
                  }}
                >
                  {format}
                </button>
              ))}
            </div>
            <div className={styles.search}>
              <Search size={15} strokeWidth={2} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversion routes"
                aria-label="Search conversion routes"
              />
            </div>
          </div>

          {groupedTools.map((group) => (
            <div key={group.from} className={styles.group}>
              <h3 className={styles.groupHeading}>Convert from {group.from}</h3>
              <div className={styles.grid}>
                {group.items.map((item) => (
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
              </div>
            </div>
          ))}
          {filteredTools.length === 0 ? (
            <div className={styles.empty}>
              <p><strong>{CONVERTER_HUB_PAGE.directoryEmptyTitle}</strong></p>
              <p>{CONVERTER_HUB_PAGE.directoryEmptyBody}</p>
              <a href="#cad-file-converter">{CONVERTER_HUB_PAGE.directoryEmptyCta}</a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default CadConverterTypes

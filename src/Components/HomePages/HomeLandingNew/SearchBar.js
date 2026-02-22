"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiSearch } from "react-icons/fi"
import { BASE_URL, IMAGEURLS } from "../../../config"
import { getLibraryPathWithQuery } from "@/common.helper"
import styles from "./HomeLandingNew.module.css"
import Image from "next/image"

function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const query = searchQuery.trim()

    if (!query) {
      setResults([])
      return
    }

    const handler = setTimeout(async () => {
      try {
        setIsLoading(true)
        // Get UUID from localStorage (client-side)
        const uuid = typeof window !== 'undefined' ? localStorage.getItem('uuid') : null

        // Build query parameters
        const queryParams = new URLSearchParams()
        queryParams.set('limit', '20')
        queryParams.set('page', '1')
        queryParams.set('search', query)
        queryParams.set('uuid', uuid)

        const response = await axios.get(
          `${BASE_URL}/v1/cad/get-category-design?${queryParams.toString()}`,
          { cache: 'no-store' }
        )

        const designs = response.data?.data?.designDetails || []
        setResults(designs)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 400)

    return () => clearTimeout(handler)
  }, [searchQuery])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const term = searchQuery.trim()
      if (term) {
        const href = getLibraryPathWithQuery({ search: term })
        router.push(href)
      }
    }
  }

  const showDropdown = searchQuery.trim() && (results.length > 0 || isLoading)

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBar}>
        <FiSearch className={styles.searchIcon} size={20} />
        <input
          type="text"
          placeholder="Search CAD files 'Engine'"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
          aria-label="Search CAD files"
        />
      </div>

      {showDropdown && (
        <div className={styles.searchResults}>
          {isLoading && (
            <div className={styles.searchResultItem}>Searching…</div>
          )}
          {!isLoading &&
            results.map((design) => (
              <Link
                key={design._id}
                href={`/library/${design.route}`}
                className={styles.searchResultItem}
              >
                <Image src={IMAGEURLS.cubeFocus} alt="search-icon" width={20} height={20} />
             
                <span className={styles.searchResultText}>
                  {design.page_title}
                </span>
              </Link>
            ))}
          {!isLoading && results.length === 0 && (
            <div className={styles.searchResultItem}>No results found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar

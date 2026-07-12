'use client';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '@/config';
import { getLibraryPath } from '@/common.helper';
import { get2DLibraryPath } from '@/data/twoDLibraryPage';
import {
  LIBRARY_SEARCH_POPULAR_PARTS,
  LIBRARY_SEARCH_STANDARDS,
} from '@/data/librarySearchSuggestions';
import libraryStyles from './Library.module.css';
import styles from './LibraryHeroSearch.module.css';

export default function LibraryHeroSearch({
  initialSearchQuery = '',
  placeholder = 'Search by part, standard or spec — "M8", "NEMA 17", "608 bea..."',
  libraryMode = '3d',
  browseCards = [],
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [panelOpen, setPanelOpen] = useState(false);
  const wrapRef = useRef(null);
  const router = useRouter();

  const showPanel = panelOpen && !searchQuery.trim();

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    if (!panelOpen) return undefined;

    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setPanelOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPanelOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [panelOpen]);

  const logSearch = async (query) => {
    try {
      const trimmed = (query || '').trim();
      if (!trimmed || typeof window === 'undefined') return;

      const uuid = localStorage.getItem('uuid');
      if (!uuid) return;

      await axios.post(
        `${BASE_URL}/v1/cad/log-search`,
        { search_text: trimmed },
        { headers: { 'user-uuid': uuid } }
      );
    } catch (error) {
      console.error('Failed to log search term', error);
    }
  };

  const pushSearch = (query) => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const existingParams = new URLSearchParams(window.location.search);
    const trimmed = (query || '').trim();

    if (trimmed) {
      existingParams.set('search', trimmed);
      logSearch(trimmed);
    } else {
      existingParams.delete('search');
    }

    existingParams.set('page', '1');
    existingParams.delete('limit');
    setPanelOpen(false);
    router.push(`${pathname}?${existingParams.toString()}`);
  };

  const handleSearch = () => {
    pushSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const existingParams = new URLSearchParams(window.location.search);
    existingParams.delete('search');
    router.push(`${pathname}?${existingParams.toString()}`);
  };

  const partHref = (tagName) =>
    libraryMode === '2d'
      ? get2DLibraryPath({ tagName })
      : getLibraryPath({ tagName });

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <form
        className={libraryStyles['library-hero-search-form']}
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <div className={libraryStyles['library-hero-search-bar']}>
          <SearchIcon className={libraryStyles['library-hero-search-icon']} aria-hidden />
          <input
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setPanelOpen(true)}
            className={libraryStyles['library-hero-search-input']}
            aria-label="Search library"
            aria-expanded={showPanel}
            aria-controls="library-search-suggestions"
            autoComplete="off"
          />
          {searchQuery ? (
            <button
              type="button"
              className={libraryStyles['library-hero-search-clear']}
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <ClearIcon fontSize="small" />
            </button>
          ) : null}
          <button type="submit" className={libraryStyles['library-hero-search-button']}>
            <SearchIcon fontSize="small" aria-hidden />
            Search
          </button>
        </div>
      </form>

      {showPanel ? (
        <div
          id="library-search-suggestions"
          className={styles.panel}
          role="listbox"
          aria-label="Search suggestions"
        >
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <StarBorderOutlinedIcon aria-hidden />
              Search by standard
            </h3>
            <div className={styles.chips}>
              {LIBRARY_SEARCH_STANDARDS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={styles.chip}
                  onClick={() => {
                    setSearchQuery(item.query);
                    pushSearch(item.query);
                  }}
                >
                  <StarBorderOutlinedIcon className={styles.chipIcon} aria-hidden />
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <LocalOfferOutlinedIcon aria-hidden />
              Popular parts
            </h3>
            <div className={styles.chips}>
              {LIBRARY_SEARCH_POPULAR_PARTS.map((item) => (
                <Link
                  key={item.label}
                  href={partHref(item.tagName)}
                  className={styles.chip}
                  onClick={() => setPanelOpen(false)}
                >
                  <LocalOfferOutlinedIcon className={styles.chipIcon} aria-hidden />
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          {/* {browseCards.length > 0 ? (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <GridViewOutlinedIcon aria-hidden />
                Browse by what you&apos;ll do
              </h3>
              <div className={styles.browseGrid}>
                {browseCards.map((card) => (
                  <Link
                    key={card.id}
                    href={card.href}
                    className={`${styles.browseCard} ${styles[`accent-${card.accent}`] || styles['accent-purple']}`}
                    onClick={() => setPanelOpen(false)}
                  >
                    <h4 className={styles.browseCardTitle}>{card.title}</h4>
                    <p className={styles.browseCardFormats}>{card.formats}</p>
                    <p className={styles.browseCardDesc}>{card.description}</p>
                    <span className={styles.browseCardLink}>{card.browseLabel} →</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null} */}
        </div>
      ) : null}
    </div>
  );
}

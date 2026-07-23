'use client';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BASE_URL, IMAGEURLS } from '@/config';
import { getLibraryPath } from '@/common.helper';
import { get2DLibraryPath, TWO_D_LIBRARY_BASE } from '@/data/twoDLibraryPage';
import {
  LIBRARY_SEARCH_POPULAR_PARTS,
  LIBRARY_SEARCH_STANDARDS,
} from '@/data/librarySearchSuggestions';
import libraryStyles from './Library.module.css';
import styles from './LibraryHeroSearch.module.css';

const SUGGESTION_LIMIT = 20;
const SUGGESTION_DEBOUNCE_MS = 400;

export default function LibraryHeroSearch({
  initialSearchQuery = '',
  placeholder = 'Search by part, standard or spec — "M8", "NEMA 17", "608 bea..."',
  libraryMode = '3d',
  browseCards = [],
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [panelOpen, setPanelOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapRef = useRef(null);
  const router = useRouter();

  const trimmedQuery = searchQuery.trim();
  const showEmptyPanel = panelOpen && !trimmedQuery;
  const showLiveSuggestions = panelOpen && Boolean(trimmedQuery);
  const suggestionsExpanded = showEmptyPanel || showLiveSuggestions;

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

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setResults([]);
      setIsLoading(false);
      return undefined;
    }

    const handler = setTimeout(async () => {
      try {
        setIsLoading(true);
        const uuid =
          typeof window !== 'undefined' ? localStorage.getItem('uuid') : null;

        const queryParams = new URLSearchParams();
        queryParams.set('limit', String(SUGGESTION_LIMIT));
        queryParams.set('page', '1');
        queryParams.set('search', query);
        if (uuid) queryParams.set('uuid', uuid);
        if (libraryMode === '2d') queryParams.set('two_dims', '1');

        const response = await axios.get(
          `${BASE_URL}/v1/cad/get-category-design?${queryParams.toString()}`,
          { cache: 'no-store' }
        );

        const designs = response.data?.data?.designDetails || [];
        setResults(designs);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, SUGGESTION_DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [searchQuery, libraryMode]);

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

    const basePath = libraryMode === '2d' ? TWO_D_LIBRARY_BASE : '/library';
    const nextParams = new URLSearchParams();
    const trimmed = (query || '').trim();

    if (trimmed) {
      nextParams.set('search', trimmed);
      logSearch(trimmed);
    }

    setPanelOpen(false);
    const qs = nextParams.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const handleSearch = () => {
    pushSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    if (typeof window === 'undefined') return;

    const basePath = libraryMode === '2d' ? TWO_D_LIBRARY_BASE : '/library';
    router.push(basePath);
  };

  const partHref = (tagName) =>
    libraryMode === '2d'
      ? get2DLibraryPath({ tagName })
      : getLibraryPath({ tagName });

  const designHref = (design) => {
    const route = String(design?.route || '').trim();
    if (!route) return libraryMode === '2d' ? TWO_D_LIBRARY_BASE : '/library';
    return libraryMode === '2d'
      ? `${TWO_D_LIBRARY_BASE}/${encodeURIComponent(route)}`
      : `/library/${encodeURIComponent(route)}`;
  };

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
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPanelOpen(true);
            }}
            onFocus={() => setPanelOpen(true)}
            className={libraryStyles['library-hero-search-input']}
            aria-label="Search library"
            aria-expanded={suggestionsExpanded}
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

      {showEmptyPanel ? (
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
        </div>
      ) : null}

      {showLiveSuggestions ? (
        <div
          id="library-search-suggestions"
          className={styles.liveResults}
          role="listbox"
          aria-label="Search results"
        >
          {isLoading ? (
            <div className={styles.liveResultItem}>Searching…</div>
          ) : null}
          {!isLoading &&
            results.map((design) => (
              <Link
                key={design._id}
                href={designHref(design)}
                className={styles.liveResultItem}
                onClick={() => setPanelOpen(false)}
              >
                <Image
                  src={IMAGEURLS.cubeFocus}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.liveResultIcon}
                />
                <span className={styles.liveResultText}>
                  {design.page_title || design.part_name || 'Untitled design'}
                </span>
              </Link>
            ))}
          {!isLoading && results.length === 0 ? (
            <div className={styles.liveResultItem}>No results found</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

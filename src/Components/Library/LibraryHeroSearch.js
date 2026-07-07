'use client';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BASE_URL } from '@/config';
import styles from './Library.module.css';

export default function LibraryHeroSearch({
  initialSearchQuery = '',
  placeholder = 'Search by part, standard or spec — "M8", "NEMA 17", "608 bea..."',
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const router = useRouter();

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

  const handleSearch = () => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const existingParams = new URLSearchParams(window.location.search);

    if (searchQuery.trim()) {
      existingParams.set('search', searchQuery.trim());
      logSearch(searchQuery);
    } else {
      existingParams.delete('search');
    }

    existingParams.set('page', '1');
    existingParams.delete('limit');

    router.push(`${pathname}?${existingParams.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const existingParams = new URLSearchParams(window.location.search);
    existingParams.delete('search');
    router.push(`${pathname}?${existingParams.toString()}`);
  };

  return (
    <form
      className={styles['library-hero-search-form']}
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch();
      }}
    >
      <div className={styles['library-hero-search-bar']}>
        <SearchIcon className={styles['library-hero-search-icon']} aria-hidden />
        <input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className={styles['library-hero-search-input']}
          aria-label="Search library"
        />
        {searchQuery ? (
          <button
            type="button"
            className={styles['library-hero-search-clear']}
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <ClearIcon fontSize="small" />
          </button>
        ) : null}
        <button type="submit" className={styles['library-hero-search-button']}>
          <SearchIcon fontSize="small" aria-hidden />
          Search
        </button>
      </div>
    </form>
  );
}

'use client';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { BASE_URL } from '@/config';
import styles from './Library.module.css';

const SearchBar = ({ initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const router = useRouter();

  const logSearch = async (query) => {
    try {
      const trimmed = (query || '').trim();
      if (!trimmed) return;

      if (typeof window === 'undefined') return;
      const uuid = localStorage.getItem('uuid');
      if (!uuid) return;

      await axios.post(
        `${BASE_URL}/v1/cad/log-search`,
        { search_text: trimmed },
        {
          headers: {
            'user-uuid': uuid,
          },
        }
      );
    } catch (error) {
      console.error('Failed to log search term', error);
    }
  };

  const handleSearch = () => {
    if (typeof window !== 'undefined') {
      const existingParams = new URLSearchParams(window.location.search);

      if (searchQuery.trim()) {
        existingParams.set('search', searchQuery.trim());
      } else {
        existingParams.delete('search');
      }

      existingParams.set('page', '1');
      existingParams.set('limit', '20');

      router.push(`/library?${existingParams.toString()}`);
      // logSearch(searchQuery);
    }
  };


  return (
    <div className={styles["search-container-div"]}>
      <div className={styles["search-bar"]}>
        <div className={styles["search-container"]}>
          <SearchIcon className={styles["search-icon"]} />
          <input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className={styles["search-input"]}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                const existingParams = new URLSearchParams(window.location.search);
                existingParams.delete('search');
               
                router.push(`/library?${existingParams.toString()}`);
              }}
            >
              <ClearIcon />
            </button>

          )}
        </div>

        <button
          onClick={handleSearch}
          className={styles["search-button"]}
          style={{
            marginLeft: '8px',
            padding: '8px 12px',
            backgroundColor: '#610bee',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Search
        </button>

      </div>
    </div>
  );
};

export default SearchBar;

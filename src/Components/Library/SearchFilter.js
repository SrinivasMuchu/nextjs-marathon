'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import styles from './Library.module.css';

const SearchBar = ({ initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams({
      search: searchQuery,
      page: 1,
      limit: 100
    });

    // Preserve category filter if it exists
    if (typeof window !== 'undefined' && window.location.search.includes('category=')) {
      const existingParams = new URLSearchParams(window.location.search);
      const category = existingParams.get('category');
      if (category) params.set('category', category);
    }

    router.push(`/library?${params.toString()}`);
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

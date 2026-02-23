'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './Library.module.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'views', label: 'Most Views' },
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'oldest', label: 'Oldest First' },
];

export default function SortBySelect({ initialSort = 'newest', className }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = SORT_OPTIONS.find((o) => o.value === (initialSort || 'newest')) || SORT_OPTIONS[0];

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSelect = (option) => {
    setMenuOpen(false);
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    if (option?.value) params.set('sort', option.value);
    else params.delete('sort');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div ref={containerRef} className={`${styles['library-sort-dropdown']} ${className || ''}`}>
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className={styles['library-sort-trigger']}
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        aria-label="Sort by"
      >
        Sort by: {selected.label}
        <ExpandMoreIcon sx={{ fontSize: 18 }} />
      </button>
      {menuOpen && (
        <ul
          className={styles['library-sort-menu']}
          role="listbox"
          aria-label="Sort options"
        >
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={selected.value === opt.value}
                className={styles['library-sort-option']}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

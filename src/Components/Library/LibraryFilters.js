'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import SearchBar from './SearchFilter';
import CategoryFilter from './CategoryFilter';
import SortBySelect from './SortBySelect';
import styles from './Library.module.css';

const RECENCY_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: 'week', label: 'Past week' },
  { value: 'month', label: 'Past month' },
  { value: 'year', label: 'Past year' },
];

const FREE_PAID_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

const FILE_FORMATS = [
  { value: 'STEP', label: 'STEP/STP' },
  { value: 'IGES', label: 'IGES' },
  { value: 'STL', label: 'STL' },
];

const selectStyles = {
  control: (base) => ({ ...base, minHeight: 40, width: '100%' }),
  container: (base) => ({ ...base, width: '100%' }),
};

export default function LibraryFilters({
  initialSearchQuery,
  category,
  tags,
  allCategories,
  allTags,
  initialSort,
  initialRecency,
  initialFreePaid,
  initialFileFormat,
  hasActiveFilters,
}) {
  const router = useRouter();
  const selectedFormats = (initialFileFormat || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`/library?${params.toString()}`);
  };

  const toggleFileFormat = useCallback((formatValue, checked) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const current = (params.get('file_format') || '').split(',').map((f) => f.trim().toUpperCase()).filter(Boolean);
    let next;
    if (checked) {
      next = current.includes(formatValue) ? current : [...current, formatValue];
    } else {
      next = current.filter((f) => f !== formatValue);
    }
    if (next.length) params.set('file_format', next.join(','));
    else params.delete('file_format');
    params.set('page', '1');
    router.push(`/library?${params.toString()}`);
  }, [router]);

  const recencyOption = RECENCY_OPTIONS.find((o) => o.value === initialRecency) || RECENCY_OPTIONS[0];
  const freePaidOption = FREE_PAID_OPTIONS.find((o) => o.value === initialFreePaid) || FREE_PAID_OPTIONS[0];

  return (
    <>
      <h2 className={styles['library-filters-title']}>FILTERS</h2>
      <div className={styles['library-filters-search']}>
        <SearchBar initialSearchQuery={initialSearchQuery} />
      </div>
      <div className={styles['library-filters-group']}>
        <span className={styles['library-filters-label']}>Recency</span>
        <Select
          options={RECENCY_OPTIONS}
          value={recencyOption}
          onChange={(o) => updateParam('recency', o?.value)}
          isClearable
          placeholder="Any time"
          aria-label="Recency"
          styles={selectStyles}
        />
      </div>
      <div className={styles['library-filters-group']}>
        <span className={styles['library-filters-label']}>Free/Paid</span>
        <Select
          options={FREE_PAID_OPTIONS}
          value={freePaidOption}
          onChange={(o) => updateParam('free_paid', o?.value)}
          isClearable
          placeholder="All"
          aria-label="Free or Paid"
          styles={selectStyles}
        />
      </div>
      <div className={styles['library-filters-group']}>
        <span className={styles['library-filters-label']}>Tags</span>
        <div className={styles['library-filters-category-tags']}>
          <CategoryFilter
            allCategories={allCategories}
            allTags={allTags}
            initialSelectedCategories={category.split(',')}
            initialTagSelectedOption={tags}
            showOnly="tags"
          />
        </div>
      </div>
      <div className={styles['library-filters-group']}>
        <span className={styles['library-filters-label']}>Category</span>
        <div className={styles['library-filters-category-tags']}>
          <CategoryFilter
            allCategories={allCategories}
            allTags={allTags}
            initialSelectedCategories={category.split(',')}
            initialTagSelectedOption={tags}
            showOnly="category"
          />
        </div>
      </div>
      <div className={styles['library-filters-group']}>
        <span className={styles['library-filters-label']}>File format</span>
        <div className={styles['library-filters-options']}>
          {FILE_FORMATS.map(({ value, label }) => (
            <label key={value}>
              <input
                type="checkbox"
                checked={selectedFormats.includes(value)}
                onChange={(e) => toggleFileFormat(value, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div className={styles['library-filters-group']}>
        <span className={styles['library-filters-label']}>Sort By</span>
        <SortBySelect initialSort={initialSort} />
      </div>
      {hasActiveFilters && (
        <Link href="/library" className={styles['library-filters-reset']}>
          Reset filters
        </Link>
      )}
    </>
  );
}

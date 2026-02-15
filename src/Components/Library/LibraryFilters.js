'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import SearchBar from './SearchFilter';
import CategoryFilter from './CategoryFilter';
import SortBySelect from './SortBySelect';
import styles from './Library.module.css';

const RECENCY_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
 
];

const FREE_PAID_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

const FILE_FORMAT_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'step', label: 'STEP/STP' },
  { value: 'iges', label: 'IGES' },
  { value: 'stl', label: 'STL' },
  { value: 'ply', label: 'PLY' },
  { value: 'off', label: 'OFF' },
  { value: 'obj', label: 'OBJ' },
  { value: 'stp', label: 'STP' },
  { value: 'brep', label: 'BREP' },
  { value: 'igs', label: 'IGS' },
  { value: 'dxf', label: 'DXF' },
  { value: 'dwg', label: 'DWG' },

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
  const selectedFormat = (initialFileFormat || '').trim().toUpperCase();

  const updateParam = (key, value) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`/library?${params.toString()}`);
  };

  const recencyOption = RECENCY_OPTIONS.find((o) => o.value === initialRecency) || RECENCY_OPTIONS[0];
  const freePaidOption = FREE_PAID_OPTIONS.find((o) => o.value === initialFreePaid) || FREE_PAID_OPTIONS[0];
  const fileFormatOption =
    FILE_FORMAT_OPTIONS.find((o) => o.value && o.value.toUpperCase() === selectedFormat) || FILE_FORMAT_OPTIONS[0];

  return (
    <>
      <div className={styles['library-filters-head']}>
        <h2 className={styles['library-filters-title']}>FILTERS</h2>
        {hasActiveFilters && (
          <Link href="/library" className={styles['library-filters-reset']}>
            Reset filters
          </Link>
        )}
      </div>
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
        <Select
          options={FILE_FORMAT_OPTIONS}
          value={fileFormatOption}
          onChange={(o) => updateParam('file_format', o?.value)}
          isClearable
          placeholder="All"
          aria-label="File format"
          styles={selectStyles}
        />
      </div>
      <div className={styles['library-filters-group']}>
        <span className={styles['library-filters-label']}>Sort By</span>
        <SortBySelect initialSort={initialSort} />
      </div>
    </>
  );
}

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const SORT_OPTIONS = [
  { value: 'views', label: 'Most Views' },
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export default function SortBySelect({ initialSort = 'views', className }) {
  const router = useRouter();
  const selected = SORT_OPTIONS.find((o) => o.value === (initialSort || 'views')) || SORT_OPTIONS[0];

  const handleChange = (option) => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    if (option?.value) params.set('sort', option.value);
    else params.delete('sort');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      options={SORT_OPTIONS}
      value={selected}
      onChange={handleChange}
      isClearable={false}
      aria-label="Sort by"
      className={className}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: 40,
          width: '100%',
        }),
        container: (base) => ({
          ...base,
          width: '100%',
        }),
      }}
    />
  );
}

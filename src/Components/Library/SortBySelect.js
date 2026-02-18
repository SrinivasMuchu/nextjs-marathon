'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'views', label: 'Most Views' },
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'oldest', label: 'Oldest First' },
];

export default function SortBySelect({ initialSort = 'newest', className }) {
  const router = useRouter();
  const selected = SORT_OPTIONS.find((o) => o.value === (initialSort || 'newest')) || SORT_OPTIONS[0];

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
      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
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
        menuPortal: (base) => ({
          ...base,
          zIndex: 1100,
        }),
      }}
    />
  );
}

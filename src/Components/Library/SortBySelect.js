'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Sort by Relevance' },
  { value: 'views', label: 'Sort by Views' },
  { value: 'downloads', label: 'Sort by Downloads' },
];

export default function SortBySelect({ initialSort = 'views', className }) {
  const router = useRouter();
  const selected = SORT_OPTIONS.find((o) => o.value === (initialSort || 'views')) || SORT_OPTIONS[0];

  const handleChange = (option) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (option?.value) {
      params.set('sort', option.value);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');
    router.push(`/library?${params.toString()}`);
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

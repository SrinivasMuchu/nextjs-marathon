'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/** Query keys that may stay indexable. Everything else gets noindex while navigating. */
const INDEXABLE_QUERY_KEYS = new Set(['page']);

const ROBOTS_META_ATTR = 'data-library-filter-robots';

function syncFilterRobotsMeta(searchParams) {
  const hasFilterQuery = [...searchParams.keys()].some(
    (key) => !INDEXABLE_QUERY_KEYS.has(key) && String(searchParams.get(key) || '').trim() !== ''
  );

  let meta = document.querySelector(`meta[name="robots"][${ROBOTS_META_ATTR}]`);

  if (hasFilterQuery) {
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      meta.setAttribute(ROBOTS_META_ATTR, '1');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, follow');
    return;
  }

  if (meta) {
    meta.remove();
  }
}

function FilterQueryRobotsTagInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    syncFilterRobotsMeta(searchParams);
    return () => {
      const meta = document.querySelector(`meta[name="robots"][${ROBOTS_META_ATTR}]`);
      if (meta) meta.remove();
    };
  }, [searchParams]);

  return null;
}

/**
 * Keeps noindex on filter/search query URLs during client-side library navigation.
 * Does not affect clean URLs or ?page= only.
 */
export default function FilterQueryRobotsTag() {
  return (
    <Suspense fallback={null}>
      <FilterQueryRobotsTagInner />
    </Suspense>
  );
}

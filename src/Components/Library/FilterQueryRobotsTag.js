'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isLibraryTagFilterPath } from '@/data/librarySeoAllowlist';

/** Query keys that may stay indexable. Everything else gets noindex while navigating. */
const INDEXABLE_QUERY_KEYS = new Set(['page']);

const ROBOTS_META_ATTR = 'data-library-filter-robots';
const ROBOTS_PREV_ATTR = 'data-library-robots-prev';

function hasFilterQuery(searchParams) {
  if (!searchParams) return false;
  return [...searchParams.keys()].some(
    (key) => !INDEXABLE_QUERY_KEYS.has(key) && String(searchParams.get(key) || '').trim() !== ''
  );
}

function shouldNoindex(pathname, searchParams) {
  return hasFilterQuery(searchParams) || isLibraryTagFilterPath(pathname);
}

function isNoindexContent(content) {
  return /noindex/i.test(content || '');
}

let applyingRobots = false;

function applyFilterNoindex() {
  applyingRobots = true;
  try {
    const metas = [...document.querySelectorAll('meta[name="robots"]')];

    metas.forEach((meta) => {
      if (meta.hasAttribute(ROBOTS_META_ATTR)) {
        if (meta.getAttribute('content') !== 'noindex, follow') {
          meta.setAttribute('content', 'noindex, follow');
        }
        return;
      }
      const current = meta.getAttribute('content') || '';
      if (isNoindexContent(current) && /nofollow/i.test(current)) {
        return;
      }
      if (!isNoindexContent(current)) {
        if (!meta.hasAttribute(ROBOTS_PREV_ATTR)) {
          meta.setAttribute(ROBOTS_PREV_ATTR, current);
        }
        meta.setAttribute('content', 'noindex, follow');
      }
    });

    let ours = document.querySelector(`meta[name="robots"][${ROBOTS_META_ATTR}]`);
    if (!ours) {
      ours = document.createElement('meta');
      ours.setAttribute('name', 'robots');
      ours.setAttribute(ROBOTS_META_ATTR, '1');
      document.head.appendChild(ours);
    }
    if (ours.getAttribute('content') !== 'noindex, follow') {
      ours.setAttribute('content', 'noindex, follow');
    }
  } finally {
    applyingRobots = false;
  }
}

function clearFilterNoindex() {
  applyingRobots = true;
  try {
    document.querySelectorAll(`meta[name="robots"][${ROBOTS_META_ATTR}]`).forEach((meta) => {
      meta.remove();
    });
    document.querySelectorAll(`meta[name="robots"][${ROBOTS_PREV_ATTR}]`).forEach((meta) => {
      const previous = meta.getAttribute(ROBOTS_PREV_ATTR);
      if (previous) meta.setAttribute('content', previous);
      else meta.removeAttribute('content');
      meta.removeAttribute(ROBOTS_PREV_ATTR);
    });
  } finally {
    applyingRobots = false;
  }
}

function syncFilterRobotsMeta(pathname, searchParams) {
  if (shouldNoindex(pathname, searchParams)) {
    applyFilterNoindex();
    return;
  }
  clearFilterNoindex();
}

function FilterQueryRobotsTagInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const latestRef = useRef({ pathname, searchParams });
  latestRef.current = { pathname, searchParams };

  useEffect(() => {
    const sync = () => {
      if (applyingRobots) return;
      const { pathname: path, searchParams: params } = latestRef.current;
      syncFilterRobotsMeta(path, params);
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['content', 'name'],
    });

    return () => {
      observer.disconnect();
      clearFilterNoindex();
    };
  }, []);

  useEffect(() => {
    syncFilterRobotsMeta(pathname, searchParams);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Keeps noindex on library filter URLs during client-side navigation:
 * query filters (sort, search, …) and tag-filter paths.
 * Does not affect clean landings or ?page= only.
 */
export default function FilterQueryRobotsTag() {
  return (
    <Suspense fallback={null}>
      <FilterQueryRobotsTagInner />
    </Suspense>
  );
}

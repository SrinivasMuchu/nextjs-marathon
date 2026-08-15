import { NextResponse } from 'next/server';
import {
  FORMAT_ALIASES,
  TRACKING_PARAMS,
  FILTER_PARAMS,
  INTERACTIVE_QUERY_PARAMS,
  LIBRARY_STATIC_PREFIXES,
} from '@/data/librarySeoAllowlist';
import {
  inferOutputFromFileFormats,
  normalizeLibraryOutput,
} from '@/data/libraryOutput';
import {
  isApprovedTagSlug,
  isApprovedCategorySlug,
  isApprovedClusterSlug,
  isApprovedFileFormatSlug,
} from '@/lib/librarySeoRegistry';

const GONE_HTML = `<!doctype html>
<html>
  <head>
    <title>Filter URL Removed</title>
    <meta name="robots" content="noindex,nofollow">
  </head>
  <body>
    <h1>This filtered URL is no longer available.</h1>
    <a href="/library">Open the CAD library</a>
  </body>
</html>`;

const GONE_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'public, max-age=86400',
};

const NOT_FOUND_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'public, max-age=86400',
};

function gone() {
  return new NextResponse(GONE_HTML, { status: 410, headers: GONE_HEADERS });
}

function notFoundResponse() {
  return new NextResponse('Not Found', { status: 404, headers: NOT_FOUND_HEADERS });
}

function permanentRedirect(url) {
  return NextResponse.redirect(url, 301);
}

function normalizeFormats(value) {
  if (!value) {
    return { formats: [], invalid: false };
  }

  const rawValues = value
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  let invalid = false;
  const normalized = rawValues
    .map((v) => {
      const family = FORMAT_ALIASES[v];
      if (!family) invalid = true;
      return family;
    })
    .filter(Boolean);

  return {
    formats: [...new Set(normalized)].sort(),
    invalid,
  };
}

function nonTrackingKeys(params) {
  return [...new Set([...params.keys()])].filter((key) => !TRACKING_PARAMS.has(key));
}

function isDesignRouteSegment(segment) {
  return typeof segment === 'string' && /[a-f0-9]{24}/i.test(segment);
}

function isStaticLibraryPath(pathname) {
  return LIBRARY_STATIC_PREFIXES.some(
    (prefix) => pathname === prefix.replace(/\/$/, '') || pathname.startsWith(prefix)
  );
}

/** Browse/filter query keys users may use; crawl blocking is robots.txt + noindex. */
function isBrowseQueryKey(key) {
  return key === 'page' || FILTER_PARAMS.has(key) || INTERACTIVE_QUERY_PARAMS.has(key);
}

function applyPageToDestination(destination, pageValue) {
  if (pageValue && pageValue !== '1') {
    destination.searchParams.set('page', pageValue);
  }
}

/** Copy user browse filters onto a redirect target (excludes path-encoded keys). */
function copyBrowseQueryParams(sourceParams, destination, { exclude = [] } = {}) {
  const excludeSet = new Set(exclude);
  for (const key of nonTrackingKeys(sourceParams)) {
    if (excludeSet.has(key) || key === 'page') continue;
    if (!isBrowseQueryKey(key)) continue;
    const value = sourceParams.get(key);
    if (value == null || value === '') continue;
    destination.searchParams.set(key, value);
  }
}

function extractClusterSlug(pathname) {
  const match = pathname.match(
    /^\/library(?:\/2d-technical-drawings)?\/cluster\/([^/]+)\/?$/
  );
  return match ? match[1] : null;
}

/**
 * Library SEO URL policy for users + crawlers:
 * - Users: filter query URLs work (sort, free_paid, recency, search, …).
 * - Crawlers: blocked via robots.txt; pages stay noindex via metadata.
 * - Still 301 path normalizations and 404/410 for invalid path slugs.
 */
export async function librarySeoGuard(request) {
  const url = request.nextUrl.clone();
  const params = url.searchParams;
  const pathname = url.pathname;

  if (!pathname.startsWith('/library')) {
    return null;
  }

  const pageValue = params.get('page');

  if (pageValue !== null) {
    if (!/^\d+$/.test(pageValue)) {
      return notFoundResponse();
    }
    if (Number(pageValue) < 1) {
      return notFoundResponse();
    }
  }

  let removedDefault = false;

  if (params.get('sort') === 'newest') {
    params.delete('sort');
    removedDefault = true;
  }

  if (params.get('page') === '1') {
    params.delete('page');
    removedDefault = true;
  }

  const normalizedOutput = normalizeLibraryOutput(params.get('output'));
  if (params.get('output') && !normalizedOutput) {
    params.delete('output');
    removedDefault = true;
  } else if (normalizedOutput && params.get('output') !== normalizedOutput) {
    params.set('output', normalizedOutput);
    removedDefault = true;
  }

  const groupedFormat = inferOutputFromFileFormats(params.get('file_format'));
  if (groupedFormat) {
    params.delete('file_format');
    if (!params.get('output')) params.set('output', groupedFormat);
    removedDefault = true;
  }

  const twoDimsValue = String(params.get('two_dims') || '').trim().toLowerCase();
  if (['1', 'true', 'yes'].includes(twoDimsValue)) {
    params.delete('two_dims');
    if (!params.get('output')) params.set('output', '2d');
    removedDefault = true;
  } else if (params.has('two_dims')) {
    params.delete('two_dims');
    removedDefault = true;
  }

  /* ── Tag routes: /library/tag/{slug} ── */
  if (pathname.startsWith('/library/tag/')) {
    const slug = pathname.replace('/library/tag/', '').split('/')[0];

    if (!slug || !(await isApprovedTagSlug(slug))) {
      return gone();
    }

    if (removedDefault) {
      return permanentRedirect(url);
    }

    return null;
  }

  /* ── File-format routes: /library/file-format/{slug} ── */
  const fileFormatMatch = pathname.match(/^\/library\/file-format\/([^/]+)\/?$/);
  if (fileFormatMatch) {
    const slug = fileFormatMatch[1].toLowerCase();
    if (!isApprovedFileFormatSlug(slug)) {
      return notFoundResponse();
    }

    if (removedDefault) {
      return permanentRedirect(url);
    }

    return null;
  }

  /* ── Cluster detail: /library/cluster/{slug} (+ 2d) ── */
  const clusterSlug = extractClusterSlug(pathname);
  if (clusterSlug) {
    if (!(await isApprovedClusterSlug(clusterSlug))) {
      return notFoundResponse();
    }

    if (removedDefault) {
      return permanentRedirect(url);
    }

    return null;
  }

  /* ── Root /library: normalize single-format and category query filters ── */
  if (pathname === '/library' || pathname === '/library/') {
    const formatValue = params.get('file_format');

    if (formatValue !== null) {
      const { formats, invalid } = normalizeFormats(formatValue);

      if (invalid || formats.length === 0) {
        return notFoundResponse();
      }

      /* Single format → canonical path; preserve user filters (sort, free_paid, …). */
      if (formats.length === 1) {
        const destination = request.nextUrl.clone();
        destination.pathname = `/library/file-format/${formats[0]}`;
        destination.search = '';
        copyBrowseQueryParams(params, destination, { exclude: ['file_format'] });
        applyPageToDestination(destination, pageValue);
        return permanentRedirect(destination);
      }

      /* Multi-format query: serve the page for users (noindex via metadata). */
      if (removedDefault) {
        return permanentRedirect(url);
      }

      return null;
    }

    const category = params.get('category');

    if (category !== null) {
      const normalizedCategory = category.trim().toLowerCase();

      if (!(await isApprovedCategorySlug(normalizedCategory))) {
        return notFoundResponse();
      }

      const destination = request.nextUrl.clone();
      destination.pathname = `/library/${normalizedCategory}`;
      destination.search = '';
      copyBrowseQueryParams(params, destination, { exclude: ['category'] });
      applyPageToDestination(destination, pageValue);
      return permanentRedirect(destination);
    }

    if (removedDefault) {
      return permanentRedirect(url);
    }

    return null;
  }

  /* ── Category + tag nested routes: /library/{category}/{tag} ── */
  const categoryTagMatch = pathname.match(/^\/library\/([^/]+)\/([^/]+)\/?$/);
  if (categoryTagMatch) {
    const [, categorySlug, tagSlug] = categoryTagMatch;

    if (
      categorySlug !== '2d-technical-drawings' &&
      !isDesignRouteSegment(categorySlug) &&
      !isDesignRouteSegment(tagSlug)
    ) {
      if (!(await isApprovedCategorySlug(categorySlug))) {
        return gone();
      }
      if (!(await isApprovedTagSlug(tagSlug))) {
        return gone();
      }

      if (removedDefault) {
        return permanentRedirect(url);
      }

      return null;
    }
  }

  /* ── Static / utility library paths (2d hub, tags index, clusters index) ── */
  if (isStaticLibraryPath(pathname)) {
    if (removedDefault) {
      return permanentRedirect(url);
    }

    return null;
  }

  /* ── Single-segment paths: /library/{segment} ── */
  const singleSegmentMatch = pathname.match(/^\/library\/([^/]+)\/?$/);
  if (singleSegmentMatch) {
    const segment = singleSegmentMatch[1];

    if (segment === 'tag' || segment === 'file-format' || segment === 'category') {
      if (removedDefault) {
        return permanentRedirect(url);
      }
      return null;
    }

    if (isDesignRouteSegment(segment)) {
      if (removedDefault) {
        return permanentRedirect(url);
      }

      return null;
    }

    /* Category landing page — must exist in DB categories */
    if (!(await isApprovedCategorySlug(segment))) {
      return notFoundResponse();
    }

    if (removedDefault) {
      return permanentRedirect(url);
    }

    return null;
  }

  if (removedDefault) {
    return permanentRedirect(url);
  }

  return null;
}

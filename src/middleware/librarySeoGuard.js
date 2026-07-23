import { NextResponse } from 'next/server';
import {
  FORMAT_ALIASES,
  APPROVED_CATEGORY_SLUGS,
  APPROVED_TAG_SLUGS,
  APPROVED_FILE_FORMAT_SLUGS,
  TRACKING_PARAMS,
  FILTER_PARAMS,
  LIBRARY_STATIC_PREFIXES,
} from '@/data/librarySeoAllowlist';

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

function hasNonPaginationFilters(params) {
  return nonTrackingKeys(params).some((key) => key !== 'page');
}

function applyPageToDestination(destination, pageValue) {
  if (pageValue && pageValue !== '1') {
    destination.searchParams.set('page', pageValue);
  }
}

/**
 * Enforce library SEO URL policy (301 / 404 / 410).
 * Returns a NextResponse when the request should be short-circuited, or null to continue.
 */
export function librarySeoGuard(request) {
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

  /* ── Tag routes: /library/tag/{slug} ── */
  if (pathname.startsWith('/library/tag/')) {
    const slug = pathname.replace('/library/tag/', '').split('/')[0];

    if (!slug || !APPROVED_TAG_SLUGS.has(slug)) {
      return gone();
    }

    if (hasNonPaginationFilters(params)) {
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
    if (!APPROVED_FILE_FORMAT_SLUGS.has(slug)) {
      return notFoundResponse();
    }

    if (hasNonPaginationFilters(params)) {
      return gone();
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

      const remainingKeys = nonTrackingKeys(params).filter(
        (key) => key !== 'file_format' && key !== 'page'
      );

      if (remainingKeys.length > 0) {
        return gone();
      }

      if (formats.length === 1) {
        const destination = request.nextUrl.clone();
        destination.pathname = `/library/file-format/${formats[0]}`;
        destination.search = '';
        applyPageToDestination(destination, pageValue);
        return permanentRedirect(destination);
      }

      return gone();
    }

    const category = params.get('category');

    if (category !== null) {
      const normalizedCategory = category.trim().toLowerCase();

      if (!APPROVED_CATEGORY_SLUGS.has(normalizedCategory)) {
        return notFoundResponse();
      }

      const remainingKeys = nonTrackingKeys(params).filter(
        (key) => key !== 'category' && key !== 'page'
      );

      if (remainingKeys.length > 0) {
        return gone();
      }

      const destination = request.nextUrl.clone();
      destination.pathname = `/library/${normalizedCategory}`;
      destination.search = '';
      applyPageToDestination(destination, pageValue);
      return permanentRedirect(destination);
    }
  }

  /* ── Category + tag nested routes: /library/{category}/{tag} ── */
  const categoryTagMatch = pathname.match(/^\/library\/([^/]+)\/([^/]+)\/?$/);
  if (categoryTagMatch) {
    const [, categorySlug, tagSlug] = categoryTagMatch;

    if (!isDesignRouteSegment(categorySlug) && !isDesignRouteSegment(tagSlug)) {
      if (!APPROVED_TAG_SLUGS.has(tagSlug.toLowerCase())) {
        return gone();
      }

      if (hasNonPaginationFilters(params)) {
        return gone();
      }

      if (removedDefault) {
        return permanentRedirect(url);
      }

      return null;
    }
  }

  /* ── Static / utility library paths (2d, tags index, clusters) ── */
  if (isStaticLibraryPath(pathname)) {
    const remainingFilterKeys = nonTrackingKeys(params).filter((key) => FILTER_PARAMS.has(key));

    if (remainingFilterKeys.length > 0) {
      return gone();
    }

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
      if (hasNonPaginationFilters(params)) {
        return gone();
      }

      if (removedDefault) {
        return permanentRedirect(url);
      }

      return null;
    }

    /* Category landing page — only pagination allowed */
    if (hasNonPaginationFilters(params)) {
      return gone();
    }

    if (removedDefault) {
      return permanentRedirect(url);
    }

    return null;
  }

  /* ── Kill remaining faceted URLs under /library ── */
  const remainingFilterKeys = nonTrackingKeys(params).filter((key) => FILTER_PARAMS.has(key));

  if (remainingFilterKeys.length > 0) {
    return gone();
  }

  if (removedDefault) {
    return permanentRedirect(url);
  }

  return null;
}

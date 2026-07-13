/**
 * CAD Tags API – single place for tags pagination. Use for:
 * - Library filters "Show more" (LibraryFiltersWrapper)
 * - Any infinite-scroll list of tags
 * Backend: GET /v1/cad/get-cad-tags
 * - No params: returns all tags (backward compat for dropdowns).
 * - limit + offset (or skip): returns paginated { data, total, hasMore }.
 * - sort=rank: ranked tags only (same as /library/tags), supports offset/search/hasMore.
 */

import axios from 'axios';
import { BASE_URL } from '@/config';

export const TAGS_PAGE_SIZE = 10;

/**
 * Filters panel tags source.
 * - 'ranked' → same list as /library/tags (rank > 0), backend-paginated
 * - 'all'    → full tag catalog, backend-paginated
 * Flip this later without changing search / show-more behavior.
 */
export const LIBRARY_FILTERS_TAGS_MODE = 'ranked'; // 'ranked' | 'all'

export function isLibraryFiltersTagsRanked() {
  return LIBRARY_FILTERS_TAGS_MODE === 'ranked';
}

/** Keep only tags with a positive rank; sort by part count descending. */
export function normalizeRankedCadTags(tags) {
  return (Array.isArray(tags) ? tags : [])
    .filter((tag) => Number(tag?.rank) > 0)
    .sort((a, b) => {
      const countDiff = Number(b.product_count) - Number(a.product_count);
      if (countDiff !== 0) return countDiff;
      const rankDiff = Number(b.rank) - Number(a.rank);
      if (rankDiff !== 0) return rankDiff;
      return String(a.cad_tag_label || a.cad_tag_name || '').localeCompare(
        String(b.cad_tag_label || b.cad_tag_name || '')
      );
    });
}

/**
 * Fetch a page of tags. Use for Show more / infinite scroll.
 * @param {number} offset - Number of tags to skip (0-based)
 * @param {number} [limit=10] - Page size
 * @param {string} [search] - Optional search filter
 * @param {string} [category] - Optional category (ignored when rankedOnly)
 * @param {boolean} [library2d=false]
 * @param {{ rankedOnly?: boolean }} [options]
 * @returns {Promise<{ data: Array, total: number, hasMore: boolean }>}
 */
export async function fetchCadTagsPage(
  offset = 0,
  limit = TAGS_PAGE_SIZE,
  search = null,
  category = null,
  library2d = false,
  options = {}
) {
  const rankedOnly = options?.rankedOnly === true;
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (rankedOnly) params.set('sort', 'rank');
  if (search && search.trim()) params.set('search', search.trim());
  if (!rankedOnly && category && String(category).trim()) {
    params.set('category', String(category).trim());
  }
  if (library2d) params.set('library_2d', '1');
  const { data } = await axios.get(`${BASE_URL}/v1/cad/get-cad-tags?${params.toString()}`, {
    cache: 'no-store',
  });
  return {
    data: Array.isArray(data?.data) ? data.data : [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore === true,
  };
}

/** First page for library filters (respects LIBRARY_FILTERS_TAGS_MODE). */
export async function fetchLibraryFiltersTagsPage(
  offset = 0,
  limit = TAGS_PAGE_SIZE,
  search = null,
  category = null,
  library2d = false
) {
  const rankedOnly = isLibraryFiltersTagsRanked();
  return fetchCadTagsPage(
    offset,
    limit,
    search,
    rankedOnly ? null : category,
    library2d,
    { rankedOnly }
  );
}

/**
 * Fetch all tags (no pagination). For dropdowns/selects that need the full list.
 * Backend returns all when no limit/offset is sent.
 */
export async function fetchAllCadTags() {
  const { data } = await axios.get(`${BASE_URL}/v1/cad/get-cad-tags`, { cache: 'no-store' });
  return Array.isArray(data?.data) ? data.data : [];
}

/**
 * Hub browse parts — live tags with rank > 0, sorted by part count descending.
 * @param {number} [limit=100]
 * @returns {Promise<Array>}
 */
export async function fetchCadTagsByRank(limit = 100, library2d = false) {
  const params = new URLSearchParams({
    sort: 'rank',
    limit: String(limit),
  });
  if (library2d) {
    params.set('library_2d', '1');
  }
  const { data } = await axios.get(`${BASE_URL}/v1/cad/get-cad-tags?${params.toString()}`, {
    cache: 'no-store',
  });
  return normalizeRankedCadTags(data?.data);
}

/** All ranked tags for /library/tags and /library/2d-technical-drawings/tags. */
export async function fetchAllRankedCadTags(library2d = false) {
  return fetchCadTagsByRank(10000, library2d);
}

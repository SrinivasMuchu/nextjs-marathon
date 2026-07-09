/**
 * CAD Tags API – single place for tags pagination. Use for:
 * - Library filters "Show more" (LibraryFiltersWrapper)
 * - Any infinite-scroll list of tags
 * Backend: GET /v1/cad/get-cad-tags
 * - No params: returns all tags (backward compat for dropdowns).
 * - limit + offset (or skip): returns paginated { data, total, hasMore }.
 */

import axios from 'axios';
import { BASE_URL } from '@/config';

export const TAGS_PAGE_SIZE = 10;

/** Keep only tags with a positive rank; sort highest rank first. */
export function normalizeRankedCadTags(tags) {
  return (Array.isArray(tags) ? tags : [])
    .filter((tag) => Number(tag?.rank) > 0)
    .sort((a, b) => {
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
 * @param {string} [category] - Optional category name; when set, returns tags for that category
 * @param {boolean} [library2d=false] - When true, tags are resolved from Elasticsearch for 2D library
 * @returns {Promise<{ data: Array, total: number, hasMore: boolean }>}
 */
export async function fetchCadTagsPage(
  offset = 0,
  limit = TAGS_PAGE_SIZE,
  search = null,
  category = null,
  library2d = false
) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (search && search.trim()) params.set('search', search.trim());
  if (category && String(category).trim()) params.set('category', String(category).trim());
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

/**
 * Fetch all tags (no pagination). For dropdowns/selects that need the full list.
 * Backend returns all when no limit/offset is sent.
 */
export async function fetchAllCadTags() {
  const { data } = await axios.get(`${BASE_URL}/v1/cad/get-cad-tags`, { cache: 'no-store' });
  return Array.isArray(data?.data) ? data.data : [];
}

/**
 * Hub browse parts — live tags with rank > 0, sorted highest rank first.
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

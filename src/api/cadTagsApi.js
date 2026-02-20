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

/**
 * Fetch a page of tags. Use for Show more / infinite scroll.
 * @param {number} offset - Number of tags to skip (0-based)
 * @param {number} [limit=10] - Page size
 * @param {string} [search] - Optional search filter
 * @param {string} [category] - Optional category name; when set, returns tags for that category
 * @returns {Promise<{ data: Array, total: number, hasMore: boolean }>}
 */
export async function fetchCadTagsPage(offset = 0, limit = TAGS_PAGE_SIZE, search = null, category = null) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (search && search.trim()) params.set('search', search.trim());
  if (category && String(category).trim()) params.set('category', String(category).trim());
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

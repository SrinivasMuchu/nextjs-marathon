/**
 * Library designs API – GET /v1/cad/get-category-design
 *
 * Backend must support all filters below; see docs/BACKEND_LIBRARY_API_SPEC.md.
 * Filter logic: category and/or tag (optional), search, recency, free_paid, file_format (all AND).
 */

export const LIBRARY_DESIGNS_ENDPOINT = '/v1/cad/get-category-design';

/** Query param names sent to backend */
export const LIBRARY_PARAMS = {
  category: 'category',
  tags: 'tags',
  search: 'search',
  sort: 'sort',
  recency: 'recency',
  free_paid: 'free_paid',
  file_format: 'file_format',
  page: 'page',
  limit: 'limit',
  uuid: 'uuid',
};

/** Allowed sort values (backend must support these) */
export const SORT_VALUES = ['views', 'downloads', 'newest', 'oldest'];

/** Allowed recency values */
export const RECENCY_VALUES = ['', '24h', 'week', 'month', 'year'];

/** Allowed free_paid values */
export const FREE_PAID_VALUES = ['', 'free', 'paid'];

/**
 * Build query params object for get-category-design. Only includes keys that have a value.
 * Use with URLSearchParams or axios.
 */
export function buildLibraryDesignsParams(filters) {
  const {
    category = '',
    tags = '',
    search = '',
    sort = 'newest',
    recency = '',
    free_paid = '',
    file_format = '',
    page = 1,
    limit = 20,
    uuid = null,
  } = filters;

  const params = {};
  if (category) params[LIBRARY_PARAMS.category] = category;
  if (tags) params[LIBRARY_PARAMS.tags] = tags;
  if (search) params[LIBRARY_PARAMS.search] = search;
  params[LIBRARY_PARAMS.sort] = sort;
  if (recency) params[LIBRARY_PARAMS.recency] = recency;
  if (free_paid) params[LIBRARY_PARAMS.free_paid] = free_paid;
  if (file_format) params[LIBRARY_PARAMS.file_format] = file_format;
  params[LIBRARY_PARAMS.page] = String(page);
  params[LIBRARY_PARAMS.limit] = String(limit);
  if (uuid) params[LIBRARY_PARAMS.uuid] = uuid;

  return params;
}

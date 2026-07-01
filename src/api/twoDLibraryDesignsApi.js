import axios from 'axios';
import { BASE_URL } from '@/config';
import { LIBRARY_PARAMS } from './libraryDesignsApi';

export const TWO_D_LIBRARY_ENDPOINT = '/v1/cad/get-category-design';

/** Categories for 2D library — sourced from Elasticsearch via API. */
export async function fetchTwoDLibraryCategories() {
  const { data } = await axios.get(`${BASE_URL}/v1/cad/get-categories?library_2d=1`, {
    cache: 'no-store',
  });
  return Array.isArray(data?.data) ? data.data : [];
}

export function buildTwoDLibraryDesignsParams(filters) {
  const {
    category = '',
    tags = '',
    search = '',
    sort = 'newest',
    recency = '',
    free_paid = '',
    file_format = '',
    output_format = '',
    projection = '',
    page = 1,
    limit = 22,
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
  params[LIBRARY_PARAMS.two_dims] = '1';
  params.library_2d = '1';
  if (output_format) params.output_format = output_format;
  if (projection) params.projection = projection;
  params[LIBRARY_PARAMS.page] = String(page);
  params[LIBRARY_PARAMS.limit] = String(limit);
  if (uuid) params[LIBRARY_PARAMS.uuid] = uuid;

  return params;
}

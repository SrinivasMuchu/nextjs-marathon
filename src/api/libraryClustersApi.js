import axios from 'axios';
import { BASE_URL } from '@/config';

/**
 * Fetch library build-kit clusters.
 * Backend: GET /v1/cad/get-library-clusters
 * `part_count` is computed from linked live designs.
 * @param {{ limit?: number, slug?: string, clusterId?: string, twoDims?: boolean }} [opts]
 * @returns {Promise<Array>}
 */
export async function fetchLibraryClusters({ limit, slug, clusterId, twoDims } = {}) {
  const params = new URLSearchParams();
  if (limit != null) params.set('limit', String(limit));
  if (slug) params.set('slug', slug);
  if (clusterId) params.set('cluster_id', clusterId);
  if (twoDims) params.set('two_dims', 'true');

  const qs = params.toString();
  try {
    const { data } = await axios.get(
      `${BASE_URL}/v1/cad/get-library-clusters${qs ? `?${qs}` : ''}`,
      { cache: 'no-store' }
    );
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404 || status === 502 || status === 503) {
      return [];
    }
    throw error;
  }
}

export function getLibraryClustersPath(libraryMode = '3d') {
  return libraryMode === '2d'
    ? '/library/2d-technical-drawings/clusters'
    : '/library/clusters';
}

export function getLibraryClusterPath(cluster, libraryMode = '3d') {
  const slug = cluster?.cluster_slug;
  if (!slug) return getLibraryClustersPath(libraryMode);
  const base =
    libraryMode === '2d'
      ? '/library/2d-technical-drawings/cluster'
      : '/library/cluster';
  return `${base}/${encodeURIComponent(slug)}`;
}
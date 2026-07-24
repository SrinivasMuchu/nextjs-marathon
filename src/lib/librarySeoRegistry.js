/**
 * Dynamic library SEO registry (Edge-safe).
 * Loads live tag / category / cluster slugs from the Marathon API (Mongo/ES)
 * and caches them in-memory with a TTL. No hard-coded allowlists.
 */

import { FORMAT_ALIASES } from '@/data/librarySeoAllowlist';

const TTL_MS = 5 * 60 * 1000;
const NEGATIVE_TTL_MS = 60 * 1000;
const FETCH_TIMEOUT_MS = 4000;

/** @type {{ tags: Set<string> | null, categories: Set<string> | null, clusters: Set<string> | null, fetchedAt: number }} */
const cache = {
  tags: null,
  categories: null,
  clusters: null,
  fetchedAt: 0,
};

/** @type {Map<string, number>} */
const tagNegative = new Map();
/** @type {Map<string, number>} */
const clusterNegative = new Map();

let refreshPromise = null;

function getApiBase() {
  return String(process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
}

function slugify(str) {
  if (str == null || str === '') return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function normalizeSlug(value) {
  try {
    return decodeURIComponent(String(value || ''))
      .trim()
      .toLowerCase();
  } catch {
    return String(value || '')
      .trim()
      .toLowerCase();
  }
}

async function fetchJson(path) {
  const base = getApiBase();
  if (!base) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${base}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[librarySeoRegistry] fetch failed', path, error?.message || error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function buildTagSet(tags) {
  const set = new Set();
  for (const tag of Array.isArray(tags) ? tags : []) {
    const name = String(tag?.cad_tag_name || '').trim();
    if (!name) continue;
    const lower = name.toLowerCase();
    set.add(lower);
    const slug = slugify(name);
    if (slug) set.add(slug);
  }
  return set;
}

function buildCategorySet(categories) {
  const set = new Set();
  for (const category of Array.isArray(categories) ? categories : []) {
    const name = String(category?.industry_category_name || '').trim();
    if (!name) continue;
    set.add(name.toLowerCase());
    const slug = slugify(name);
    if (slug) set.add(slug);
  }
  return set;
}

function buildClusterSet(clusters) {
  const set = new Set();
  for (const cluster of Array.isArray(clusters) ? clusters : []) {
    const slug = String(cluster?.cluster_slug || '').trim().toLowerCase();
    if (slug) set.add(slug);
    const id = String(cluster?.cluster_id || '').trim().toLowerCase();
    if (id) set.add(id);
  }
  return set;
}

async function refreshRegistry() {
  const [tagsJson, categoriesJson, clustersJson] = await Promise.all([
    fetchJson('/v1/cad/get-cad-tags'),
    fetchJson('/v1/cad/get-categories'),
    fetchJson('/v1/cad/get-library-clusters'),
  ]);

  let updated = false;

  if (tagsJson?.data) {
    cache.tags = buildTagSet(tagsJson.data);
    updated = true;
  }
  if (categoriesJson?.data) {
    cache.categories = buildCategorySet(categoriesJson.data);
    updated = true;
  }
  if (clustersJson?.data) {
    cache.clusters = buildClusterSet(clustersJson.data);
    updated = true;
  }

  if (updated) {
    cache.fetchedAt = Date.now();
  }

  return updated;
}

async function ensureRegistry() {
  const fresh = cache.fetchedAt > 0 && Date.now() - cache.fetchedAt < TTL_MS;
  if (fresh && cache.tags && cache.categories && cache.clusters) {
    return;
  }

  if (!refreshPromise) {
    refreshPromise = refreshRegistry().finally(() => {
      refreshPromise = null;
    });
  }

  await refreshPromise;
}

function isNegativeCached(map, key) {
  const expires = map.get(key);
  if (!expires) return false;
  if (Date.now() > expires) {
    map.delete(key);
    return false;
  }
  return true;
}

function rememberNegative(map, key) {
  map.set(key, Date.now() + NEGATIVE_TTL_MS);
}

async function probeTagExists(slug) {
  const encoded = encodeURIComponent(slug);
  const json = await fetchJson(
    `/v1/cad/get-cad-tags?limit=1&offset=0&ensureTag=${encoded}`
  );
  if (!json?.data) return null;

  const set = buildTagSet(json.data);
  if (set.has(slug)) {
    if (!cache.tags) cache.tags = new Set();
    for (const value of set) cache.tags.add(value);
    tagNegative.delete(slug);
    return true;
  }

  rememberNegative(tagNegative, slug);
  return false;
}

async function probeClusterExists(slug) {
  const encoded = encodeURIComponent(slug);
  const json = await fetchJson(`/v1/cad/get-library-clusters?slug=${encoded}`);
  if (!json) return null;

  const set = buildClusterSet(json.data);
  if (set.has(slug)) {
    if (!cache.clusters) cache.clusters = new Set();
    for (const value of set) cache.clusters.add(value);
    clusterNegative.delete(slug);
    return true;
  }

  rememberNegative(clusterNegative, slug);
  return false;
}

/** Canonical file-format slugs derived from FORMAT_ALIASES (no separate static list). */
const CANONICAL_FILE_FORMAT_SLUGS = new Set(Object.values(FORMAT_ALIASES));

export function isApprovedFileFormatSlug(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return false;
  if (CANONICAL_FILE_FORMAT_SLUGS.has(normalized)) return true;
  return Boolean(FORMAT_ALIASES[normalized]);
}

/**
 * @param {string} slug
 * @returns {Promise<boolean>}
 */
export async function isApprovedTagSlug(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return false;

  if (isNegativeCached(tagNegative, normalized)) return false;

  await ensureRegistry();

  if (cache.tags?.has(normalized)) return true;

  // Cache miss / stale API: probe live (Mongo/ES via ensureTag)
  const probed = await probeTagExists(normalized);
  if (probed === true) return true;
  if (probed === false) return false;

  // API unavailable: fail-open if we have never loaded tags (avoid site-wide 410s)
  if (!cache.tags) return true;
  return false;
}

/**
 * @param {string} slug
 * @returns {Promise<boolean>}
 */
export async function isApprovedCategorySlug(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return false;

  await ensureRegistry();

  if (cache.categories?.has(normalized)) return true;
  if (!cache.categories) return true; // fail-open when API down
  return false;
}

/**
 * @param {string} slug
 * @returns {Promise<boolean>}
 */
export async function isApprovedClusterSlug(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return false;

  if (isNegativeCached(clusterNegative, normalized)) return false;

  await ensureRegistry();

  if (cache.clusters?.has(normalized)) return true;

  const probed = await probeClusterExists(normalized);
  if (probed === true) return true;
  if (probed === false) return false;

  if (!cache.clusters) return true;
  return false;
}

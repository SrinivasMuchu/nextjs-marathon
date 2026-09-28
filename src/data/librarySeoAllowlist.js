

export const FORMAT_ALIASES = {
  step: 'step',
  stp: 'step',
  iges: 'iges',
  igs: 'iges',
  brep: 'brep',
  brp: 'brep',
  stl: 'stl',
  dwg: 'dwg',
  dxf: 'dxf',
  obj: 'obj',
  ply: 'ply',
  off: 'off',
};

export const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'gclsrc',
  'ref',
  'mc_cid',
  'mc_eid',
  '_ga',
]);

export const FILTER_PARAMS = new Set([
  'sort',
  'recency',
  'free_paid',
  'file_format',
  'output',
  'category',
  'search',
  'q',
  'tag',
  'tags',
  'limit',
  'two_dims',
  'cluster_id',
  'cluster_slug',
  'output_format',
  'sheet_count',
  'projection',
  'library_2d',
  'random',
  'industry',
]);

/**
 * Interactive query params for library browse/search.
 * FILTER_PARAMS are allowed for users; crawlers are blocked via robots.txt + noindex.
 */
export const INTERACTIVE_QUERY_PARAMS = new Set(['search', 'q']);

/**
 * Path prefixes that skip category/tag slug checks (hubs / indexes).
 * Cluster *detail* slugs are validated dynamically in librarySeoGuard.
 */
export const LIBRARY_STATIC_PREFIXES = [
  '/library/2d-technical-drawings',
  '/library/tags',
  '/library/clusters',
  '/library/category/',
];

const LIBRARY_RESERVED_SEGMENTS = new Set([
  'tag',
  'tags',
  'cluster',
  'clusters',
  'file-format',
  'category',
  '2d-technical-drawings',
]);

const TWO_D_RESERVED_SEGMENTS = new Set(['tag', 'tags', 'cluster', 'clusters']);

/**
 * Tag filters live in the path, not ?tags=:
 * /library/tag/{slug}, /library/{category}/{tag}, and 2D equivalents.
 */
export function isLibraryTagFilterPath(pathname) {
  if (!pathname) return false;
  const parts = String(pathname).split('/').filter(Boolean);
  if (parts[0] !== 'library') return false;

  if (parts[1] === 'tag' && parts[2]) return true;
  if (parts[1] === '2d-technical-drawings' && parts[2] === 'tag' && parts[3]) return true;

  if (
    parts[1] === '2d-technical-drawings' &&
    parts[2] &&
    parts[3] &&
    !TWO_D_RESERVED_SEGMENTS.has(parts[2])
  ) {
    return true;
  }

  if (parts[1] && parts[2] && !LIBRARY_RESERVED_SEGMENTS.has(parts[1])) {
    return true;
  }

  return false;
}

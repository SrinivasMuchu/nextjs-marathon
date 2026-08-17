

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

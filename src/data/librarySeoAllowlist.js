/**
 * SEO allowlists for /library URL governance (Emergency SEO Fix: Library Filter URL Explosion).
 * Expand APPROVED_TAGS with product/SEO sign-off only.
 */

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

/** Slugs with dedicated /library/file-format/{slug} landing pages */
export const APPROVED_FILE_FORMAT_SLUGS = new Set([
  'step',
  'stl',
  'iges',
  'obj',
  'ply',
  'dwg',
  'dxf',
]);

/** Category slugs eligible for ?category= → /library/{slug} redirects */
export const APPROVED_CATEGORY_SLUGS = new Set([
  'automotive',
  'aerospace',
  'robotics',
  '3d-printing',
  'architecture',
  'industrial-design',
  'medical',
  'electrical',
  'marine',
]);

/**
 * Tag slugs allowed as public SEO routes (/library/tag/{slug}).
 * All other tag slugs return 410 Gone.
 */
export const APPROVED_TAG_SLUGS = new Set([
  'servo-motors',
  'electrical-connectors',
  'robot-arms',
  'electric-motors',
  'fasteners',
  'drone-components',
  '3d-printing',
]);

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

/** Path prefixes that skip tag allowlist checks */
export const LIBRARY_STATIC_PREFIXES = [
  '/library/2d-technical-drawings',
  '/library/tags',
  '/library/clusters',
  '/library/cluster/',
  '/library/category/',
];

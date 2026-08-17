const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://marathon-os.com";

const PRIVATE_PATHS = [
  "/dashboard/",
  "/account/",
  "/checkout/",
  "/payment/",
  "/admin/",
  "/api/",
  "/creator/",
  "/tools/cad-renderer",
];

/**
 * Crawl-only policy (does not change page behavior for users):
 * - Disallow all query-string URLs
 * - Allow only ?page= pagination
 * - Named param Disallows beat Allow when combined (e.g. ?page=2&sort=)
 */
const CRAWL_BLOCKED_QUERY_PARAMS = [
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
  'fileid',
  'fileId',
  'file_id',
  'folderId',
  'designId',
  'glb',
  'sample',
  'ready',
  'format',
  'cad_type',
  'type',
  'id',
  'token',
  'session',
];

const QUERY_CRAWL_DISALLOW = [
  '/*?*',
  ...CRAWL_BLOCKED_QUERY_PARAMS.map((key) => `/*?*${key}=`),
];

/** Only this session URL — not /tools/3d-cad-file-converter. */
const CAD_CONVERTOR_FILEID_DISALLOW = [
  '/cad-convertor?*fileid=',
];

const CRAWL_DISALLOW = [...PRIVATE_PATHS, ...CAD_CONVERTOR_FILEID_DISALLOW, ...QUERY_CRAWL_DISALLOW];

const QUERY_CRAWL_ALLOW = [
  '/',
  '/*?page=',
];

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "Bingbot",
];

function crawlRules(userAgent) {
  return {
    userAgent,
    allow: QUERY_CRAWL_ALLOW,
    disallow: CRAWL_DISALLOW,
  };
}

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [
      crawlRules('*'),
      crawlRules('Googlebot'),
      crawlRules('Googlebot-Image'),
      ...AI_CRAWLERS.map((userAgent) => crawlRules(userAgent)),
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}

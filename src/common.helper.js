import { PHOTO_LINK, DESIGN_GLB_PREFIX_URL } from "./config";

export const textLettersLimit = (text, limitType) => {

  if (typeof text !== 'string' || typeof limitType !== 'number') {
    return text;
  }

  if (text.length > limitType) {
    return `${text.substring(0, limitType)}...`;
  }

  return text;
};


export function sendGAtagEvent1(eventName,category,publish_from) {
  if(publish_from){
    const cleanUrl = window.location.origin + window.location.pathname;
    window.gtag('event', eventName, {
      event_category: 'PUBLISH',
      event_label: cleanUrl // URL without query params
    });
  }else{
    window.gtag('event', eventName, {
      event_category: category
    });
  }
  
  

}
export function sendGAtagEvent(eventData) {
  if (
    typeof window === "undefined" ||
    typeof window.gtag !== "function" ||
    !eventData ||
    !eventData.event_name
  ) {
    return;
  }
  const { event_name, ...eventParams } = eventData;
  window.gtag("event", event_name, eventParams);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options).replace(',', '');
}








//    iges 


export const convertedFiles = [
  {
    "id": "1",
    "url": `${DESIGN_GLB_PREFIX_URL}sample_files/converter/step_file.STEP`,
    "format": "step",
    "name": "sample.step"

  },
  {
    "id": '2',
    "url": `${DESIGN_GLB_PREFIX_URL}sample_files/converter/stl_file.STL`,
    "format": "stl",

    "name": "sample.stl"
  },
  {
    "id": '3',
    "url": `${DESIGN_GLB_PREFIX_URL}sample_files/converter/ply_file.ply`,
    "format": "ply",
    "name": "sample.ply"
  },
  {
    "id": '4',
    "url": `${DESIGN_GLB_PREFIX_URL}sample_files/converter/igs_file.IGS`,
    "format": "iges",
    "name": "sample.iges"
  },

  {
    "id": "5",
    "url": `${DESIGN_GLB_PREFIX_URL}sample_files/converter/obj_file.obj`,
    "format": "obj",
    "name": "sample.obj"


  }]


  export const cadViewerFiles = [
    {
     "id": '69831e5196888fd1a671ec12',    
      "name": "Electric Go Kart Roll",
      
    },
    {
      "id": '698ebb35c6bb4d464875f171',
      "name": "TGS 8x4 Truck",
      
    },
    {
      "id": "698eb8b533d75271de7259cd",
      "name": "DIY Flight Sim Cockpit",
      
  
    },
    {
      "id": '69dc8d16562aa5e7d2713efc',
      "name": "Drone (Fpv-Quadcopter)",
      
    },
    
   ]


export const createDropdownCustomStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "transparent",
        border: "1px solid #d1d5db",
        boxShadow: "none",
        marginBottom: "16px",
        height:"42px"
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),

    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? "#3182CE"
            : state.isFocused
            ? "#E2E8F0"
            : "white",
        color: state.isSelected ? "white" : "black",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "#E2E8F0",
        },
    }),

    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#610bee", // blue background for selected values
        borderRadius: "4px",
    }),

    multiValueLabel: (provided) => ({
        ...provided,
        color: "white", // white text
        fontWeight: 500,
    }),

    multiValueRemove: (provided) => ({
        ...provided,
        color: "white",
        ":hover": {
            backgroundColor: "#2B6CB0", // darker blue on hover
            color: "white",
        },
    }),
};




export const converterTypes = [
  { label: 'STEP to BREP', path: '/step-to-brep', oneLiner: 'Convert STEP to BREP for solid geometry exchange.' },
  { label: 'STEP to IGES', path: '/step-to-iges', oneLiner: 'Convert STEP to IGES for cross-platform CAD exchange.' },
  { label: 'STEP to OBJ', path: '/step-to-obj', oneLiner: 'Convert STEP to OBJ for rendering and visualization.' },
  { label: 'STEP to PLY', path: '/step-to-ply', oneLiner: 'Convert STEP to PLY for mesh and scan workflows.' },
  { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'Convert STEP to STL for 3D printing and slicing.' },
  { label: 'STEP to OFF', path: '/step-to-off', oneLiner: 'Convert STEP to OFF for geometry research workflows.' },
  { label: 'STEP to 3DM', path: '/step-to-3dm', oneLiner: 'Convert STEP to 3DM for Rhino / OpenNURBS workflows.' },

  { label: 'IGES to BREP', path: '/iges-to-brep', oneLiner: 'Convert IGES to BREP for solid model processing.' },
  { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Convert IGES to STEP for modern CAD compatibility.' },
  { label: 'IGES to OBJ', path: '/iges-to-obj', oneLiner: 'Convert IGES to OBJ for visualization pipelines.' },
  { label: 'IGES to PLY', path: '/iges-to-ply', oneLiner: 'Convert IGES to PLY for mesh export.' },
  { label: 'IGES to STL', path: '/iges-to-stl', oneLiner: 'Convert IGES to STL for 3D printing from legacy files.' },
  { label: 'IGES to OFF', path: '/iges-to-off', oneLiner: 'Convert IGES to OFF for geometry research workflows.' },
  { label: 'IGES to 3DM', path: '/iges-to-3dm', oneLiner: 'Convert IGES to 3DM for Rhino / OpenNURBS workflows.' },

  { label: 'OBJ to BREP', path: '/obj-to-brep', oneLiner: 'Convert OBJ to BREP for solid CAD workflows.' },
  { label: 'OBJ to IGES', path: '/obj-to-iges', oneLiner: 'Convert OBJ to IGES for legacy CAD exchange.' },
  { label: 'OBJ to STEP', path: '/obj-to-step', oneLiner: 'Convert OBJ to STEP for CAD editing from mesh files.' },
  { label: 'OBJ to PLY', path: '/obj-to-ply', oneLiner: 'Convert OBJ to PLY for mesh interchange.' },
  { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Convert OBJ to STL for mesh workflows and 3D printing.' },
  { label: 'OBJ to OFF', path: '/obj-to-off', oneLiner: 'Convert OBJ to OFF for geometry research workflows.' },
  { label: 'OBJ to 3DM', path: '/obj-to-3dm', oneLiner: 'Convert OBJ to 3DM for Rhino mesh/NURBS handoff.' },

  { label: 'PLY to BREP', path: '/ply-to-brep', oneLiner: 'Convert PLY to BREP for solid CAD workflows.' },
  { label: 'PLY to IGES', path: '/ply-to-iges', oneLiner: 'Convert PLY to IGES for legacy CAD exchange.' },
  { label: 'PLY to OBJ', path: '/ply-to-obj', oneLiner: 'Convert PLY to OBJ for rendering and editing.' },
  { label: 'PLY to STEP', path: '/ply-to-step', oneLiner: 'Convert PLY to STEP for CAD import from scan data.' },
  { label: 'PLY to STL', path: '/ply-to-stl', oneLiner: 'Convert PLY to STL for 3D printing pipelines.' },
  { label: 'PLY to OFF', path: '/ply-to-off', oneLiner: 'Convert PLY to OFF for geometry research workflows.' },
  { label: 'PLY to 3DM', path: '/ply-to-3dm', oneLiner: 'Convert PLY to 3DM for Rhino scan-data workflows.' },

  { label: 'STL to BREP', path: '/stl-to-brep', oneLiner: 'Convert STL to BREP for solid reconstruction workflows.' },
  { label: 'STL to IGES', path: '/stl-to-iges', oneLiner: 'Convert STL to IGES for legacy CAD exchange.' },
  { label: 'STL to OBJ', path: '/stl-to-obj', oneLiner: 'Convert STL to OBJ for game engines and 3D rendering.' },
  { label: 'STL to PLY', path: '/stl-to-ply', oneLiner: 'Convert STL to PLY for mesh interchange.' },
  { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Convert STL to STEP for reverse engineering workflows.' },
  { label: 'STL to OFF', path: '/stl-to-off', oneLiner: 'Convert STL to OFF for geometry research workflows.' },
  { label: 'STL to 3DM', path: '/stl-to-3dm', oneLiner: 'Convert STL to 3DM for Rhino mesh workflows.' },

  { label: 'OFF to BREP', path: '/off-to-brep', oneLiner: 'Convert OFF to BREP for solid CAD workflows.' },
  { label: 'OFF to IGES', path: '/off-to-iges', oneLiner: 'Convert OFF to IGES for legacy CAD exchange.' },
  { label: 'OFF to OBJ', path: '/off-to-obj', oneLiner: 'Convert OFF to OBJ for visualization pipelines.' },
  { label: 'OFF to PLY', path: '/off-to-ply', oneLiner: 'Convert OFF to PLY for mesh interchange.' },
  { label: 'OFF to STL', path: '/off-to-stl', oneLiner: 'Convert OFF to STL for 3D printing pipelines.' },
  { label: 'OFF to STEP', path: '/off-to-step', oneLiner: 'Convert OFF to STEP for modern CAD import.' },
  { label: 'OFF to 3DM', path: '/off-to-3dm', oneLiner: 'Convert OFF to 3DM for Rhino geometry workflows.' },

  { label: 'BREP to STEP', path: '/brep-to-step', oneLiner: 'Convert BREP to STEP for CAD/CAM handoff.' },
  { label: 'BREP to IGES', path: '/brep-to-iges', oneLiner: 'Convert BREP to IGES for legacy CAD exchange.' },
  { label: 'BREP to OBJ', path: '/brep-to-obj', oneLiner: 'Convert BREP to OBJ for visualization pipelines.' },
  { label: 'BREP to PLY', path: '/brep-to-ply', oneLiner: 'Convert BREP to PLY for mesh export.' },
  { label: 'BREP to STL', path: '/brep-to-stl', oneLiner: 'Convert BREP to STL for additive manufacturing.' },
  { label: 'BREP to OFF', path: '/brep-to-off', oneLiner: 'Convert BREP to OFF for geometry research workflows.' },
  { label: 'BREP to 3DM', path: '/brep-to-3dm', oneLiner: 'Convert BREP to 3DM for Rhino / OpenNURBS workflows.' },

  { label: '3DM to BREP', path: '/3dm-to-brep', oneLiner: 'Convert 3DM to BREP for solid CAD workflows.' },
  { label: '3DM to IGES', path: '/3dm-to-iges', oneLiner: 'Convert 3DM to IGES for legacy CAD exchange.' },
  { label: '3DM to OBJ', path: '/3dm-to-obj', oneLiner: 'Convert 3DM to OBJ for visualization pipelines.' },
  { label: '3DM to PLY', path: '/3dm-to-ply', oneLiner: 'Convert 3DM to PLY for mesh export.' },
  { label: '3DM to STL', path: '/3dm-to-stl', oneLiner: 'Convert 3DM to STL for 3D printing pipelines.' },
  { label: '3DM to OFF', path: '/3dm-to-off', oneLiner: 'Convert 3DM to OFF for geometry research workflows.' },
  { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Move Rhino models into CAD/CAM.' },

  { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Convert DWG to DXF for 2D CAD exchange.' },
  { label: 'DXF to DWG', path: '/dxf-to-dwg', oneLiner: 'Convert DXF to DWG for 2D CAD exchange.' },
];

/** Short descriptions for Popular Conversions cards (override generic oneLiners). */
const POPULAR_CONVERTER_DESCRIPTIONS = {
  'step-to-stl': 'For 3D printing and rapid prototyping',
  'step-to-iges': 'For cross-platform CAD exchange',
  'step-to-obj': 'For rendering and visualization',
  'step-to-3dm': 'For Rhino / OpenNURBS workflows',
  'step-to-brep': 'For solid geometry processing',
  'step-to-ply': 'For mesh and scan-style export',
  'step-to-off': 'For geometry research workflows',
  'iges-to-step': 'For modern CAD compatibility',
  'iges-to-stl': 'For 3D printing from legacy files',
  'iges-to-brep': 'For solid model processing',
  'iges-to-obj': 'For visualization pipelines',
  'iges-to-ply': 'For mesh export from legacy CAD',
  'iges-to-off': 'For geometry research workflows',
  'iges-to-3dm': 'For Rhino / OpenNURBS workflows',
  'obj-to-step': 'For CAD editing from mesh files',
  'obj-to-stl': 'For mesh workflows and 3D printing',
  'obj-to-brep': 'For solid CAD workflows',
  'obj-to-iges': 'For legacy CAD exchange',
  'obj-to-ply': 'For mesh interchange',
  'obj-to-off': 'For geometry research workflows',
  'obj-to-3dm': 'For Rhino mesh/NURBS handoff',
  'ply-to-step': 'For CAD import from scan data',
  'ply-to-stl': 'For 3D printing pipelines',
  'ply-to-obj': 'For rendering and editing',
  'ply-to-brep': 'For solid CAD workflows',
  'ply-to-iges': 'For legacy CAD exchange',
  'ply-to-off': 'For geometry research workflows',
  'ply-to-3dm': 'For Rhino scan-data workflows',
  'stl-to-step': 'For reverse engineering workflows',
  'stl-to-obj': 'For game engines and 3D rendering',
  'stl-to-brep': 'For solid reconstruction workflows',
  'stl-to-iges': 'For legacy CAD exchange',
  'stl-to-ply': 'For mesh interchange',
  'stl-to-off': 'For geometry research workflows',
  'stl-to-3dm': 'For Rhino mesh workflows',
  'off-to-step': 'For modern CAD import',
  'off-to-stl': 'For 3D printing pipelines',
  'off-to-obj': 'For visualization pipelines',
  'off-to-brep': 'For solid CAD workflows',
  'off-to-iges': 'For legacy CAD exchange',
  'off-to-ply': 'For mesh interchange',
  'off-to-3dm': 'For Rhino geometry workflows',
  'brep-to-step': 'For CAD/CAM handoff',
  'brep-to-stl': 'For additive manufacturing',
  'brep-to-iges': 'For legacy CAD exchange',
  'brep-to-obj': 'For visualization pipelines',
  'brep-to-ply': 'For mesh export',
  'brep-to-off': 'For geometry research workflows',
  'brep-to-3dm': 'For Rhino / OpenNURBS workflows',
  '3dm-to-step': 'Move Rhino models into CAD/CAM',
  '3dm-to-stl': 'For 3D printing pipelines',
  '3dm-to-brep': 'For solid CAD workflows',
  '3dm-to-iges': 'For legacy CAD exchange',
  '3dm-to-obj': 'For visualization pipelines',
  '3dm-to-ply': 'For mesh export',
  '3dm-to-off': 'For geometry research workflows',
  'dxf-to-dwg': 'Convert DXF to DWG for 2D CAD exchange',
  'dwg-to-dxf': 'Convert DWG to DXF for 2D CAD exchange',
};

/**
 * Full Popular Conversions / CAD Converter Types grid (all converter routes).
 * Built from converterTypes so page links stay in sync.
 */
export const popularCadConverterTypes = converterTypes.map((item) => {
  const pair = item.path.replace(/^\//, '');
  const [fromRaw, toRaw] = pair.split('-to-');
  return {
    from: String(fromRaw || '').toUpperCase(),
    to: String(toRaw || '').toUpperCase(),
    path: item.path,
    description: POPULAR_CONVERTER_DESCRIPTIONS[pair] || item.oneLiner || `Convert ${fromRaw} to ${toRaw}`,
  };
});

/** Featured conversion cards for topical authority and internal linking (each links to /tools/convert{path}) */
export const featuredConversions = [
  { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'Convert STEP to STL for 3D printing and slicing.' },
  { label: 'STEP to 3DM', path: '/step-to-3dm', oneLiner: 'Convert STEP to Rhino 3DM for Rhino workflows.' },
  { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Convert IGES to STEP for manufacturing handoff.' },
  { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Convert OBJ to STL for mesh workflows and 3D printing.' },
  { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Convert STL to STEP for CAD compatibility and import.' },
  { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Convert Rhino 3DM to STEP for CAD/CAM exchange.' },
  { label: 'BREP to STL', path: '/brep-to-stl', oneLiner: 'Convert BREP to STL for mesh export and 3D printing.' },
  { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Convert DWG to DXF for 2D CAD exchange.' },
  { label: 'DXF to DWG', path: '/dxf-to-dwg', oneLiner: 'Convert DXF to DWG for 2D CAD exchange.' },
];

// export const allowedFilesList = [ ".stp",  ,  ".igs", , ".brp", ]
export const cadViewTypes = [
  { label: 'OBJ viewer', path: '/obj', oneLiner: 'View OBJ mesh models and 3D assets in your browser.' },
  { label: 'STL viewer', path: '/stl', oneLiner: 'Inspect STL meshes for 3D printing checks.' },
  { label: 'PLY viewer', path: '/ply', oneLiner: 'Open PLY point clouds and polygon meshes online.' },
  { label: 'OFF viewer', path: '/off', oneLiner: 'Preview OFF geometry files without desktop software.' },
  { label: 'IGES viewer', path: '/iges', oneLiner: 'Preview IGES/IGS surfaces before manufacturing handoff.' },
  { label: 'BREP viewer', path: '/brep', oneLiner: 'Open BREP boundary representation models in the browser.' },
  { label: 'STEP viewer', path: '/step', oneLiner: 'Open STEP/STP assemblies and 3D geometry online.' },
  { label: 'STP viewer', path: '/stp', oneLiner: 'View STP (STEP) CAD files instantly—no install needed.' },
  { label: '3DM viewer', path: '/3dm', oneLiner: 'Preview Rhino 3DM NURBS and mesh models in your browser.' },
  { label: 'BRP viewer', path: '/brp', oneLiner: 'Inspect BRP (BREP) solid models for design review.' },
  { label: 'IGS viewer', path: '/igs', oneLiner: 'Check IGS/IGES exchange files for collaboration.' },
];

// --- Library path-based routing (category/tag as path segments) ---

/** Turn a category or tag name into a URL slug (lowercase, spaces to hyphens, safe chars only) */
export function slugify(str) {
  if (str == null || str === '') return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/** Turn a tag slug back into the raw tag value used in the DB/API. */
export function tagSlugToName(slug) {
  if (slug == null || slug === '') return '';
  try {
    return decodeURIComponent(String(slug)).trim();
  } catch {
    return '';
  }
}

/** Allowed library tag URL segment: lowercase letters, digits, hyphens (e.g. robotics, cnc-milling, 3d-printing). */
export const LIBRARY_TAG_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const LIBRARY_TAG_SLUG_MAX_LENGTH = 80;

/**
 * Normalize and validate a tag slug from the URL. Returns null for bot junk, encoded garbage, or objectId-like paths.
 */
export function normalizeLibraryTagSlug(rawSlug) {
  if (rawSlug == null || rawSlug === '') return null;
  let decoded = String(rawSlug).trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }
  decoded = decoded.trim().toLowerCase();
  if (!decoded || decoded.length > LIBRARY_TAG_SLUG_MAX_LENGTH) return null;
  if (decoded.includes('%')) return null;
  if (!LIBRARY_TAG_SLUG_RE.test(decoded)) return null;
  if (decoded !== slugify(decoded)) return null;
  /* Reject Mongo ObjectId–style bot paths (e.g. 697f1bece2eb5087a19c42a2step). */
  if (/[a-f0-9]{20,}/i.test(decoded)) return null;
  return decoded;
}

export function isValidLibraryTagSlug(rawSlug) {
  return normalizeLibraryTagSlug(rawSlug) != null;
}

/** Redirect target when a tag segment is invalid (301/308 to library root or category). */
export function getInvalidLibraryTagRedirectPath(categorySlugRaw = null) {
  const categorySlug = categorySlugRaw ? slugify(tagSlugToName(categorySlugRaw)) : '';
  if (categorySlug && LIBRARY_TAG_SLUG_RE.test(categorySlug) && !/[a-f0-9]{20,}/i.test(categorySlug)) {
    return `/library/${categorySlug}`;
  }
  return '/library';
}

/** Resolve category slug to category name using categories list (from get-categories API) */
export function resolveCategorySlugToName(slug, categories = []) {
  if (!slug) return '';
  const s = decodeURIComponent(String(slug)).trim().toLowerCase();
  const found = (categories || []).find(
    (c) => slugify(c.industry_category_name) === s || (c.industry_category_name || '').toLowerCase() === s
  );
  return found ? found.industry_category_name : '';
}

/**
 * Build library path (no query). Use for links.
 * - No category, no tag → /library
 * - Category only → /library/{categorySlug}
 * - Tag only → /library/tag/{tagSlug}
 * - Category + tag → /library/{categorySlug}/{tagSlug}
 * categoryName/tagName are the raw names (e.g. from API); they are slugified for the path.
 */
export function getLibraryCategoryPath(categorySlug) {
  return `/library/${slugify(categorySlug)}`;
}

export function getLibraryFileFormatPath(formatSlug) {
  return `/library/file-format/${slugify(formatSlug)}`;
}

export function getLibraryPath({ categoryName = null, tagName = null }) {
  const base = '/library';
  if (!categoryName && !tagName) return base;
  if (categoryName && !tagName) return getLibraryCategoryPath(categoryName);
  if (!categoryName && tagName) return `${base}/tag/${slugify(tagName)}`;
  return `${base}/${slugify(categoryName)}/${slugify(tagName)}`;
}

/**
 * Append query string for search, page, sort, etc. (everything except category/tag which are in path).
 */
export function getLibraryPathWithQuery({ categoryName = null, tagName = null, search, page, limit, sort, recency, free_paid, file_format, two_dims, cluster_id }) {
  const path = getLibraryPath({ categoryName, tagName });
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (page && page > 1) params.set('page', String(page));
  /* limit intentionally omitted from URL; backend uses default */
  if (sort) params.set('sort', sort);
  if (recency) params.set('recency', recency);
  if (free_paid) params.set('free_paid', free_paid);
  if (file_format) params.set('file_format', file_format);
  const td = String(two_dims || '').trim().toLowerCase();
  if (td === '1' || td === 'true' || td === 'yes') params.set('two_dims', '1');
  if (cluster_id) params.set('cluster_id', String(cluster_id).trim());
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

/** Default sort when none specified (used for canonical / “unsorted” version) */
export const LIBRARY_DEFAULT_SORT = 'newest';

/** Query keys that are tracking/non-canonical (canonical URL should omit these) */
const LIBRARY_TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'gclsrc', 'ref', 'mc_cid', 'mc_eid', '_ga',
];

/**
 * Canonical URL query for library pages:
 * - Clean indexable paths keep self-canonical URLs.
 * - Filtered /library query variants canonicalize to /library.
 */
const LIBRARY_CANONICAL_QUERY_KEYS = ['page'];

function buildLibraryCanonicalQuery(params, { includePage = true } = {}) {
  const q = new URLSearchParams();
  if (!includePage) return q;
  for (const key of LIBRARY_CANONICAL_QUERY_KEYS) {
    const value = params[key];
    if (value != null && String(value).trim() !== '') q.set(key, String(value).trim());
  }
  return q;
}

/**
 * Build canonical path + query for library pages, robots, and prev/next for pagination.
 * - Canonical = path (+ ?page=N when N > 1). Filters are not encoded in canonical.
 * - Sort / file_format / tracking variants: noindex,follow + canonical to clean URL (no sort/file_format; page kept).
 * - Returns prevPath and nextPath for rel="prev" / rel="next" (same structure as current, page-1 / page+1).
 * @param {{ path: string, searchParams?: Record<string, string | undefined>, hasNextPage?: boolean }} opts
 * @returns {{ canonicalPath: string, robots?: string, prevPath?: string, nextPath?: string }}
 */
export function getLibraryCanonicalAndRobots({ path, searchParams = {}, hasNextPage = false }) {
  const params = searchParams || {};
  const currentPage = Math.max(1, parseInt(params.page, 10) || 1);
  const sort = (params.sort || '').trim();
  const hasSortVariant = sort && sort !== LIBRARY_DEFAULT_SORT;
  const hasFreePaidVariant = (params.free_paid || '').trim() !== '';
  const hasFileFormatVariant = (params.file_format || '').trim() !== '';
  const hasSearchVariant = (params.search || '').trim() !== '';
  const hasRecencyVariant = (params.recency || '').trim() !== '';
  const hasTagsVariant = (params.tags || '').trim() !== '';
  const hasPageVariant = currentPage > 1;
  const twoDimsRaw = (params.two_dims || '').trim().toLowerCase();
  const hasTwoDimsVariant = twoDimsRaw === '1' || twoDimsRaw === 'true' || twoDimsRaw === 'yes';
  const hasTrackingParams = Object.keys(params).some((k) =>
    LIBRARY_TRACKING_PARAMS.some((t) => k.toLowerCase() === t.toLowerCase())
  );

  const isMainLibraryFiltered =
    path === '/library' &&
    (hasSortVariant ||
      hasFreePaidVariant ||
      hasFileFormatVariant ||
      hasSearchVariant ||
      hasRecencyVariant ||
      hasTagsVariant ||
      hasPageVariant ||
      hasTwoDimsVariant ||
      hasTrackingParams);

  const isNestedLibraryFiltered =
    path !== '/library' &&
    (hasSortVariant ||
      hasFreePaidVariant ||
      hasSearchVariant ||
      hasRecencyVariant ||
      hasTagsVariant ||
      hasPageVariant ||
      hasTwoDimsVariant ||
      hasTrackingParams);

  let canonicalPath = path;
  if (isMainLibraryFiltered) {
    canonicalPath = '/library';
  } else if (isNestedLibraryFiltered) {
    canonicalPath = path;
  } else {
    const canonicalQuery = buildLibraryCanonicalQuery(params);
    const queryString = canonicalQuery.toString();
    canonicalPath = queryString ? `${path}?${queryString}` : path;
  }

  let robots;
  if (isMainLibraryFiltered || isNestedLibraryFiltered || hasTrackingParams) {
    robots = 'noindex, follow';
  }

  const prevPath = currentPage > 1
    ? (() => {
        const q = buildLibraryCanonicalQuery({ ...params, page: String(currentPage - 1) });
        const s = q.toString();
        return s ? `${path}?${s}` : path;
      })()
    : undefined;
  const nextPath = hasNextPage
    ? (() => {
        const q = buildLibraryCanonicalQuery({ ...params, page: String(currentPage + 1) });
        const s = q.toString();
        return s ? `${path}?${s}` : `${path}?page=2`;
      })()
    : undefined;

  return { canonicalPath, robots, prevPath, nextPath };
}

import { PHOTO_LINK } from "./config";

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
  const { event_name, ...eventParams } = eventData;
  

    window.gtag('event', event_name, eventParams);
  
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
    "url": `${PHOTO_LINK}67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745498051_620_cy79pc4yd3r.step`,
    "format": "step",
    "name": "sample.step"

  },
  {
    "id": '2',
    "url": `${PHOTO_LINK}67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745231893_385_b3jinkax9rn.stl`,
    "format": "stl",

    "name": "sample.stl"
  },
  {
    "id": '3',
    "url": `${PHOTO_LINK}67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745562522_827_dqmd45tl4ft.ply`,
    "format": "ply",
    "name": "sample.ply"
  },
  {
    "id": '4',
    "url": `${PHOTO_LINK}67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745497469_620_njtb4ms2wf.iges`,
    "format": "iges",
    "name": "sample.iges"
  },
  {
    "id": "5",
    "url": `${PHOTO_LINK}67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745497955_891_tbkq0vuhfd.obj`,
    "format": "obj",
    "name": "sample.obj"


  }]


  export const cadViewerFiles = [
    {
      "id": '6800a5b1b6b9e6583e6ec3c3',    
      "name": "Engine Block",
      
    },
    {
      "id": '68012016b1f61b010dd05a53',
      "name": "End Effector",
      
    },
    {
      "id": "68011f2eb1f61b010dd05a50",
      "name": "Brushless DC Motor",
      
  
    },
    {
      "id": '6800ef3cb1f61b010dd059d1',
      "name": "Fixture Clamp",
      
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
  { label: 'STEP to BREP', path: '/step-to-brep', oneLiner: 'Convert STEP to BREP for 3D printing and slicing.' },
  { label: 'STEP to IGES', path: '/step-to-iges', oneLiner: 'Convert STEP to IGES for 3D printing and slicing.' },
  { label: 'STEP to OBJ', path: '/step-to-obj', oneLiner: 'Convert STEP to OBJ for 3D printing and slicing.' },
  { label: 'STEP to PLY', path: '/step-to-ply', oneLiner: 'Convert STEP to PLY for 3D printing and slicing.' },
  { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'Convert STEP to STL for 3D printing and slicing.' },
  { label: 'STEP to OFF', path: '/step-to-off', oneLiner: 'Convert STEP to OFF for 3D printing and slicing.' },
  // { label: 'STEP to GLB', path: '/step-to-glb' },

  { label: 'IGES to BREP', path: '/iges-to-brep', oneLiner: 'Convert IGES to BREP for 3D printing and slicing.' },
  { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Convert IGES to STEP for 3D printing and slicing.' },
  { label: 'IGES to OBJ', path: '/iges-to-obj', oneLiner: 'Convert IGES to OBJ for 3D printing and slicing.' },
  { label: 'IGES to PLY', path: '/iges-to-ply', oneLiner: 'Convert IGES to PLY for 3D printing and slicing.' },
  { label: 'IGES to STL', path: '/iges-to-stl', oneLiner: 'Convert IGES to STL for 3D printing and slicing.' },
  { label: 'IGES to OFF', path: '/iges-to-off', oneLiner: 'Convert IGES to OFF for 3D printing and slicing.' },
  // { label: 'IGES to GLB', path: '/iges-to-glb' },

  { label: 'OBJ to BREP', path: '/obj-to-brep', oneLiner: 'Convert OBJ to BREP for 3D printing and slicing.' },
  { label: 'OBJ to IGES', path: '/obj-to-iges', oneLiner: 'Convert OBJ to IGES for 3D printing and slicing.'     },
  { label: 'OBJ to STEP', path: '/obj-to-step', oneLiner: 'Convert OBJ to STEP for 3D printing and slicing.' },
  { label: 'OBJ to PLY', path: '/obj-to-ply', oneLiner: 'Convert OBJ to PLY for 3D printing and slicing.' },
  { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Convert OBJ to STL for 3D printing and slicing.' },
  { label: 'OBJ to OFF', path: '/obj-to-off', oneLiner: 'Convert OBJ to OFF for 3D printing and slicing.' },
  // { label: 'OBJ to GLB', path: '/obj-to-glb' },

  { label: 'PLY to BREP', path: '/ply-to-brep', oneLiner: 'Convert PLY to BREP for 3D printing and slicing.' },
  { label: 'PLY to IGES', path: '/ply-to-iges', oneLiner: 'Convert PLY to IGES for 3D printing and slicing.' },
  { label: 'PLY to OBJ', path: '/ply-to-obj', oneLiner: 'Convert PLY to OBJ for 3D printing and slicing.' },
  { label: 'PLY to STEP', path: '/ply-to-step', oneLiner: 'Convert PLY to STEP for 3D printing and slicing.' },
  { label: 'PLY to STL', path: '/ply-to-stl', oneLiner: 'Convert PLY to STL for 3D printing and slicing.' },
  { label: 'PLY to OFF', path: '/ply-to-off', oneLiner: 'Convert PLY to OFF for 3D printing and slicing.' },
  // { label: 'PLY to GLB', path: '/ply-to-glb' },

  { label: 'STL to BREP', path: '/stl-to-brep', oneLiner: 'Convert STL to BREP for 3D printing and slicing.' },
  { label: 'STL to IGES', path: '/stl-to-iges', oneLiner: 'Convert STL to IGES for 3D printing and slicing.' },
  { label: 'STL to OBJ', path: '/stl-to-obj', oneLiner: 'Convert STL to OBJ for 3D printing and slicing.' },
  { label: 'STL to PLY', path: '/stl-to-ply', oneLiner: 'Convert STL to PLY for 3D printing and slicing.' },
  { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Convert STL to STEP for 3D printing and slicing.' },
  { label: 'STL to OFF', path: '/stl-to-off', oneLiner: 'Convert STL to OFF for 3D printing and slicing.' },
  // { label: 'STL to GLB', path: '/stl-to-glb' },

  { label: 'OFF to BREP', path: '/off-to-brep', oneLiner: 'Convert OFF to BREP for 3D printing and slicing.' },
  { label: 'OFF to IGES', path: '/off-to-iges', oneLiner: 'Convert OFF to IGES for 3D printing and slicing.' },
  { label: 'OFF to OBJ', path: '/off-to-obj', oneLiner: 'Convert OFF to OBJ for 3D printing and slicing.'  },
  { label: 'OFF to PLY', path: '/off-to-ply', oneLiner: 'Convert OFF to PLY for 3D printing and slicing.' },
  { label: 'OFF to STL', path: '/off-to-stl', oneLiner: 'Convert OFF to STL for 3D printing and slicing.' },
  { label: 'OFF to STEP', path: '/off-to-step', oneLiner: 'Convert OFF to STEP for 3D printing and slicing.' },
  // { label: 'OFF to GLB', path: '/off-to-glb' },

  { label: 'BREP to STEP', path: '/brep-to-step', oneLiner: 'Convert BREP to STEP for 3D printing and slicing.' },
  { label: 'BREP to IGES', path: '/brep-to-iges', oneLiner: 'Convert BREP to IGES for 3D printing and slicing.' },
  { label: 'BREP to OBJ', path: '/brep-to-obj', oneLiner: 'Convert BREP to OBJ for 3D printing and slicing.' },
  { label: 'BREP to PLY', path: '/brep-to-ply', oneLiner: 'Convert BREP to PLY for 3D printing and slicing.' },
  { label: 'BREP to STL', path: '/brep-to-stl', oneLiner: 'Convert BREP to STL for 3D printing and slicing.' },
  { label: 'BREP to OFF', path: '/brep-to-off', oneLiner: 'Convert BREP to OFF for 3D printing and slicing.' },
  { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Convert DWG to DXF for 3D printing and slicing.' },
  { label: 'DXF to DWG', path: '/dxf-to-dwg', oneLiner: 'Convert DXF to DWG for 3D printing and slicing.' },


  // { label: 'BREP to GLB', path: '/brep-to-glb' },

  // { label: 'GLB to STEP', path: '/glb-to-step' },
  // { label: 'GLB to IGES', path: '/glb-to-iges' },
  // { label: 'GLB to OBJ', path: '/glb-to-obj' },
  // { label: 'GLB to PLY', path: '/glb-to-ply' },
  // { label: 'GLB to STL', path: '/glb-to-stl' },
  // { label: 'GLB to OFF', path: '/glb-to-off' },
  // { label: 'GLB to BREP', path: '/glb-to-brep' },

];

/** Featured conversion cards for topical authority and internal linking (each links to /tools/convert{path}) */
export const featuredConversions = [
  { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'Convert STEP to STL for 3D printing and slicing.' },
  { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Convert IGES to STEP for manufacturing handoff.' },
  { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Convert OBJ to STL for mesh workflows and 3D printing.' },
  { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Convert STL to STEP for CAD compatibility and import.' },
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

/** Turn a tag slug back into a display/API-friendly name (hyphens to spaces; optional title-case) */
export function tagSlugToName(slug) {
  if (slug == null || slug === '') return '';
  return decodeURIComponent(String(slug))
    .replace(/-/g, ' ')
    .trim();
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
export function getLibraryPath({ categoryName = null, tagName = null }) {
  const base = '/library';
  if (!categoryName && !tagName) return base;
  if (categoryName && !tagName) return `${base}/${slugify(categoryName)}`;
  if (!categoryName && tagName) return `${base}/tag/${slugify(tagName)}`;
  return `${base}/${slugify(categoryName)}/${slugify(tagName)}`;
}

/**
 * Append query string for search, page, sort, etc. (everything except category/tag which are in path).
 */
export function getLibraryPathWithQuery({ categoryName = null, tagName = null, search, page, limit, sort, recency, free_paid, file_format }) {
  const path = getLibraryPath({ categoryName, tagName });
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (page && page > 1) params.set('page', String(page));
  if (limit) params.set('limit', String(limit));
  if (sort) params.set('sort', sort);
  if (recency) params.set('recency', recency);
  if (free_paid) params.set('free_paid', free_paid);
  if (file_format) params.set('file_format', file_format);
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

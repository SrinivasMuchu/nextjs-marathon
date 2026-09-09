/**
 * Cross-template internal linking rules (Section 8).
 */

export const TOOL_LIBRARY_CROSS_LINKS = [
  {
    label: 'Browse CAD models',
    description: 'Explore 3D models in various formats.',
    href: '/library',
    icon: 'box',
  },
  {
    label: 'Browse 2D technical drawings',
    description: 'Find and download technical drawings.',
    href: '/library/2d-technical-drawings',
    icon: 'file',
  },
  {
    label: 'Get CAD design support',
    description: 'Connect with experts for design assistance.',
    href: '/cad-services',
    icon: 'headset',
  },
];

export const TWO_D_SOURCE_MODEL_LINK = {
  label: 'Open source 3D CAD model',
  description: 'Preview the original 3D geometry used to generate these drawings',
  icon: '3D',
};

export const TWO_D_DETAIL_LINKS = [
  {
    label: 'Generate your own 2D drawing',
    href: '/tools/cad-drawing-pipeline',
    description: 'Upload STEP, STP, IGES or FreeCAD — get PDF, SVG and DXF',
    icon: '2D',
  },
  {
    label: 'Browse more 2D technical drawings',
    href: '/library/2d-technical-drawings',
    description: 'Explore AI-generated orthographic sheets across part types',
    icon: 'draw',
  },
  {
    label: 'Browse 3D CAD models',
    href: '/library',
    description: 'Download and preview open-source STEP, STL and IGES files',
    icon: 'lib',
  },
  {
    label: 'Open CAD files online',
    href: '/tools/3d-cad-viewer',
    description: 'View STEP, IGES, STL and more in your browser',
    icon: 'view',
  },
  {
    label: 'Convert CAD files online',
    href: '/tools/3d-cad-file-converter',
    description: 'Convert between STEP, STL, OBJ and other 3D formats',
    icon: 'conv',
  },
  {
    label: 'Get manual drafting support',
    href: '/cad-services',
    description: 'Work with vetted CAD designers for production-ready drawings',
    icon: 'help',
  },
];

/** @deprecated Use TWO_D_DETAIL_LINKS */
export const TWO_D_DETAIL_STATIC_LINKS = TWO_D_DETAIL_LINKS;

const PRODUCT_TOOL_LINKS = {
  step: [
    { label: 'Open STEP file viewer', href: '/tools/step-file-viewer' },
    { label: 'Convert STEP to STL', href: '/tools/convert-step-to-stl' },
    { label: 'Generate 2D drawing', href: '/tools/cad-drawing-pipeline' },
  ],
  stp: 'step',
  stl: [
    { label: 'Open STL file viewer', href: '/tools/stl-file-viewer' },
    { label: 'Convert STL to STEP', href: '/tools/convert-stl-to-step' },
  ],
  iges: [
    { label: 'Open IGES file viewer', href: '/tools/iges-file-viewer' },
    { label: 'Convert IGES to STEP', href: '/tools/convert-iges-to-step' },
    { label: 'Generate 2D drawing', href: '/tools/cad-drawing-pipeline' },
  ],
  igs: 'iges',
  obj: [
    { label: 'Open OBJ file viewer', href: '/tools/obj-file-viewer' },
    { label: 'Open CAD file converter', href: '/tools/3d-cad-file-converter' },
  ],
  ply: [
    { label: 'Open PLY file viewer', href: '/tools/ply-file-viewer' },
    { label: 'Open CAD file converter', href: '/tools/3d-cad-file-converter' },
  ],
  off: [
    { label: 'Open OFF file viewer', href: '/tools/off-file-viewer' },
    { label: 'Open CAD file converter', href: '/tools/3d-cad-file-converter' },
  ],
  '3dm': [
    { label: 'Open 3DM file viewer', href: '/tools/3dm-file-viewer' },
    { label: 'Convert 3DM to STEP', href: '/tools/convert-3dm-to-step' },
    { label: 'Convert STEP to 3DM', href: '/tools/convert-step-to-3dm' },
  ],
  dxf: [
    { label: 'Open DXF file viewer', href: '/tools/dxf-file-viewer' },
    { label: 'Convert DXF to DWG', href: '/tools/convert-dxf-to-dwg' },
  ],
  dwg: [
    { label: 'Open DWG file viewer', href: '/tools/dwg-file-viewer' },
    { label: 'Convert DWG to DXF', href: '/tools/convert-dwg-to-dxf' },
  ],
};

export function getProductDetailToolLinks(fileType) {
  const key = String(fileType || 'step').toLowerCase();
  const entry = PRODUCT_TOOL_LINKS[key];
  if (!entry) return PRODUCT_TOOL_LINKS.step;
  if (entry === 'step') return PRODUCT_TOOL_LINKS.step;
  if (entry === 'iges') return PRODUCT_TOOL_LINKS.iges;
  return entry;
}

/** @deprecated Use getProductDetailToolLinks — kept for library listing cards */
export function getLibraryQuickLinks(fileType) {
  return getProductDetailToolLinks(fileType);
}

/**
 * Target formats for the "Convert to" chips on 3D library cards / design download box.
 * Keys are normalized primary file types; values are converter output labels.
 * STEP ↔ STL; DXF ↔ DWG (single option each).
 */
const LIBRARY_CARD_CONVERT_TARGETS = {
  step: ['STL'],
  stp: ['STL'],
  stl: ['STEP'],
  dwg: ['DXF'],
  dxf: ['DWG'],
  iges: ['STEP', 'STL'],
  igs: ['STEP', 'STL'],
  obj: ['STEP', 'STL'],
  ply: ['STEP', 'STL'],
  off: ['STEP', 'STL'],
  brep: ['STL', 'STEP'],
  brp: ['STL', 'STEP'],
  '3dm': ['STEP', 'STL'],
};

const CONVERT_TARGET_BLURBS = {
  STL: '3D printing and slicers',
  OBJ: 'Rendering and mesh tools',
  STEP: 'CAD editing and manufacturing',
  DXF: '2D CAD exchange',
  DWG: 'AutoCAD and drafting tools',
  IGES: 'Legacy CAD exchange',
  '2D PDF': 'Multi-view drawing set',
};

/** 2D drawing pipeline is STEP/STP only. */
const FORMATS_WITH_2D_PDF = new Set(['step', 'stp']);

const SOFTWARE_LINE_BY_FORMAT = {
  step: 'Opens in SolidWorks, Fusion, Onshape, Inventor.',
  stp: 'Opens in SolidWorks, Fusion, Onshape, Inventor.',
  stl: 'Opens in slicers, mesh tools and most CAD viewers.',
  dwg: 'Opens in AutoCAD, DraftSight and similar 2D CAD tools.',
  dxf: 'Opens in AutoCAD, LibreCAD and most 2D CAD tools.',
  iges: 'Opens in SolidWorks, Fusion, Rhino and similar CAD tools.',
  igs: 'Opens in SolidWorks, Fusion, Rhino and similar CAD tools.',
  obj: 'Opens in Blender, mesh tools and rendering apps.',
  '3dm': 'Opens in Rhino and OpenNURBS workflows.',
  brep: 'Opens in FreeCAD and solid-model CAD tools.',
};

function normalizeLibraryConvertFrom(fileType) {
  const key = String(fileType || 'step').toLowerCase().replace(/^\./, '');
  if (key === 'stp') return 'step';
  if (key === 'igs') return 'iges';
  if (key === 'brp') return 'brep';
  return key || 'step';
}

function formatDisplayLabel(fileType) {
  return String(fileType || 'step').replace(/^\./, '').toUpperCase();
}

/** Append ?source=designId (or &source=) for library → tool handoff. */
export function withLibrarySource(href, designId) {
  if (!href || !designId) return href;
  const id = String(designId).trim();
  if (!id) return href;
  const sep = String(href).includes('?') ? '&' : '?';
  return `${href}${sep}source=${encodeURIComponent(id)}`;
}

/** Build /tools/convert-{from}-to-{to} targets for a library card / design page. */
export function getLibraryCardConvertTargets(fileType, designId) {
  const raw = String(fileType || 'step').toLowerCase().replace(/^\./, '');
  const from = normalizeLibraryConvertFrom(raw);

  // DXF ↔ DWG: exactly one conversion option
  if (raw === 'dxf') {
    return [
      {
        label: 'DWG',
        href: withLibrarySource(`/tools/convert-dxf-to-dwg`, designId),
      },
    ];
  }
  if (raw === 'dwg') {
    return [
      {
        label: 'DXF',
        href: withLibrarySource(`/tools/convert-dwg-to-dxf`, designId),
      },
    ];
  }

  // STEP ↔ STL (and other mapped formats). Never fall back DXF/DWG to STEP targets.
  const targets = LIBRARY_CARD_CONVERT_TARGETS[raw];
  if (!targets || !targets.length) return [];

  return targets.map((toLabel) => {
    const to = String(toLabel).toLowerCase();
    return {
      label: toLabel,
      href: withLibrarySource(`/tools/convert-${from}-to-${to}`, designId),
    };
  });
}

export function getConvertTargetBlurb(label) {
  return CONVERT_TARGET_BLURBS[String(label || '').toUpperCase()] || 'Convert this file online';
}

export function designPageSupports2dPdf(fileType) {
  const raw = String(fileType || 'step').toLowerCase().replace(/^\./, '');
  return FORMATS_WITH_2D_PDF.has(raw);
}

export function getDesignPageSoftwareLine(fileType) {
  const raw = String(fileType || 'step').toLowerCase().replace(/^\./, '');
  return (
    SOFTWARE_LINE_BY_FORMAT[raw] ||
    'Opens in major CAD and mesh tools. Need another format? Pick one above.'
  );
}

/**
 * Free designs get the conversion + 2D drawing upsells; paid designs are download-only.
 */
export function isLibraryDesignFree(design) {
  const price = Number(design?.price);
  return !(Number.isFinite(price) && price > 0);
}

/**
 * Download-box options for the 3D design detail page.
 * Native first (priced from design.price when set); convert targets + STEP-only 2D PDF.
 */
export function getDesignPageDownloadOptions({
  fileType,
  designId,
  include2dPdf = true,
  price = null,
} = {}) {
  const raw = String(fileType || 'step').toLowerCase().replace(/^\./, '');
  const from = normalizeLibraryConvertFrom(raw);
  const nativeLabel = formatDisplayLabel(raw === 'stp' ? 'step' : raw);
  const convertTargets = getLibraryCardConvertTargets(fileType, designId);
  const nativePrice = Number(price);
  const hasNativePrice = Number.isFinite(nativePrice) && nativePrice > 0;

  const options = [
    {
      id: 'native',
      kind: 'native',
      label: nativeLabel,
      detail: 'Native file',
      blurb: 'Native file',
      price: hasNativePrice ? nativePrice : 0,
      isFree: !hasNativePrice,
    },
  ];

  // Paid designs are download-only — no conversion, no 2D drawing.
  if (hasNativePrice) return options;

  options.push(
    ...convertTargets.map((target) => ({
      id: `convert-${target.label.toLowerCase()}`,
      kind: 'convert',
      label: target.label,
      detail: getConvertTargetBlurb(target.label),
      blurb: getConvertTargetBlurb(target.label),
      href: target.href,
      toLabel: target.label,
      fromLabel: formatDisplayLabel(from),
    })),
  );

  // 2D PDF only for STEP/STP designs
  if (include2dPdf && designPageSupports2dPdf(fileType)) {
    const drawingHref = withLibrarySource('/tools/cad-drawing-pipeline', designId);
    options.push({
      id: 'drawing-pdf',
      kind: 'drawing',
      label: '2D PDF',
      detail: getConvertTargetBlurb('2D PDF'),
      blurb: getConvertTargetBlurb('2D PDF'),
      href: drawingHref,
      toLabel: '2D PDF',
      fromLabel: formatDisplayLabel(from),
    });
  }

  return options;
}

/** Preferred convert target for banners / sticky bar (first convert option). */
export function getPreferredDesignConvertTarget(fileType, designId) {
  const targets = getLibraryCardConvertTargets(fileType, designId);
  return targets[0] || null;
}

/**
 * Stable social-proof rows for the design page (no analytics API).
 * Highest 2 convert targets + STEP → 2D PDF (shown on any format design page).
 */
export function getDesignConversionSocialProofRows({
  fileType,
  designId,
  downloads = 0,
  include2dPdf = true,
  maxConvertRows = 2,
} = {}) {
  const convertOptions = getDesignPageDownloadOptions({
    fileType,
    designId,
    include2dPdf: false,
  }).filter((option) => option.kind === 'convert');

  const options = convertOptions.slice(0, Math.max(1, maxConvertRows));

  // TechDraw is always STEP → 2D PDF; fine to show on IGES/STL/etc. design pages.
  if (include2dPdf) {
    options.push({
      id: 'drawing-pdf',
      kind: 'drawing',
      label: '2D PDF',
      toLabel: '2D PDF',
      fromLabel: 'STEP',
      href: withLibrarySource('/tools/cad-drawing-pipeline', designId),
    });
  }

  if (!options.length) return { rows: [], totalConversions: 0 };

  const from = normalizeLibraryConvertFrom(fileType);
  const dl = Math.max(0, Number(downloads) || 0);
  const idSeed = String(designId || '')
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const totalConversions = Math.max(
    120,
    Math.round(dl * 0.42) + (idSeed % 180) + options.length * 40,
  );

  let percents;
  const labels = options.map((o) => (o.toLabel || o.label).toUpperCase());
  if (
    from === 'step' &&
    labels.includes('STL') &&
    labels.includes('2D PDF') &&
    options.length === 2
  ) {
    percents = options.map((option) => {
      const key = (option.toLabel || option.label).toUpperCase();
      if (key === 'STL') return 67;
      if (key === '2D PDF') return 33;
      return 0;
    });
  } else if (options.length === 1) {
    percents = [100];
  } else if (options.length === 2) {
    percents = [67, 33];
  } else if (options.length === 3) {
    percents = [50, 30, 20];
  } else {
    const base = Math.floor(100 / options.length);
    percents = options.map((_, index) =>
      index === 0 ? 100 - base * (options.length - 1) : base,
    );
  }

  const rows = options.map((option, index) => ({
    id: option.id,
    fromLabel: option.fromLabel || formatDisplayLabel(from),
    toLabel: option.toLabel || option.label,
    href: option.href,
    kind: option.kind,
    percent: percents[index] || 0,
  }));

  return { rows, totalConversions };
}

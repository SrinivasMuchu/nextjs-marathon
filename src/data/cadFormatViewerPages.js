import { getUniqueViewerPage } from '@/data/viewerUniquePages';

export const CAD_VIEWER_FORMAT_SLUGS = [
  'off',
  'step',
  'stp',
  'stl',
  'obj',
  'ply',
  'iges',
  'igs',
  'brep',
  'brp',
  '3dm',
  '3mf',
  'dxf',
  'dwg',
];

const DEFAULT_RELATED_TOOLS = [
  { href: '/tools/3d-cad-viewer', label: '3D CAD Viewer' },
  { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
];

const FORMAT_CONFIG = {
  off: {
    formatName: 'OFF',
    previewPhrase: 'OFF polygon mesh models',
    supportedInputLabel: 'OFF (.off)',
    extensions: ['.off'],
    title: 'OFF File Viewer | Open OFF Files Online | Marathon OS',
    description:
      'Open and inspect OFF files online without installing CAD software. Preview polygon mesh models securely in your browser with private uploads and 7-day auto-delete.',
    h1: 'Free Online OFF File Viewer',
    relatedTools: [
      { href: '/tools/ply-file-viewer', label: 'PLY File Viewer' },
      { href: '/tools/obj-file-viewer', label: 'OBJ File Viewer' },
      { href: '/tools/stl-file-viewer', label: 'STL File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  step: {
    formatName: 'STEP',
    previewPhrase: 'STEP 3D CAD models',
    supportedInputLabel: 'STEP (.step), STP (.stp)',
    extensions: ['.step', '.stp'],
    title: 'Free STEP File Viewer Online – Open STEP & STP Files in 3D | Marathon OS',
    description:
      'Open STEP and STP files online and view them in 3D. Rotate, zoom and inspect solids and assemblies in your browser, with no CAD software to install.',
    h1: 'Free Online STEP File Viewer',
    relatedTools: [
      { href: '/tools/convert-step-to-stl', label: 'STEP to STL Converter' },
      { href: '/tools/convert-step-to-iges', label: 'STEP to IGES Converter' },
      { href: '/tools/convert-stl-to-step', label: 'STL to STEP Converter' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
      { href: '/tools/convert-step-to-2d-drawing', label: 'STEP to 2D Drawing' },
    ],
  },
  stp: {
    formatName: 'STP',
    previewPhrase: 'STP 3D CAD models',
    supportedInputLabel: 'STEP (.step), STP (.stp)',
    extensions: ['.step', '.stp'],
    title: 'STP File Viewer | Open STP and STEP Files Online | Marathon OS',
    description:
      'Open and inspect STP and STEP files online without CAD software. Preview 3D CAD models securely in your browser with encrypted uploads and 7-day file deletion.',
    h1: 'Free Online STP File Viewer',
    relatedTools: [
      { href: '/tools/convert-step-to-stl', label: 'STEP to STL Converter' },
      { href: '/tools/convert-step-to-iges', label: 'STEP to IGES Converter' },
      { href: '/tools/convert-stl-to-step', label: 'STL to STEP Converter' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
      { href: '/tools/convert-step-to-2d-drawing', label: 'STEP to 2D Drawing' },
    ],
  },
  stl: {
    formatName: 'STL',
    previewPhrase: 'STL mesh models',
    supportedInputLabel: 'STL (.stl)',
    extensions: ['.stl'],
    title: 'Free STL File Viewer Online – View STL Files in Your Browser | Marathon OS',
    description:
      'Open and view STL files online in 3D. Rotate, zoom and check your mesh before 3D printing or slicing, right in your browser. No software to install.',
    h1: 'Free Online STL File Viewer',
    relatedTools: [
      { href: '/tools/convert-stl-to-step', label: 'STL to STEP Converter' },
      { href: '/tools/convert-stl-to-obj', label: 'STL to OBJ Converter' },
      { href: '/tools/step-file-viewer', label: 'STEP File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  obj: {
    formatName: 'OBJ',
    previewPhrase: 'OBJ mesh models',
    supportedInputLabel: 'OBJ (.obj)',
    extensions: ['.obj'],
    title: 'Free OBJ File Viewer Online – View OBJ 3D Models in Browser | Marathon OS',
    description:
      'Open and view OBJ files online in 3D. Rotate, zoom and inspect polygon models and meshes in your browser, with no 3D software to install.',
    h1: 'Free Online OBJ File Viewer',
    relatedTools: [
      { href: '/tools/stl-file-viewer', label: 'STL File Viewer' },
      { href: '/tools/ply-file-viewer', label: 'PLY File Viewer' },
      { href: '/tools/off-file-viewer', label: 'OFF File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  ply: {
    formatName: 'PLY',
    previewPhrase: 'PLY point clouds and mesh models',
    supportedInputLabel: 'PLY (.ply)',
    extensions: ['.ply'],
    title: 'PLY File Viewer | Open PLY Files Online | Marathon OS',
    description:
      'Open and inspect PLY files online for point clouds, scans and mesh models. Preview files securely in your browser with private uploads and 7-day auto-delete.',
    h1: 'Free Online PLY File Viewer',
    relatedTools: [
      { href: '/tools/obj-file-viewer', label: 'OBJ File Viewer' },
      { href: '/tools/stl-file-viewer', label: 'STL File Viewer' },
      { href: '/tools/off-file-viewer', label: 'OFF File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  iges: {
    formatName: 'IGES',
    previewPhrase: 'IGES surface-based CAD models',
    supportedInputLabel: 'IGES (.igs), IGS (.iges)',
    extensions: ['.igs', '.iges'],
    title: 'Free IGES File Viewer Online – Open IGES & IGS Files in 3D | Marathon OS',
    description:
      'Open IGES and IGS files online and view them in 3D. Inspect legacy surfaces and solids from older CAD systems in your browser, no CAD software needed.',
    h1: 'Free Online IGES File Viewer',
    relatedTools: [
      { href: '/tools/convert-iges-to-step', label: 'IGES to STEP Converter' },
      { href: '/tools/convert-step-to-iges', label: 'STEP to IGES Converter' },
      { href: '/tools/step-file-viewer', label: 'STEP File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  igs: {
    formatName: 'IGS',
    previewPhrase: 'IGS surface-based CAD models',
    supportedInputLabel: 'IGES (.igs), IGS (.iges)',
    extensions: ['.igs', '.iges'],
    title: 'IGS File Viewer | Open IGS and IGES Files Online | Marathon OS',
    description:
      'Open and inspect IGS and IGES files online without CAD software. Preview surface-based CAD models securely in your browser with 7-day auto-delete.',
    h1: 'Free Online IGS File Viewer',
    relatedTools: [
      { href: '/tools/convert-iges-to-step', label: 'IGES to STEP Converter' },
      { href: '/tools/convert-step-to-iges', label: 'STEP to IGES Converter' },
      { href: '/tools/iges-file-viewer', label: 'IGES File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  brep: {
    formatName: 'BREP',
    previewPhrase: 'BREP boundary representation models',
    supportedInputLabel: 'BREP (.brep), BRP (.brp)',
    extensions: ['.brp', '.brep'],
    title: 'BREP File Viewer | Open BREP and BRP Files Online | Marathon OS',
    description:
      'Open and inspect BREP and BRP files online without CAD software. Preview boundary representation models securely in your browser with private uploads and 7-day auto-delete.',
    h1: 'Free Online BREP File Viewer',
    relatedTools: [
      { href: '/tools/convert-brep-to-stl', label: 'BREP to STL Converter' },
      { href: '/tools/step-file-viewer', label: 'STEP File Viewer' },
      { href: '/tools/stl-file-viewer', label: 'STL File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  brp: {
    formatName: 'BRP',
    previewPhrase: 'BRP boundary representation models',
    supportedInputLabel: 'BREP (.brep), BRP (.brp)',
    extensions: ['.brp', '.brep'],
    title: 'BRP File Viewer | Open BRP and BREP Files Online | Marathon OS',
    description:
      'Open and inspect BRP and BREP files online without CAD software. Preview boundary representation models securely in your browser with private uploads and 7-day auto-delete.',
    h1: 'Free Online BRP File Viewer',
    relatedTools: [
      { href: '/tools/convert-brep-to-stl', label: 'BREP to STL Converter' },
      { href: '/tools/brep-file-viewer', label: 'BREP File Viewer' },
      { href: '/tools/stl-file-viewer', label: 'STL File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  '3dm': {
    formatName: '3DM',
    previewPhrase: 'Rhino 3DM NURBS and mesh models',
    supportedInputLabel: '3DM (.3dm)',
    extensions: ['.3dm'],
    title: 'Free 3DM File Viewer Online – Open Rhino Files Without Rhino | Marathon OS',
    description:
      'Open Rhino 3DM files online and view them in 3D. Rotate, zoom and review Rhino geometry in your browser, without installing Rhino or any CAD software.',
    h1: 'Free Online 3DM File Viewer',
    relatedTools: [
      { href: '/tools/convert-3dm-to-step', label: '3DM to STEP Converter' },
      { href: '/tools/convert-step-to-3dm', label: 'STEP to 3DM Converter' },
      { href: '/tools/step-file-viewer', label: 'STEP File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  '3mf': {
    formatName: '3MF',
    previewPhrase: '3MF print models with named parts and colours',
    supportedInputLabel: '3MF (.3mf)',
    extensions: ['.3mf'],
    title: 'Free 3MF File Viewer Online – Open 3MF Files in Your Browser | Marathon OS',
    description:
      'Open and view 3MF files online in 3D. Inspect named parts and colours from PrusaSlicer, Bambu Studio, OrcaSlicer and Cura in your browser, with no slicer to install.',
    h1: 'Free Online 3MF File Viewer',
    relatedTools: [
      { href: '/tools/convert-3mf-to-stl', label: '3MF to STL Converter' },
      { href: '/tools/convert-stl-to-3mf', label: 'STL to 3MF Converter' },
      { href: '/tools/convert-3mf-to-step', label: '3MF to STEP Converter' },
      { href: '/tools/stl-file-viewer', label: 'STL File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
    ],
  },
  dxf: {
    formatName: 'DXF',
    previewPhrase: 'DXF CAD drawings',
    supportedInputLabel: 'DXF (.dxf)',
    extensions: ['.dxf'],
    title: 'DXF File Viewer | Open DXF Drawings Online | Marathon OS',
    description:
      'Open and inspect DXF drawings online without installing CAD software. Preview CAD drawings securely in your browser with private uploads and 7-day auto-delete.',
    h1: 'Free Online DXF File Viewer',
    relatedTools: [
      { href: '/tools/convert-dxf-to-dwg', label: 'DXF to DWG Converter' },
      { href: '/tools/dwg-file-viewer', label: 'DWG File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
      { href: '/tools/convert-step-to-2d-drawing', label: 'STEP to 2D Drawing' },
    ],
  },
  dwg: {
    formatName: 'DWG',
    previewPhrase: 'DWG CAD drawings',
    supportedInputLabel: 'DWG (.dwg)',
    extensions: ['.dwg'],
    title: 'DWG File Viewer | Open DWG Drawings Online | Marathon OS',
    description:
      'Open and inspect DWG drawings online without installing CAD software. Preview CAD drawings securely in your browser with private uploads and 7-day auto-delete.',
    h1: 'Free Online DWG File Viewer',
    relatedTools: [
      { href: '/tools/convert-dwg-to-dxf', label: 'DWG to DXF Converter' },
      { href: '/tools/dxf-file-viewer', label: 'DXF File Viewer' },
      { href: '/tools/3d-cad-file-converter', label: 'CAD File Converter' },
      { href: '/tools/convert-step-to-2d-drawing', label: 'STEP to 2D Drawing' },
    ],
  },
};

export function isCadViewerFormatSlug(slug) {
  return Boolean(slug && FORMAT_CONFIG[slug.toLowerCase()]);
}

export function getCadViewerFormatConfig(slug) {
  const key = String(slug || '').toLowerCase();
  return FORMAT_CONFIG[key] || null;
}

export function getAllowedExtensions(slug) {
  return getCadViewerFormatConfig(slug)?.extensions || [];
}

export function getSupportedInputFormatsLabel(slug) {
  const unique = getUniqueViewerPage(slug);
  if (unique?.supportedInputLabel) {
    return `Supported input formats: ${unique.supportedInputLabel}`;
  }
  const config = getCadViewerFormatConfig(slug);
  if (!config) return null;
  return `Supported input formats: ${config.supportedInputLabel}`;
}

export function getViewerHeroCopy(slug) {
  const unique = getUniqueViewerPage(slug);
  if (unique?.heroIntro) return unique.heroIntro;
  const config = getCadViewerFormatConfig(slug);
  if (!config) return null;
  return `Open and inspect ${config.formatName} files online without installing CAD software. Marathon OS lets you preview ${config.previewPhrase} securely in your browser with private uploads and automatic file deletion after 7 days.`;
}

export function getViewerPageMetadata(slug) {
  const config = getCadViewerFormatConfig(slug);
  if (!config) return null;
  const unique = getUniqueViewerPage(slug);
  const canonicalPath = `/tools/${slug.toLowerCase()}-file-viewer`;
  return {
    title: unique?.meta?.title || config.title,
    description: unique?.meta?.description || config.description,
    h1: unique?.h1 || config.h1,
    canonicalPath,
    canonicalUrl: `https://marathon-os.com${canonicalPath}`,
    formatName: config.formatName,
    relatedTools: unique?.relatedTools || config.relatedTools || DEFAULT_RELATED_TOOLS,
    breadcrumbLabel: unique?.breadcrumbLabel,
  };
}

export function applyAllowedFormatsForSlug(setAllowedFormats, slug) {
  const extensions = getAllowedExtensions(slug);
  if (extensions.length > 0) {
    setAllowedFormats(extensions);
  }
}

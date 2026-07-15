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

export const PIPELINE_PAGE_TITLE =
  '3D CAD to 2D Drawing Generator | STEP to PDF, SVG, DXF | Marathon OS';

export const PIPELINE_PAGE_DESCRIPTION =
  'Generate 2D technical drawings from 3D CAD files online. Upload STEP, STP, IGES or FreeCAD files and get orthographic views, section cuts, PDF, SVG and DXF outputs.';

export const PIPELINE_H1 = '3D CAD to 2D Technical Drawing Generator';

export const PIPELINE_HERO_COPY =
  'Upload a STEP, STP, IGES or FreeCAD file and generate 2D engineering drawings online. Get orthographic views, section cuts and downloadable PDF, SVG and DXF files from your 3D CAD model.';

export const PIPELINE_HOW_IT_WORKS_COPY =
  'Upload a STEP, STP, IGES or FreeCAD file. Marathon OS analyzes the geometry, selects drawing views, plans section cuts and generates 2D drawing sheets in PDF, SVG and DXF formats.';

export const PIPELINE_SUPPORTED_INPUTS = [
  'STEP (.step, .stp)',
  'IGES (.igs, .iges)',
  'FreeCAD (.FCStd)',
];

export const PIPELINE_OUTPUT_FILES = [
  'PDF drawing sheets',
  'SVG drawing sheets',
  'DXF drawing files',
  'PNG previews',
  'Editable FreeCAD file where available',
];

export const PIPELINE_GENERATOR_CREATES = [
  'Orthographic views',
  'Top, front and side views',
  'Section cuts',
  'Detail views',
  'Sheet labels',
  'Basic dimensions where available',
  'Bill of materials where available',
  'Downloadable drawing files',
];

export const PIPELINE_BEFORE_USING_COPY =
  'Review critical dimensions against the original CAD model before using the generated drawings for manufacturing. Generated drawings should be checked by an engineer or designer before production release.';

export const PIPELINE_INTERNAL_LINKS = [
  {
    label: 'Browse 2D technical drawings',
    href: '/library/2d-technical-drawings',
    description: 'See AI-generated drawing sets across part types',
    icon: 'draw',
  },
  {
    label: 'Browse 3D CAD models',
    href: '/library',
    description: 'Download open-source STEP, STL and IGES models',
    icon: 'lib',
  },
  {
    label: 'Open CAD files online',
    href: '/tools/3d-cad-viewer',
    description: 'Preview 3D models in your browser',
    icon: 'view',
  },
  {
    label: 'Convert CAD files online',
    href: '/tools/3d-cad-file-converter',
    description: 'Convert between STEP, STL, OBJ and more',
    icon: 'conv',
  },
  {
    label: 'Preview STEP files online',
    href: '/tools/step-file-viewer',
    description: 'Open STEP and STP files without desktop CAD',
    icon: 'step',
  },
  {
    label: 'Get manual CAD drafting support',
    href: '/cad-services',
    description: 'Work with vetted designers for production-ready drawings',
    icon: 'help',
  },
];

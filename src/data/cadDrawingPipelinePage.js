/** Shared copy and link data for /tools/cad-drawing-pipeline */

export const CAD_DRAWING_PIPELINE_TITLE =
  '3D CAD to 2D Drawing Generator | STEP to PDF, SVG, DXF | Marathon OS';

export const CAD_DRAWING_PIPELINE_DESCRIPTION =
  'Generate 2D technical drawings from 3D CAD files online. Upload STEP, STP, IGES or FreeCAD files and get orthographic views, section cuts, PDF, SVG and DXF outputs.';

export const CAD_DRAWING_PIPELINE_H1 = '3D CAD to 2D Technical Drawing Generator';

export const CAD_DRAWING_PIPELINE_HERO_COPY =
  'Upload a STEP, STP, IGES or FreeCAD file and generate 2D engineering drawings online. Get orthographic views, section cuts and downloadable PDF, SVG and DXF files from your 3D CAD model.';

export const CAD_DRAWING_PIPELINE_HOW_IT_WORKS_COPY =
  'Upload a STEP, STP, IGES or FreeCAD file. Marathon OS analyzes the geometry, selects drawing views, plans section cuts and generates 2D drawing sheets in PDF, SVG and DXF formats.';

export const TECHDRAW_ACCEPTED_EXTENSIONS = ['.step', '.stp', '.igs', '.iges', '.FCStd'];

export const TECHDRAW_INPUT_EXT = /\.(step|stp|igs|iges|FCStd)$/i;

export const CAD_DRAWING_PIPELINE_INTERNAL_LINKS = [
  { href: '/library/2d-technical-drawings', label: 'Browse 2D technical drawings' },
  { href: '/library', label: 'Browse 3D CAD models' },
  { href: '/tools/3d-cad-viewer', label: 'Open CAD files online' },
  { href: '/tools/3d-cad-file-converter', label: 'Convert CAD files online' },
  { href: '/tools/step-file-viewer', label: 'Preview STEP files online' },
  { href: '/cad-services', label: 'Get manual CAD drafting support' },
];

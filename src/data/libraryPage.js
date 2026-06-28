export const LIBRARY_DEFAULT_TITLE =
  'Engineering CAD Design Library | Download 3D CAD Models | Marathon OS';

export const LIBRARY_DEFAULT_DESCRIPTION =
  'Browse engineering-ready 3D CAD models on Marathon OS. Preview and download STEP, STP, IGES, STL, OBJ, PLY, DWG and DXF files for design, prototyping and manufacturing.';

export const LIBRARY_DEFAULT_H1 = 'Engineering CAD Design Library';

export const LIBRARY_DEFAULT_INTRO =
  'Browse quality-checked 3D CAD models for engineering, product design, prototyping and manufacturing. Preview models online and download files in STEP, STP, IGES, STL, OBJ, PLY, DWG, DXF and more.';

export const LIBRARY_FILE_FORMAT_FILTERS = [
  { value: 'STEP', label: 'STEP' },
  { value: 'STP', label: 'STP' },
  { value: 'STL', label: 'STL' },
  { value: 'PLY', label: 'PLY' },
  { value: 'OFF', label: 'OFF' },
  { value: 'IGS', label: 'IGS' },
  { value: 'IGES', label: 'IGES' },
  { value: 'BRP', label: 'BRP' },
  { value: 'BREP', label: 'BREP' },
  { value: 'OBJ', label: 'OBJ' },
  { value: 'DXF', label: 'DXF' },
  { value: 'DWG', label: 'DWG' },
];

export const LIBRARY_BROWSE_FILE_FORMATS = [
  { slug: 'step', label: 'STEP CAD models', apiValue: 'STEP' },
  { slug: 'stl', label: 'STL CAD models', apiValue: 'STL' },
  { slug: 'iges', label: 'IGES CAD models', apiValue: 'IGES' },
  { slug: 'obj', label: 'OBJ 3D models', apiValue: 'OBJ' },
  { slug: 'ply', label: 'PLY models', apiValue: 'PLY' },
  { slug: 'dwg', label: 'DWG drawings', apiValue: 'DWG' },
  { slug: 'dxf', label: 'DXF drawings', apiValue: 'DXF' },
];

export const LIBRARY_BROWSE_CATEGORIES = [
  { slug: 'automotive', label: 'Automotive CAD models' },
  { slug: 'aerospace', label: 'Aerospace CAD models' },
  { slug: 'robotics', label: 'Robotics CAD models' },
  { slug: '3d-printing', label: '3D printing CAD models' },
  { slug: 'architecture', label: 'Architecture CAD models' },
  { slug: 'industrial-design', label: 'Industrial design CAD models' },
  { slug: 'medical', label: 'Medical CAD models' },
  { slug: 'electrical', label: 'Electrical CAD models' },
];

export const LIBRARY_FILE_FORMAT_PAGES = {
  step: {
    apiValue: 'STEP',
    title: 'STEP CAD Models Library | Download STEP Files | Marathon OS',
    description:
      'Browse and download STEP 3D CAD models for engineering and manufacturing. Preview models online and filter by category, price and popularity on Marathon OS.',
    h1: 'STEP CAD Models',
    intro:
      'Browse quality-checked STEP CAD models for product design, mechanical engineering and manufacturing workflows. Preview online and download STEP files ready for CAD software.',
  },
  stl: {
    apiValue: 'STL',
    title: 'STL CAD Models Library | Download STL Files | Marathon OS',
    description:
      'Browse and download STL 3D models for 3D printing and mesh workflows. Preview models online and filter by category, price and popularity on Marathon OS.',
    h1: 'STL CAD Models',
    intro:
      'Browse STL mesh models for 3D printing, prototyping and visualization. Preview online and download STL files for slicers and CAD tools.',
  },
  iges: {
    apiValue: 'IGES',
    title: 'IGES CAD Models Library | Download IGES Files | Marathon OS',
    description:
      'Browse and download IGES 3D CAD models for legacy CAD exchange. Preview models online and filter by category, price and popularity on Marathon OS.',
    h1: 'IGES CAD Models',
    intro:
      'Browse IGES CAD models for engineering exchange and legacy design workflows. Preview online and download IGES files for CAD review and conversion.',
  },
  obj: {
    apiValue: 'OBJ',
    title: 'OBJ 3D Models Library | Download OBJ Files | Marathon OS',
    description:
      'Browse and download OBJ 3D models for visualization and mesh workflows. Preview models online and filter by category, price and popularity on Marathon OS.',
    h1: 'OBJ 3D Models',
    intro:
      'Browse OBJ mesh models for rendering, visualization and 3D workflows. Preview online and download OBJ files for design and prototyping projects.',
  },
  ply: {
    apiValue: 'PLY',
    title: 'PLY Models Library | Download PLY Files | Marathon OS',
    description:
      'Browse and download PLY 3D models for scan data and mesh workflows. Preview models online and filter by category, price and popularity on Marathon OS.',
    h1: 'PLY Models',
    intro:
      'Browse PLY mesh models for 3D scanning, visualization and engineering review. Preview online and download PLY files for CAD and rendering tools.',
  },
  dwg: {
    apiValue: 'DWG',
    title: 'DWG Drawings Library | Download DWG CAD Files | Marathon OS',
    description:
      'Browse and download DWG CAD drawings for architecture and mechanical documentation. Preview online and filter by category, price and popularity on Marathon OS.',
    h1: 'DWG Drawings',
    intro:
      'Browse DWG drawing files for architecture, mechanical design and documentation workflows. Preview online and download DWG files for AutoCAD-compatible tools.',
  },
  dxf: {
    apiValue: 'DXF',
    title: 'DXF Drawings Library | Download DXF CAD Files | Marathon OS',
    description:
      'Browse and download DXF CAD drawings for 2D documentation and CNC workflows. Preview online and filter by category, price and popularity on Marathon OS.',
    h1: 'DXF Drawings',
    intro:
      'Browse DXF drawing files for 2D CAD, CNC and documentation workflows. Preview online and download DXF files for CAD and manufacturing tools.',
  },
};

export const LIBRARY_CATEGORY_PAGES = {
  automotive: {
    title: 'Automotive CAD Models Library | Download 3D CAD Files | Marathon OS',
    description:
      'Browse automotive 3D CAD models for vehicle design, engineering and prototyping. Preview and download STEP, STL, IGES and more on Marathon OS.',
    h1: 'Automotive CAD Models',
    intro:
      'Browse automotive CAD models for vehicle components, assemblies and engineering projects. Preview online and download files for design, simulation and manufacturing.',
  },
  aerospace: {
    title: 'Aerospace CAD Models Library | Download 3D CAD Files | Marathon OS',
    description:
      'Browse aerospace 3D CAD models for aircraft and space engineering projects. Preview and download STEP, STL, IGES and more on Marathon OS.',
    h1: 'Aerospace CAD Models',
    intro:
      'Browse aerospace CAD models for aircraft structures, components and engineering workflows. Preview online and download files for analysis and manufacturing.',
  },
  robotics: {
    title: 'Robotics CAD Models Library | Download 3D CAD Files | Marathon OS',
    description:
      'Browse robotics 3D CAD models for mechanisms, assemblies and automation projects. Preview and download STEP, STL, IGES and more on Marathon OS.',
    h1: 'Robotics CAD Models',
    intro:
      'Browse robotics CAD models for arms, grippers, frames and automation assemblies. Preview online and download files for prototyping and production.',
  },
  '3d-printing': {
    title: '3D Printing CAD Models Library | Download STL and STEP Files | Marathon OS',
    description:
      'Browse 3D printing CAD models for prototypes and printable parts. Preview and download STL, STEP and mesh files on Marathon OS.',
    h1: '3D Printing CAD Models',
    intro:
      'Browse CAD models suited for 3D printing workflows. Preview online and download STL, STEP and mesh files for slicers and print-ready projects.',
  },
  architecture: {
    title: 'Architecture CAD Models Library | Download 3D CAD Files | Marathon OS',
    description:
      'Browse architecture 3D CAD models for building components and design documentation. Preview and download DWG, DXF, STEP and more on Marathon OS.',
    h1: 'Architecture CAD Models',
    intro:
      'Browse architecture CAD models for building elements, fixtures and design documentation. Preview online and download files for BIM and CAD workflows.',
  },
  'industrial-design': {
    title: 'Industrial Design CAD Models Library | Download 3D CAD Files | Marathon OS',
    description:
      'Browse industrial design 3D CAD models for product concepts and manufacturing-ready parts. Preview and download STEP, STL and more on Marathon OS.',
    h1: 'Industrial Design CAD Models',
    intro:
      'Browse industrial design CAD models for consumer products, enclosures and production parts. Preview online and download files for design and manufacturing.',
  },
  medical: {
    title: 'Medical CAD Models Library | Download 3D CAD Files | Marathon OS',
    description:
      'Browse medical 3D CAD models for devices, instruments and healthcare product design. Preview and download STEP, STL and more on Marathon OS.',
    h1: 'Medical CAD Models',
    intro:
      'Browse medical CAD models for devices, fixtures and healthcare product development. Preview online and download files for engineering review and prototyping.',
  },
  electrical: {
    title: 'Electrical CAD Models Library | Download 3D CAD Files | Marathon OS',
    description:
      'Browse electrical 3D CAD models for enclosures, connectors and electromechanical assemblies. Preview and download STEP, STL and more on Marathon OS.',
    h1: 'Electrical CAD Models',
    intro:
      'Browse electrical CAD models for enclosures, connectors and electromechanical components. Preview online and download files for product design and manufacturing.',
  },
};

export function getLibraryQuickLinks(fileType) {
  const key = String(fileType || 'step').toLowerCase();
  if (key === 'step' || key === 'stp') {
    return [
      { label: 'Open STEP viewer', href: '/tools/step-file-viewer' },
      { label: 'Convert STEP to STL', href: '/tools/convert-step-to-stl' },
      { label: 'Generate 2D drawing', href: '/tools/cad-drawing-pipeline' },
    ];
  }
  if (key === 'stl') {
    return [
      { label: 'Open STL viewer', href: '/tools/stl-file-viewer' },
      { label: 'Convert STL to STEP', href: '/tools/convert-stl-to-step' },
    ];
  }
  if (key === 'dxf') {
    return [
      { label: 'Open DXF viewer', href: '/tools/dxf-file-viewer' },
      { label: 'Convert DXF to DWG', href: '/tools/convert-dxf-to-dwg' },
    ];
  }
  if (key === 'dwg') {
    return [
      { label: 'Open DWG viewer', href: '/tools/dwg-file-viewer' },
      { label: 'Convert DWG to DXF', href: '/tools/convert-dwg-to-dxf' },
    ];
  }
  return [];
}

export function formatPrimaryFileFormat(fileType) {
  const key = String(fileType || 'step').toUpperCase();
  return key;
}

export function hasPreviewAvailable(design) {
  const ft = String(design?.file_type || '').toLowerCase();
  if (ft === 'dxf' || ft === 'dwg') return true;
  return Boolean(design?.is_glb);
}

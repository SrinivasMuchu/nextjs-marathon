export const TWO_D_LIBRARY_TITLE =
  '2D Technical Drawing Library | PDF, SVG, DXF CAD Drawings | Marathon OS';

export const TWO_D_LIBRARY_DESCRIPTION =
  'Browse 2D technical drawings generated from 3D CAD models. Download engineering drawing sets with orthographic views, section cuts, PDF, SVG and DXF files.';

export const TWO_D_LIBRARY_H1 = '2D Technical Drawing Library';

export const TWO_D_LIBRARY_INTRO =
  'Browse 2D technical drawings generated from 3D CAD models. Download drawing sets with orthographic views, section cuts and PDF, SVG and DXF files for engineering review and documentation.';

export const TWO_D_LIBRARY_DRAWING_TYPE = '2D Technical Drawing';

export const TWO_D_LIBRARY_DEFAULT_FORMATS = 'PDF, SVG, DXF';

export const TWO_D_LIBRARY_DEFAULT_PROJECTION = '1st Angle';

export const TWO_D_LIBRARY_DEFAULT_SHEETS_LABEL = 'Up to 9 sheets';

export const TWO_D_LIBRARY_SECTION_CUTS_LABEL = 'Section cuts included';

export const POPULAR_2D_CATEGORIES = [
  { label: 'Mechanical part drawings', search: 'mechanical' },
  { label: 'Automotive CAD drawings', search: 'automotive' },
  { label: 'Robotics technical drawings', search: 'robotics' },
  { label: 'Industrial component drawings', search: 'industrial' },
  { label: '3D printing drawing sets', search: '3d printing' },
  { label: 'Aerospace CAD drawings', search: 'aerospace' },
];

export const TWO_D_FILTER_CATEGORIES = [
  { value: '', label: 'All categories' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'industrial', label: 'Industrial' },
  { value: '3d printing', label: '3D printing' },
  { value: 'aerospace', label: 'Aerospace' },
];

export const TWO_D_SOURCE_FORMATS = [
  { value: '', label: 'All source formats' },
  { value: 'step', label: 'STEP / STP' },
  { value: 'iges', label: 'IGES / IGS' },
  { value: 'fcstd', label: 'FreeCAD (.FCStd)' },
];

export const TWO_D_OUTPUT_FORMATS = [
  { value: '', label: 'All output formats' },
  { value: 'pdf', label: 'PDF' },
  { value: 'svg', label: 'SVG' },
  { value: 'dxf', label: 'DXF' },
];

export const TWO_D_SHEET_FILTERS = [
  { value: '', label: 'Any sheet count' },
  { value: 'multi', label: 'Multi-sheet sets' },
];

export const TWO_D_PROJECTION_TYPES = [
  { value: '', label: 'Any projection' },
  { value: 'first_angle', label: '1st Angle' },
];

export const TWO_D_FREE_PAID = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

export function buildTwoDLibraryHref({
  basePath = '/library/2d-technical-drawings',
  page,
  search,
  category,
  source_format,
  output_format,
  sheets,
  projection,
  free_paid,
  recently_generated,
} = {}) {
  const qp = new URLSearchParams();
  if (page && Number(page) > 1) qp.set('page', String(page));
  if (search) qp.set('search', search);
  if (category) qp.set('category', category);
  if (source_format) qp.set('source_format', source_format);
  if (output_format) qp.set('output_format', output_format);
  if (sheets) qp.set('sheets', sheets);
  if (projection) qp.set('projection', projection);
  if (free_paid) qp.set('free_paid', free_paid);
  if (recently_generated) qp.set('recently_generated', '1');
  const qs = qp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function parseDesignCategories(categories) {
  if (!categories || typeof categories !== 'string') return [];
  return categories
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getTwoDDesignHref(design) {
  const route = String(design?.route || '').trim();
  if (route) {
    return `/library/2d-technical-drawings/${encodeURIComponent(route)}`;
  }
  return `/library/2d-technical-drawings/${design._id}`;
}

export function getSourceCadHref(design) {
  const route = String(design?.route || '').trim();
  if (route) return `/library/${encodeURIComponent(route)}`;
  return '/library';
}

export function formatSourceCadFormat(fileType) {
  const key = String(fileType || 'step').toLowerCase();
  const map = {
    step: 'STEP / STP',
    stp: 'STEP / STP',
    iges: 'IGES / IGS',
    igs: 'IGES / IGS',
    fcstd: 'FreeCAD (.FCStd)',
  };
  return map[key] || key.toUpperCase();
}

export function applyTwoDLibraryFilters(designs, searchParams = {}) {
  let rows = Array.isArray(designs) ? [...designs] : [];
  const category = String(searchParams?.category || '').trim().toLowerCase();
  const sourceFormat = String(searchParams?.source_format || '').trim().toLowerCase();
  const freePaid = String(searchParams?.free_paid || '').trim().toLowerCase();

  if (category) {
    rows = rows.filter((design) => {
      const haystack = [
        design?.categories,
        design?.page_title,
        design?.part_name,
        design?.name,
        design?.search_term,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const categoryLabels = parseDesignCategories(design?.categories).map((c) => c.toLowerCase());
      return haystack.includes(category) || categoryLabels.some((c) => c.includes(category));
    });
  }

  if (sourceFormat) {
    rows = rows.filter((design) => {
      const ft = String(design?.file_type || '').toLowerCase();
      if (sourceFormat === 'step') return ft === 'step' || ft === 'stp';
      if (sourceFormat === 'iges') return ft === 'iges' || ft === 'igs';
      if (sourceFormat === 'fcstd') return ft === 'fcstd';
      return ft === sourceFormat;
    });
  }

  if (freePaid === 'free') {
    rows = rows.filter((design) => !design?.price);
  } else if (freePaid === 'paid') {
    rows = rows.filter((design) => Boolean(design?.price));
  }

  if (searchParams?.recently_generated === '1') {
    rows.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
  }

  return rows;
}

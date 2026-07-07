import { slugify } from '@/common.helper';

export const TWO_D_LIBRARY_BASE = '/library/2d-technical-drawings';

export const TWO_D_LIBRARY_TITLE =
  '2D Technical Drawing Library | PDF, SVG, DXF CAD Drawings | Marathon OS';

export const TWO_D_LIBRARY_DESCRIPTION =
  'Browse 2D technical drawings generated from 3D CAD models. Download engineering drawing sets with orthographic views, section cuts, PDF, SVG and DXF files.';

export const TWO_D_LIBRARY_H1 = '2D Technical Drawing Library';

export const TWO_D_LIBRARY_HUB_H1 = 'The 2D drawing library built from real 3D CAD models.';

export const TWO_D_LIBRARY_HUB_INTRO =
  'Browse engineering drawing sets generated from quality-checked 3D models. Every bundle includes orthographic views, section cuts and downloadable PDF, SVG and DXF files for review and documentation.';

export const TWO_D_LIBRARY_HUB_SEARCH_PLACEHOLDER =
  'Search by part, standard or drawing set — "bearing housing", "NEMA 17", "M8..."';

export const TWO_D_LIBRARY_INTRO =
  'Browse 2D technical drawings generated from 3D CAD models. Download drawing sets with orthographic views, section cuts and PDF, SVG and DXF files for engineering review and documentation.';

export const TWO_D_LIBRARY_HUB_CARDS = [
  {
    id: 'pdf-sets',
    title: 'Review & Approve',
    formats: 'PDF • PNG',
    description: 'Complete drawing packages for engineering review, sign-off and shop-floor reference.',
    browseLabel: 'Browse PDF drawing sets',
    href: '/library/2d-technical-drawings?output_format=PDF',
    accent: 'purple',
    icon: 'pdf',
    count: '1,240 PDF sets',
  },
  {
    id: 'vector-dxf',
    title: 'Cut & Profile',
    formats: 'DXF • SVG',
    description: 'Vector sheets and flat profiles ready for laser, waterjet, router and CAM workflows.',
    browseLabel: 'Browse DXF & SVG files',
    href: '/library/2d-technical-drawings?output_format=DXF',
    accent: 'teal',
    icon: 'dxf',
    count: '860 vector files',
  },
  {
    id: 'source-3d',
    title: 'Source from 3D',
    formats: 'STEP • IGES • STL',
    description: 'Start from the 3D CAD model library — every drawing set traces back to a real part.',
    browseLabel: 'Browse 3D CAD models',
    href: '/library',
    accent: 'orange',
    icon: 'cube',
    count: '10,000+ parts',
  },
];

export const TWO_D_DEFAULT_SHEET_LABEL = 'Up to 5 sheets';
export const TWO_D_DEFAULT_PROJECTION = '1st Angle';
export const TWO_D_DEFAULT_OUTPUT_FORMATS = 'PDF, SVG, DXF';
export const TWO_D_DRAWING_TYPE = '2D Technical Drawing';

export const TWO_D_POPULAR_CATEGORIES = [
  { slug: 'machine-design', label: 'Mechanical part drawings' },
  { slug: 'automotive', label: 'Automotive CAD drawings' },
  { slug: 'robotics', label: 'Robotics technical drawings' },
  { slug: 'industrial-design', label: 'Industrial component drawings' },
  { slug: '3d-printing', label: '3D printing drawing sets' },
  { slug: 'aerospace', label: 'Aerospace CAD drawings' },
];

export const TWO_D_SOURCE_FORMAT_FILTERS = [
  'STEP',
  'STP',
  'IGES',
  'IGS',
  'FCSTD',
];

export const TWO_D_SOURCE_FORMAT_FILTER_OPTIONS = TWO_D_SOURCE_FORMAT_FILTERS.map((value) => ({
  value,
  label: value,
}));

export const TWO_D_OUTPUT_FORMAT_FILTERS = ['PDF', 'SVG', 'DXF', 'PNG'];

export const TWO_D_OUTPUT_FORMAT_FILTER_OPTIONS = TWO_D_OUTPUT_FORMAT_FILTERS.map((value) => ({
  value,
  label: value,
}));

export const TWO_D_PROJECTION_FILTERS = [
  { value: '', label: 'Any' },
  { value: '1st-angle', label: '1st Angle' },
  { value: '3rd-angle', label: '3rd Angle' },
];

/** Price label for 2D library cards — uses 2d_price when set, otherwise Free. */
export function getTwoDPriceLabel(design) {
  const price = design?.['2d_price'];
  return price ? `$${price}` : 'Free';
}

/** Design routes contain a MongoDB ObjectId (24 hex chars); category slugs do not. */
export function isTwoDDesignRoute(segment) {
  return typeof segment === 'string' && /[a-f0-9]{24}/i.test(segment);
}

/** Path for 2D library listing (category/tag in path, same pattern as 3D library). */
export function get2DLibraryPath({ categoryName = null, tagName = null } = {}) {
  if (!categoryName && !tagName) return TWO_D_LIBRARY_BASE;
  if (categoryName && !tagName) {
    return `${TWO_D_LIBRARY_BASE}/${slugify(categoryName)}`;
  }
  if (!categoryName && tagName) {
    return `${TWO_D_LIBRARY_BASE}/tag/${slugify(tagName)}`;
  }
  return `${TWO_D_LIBRARY_BASE}/${slugify(categoryName)}/${slugify(tagName)}`;
}

export function get2DLibraryPathWithQuery({
  categoryName = null,
  tagName = null,
  search,
  page,
  sort,
  recency,
  free_paid,
  file_format,
  output_format,
  projection,
} = {}) {
  const path = get2DLibraryPath({ categoryName, tagName });
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (page && page > 1) params.set('page', String(page));
  if (sort) params.set('sort', sort);
  if (recency) params.set('recency', recency);
  if (free_paid) params.set('free_paid', free_paid);
  if (file_format) params.set('file_format', file_format);
  if (output_format) params.set('output_format', output_format);
  if (projection) params.set('projection', projection);
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

export function hasTwoDLibraryNarrowingFilters({
  category,
  tags,
  search,
  recency,
  free_paid,
  file_format,
  output_format,
  projection,
}) {
  return Boolean(
    (category && String(category).trim()) ||
      (tags && String(tags).trim()) ||
      (search && String(search).trim()) ||
      (recency && String(recency).trim()) ||
      (free_paid && String(free_paid).trim()) ||
      (file_format && String(file_format).trim()) ||
      (output_format && String(output_format).trim()) ||
      (projection && String(projection).trim())
  );
}

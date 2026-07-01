export const TWO_D_LIBRARY_TITLE =
  '2D Technical Drawing Library | PDF, SVG, DXF CAD Drawings | Marathon OS';

export const TWO_D_LIBRARY_DESCRIPTION =
  'Browse 2D technical drawings generated from 3D CAD models. Download engineering drawing sets with orthographic views, section cuts, PDF, SVG and DXF files.';

export const TWO_D_LIBRARY_H1 = '2D Technical Drawing Library';

export const TWO_D_LIBRARY_INTRO =
  'Browse 2D technical drawings generated from 3D CAD models. Download drawing sets with orthographic views, section cuts and PDF, SVG and DXF files for engineering review and documentation.';

export const TWO_D_DEFAULT_SHEET_LABEL = 'Up to 9 sheets';
export const TWO_D_DEFAULT_PROJECTION = '1st Angle';
export const TWO_D_DEFAULT_OUTPUT_FORMATS = 'PDF, SVG, DXF';
export const TWO_D_DRAWING_TYPE = '2D Technical Drawing';

export const TWO_D_POPULAR_CATEGORIES = [
  { slug: 'mechanical', label: 'Mechanical part drawings' },
  { slug: 'automotive', label: 'Automotive CAD drawings' },
  { slug: 'robotics', label: 'Robotics technical drawings' },
  { slug: 'industrial', label: 'Industrial component drawings' },
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

export const TWO_D_SHEET_COUNT_FILTERS = [
  { value: '', label: 'Any' },
  { value: '1-3', label: '1–3 sheets' },
  { value: '4-6', label: '4–6 sheets' },
  { value: '7-9', label: '7–9 sheets' },
];

export const TWO_D_PROJECTION_FILTERS = [
  { value: '', label: 'Any' },
  { value: '1st-angle', label: '1st Angle' },
  { value: '3rd-angle', label: '3rd Angle' },
];

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
  sheet_count,
  projection,
} = {}) {
  const base = '/library/2d-technical-drawings';
  const params = new URLSearchParams();
  if (categoryName) params.set('category', categoryName);
  if (tagName) params.set('tags', tagName);
  if (search) params.set('search', search);
  if (page && page > 1) params.set('page', String(page));
  if (sort) params.set('sort', sort);
  if (recency) params.set('recency', recency);
  if (free_paid) params.set('free_paid', free_paid);
  if (file_format) params.set('file_format', file_format);
  if (output_format) params.set('output_format', output_format);
  if (sheet_count) params.set('sheet_count', sheet_count);
  if (projection) params.set('projection', projection);
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

export function hasTwoDLibraryNarrowingFilters({
  category,
  tags,
  search,
  recency,
  free_paid,
  file_format,
  output_format,
  sheet_count,
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
      (sheet_count && String(sheet_count).trim()) ||
      (projection && String(projection).trim())
  );
}

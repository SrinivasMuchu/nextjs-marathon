/** Public 3D library Output filter values (URL ?output=). */
export const LIBRARY_OUTPUT_SOLIDS = 'solids';
export const LIBRARY_OUTPUT_MESHES = 'meshes';
export const LIBRARY_OUTPUT_2D = '2d';

export const LIBRARY_OUTPUT_VALUES = [
  LIBRARY_OUTPUT_SOLIDS,
  LIBRARY_OUTPUT_MESHES,
  LIBRARY_OUTPUT_2D,
];

export const SOLID_FILE_FORMATS = ['STEP', 'STP', 'IGES', 'IGS', 'BREP', 'BRP'];
export const MESH_FILE_FORMATS = ['STL', 'OBJ', 'PLY', 'OFF'];

export function normalizeLibraryOutput(value) {
  const v = String(value || '').trim().toLowerCase();
  if (v === 'solids' || v === 'solid') return LIBRARY_OUTPUT_SOLIDS;
  if (v === 'meshes' || v === 'mesh') return LIBRARY_OUTPUT_MESHES;
  if (['2d', '2dims', 'two_dims', 'two-dims'].includes(v)) return LIBRARY_OUTPUT_2D;
  return '';
}

function formatsFromQuery(fileFormat) {
  return String(fileFormat || '')
    .split(',')
    .map((f) => f.trim().toUpperCase())
    .filter(Boolean);
}

function sameFormatSet(formats, group) {
  if (!formats.length || formats.length < 2) return false;
  const groupSet = new Set(group);
  return formats.every((f) => groupSet.has(f));
}

/** Infer Output from a comma-separated file_format list, if it maps to a group. */
export function inferOutputFromFileFormats(fileFormat) {
  const formats = formatsFromQuery(fileFormat);
  if (sameFormatSet(formats, SOLID_FILE_FORMATS)) return LIBRARY_OUTPUT_SOLIDS;
  if (sameFormatSet(formats, MESH_FILE_FORMATS)) return LIBRARY_OUTPUT_MESHES;
  return '';
}

export function inferLibraryOutput({ output, file_format, two_dims } = {}) {
  const fromParam = normalizeLibraryOutput(output);
  if (fromParam) return fromParam;
  if (['1', 'true', 'yes'].includes(String(two_dims || '').trim().toLowerCase())) {
    return LIBRARY_OUTPUT_2D;
  }
  return inferOutputFromFileFormats(file_format);
}

/** Map Output group → API filters (file_format / two_dims). */
export function libraryOutputToApiFilters(output) {
  const type = normalizeLibraryOutput(output);
  if (type === LIBRARY_OUTPUT_SOLIDS) {
    return { file_format: SOLID_FILE_FORMATS.join(','), two_dims: '' };
  }
  if (type === LIBRARY_OUTPUT_MESHES) {
    return { file_format: MESH_FILE_FORMATS.join(','), two_dims: '' };
  }
  if (type === LIBRARY_OUTPUT_2D) {
    return { file_format: '', two_dims: '1' };
  }
  return { file_format: '', two_dims: '' };
}

export function isLibraryOutputValue(value) {
  return LIBRARY_OUTPUT_VALUES.includes(normalizeLibraryOutput(value));
}

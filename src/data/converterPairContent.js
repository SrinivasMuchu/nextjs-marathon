import { converterTypes } from '@/common.helper'

const FORMAT_INFO = {
  step: {
    name: 'STEP model',
    family: 'Parametric CAD',
    purpose: 'CAD exchange, manufacturing and editable engineering geometry',
    geometry: 'B-rep solids and surfaces',
    texture: 'Not normally included',
    materials: 'Basic product data may be retained',
    groups: 'Assemblies and product structure may be retained',
    tools: 'SolidWorks, Fusion 360, Inventor and CAD/CAM tools',
  },
  iges: {
    name: 'IGES model',
    family: 'Surface CAD',
    purpose: 'Legacy CAD exchange and surface-based engineering workflows',
    geometry: 'Curves, trimmed surfaces and wireframes',
    texture: 'Not supported',
    materials: 'Limited support',
    groups: 'Layer and entity structure may vary',
    tools: 'Legacy CAD, CAM and surface-modelling tools',
  },
  obj: {
    name: 'Wavefront OBJ',
    family: 'Polygon mesh',
    purpose: '3D modelling, rendering and asset exchange',
    geometry: 'Polygonal mesh',
    texture: 'Supported through referenced assets',
    materials: 'Can use an accompanying MTL file',
    groups: 'Can contain named objects and groups',
    tools: 'Blender, Maya and rendering tools',
  },
  ply: {
    name: 'PLY mesh',
    family: 'Scan / polygon data',
    purpose: '3D scanning, point clouds and mesh interchange',
    geometry: 'Vertices, faces and optional point data',
    texture: 'Vertex colours may be supported',
    materials: 'No standard material workflow',
    groups: 'Limited object hierarchy',
    tools: 'MeshLab, scanners and geometry-processing tools',
  },
  stl: {
    name: 'STL mesh',
    family: 'Triangular mesh',
    purpose: '3D printing, slicing and rapid prototyping',
    geometry: 'Triangular surface mesh',
    texture: 'Not supported in standard STL',
    materials: 'Not supported in standard STL',
    groups: 'Does not retain named object groups',
    tools: 'Cura, PrusaSlicer and 3D printers',
  },
  off: {
    name: 'OFF mesh',
    family: 'Polygon mesh',
    purpose: 'Geometry research, mesh processing and interchange',
    geometry: 'Polygon vertices and faces',
    texture: 'Not normally supported',
    materials: 'Not normally supported',
    groups: 'Single geometry-oriented dataset',
    tools: 'Research and computational geometry tools',
  },
  brep: {
    name: 'BREP solid',
    family: 'Boundary representation',
    purpose: 'Solid modelling, topology and CAD kernel workflows',
    geometry: 'Faces, edges, vertices and solid topology',
    texture: 'Not normally included',
    materials: 'Application dependent',
    groups: 'Body topology is retained where supported',
    tools: 'OpenCascade and solid-modelling CAD systems',
  },
  '3dm': {
    name: 'Rhino 3DM',
    family: 'Rhino / OpenNURBS',
    purpose: 'Rhino modelling, NURBS surfacing and mixed geometry',
    geometry: 'NURBS, solids, curves and meshes',
    texture: 'May contain texture references',
    materials: 'Rhino materials may be included',
    groups: 'Layers and object groups may be included',
    tools: 'Rhino and OpenNURBS-compatible tools',
  },
  dwg: {
    name: 'AutoCAD DWG',
    family: '2D CAD drawing',
    purpose: 'Native AutoCAD drafting and documentation',
    geometry: '2D entities, layers and annotations',
    texture: 'Not applicable',
    materials: 'Not applicable',
    groups: 'Layers and drawing blocks',
    tools: 'AutoCAD and DWG-compatible drafting tools',
  },
  dxf: {
    name: 'DXF drawing',
    family: 'Drawing exchange',
    purpose: 'Open 2D CAD exchange, CAM and drafting handoff',
    geometry: '2D entities, layers and annotations',
    texture: 'Not applicable',
    materials: 'Not applicable',
    groups: 'Layers and drawing blocks',
    tools: 'CAD, CAM and vector drafting tools',
  },
}

const FORMAT_HERO = {
  step: {
    article: 'a',
    label: 'STEP',
    extensions: '.step or .stp',
    kind: 'CAD model',
    into: 'into STEP (.step or .stp) for mechanical CAD exchange and downstream engineering workflows',
  },
  iges: {
    article: 'an',
    label: 'IGES',
    extensions: '.iges or .igs',
    kind: 'CAD model',
    into: 'into IGES (.iges or .igs) for legacy CAD/CAM compatibility and surface exchange',
  },
  brep: {
    article: 'a',
    label: 'BREP',
    extensions: '.brep',
    kind: 'CAD model',
    into: 'into BREP (.brep) for Open CASCADE geometry processing and topology-based CAD workflows',
  },
  obj: {
    article: 'an',
    label: 'OBJ',
    extensions: '.obj',
    kind: 'mesh',
    into: 'into an OBJ (.obj) mesh for 3D visualization, rendering and polygon-mesh workflows',
  },
  ply: {
    article: 'a',
    label: 'PLY',
    extensions: '.ply',
    kind: 'mesh',
    into: 'into a PLY (.ply) mesh for 3D scanning, colored meshes and point-cloud workflows',
  },
  stl: {
    article: 'an',
    label: 'STL',
    extensions: '.stl',
    kind: 'mesh',
    into: 'into an STL (.stl) mesh for 3D printing, slicing and rapid prototyping',
  },
  off: {
    article: 'an',
    label: 'OFF',
    extensions: '.off',
    kind: 'mesh',
    into: 'into an OFF (.off) mesh for computational geometry and lightweight polygon-mesh exchange',
  },
  '3dm': {
    article: 'a',
    label: '3DM',
    extensions: '.3dm',
    kind: 'CAD model',
    into: 'into Rhino 3DM (.3dm) for Rhino, Grasshopper and OpenNURBS workflows',
  },
  dxf: {
    article: 'a',
    label: 'DXF',
    extensions: '.dxf',
    kind: 'drawing',
    into: 'into DXF (.dxf) for cross-application drawing exchange, CAM and CNC workflows',
  },
  dwg: {
    article: 'a',
    label: 'DWG',
    extensions: '.dwg',
    kind: 'drawing',
    into: 'into DWG (.dwg) for native AutoCAD editing and production drawing workflows',
  },
}

const MESH_FORMATS = new Set(['obj', 'ply', 'stl', 'off'])
const DRAWING_FORMATS = new Set(['dwg', 'dxf'])
const CAD_FORMATS = new Set(['step', 'iges', 'brep'])

const CAD_TRANSLATE_SENTENCE =
  'The converter translates compatible curves, surfaces, solids and topology while preserving engineering geometry wherever the destination format supports it.'
const MESH_TESSELLATE_SENTENCE =
  "The converter tessellates the model's exact curves and surfaces into polygonal geometry that can be downloaded and inspected in your browser."
const RHINO_SENTENCE =
  'Compatible solids, shells, surfaces and curves are translated into Rhino-readable geometry without requiring desktop CAD software.'
const DRAWING_UPLOAD_SENTENCE =
  'Upload the file directly in your browser without installing AutoCAD or another desktop converter.'

function getPairOneLiner(from, to) {
  const path = `/${from}-to-${to}`
  return converterTypes.find((item) => item.path === path)?.oneLiner || `Convert ${from.toUpperCase()} to ${to.toUpperCase()} online.`
}

function getHeroSourcePhrase(from) {
  const info = FORMAT_HERO[from]
  if (!info) return `a ${from.toUpperCase()} file`
  return `${info.article} ${info.label} (${info.extensions}) ${info.kind}`
}

function getHeroDescription(from, to) {
  const source = getHeroSourcePhrase(from)
  const toInfo = FORMAT_HERO[to]

  if (from === 'dxf' && to === 'dwg') {
    return `Convert a DXF (.dxf) drawing into DWG (.dwg) for native AutoCAD editing and production drawing workflows. ${DRAWING_UPLOAD_SENTENCE}`
  }
  if (from === 'dwg' && to === 'dxf') {
    return `Convert a DWG (.dwg) drawing into DXF (.dxf) for cross-application drawing exchange, CAM and CNC workflows. ${DRAWING_UPLOAD_SENTENCE}`
  }
  if (DRAWING_FORMATS.has(from) || DRAWING_FORMATS.has(to)) {
    const into = toInfo?.into || `into ${to.toUpperCase()}`
    return `Convert ${source} ${into}. ${DRAWING_UPLOAD_SENTENCE}`
  }
  if (to === '3dm') {
    return `Convert ${source} ${toInfo.into}. ${RHINO_SENTENCE}`
  }
  if (MESH_FORMATS.has(to) && !MESH_FORMATS.has(from)) {
    return `Convert ${source} ${toInfo.into}. ${MESH_TESSELLATE_SENTENCE}`
  }
  if (CAD_FORMATS.has(to) || (!MESH_FORMATS.has(to) && toInfo)) {
    const into = toInfo?.into || `into ${to.toUpperCase()}`
    return `Convert ${source} ${into}. ${CAD_TRANSLATE_SENTENCE}`
  }

  return `Convert ${source} into ${to.toUpperCase()} online. Upload your file in the browser and download the converted result without installing desktop CAD software.`
}

function getBehavior(from, to) {
  const fromUpper = from.toUpperCase()
  const toUpper = to.toUpperCase()
  const toIsMesh = MESH_FORMATS.has(to)
  const fromIsMesh = MESH_FORMATS.has(from)
  const isDrawing = DRAWING_FORMATS.has(from) || DRAWING_FORMATS.has(to)

  if (isDrawing) {
    return {
      summary: `${fromUpper} and ${toUpper} are drawing formats, but application-specific objects, fonts and metadata may be represented differently during exchange.`,
      retained: ['2D linework and common entities', 'Drawing scale where supported', 'Standard layers', 'Basic dimensions and annotations'],
      changed: ['Application-specific objects', 'Custom fonts and line types', 'External references', 'Unsupported metadata'],
      note: `Review the converted ${toUpper} drawing for fonts, dimensions and application-specific entities before production use.`,
    }
  }

  if (toIsMesh && !fromIsMesh) {
    return {
      summary: `${fromUpper} engineering geometry is tessellated into the polygonal surface structure used by ${toUpper}. The visible shape is preserved, but parametric CAD intelligence is not.`,
      retained: ['Overall 3D shape', 'Vertices and surface geometry', 'Tessellated faces', 'Model orientation where supported'],
      changed: ['Parametric feature history', 'Editable sketches and constraints', 'Assembly intelligence', 'CAD metadata not supported by the mesh'],
      note: `${toUpper} is a mesh output. Keep the source ${fromUpper} file whenever editable engineering geometry may be needed later.`,
    }
  }

  if (fromIsMesh && !toIsMesh) {
    return {
      summary: `${fromUpper} starts as polygonal surface data. Conversion packages that geometry for ${toUpper}, but it cannot recreate the original parametric feature history automatically.`,
      retained: ['Visible surface shape', 'Mesh vertices and faces', 'Model orientation', 'Closed geometry where supported'],
      changed: ['Original feature history', 'Native sketches and constraints', 'Exact analytic surfaces', 'Unsupported texture or material data'],
      note: `The resulting ${toUpper} file is based on the source mesh. Complex reverse-engineering work may still be required for a fully editable native CAD model.`,
    }
  }

  return {
    summary: `${fromUpper} and ${toUpper} describe geometry differently. Conversion preserves compatible shape and topology while translating or omitting format-specific data.`,
    retained: ['Overall model shape', 'Compatible geometry', 'Model orientation', 'Supported topology and layers'],
    changed: ['Format-specific metadata', 'Unsupported materials or textures', 'Application-specific features', 'Data without a target-format equivalent'],
    note: `Keep the original ${fromUpper} file as the source of truth and inspect the converted ${toUpper} file before downstream production use.`,
  }
}

export function getConverterPairContent(conversionParams) {
  const [from = '', to = ''] = String(conversionParams || '').toLowerCase().split('-to-')
  const fromInfo = FORMAT_INFO[from] || {
    name: `${from.toUpperCase()} file`,
    family: 'CAD format',
    purpose: 'CAD and engineering workflows',
    geometry: 'Format-specific geometry',
    texture: 'Format dependent',
    materials: 'Format dependent',
    groups: 'Format dependent',
    tools: 'Compatible CAD tools',
  }
  const toInfo = FORMAT_INFO[to] || {
    name: `${to.toUpperCase()} file`,
    family: 'CAD format',
    purpose: 'CAD and engineering workflows',
    geometry: 'Format-specific geometry',
    texture: 'Format dependent',
    materials: 'Format dependent',
    groups: 'Format dependent',
    tools: 'Compatible CAD tools',
  }

  return {
    from,
    to,
    fromUpper: from.toUpperCase(),
    toUpper: to.toUpperCase(),
    fromInfo,
    toInfo,
    oneLiner: getPairOneLiner(from, to),
    heroDescription: getHeroDescription(from, to),
    behavior: getBehavior(from, to),
  }
}

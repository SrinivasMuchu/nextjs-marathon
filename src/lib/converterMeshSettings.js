/**
 * Shared converter quality presets (solid → mesh).
 * Maps UI choices to FreeCAD tessellation deflection + face caps.
 */

export const TESSELLATION_PRESETS = {
  draft: {
    id: "draft",
    label: "Draft",
    description: "Fast preview, fewer triangles",
    linearDeflection: 2.5,
  },
  balanced: {
    id: "balanced",
    label: "Balanced",
    description: "Recommended for most models",
    linearDeflection: 1.0,
  },
  detailed: {
    id: "detailed",
    label: "Detailed",
    description: "More detail and larger output",
    linearDeflection: 0.35,
  },
};

export const TRIANGLE_TARGET_OPTIONS = [
  { value: "auto", label: "Automatic — recommended", maxFaces: 100000 },
  { value: "100000", label: "100,000 triangles", maxFaces: 100000 },
  { value: "250000", label: "250,000 triangles", maxFaces: 250000 },
  { value: "500000", label: "500,000 triangles", maxFaces: 500000 },
  { value: "1000000", label: "1,000,000 triangles", maxFaces: 1000000 },
  { value: "custom", label: "Custom target", maxFaces: null },
];

export const SOLID_INPUT_EXTS = new Set([
  "step",
  "stp",
  "iges",
  "igs",
  "brep",
  "brp",
]);

export const MESH_OUTPUT_EXTS = new Set(["stl", "obj", "ply", "off", "3dm"]);

export function normalizeExt(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/^\./, "");
}

/** Configure (tessellation UI) only for solid → mesh */
export function needsMeshConfigure(inputFormat, outputFormat) {
  return (
    SOLID_INPUT_EXTS.has(normalizeExt(inputFormat)) &&
    MESH_OUTPUT_EXTS.has(normalizeExt(outputFormat))
  );
}

export function resolveMeshExportSettings({
  tessellationQuality = "balanced",
  triangleTarget = "auto",
  customMaxTriangles = null,
} = {}) {
  const preset =
    TESSELLATION_PRESETS[tessellationQuality] || TESSELLATION_PRESETS.balanced;

  let maxFaces = 100000;
  if (triangleTarget === "custom") {
    const n = Number(customMaxTriangles);
    maxFaces = Number.isFinite(n) && n > 1000 ? Math.round(n) : 100000;
  } else {
    const opt = TRIANGLE_TARGET_OPTIONS.find((o) => o.value === triangleTarget);
    maxFaces = opt?.maxFaces || 100000;
  }

  return {
    tessellation_quality: preset.id,
    linear_deflection: preset.linearDeflection,
    max_mesh_faces: maxFaces,
    triangle_target: triangleTarget,
  };
}

export const CONVERT_STAGES = [
  {
    id: "UPLOADINGFILE",
    label: "Upload source file",
  },
  {
    id: "READING",
    label: "Read STEP bodies and surfaces",
  },
  {
    id: "TESSELLATING",
    label: "Tessellate surfaces",
  },
  {
    id: "INTEGRITY_CHECK",
    label: "Run mesh integrity checks",
  },
  {
    id: "PREVIEW_REPORT",
    label: "Generate STL preview and report",
  },
];

/** Top-level funnel steps matching product UI */
export const FUNNEL_STEPS = [
  { id: "upload", label: "Upload" },
  { id: "configure", label: "Configure" },
  { id: "convert", label: "Convert & check" },
  { id: "pay", label: "Pay" },
  { id: "download", label: "Download" },
];

export const NOTIFY_WHEN_DONE =
  "Once done, you will be notified. Feel free to leave this tab — your file will be ready in Dashboard → CAD Converter.";

export function funnelStepIndex(stepId) {
  const idx = FUNNEL_STEPS.findIndex((s) => s.id === stepId);
  return idx >= 0 ? idx : 0;
}

export function stageIndexFromStatus(status, convertStage) {
  const key = String(convertStage || status || "").toUpperCase();
  if (key === "UPLOADINGFILE") return 0;
  if (key === "PENDING" || key === "READING") return 1;
  if (key === "PROCESSING" || key === "TESSELLATING") return 2;
  if (key === "INTEGRITY_CHECK") return 3;
  if (key === "PREVIEW_REPORT" || key === "UPLOADING") return 4;
  if (key === "COMPLETED") return 5;
  return 1;
}

export function stageProgressPercent(status, convertStage, uploadProgressPercent) {
  const key = String(convertStage || status || "").toUpperCase();
  if (key === "UPLOADINGFILE") {
    return Math.min(100, Math.max(0, Number(uploadProgressPercent) || 0));
  }
  const map = {
    PENDING: 18,
    READING: 28,
    PROCESSING: 45,
    TESSELLATING: 62,
    INTEGRITY_CHECK: 78,
    PREVIEW_REPORT: 90,
    UPLOADING: 90,
    COMPLETED: 100,
  };
  return map[key] ?? 20;
}

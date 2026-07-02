function formatGeneratedDate(savedAtUtc) {
  if (!savedAtUtc) return "—";
  const d = new Date(savedAtUtc);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function countSections(entries) {
  if (!Array.isArray(entries)) return 0;
  return entries.filter(
    (e) => /section/i.test(e?.label || "") || /^section/i.test(e?.view_name || "")
  ).length;
}

function uniqueViews(entries) {
  if (!Array.isArray(entries)) return 0;
  return new Set(entries.map((e) => e?.view_name).filter(Boolean)).size;
}

export function buildTwoDDrawingHeroStats({
  sheetCount = 0,
  viewCount = 0,
  sectionCount = 0,
  generatedDate = "—",
  sourceCadFormat = "STEP",
  sourceModelTitle = "",
  sourceModelHref = "",
}) {
  const format = String(sourceCadFormat || "STEP").trim().toUpperCase() || "STEP";
  const modelTitle = String(sourceModelTitle || "").trim() || "View 3D model";

  return [
    { value: String(sheetCount), label: "Drawing sheets" },
    { value: String(viewCount), label: "Views analysed" },
    { value: "3", label: "Export formats" },
    { value: String(sectionCount), label: "Section cuts" },
    { value: "1st Angle", label: "Projection type" },
    { value: generatedDate, label: "Generated date" },
    { value: format, label: "Source CAD format" },
    {
      value: modelTitle,
      label: "Source 3D model",
      href: sourceModelHref || undefined,
    },
  ];
}

export function buildTwoDDrawingHeroStatsFromGeometry(
  geometryPerSheet,
  { savedAtUtc, sourceCadFormat, sourceModelTitle, sourceModelHref } = {}
) {
  const entries =
    geometryPerSheet && typeof geometryPerSheet === "object"
      ? Object.values(geometryPerSheet)
      : [];

  return buildTwoDDrawingHeroStats({
    sheetCount: entries.length,
    viewCount: uniqueViews(entries),
    sectionCount: countSections(entries),
    generatedDate: formatGeneratedDate(savedAtUtc),
    sourceCadFormat,
    sourceModelTitle,
    sourceModelHref,
  });
}

export function buildTwoDDrawingHeroTitle(productName) {
  const name = String(productName || "Product").trim();
  return `${name} 2D Technical Drawing Set`;
}

export const TWO_D_DRAWING_TRANSPARENCY_INTRO = [
  "These drawings were generated from the source 3D CAD geometry. The system analysed the model, selected relevant views, planned section cuts and generated drawing sheets in PDF, SVG and DXF formats.",
];

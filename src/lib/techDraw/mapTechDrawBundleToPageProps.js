/**
 * Maps CloudFront freecad-techdraw JSON into props for TwoDTechnicalDrawingPage / TwoDTechnicalDrawingContent.
 * Shapes: dimension_specs.json, dimensions_response.json, geometry_per_sheet.json, view_selection_response.json.
 */

function sortGeometryKeys(geometryPerSheet) {
  if (!geometryPerSheet || typeof geometryPerSheet !== "object") return [];
  return Object.keys(geometryPerSheet).sort(
    (a, b) => Number(a) - Number(b) || String(a).localeCompare(String(b))
  );
}

function normalizeGeometryEntries(geometryPerSheet) {
  const keys = sortGeometryKeys(geometryPerSheet);
  return keys.map((k) => {
    const g = geometryPerSheet[k] || {};
    const edges = g.geometry?.edges;
    const edgeCount = Array.isArray(edges) ? edges.length : 0;
    return {
      key: k,
      sheet_num: g.sheet_num ?? Number(k),
      view_name: g.view_name || "",
      label: g.label || `Sheet ${k}`,
      edgeCount,
    };
  });
}

function countDimensionIds(dimensionSpecs) {
  if (!dimensionSpecs || typeof dimensionSpecs !== "object") return 0;
  return Object.values(dimensionSpecs).reduce((sum, arr) => {
    return sum + (Array.isArray(arr) ? arr.length : 0);
  }, 0);
}

function uniqueViews(entries) {
  return new Set(entries.map((e) => e.view_name).filter(Boolean)).size;
}

/** Order: published sheet vectors first, then raster previews if present. */
function sheetPreviewCandidates(baseUrl, sheetNum) {
  const n = Number(sheetNum);
  return [
    `${baseUrl}/svg/sheet_${n}.svg`,
    `${baseUrl}/screenshots/sheet_${n}.png`,
    `${baseUrl}/png_dim/sheet_${n}.png`,
  ];
}

function sheetAssetPaths(baseUrl, sheetNum) {
  const n = Number(sheetNum);
  return {
    pdf: `${baseUrl}/sheet_${n}.pdf`,
    svg: `${baseUrl}/svg/sheet_${n}.svg`,
    dxf: `${baseUrl}/dxf/sheet_${n}.dxf`,
  };
}

function pipelineMeta(dimensionsResponse, viewSelectionResponse) {
  const d =
    dimensionsResponse && typeof dimensionsResponse === "object"
      ? dimensionsResponse
      : null;
  const v =
    viewSelectionResponse && typeof viewSelectionResponse === "object"
      ? viewSelectionResponse
      : null;
  return {
    stage: d?.stage || v?.stage || "pipeline",
    provider: d?.provider || v?.provider || "",
    model: d?.model || v?.model || "",
    saved_at_utc: d?.saved_at_utc || v?.saved_at_utc || "",
  };
}

function sectionEntries(entries) {
  return entries.filter(
    (e) => /section/i.test(e.label) || /^section/i.test(e.view_name)
  );
}

function deriveProductTitle(entries) {
  if (!entries.length) return "Technical drawing";
  const first = entries[0].label.split(" - ")[0]?.trim() || entries[0].label;
  return first;
}

function resolveProductTitle(entries, designMeta) {
  const dbTitle = String(designMeta?.page_title || "").trim();
  if (dbTitle) return dbTitle;
  const dbPartName = String(designMeta?.part_name || "").trim();
  if (dbPartName) return dbPartName;
  return deriveProductTitle(entries);
}

function badgeKeyForEntry(entry) {
  if (/section/i.test(entry.label) || /^section/i.test(entry.view_name)) return "ortho";
  if (/iso/i.test(entry.view_name) || /iso/i.test(entry.label)) return "iso";
  if (/hidden/i.test(entry.label)) return "hidden";
  return "ortho";
}

function buildViewCards(entries, baseUrl) {
  return entries.map((e) => {
    const previewCandidates = sheetPreviewCandidates(baseUrl, e.sheet_num);
    return {
      title: e.label,
      badgeKey: badgeKeyForEntry(e),
      source: `geometry_per_sheet.json → sheet ${e.sheet_num} (${e.view_name})`,
      body: `This sheet includes ${e.edgeCount} geometry edges from the CAD projection pipeline. Dimension IDs for this sheet are listed in dimension_specs.json.`,
      imageSrc: previewCandidates[0],
      previewCandidates,
    };
  });
}

function sectionSymbolFromLabel(label) {
  const m = label.match(/section\s*([A-Z])\s*[-–—]\s*\1/i);
  if (m) return `${m[1]} — ${m[1]}`;
  if (/A-A/i.test(label)) return "A — A";
  if (/B-B/i.test(label)) return "B — B";
  return label.slice(0, 12);
}

function buildSectionDetailGroups(entries, dimensionSpecs) {
  const sections = sectionEntries(entries);
  if (sections.length < 2) return [];

  const dimNote = dimensionSpecs
    ? "Dimension selection IDs for section sheets are included in dimension_specs.json."
    : "";

  return [
    {
      srcTag:
        'drawing_config.py → DRAWING_CONFIG_SEMANTIC["sheet_*"]["section_a"] and ["section_b"] (see pipeline output)',
      variant: "section",
      cards: sections.slice(0, 2).map((e, idx) => ({
        symbol: sectionSymbolFromLabel(e.label),
        label: `section_${String.fromCharCode(97 + idx)} · ${e.view_name}`,
        meta: `sheet_num: ${e.sheet_num} · edges: ${e.edgeCount}`,
        description: `${e.label}. ${dimNote} Geometry is derived from the 3D model projection for this drawing set.`,
        bullets: [
          `${e.edgeCount} resolved edges in sheet geometry`,
          "See technical_drawing_simple.pdf, sheet_N.pdf, and svg/ for full graphical context",
          "Verify critical dimensions against the source CAD before manufacturing",
        ],
      })),
    },
  ];
}

function buildSheetDownloadRows(entries, baseUrl) {
  return entries.map((e) => {
    const paths = sheetAssetPaths(baseUrl, e.sheet_num);
    return {
      name: e.label,
      pdf: paths.pdf,
      svg: paths.svg,
      dxf: paths.dxf,
    };
  });
}

function buildDrawingInfo(entries, dimensionsResponse, viewSelectionResponse) {
  const sections = sectionEntries(entries);
  const meta = pipelineMeta(dimensionsResponse, viewSelectionResponse);
  const saved = meta.saved_at_utc;
  const dateStr = saved
    ? new Date(saved).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return {
    viewsAnalysed: uniqueViews(entries),
    sheetsGenerated: entries.length,
    sectionCuts: sections.length,
    exportFormats: 3,
    generatedLabel: dateStr
      ? `Generated: ${dateStr} · Projection: First Angle`
      : "Projection: First Angle",
  };
}

function buildTransparencyMeta(entries, dimensionsResponse, viewSelectionResponse /* , bomRows */) {
  const sections = sectionEntries(entries);
  const meta = pipelineMeta(dimensionsResponse, viewSelectionResponse);
  const saved = meta.saved_at_utc;
  const dateDisplay = saved
    ? new Date(saved).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return [
    { value: String(uniqueViews(entries)), label: "Views Analysed" },
    { value: String(entries.length), label: "Sheets Generated" },
    { value: String(sections.length), label: "Section Cuts" },
    // { value: String(bomRows?.length ?? 0), label: "BOM Items" },
    { value: "3", label: "Export Formats" },
    { value: dateDisplay, label: "Generated" },
  ];
}

function buildTransparencyIntro(
  dimensionsResponse,
  viewSelectionResponse,
  dimensionSpecs,
  totalDimIds
) {
  const meta = pipelineMeta(dimensionsResponse, viewSelectionResponse);
  const stage = meta.stage || "pipeline";
  const provider = meta.provider || "";
  const model = meta.model || "";
  const saved = meta.saved_at_utc || "";
  const vsNote = viewSelectionResponse
    ? " View selection metadata is in view_selection_response.json."
    : "";

  return [
    `Pipeline stage: ${stage}.${provider ? ` Provider: ${provider}.` : ""}${model ? ` Model: ${model}.` : ""}${saved ? ` Saved ${saved}.` : ""}${vsNote}`,
    `dimension_specs.json maps ${totalDimIds} dimension IDs across sheets. geometry_per_sheet.json stores per-sheet labels, views, and extracted edge geometry. Assets are published under svg/, dxf/, sheet_N.pdf, and technical_drawing_simple.pdf.`,
  ];
}

function buildAiAnalysisSources(viewSelectionResponse, totalDimIds) {
  const vs = viewSelectionResponse;
  return [
    {
      icon: "🎯",
      iconMods: [],
      title: "view_selection_response.json",
      description: vs
        ? `Stage 2 view selection (${vs.provider || "LLM"} · ${vs.model || "model"}), saved ${vs.saved_at_utc || "—"}.`
        : "AI-selected views for this drawing set when Stage 2 JSON is present in the bundle.",
    },
    {
      icon: "{ }",
      iconMods: ["itemIconBlue", "itemIconMono"],
      title: "dimension_specs.json + geometry_per_sheet.json",
      description: `${totalDimIds} dimension references and per-sheet projection geometry for this design.`,
    },
    {
      icon: "📦",
      iconMods: ["itemIconPurple"],
      title: "svg/ · dxf/ · PDFs",
      description:
        "Per-sheet SVG and DXF files plus sheet_N.pdf files and technical_drawing_simple.pdf at the bundle root.",
    },
  ];
}

/*
function normalizeBomRows(bom) {
  if (!Array.isArray(bom) || bom.length === 0) return [];
  return bom.map((row) => {
    if (Array.isArray(row) && row.length >= 3) return [row[0], row[1], String(row[2])];
    if (row && typeof row === "object") {
      const part = row.part || row.name || row.component || "";
      const mat = row.material || row.mat || "";
      const qty = row.qty ?? row.quantity ?? "";
      return [part, mat, String(qty)];
    }
    return null;
  }).filter(Boolean);
}
*/

/**
 * @param {string} designId
 * @param {Awaited<ReturnType<import('./fetchTechDrawBundle.js').fetchTechDrawBundle>>} bundle
 */
export function mapTechDrawBundleToPageProps(designId, bundle) {
  const {
    baseUrl,
    dimensionSpecs,
    dimensionsResponse,
    geometryPerSheet,
    viewSelectionResponse,
    designMeta,
    // bom,
  } = bundle;

  const entries = normalizeGeometryEntries(geometryPerSheet);
  const totalDimIds = countDimensionIds(dimensionSpecs);
  const productTitle = resolveProductTitle(entries, designMeta);
  const title = `${productTitle} — 2D Technical Drawing Set`;
  const designRoute = String(designMeta?.route || "").trim();
  const designLibraryHref = designRoute
    ? `/library/${encodeURIComponent(designRoute)}`
    : `/library/${designId}`;
  const drawingPageHref = `${designLibraryHref}/2d-technical-drawing/${designId}`;

  const sectionCount = sectionEntries(entries).length;
  // const bomRows = normalizeBomRows(bom);

  const stats = [
    { value: String(entries.length), label: "Drawing Sheets" },
    { value: String(uniqueViews(entries)), label: "Views Analysed" },
    { value: "3", label: "Export Formats" },
    { value: String(sectionCount), label: "Section Cuts" },
    // { value: String(bomRows.length), label: "BOM Items" },
    { value: "1st Angle", label: "Projection" },
  ];

  const sheets = entries.map((e) => {
    const previewCandidates = sheetPreviewCandidates(baseUrl, e.sheet_num);
    const assets = sheetAssetPaths(baseUrl, e.sheet_num);
    return {
      src: previewCandidates[0],
      previewCandidates,
      dxfUrl: assets.dxf,
      label: e.label,
    };
  });

  const sheetDownloadRows = buildSheetDownloadRows(entries, baseUrl);

  return {
    designId,
    baseUrl,
    breadcrumbLinks: [
      { label: "Library", href: "/library" },
      {
        label: productTitle,
        href: designLibraryHref,
      },
      { label: "2D Technical Drawings", href: drawingPageHref },
    ],
    heroProps: {
      title,
      tags: [],
      stats,
      showBadges: true,
    },
    sheets,
    cadModelHref: designLibraryHref,
    generateHref: "/generate",
    pdfHref: `/api/techdraw-pdf-bundle?designId=${encodeURIComponent(designId)}`,
    freecadHref: `${baseUrl}/technical_drawing_simple.FCStd`,
    zipHref: `/api/techdraw-bundle-zip?designId=${encodeURIComponent(designId)}`,
    drawingInfo: buildDrawingInfo(entries, dimensionsResponse, viewSelectionResponse),
    aiAnalysisSources: buildAiAnalysisSources(viewSelectionResponse, totalDimIds),
    viewCards: buildViewCards(entries, baseUrl),
    sectionDetailGroups: buildSectionDetailGroups(entries, dimensionSpecs),
    // bomRows,
    sheetDownloadRows,
    transparencyMetaStats: buildTransparencyMeta(
      entries,
      dimensionsResponse,
      viewSelectionResponse /* , bomRows */
    ),
    transparencyIntroParagraphs: buildTransparencyIntro(
      dimensionsResponse,
      viewSelectionResponse,
      dimensionSpecs,
      totalDimIds
    ),
  };
}

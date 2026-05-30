/**
 * Maps CloudFront 2d-technical-drawings JSON into props for TwoDTechnicalDrawingPage / TwoDTechnicalDrawingContent.
 * Shapes: dimension_specs.json, dimensions_response.json, geometry_per_sheet.json, view_selection_response.json.
 */

import {
  techdrawBundlePdfViewUrl,
  techdrawFileApiUrl,
  techdrawSheetPdfViewUrl,
  techdrawSheetPreviewUrls,
} from "./techdrawFileApi";

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

/**
 * Layer B filter — drop entries whose underlying sheet artifacts won't
 * render cleanly. An entry is kept only when:
 *   • The TechDraw projection produced ≥ 1 edge for it. ``edgeCount === 0``
 *     means the SVG/PDF exports are visually blank even though the files
 *     might exist on S3 (this is the "Section A-A" blank-tile case from
 *     the dashboard screenshot).
 *   • If the bundle fetcher ran HEAD probes (``availabilityBySheet``), the
 *     sheet's preview SVG resolved on S3. ``false`` means the file 404'd
 *     or the CDN reported a Content-Length below the empty-shell floor.
 *   • If no availability map is present (older callers, or when probing
 *     was skipped), we don't enforce that part — just the edgeCount rule.
 *
 * Both rules combined give us:
 *   pipeline-clean jobs       → no filtering needed, everything passes
 *   pre-Layer-A legacy jobs   → blank views drop via edgeCount, missing
 *                               files drop via availability map
 *   future S3 deletions       → drop via availability map even when the
 *                               JSONs still reference the sheet
 */
function filterRenderableEntries(entries, availabilityBySheet) {
  if (!Array.isArray(entries)) return [];
  const hasAvailability =
    availabilityBySheet && typeof availabilityBySheet === "object";
  return entries.filter((e) => {
    if (!e || e.edgeCount <= 0) return false;
    if (hasAvailability) {
      const n = Number(e.sheet_num);
      if (Number.isInteger(n) && availabilityBySheet[n] === false) {
        return false;
      }
    }
    return true;
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

function isUserPipelineCdnBase(baseUrl) {
  return String(baseUrl || "").includes("user-freecad-techdraw");
}

/** SVG preview URLs (same-origin API so inline MIME + no forced download). */
function sheetPreviewCandidates(baseUrl, sheetNum, designId) {
  const n = Number(sheetNum);
  const id = String(designId || "").trim();
  const base = String(baseUrl || "").replace(/\/$/, "");
  if (isUserPipelineCdnBase(base) && id) {
    return techdrawSheetPreviewUrls(id, n, { userPipeline: true });
  }
  const fromBase = base.split("/").pop() || "";
  const resolvedId = id || fromBase;
  if (/^[a-f0-9]{24}$/i.test(resolvedId)) {
    return techdrawSheetPreviewUrls(resolvedId, n, { userPipeline: false });
  }
  return [`${base}/svg/sheet_${n}.svg`];
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

function normalizeViewToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function buildReasonMaps(viewSelectionResponse) {
  const selected = Array.isArray(viewSelectionResponse?.llm_data?.selected_views)
    ? viewSelectionResponse.llm_data.selected_views
    : [];
  const sections = Array.isArray(viewSelectionResponse?.llm_data?.section_views)
    ? viewSelectionResponse.llm_data.section_views
    : [];
  const details = Array.isArray(viewSelectionResponse?.llm_data?.detail_views)
    ? viewSelectionResponse.llm_data.detail_views
    : [];

  const byType = new Map();
  selected.forEach((v) => {
    const key = normalizeViewToken(v?.type);
    const reason = String(v?.reason || "").trim();
    if (key && reason && !byType.has(key)) byType.set(key, reason);
  });

  const sectionBySymbol = new Map();
  sections.forEach((v) => {
    const key = normalizeViewToken(v?.symbol);
    const reason = String(v?.reason || "").trim();
    if (key && reason && !sectionBySymbol.has(key)) sectionBySymbol.set(key, reason);
  });

  const detailByRef = new Map();
  details.forEach((v) => {
    const key = normalizeViewToken(v?.reference);
    const reason = String(v?.reason || "").trim();
    if (key && reason && !detailByRef.has(key)) detailByRef.set(key, reason);
  });

  return { byType, sectionBySymbol, detailByRef };
}

function reasonForEntry(entry, reasonMaps) {
  const text = `${entry?.label || ""} ${entry?.view_name || ""}`;
  const norm = normalizeViewToken(text);

  if (norm.includes("front")) return reasonMaps.byType.get("front") || "";
  if (norm.includes("top")) return reasonMaps.byType.get("top") || "";
  if (norm.includes("left")) return reasonMaps.byType.get("left") || "";
  if (norm.includes("right")) return reasonMaps.byType.get("right") || "";
  if (norm.includes("isometric") || norm.includes("iso"))
    return reasonMaps.byType.get("isometric") || "";

  const sectionMatch = String(entry?.label || "").match(/section\s*([A-Z])/i);
  if (sectionMatch?.[1]) {
    const r = reasonMaps.sectionBySymbol.get(normalizeViewToken(sectionMatch[1]));
    if (r) return r;
  }

  const detailMatch = String(entry?.label || "").match(/detail\s*([A-Z])/i);
  if (detailMatch?.[1]) {
    const r = reasonMaps.detailByRef.get(normalizeViewToken(detailMatch[1]));
    if (r) return r;
  }

  return "";
}

function buildViewCards(entries, baseUrl, viewSelectionResponse, designId) {
  const reasonMaps = buildReasonMaps(viewSelectionResponse);
  return entries.map((e) => {
    const previewCandidates = sheetPreviewCandidates(baseUrl, e.sheet_num, designId);
    const reason = reasonForEntry(e, reasonMaps);
    const body = reason
      ? reason
      : `This sheet includes ${e.edgeCount} geometry edges from the CAD projection pipeline.`;
    return {
      title: e.label,
      badgeKey: badgeKeyForEntry(e),
      source: `Sheet ${e.sheet_num} (${e.view_name})`,
      body,
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

function buildSectionDetailGroups(entries, dimensionSpecs, viewSelectionResponse) {
  const sections = sectionEntries(entries);
  const reasonMaps = buildReasonMaps(viewSelectionResponse);
  const detailViews = Array.isArray(viewSelectionResponse?.llm_data?.detail_views)
    ? viewSelectionResponse.llm_data.detail_views
    : [];

  const dimNote = dimensionSpecs
    ? "Dimension references for section sheets are included in the pipeline output."
    : "";

  const groups = [];

  if (sections.length > 0) {
    groups.push({
      srcTag:
        'drawing_config.py → DRAWING_CONFIG_SEMANTIC["sheet_*"]["section_a"] and ["section_b"] (see pipeline output)',
      variant: "section",
      cards: sections.slice(0, 2).map((e, idx) => ({
        symbol: sectionSymbolFromLabel(e.label),
        label: `section_${String.fromCharCode(97 + idx)} · ${e.view_name}`,
        meta: `sheet_num: ${e.sheet_num} · edges: ${e.edgeCount}`,
        description: (() => {
          const reason = reasonForEntry(e, reasonMaps);
          if (reason) return reason;
          return `${e.label}. ${dimNote} Geometry is derived from the 3D model projection for this drawing set.`;
        })(),
        bullets: [
          `${e.edgeCount} resolved edges in sheet geometry`,
          "See technical_drawing_simple.pdf, sheet_N.pdf, and svg/ for full graphical context",
          "Verify critical dimensions against the source CAD before manufacturing",
        ],
      })),
    });
  }

  if (detailViews.length > 0) {
    groups.push({
      srcTag:
        'drawing_config.py → DRAWING_CONFIG_SEMANTIC["sheet_*"]["detail_*"] (see pipeline output)',
      variant: "detail",
      cards: detailViews.slice(0, 2).map((d, idx) => {
        const ref = String(d?.reference || String.fromCharCode(67 + idx)).trim();
        const refUpper = ref.toUpperCase();
        const baseView = String(d?.base_view || "").trim();
        const anchor = Array.isArray(d?.anchor) ? d.anchor.join(", ") : "";
        const radius = d?.radius != null ? String(d.radius) : "";
        return {
          symbol: `Detail ${refUpper}`,
          label: `detail_${ref.toLowerCase()}${baseView ? ` · base_view: ${baseView}` : ""}`,
          meta:
            anchor || radius
              ? `anchor: (${anchor || "—"})${radius ? ` · radius: ${radius}` : ""}`
              : "detail-view anchor from pipeline output",
          description:
            String(d?.reason || "").trim() ||
            `Detail ${refUpper} highlights a localized manufacturing-critical area for the drawing package.`,
          bullets: [
            "Detail-view anchor selected by the AI planning stage",
            "Use with sheet PDF/SVG for local feature inspection",
            "Validate critical dimensions against source CAD before release",
          ],
        };
      }),
    });
  }

  return groups;
}

function buildSheetDownloadRows(entries, baseUrl, designId) {
  const userCdn = isUserPipelineCdnBase(baseUrl);
  const id = String(designId || "").trim();
  return entries.map((e) => {
    const n = Number(e.sheet_num);
    if (userCdn && id) {
      return {
        name: e.label,
        pdf: techdrawFileApiUrl(id, {
          sheet: n,
          ext: "pdf",
          source: "user",
          disposition: "attachment",
        }),
        svg: techdrawFileApiUrl(id, {
          sheet: n,
          ext: "svg",
          source: "user",
          disposition: "attachment",
        }),
        dxf: techdrawFileApiUrl(id, {
          sheet: n,
          ext: "dxf",
          source: "user",
          disposition: "attachment",
        }),
      };
    }
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
  entries,
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
  const vsNote = "";
  const analysedViews = uniqueViews(entries);
  const sectionsCount = sectionEntries(entries).length;
  const hasDetails = Array.isArray(viewSelectionResponse?.llm_data?.detail_views)
    ? viewSelectionResponse.llm_data.detail_views.length > 0
    : false;

  return [
    `The Marathon 3D→2D pipeline rendered ${analysedViews} views of the 3D CAD model and passed them through our AI analysis engine.${vsNote}`,
    `The AI reasoned about the geometry, selected view candidates, and planned ${sectionsCount} section cut${sectionsCount === 1 ? "" : "s"} to expose critical internal features.${hasDetails ? " It also selected detail-view anchor points for local manufacturing-critical regions." : ""} The final drawing configuration was then generated automatically for sheet outputs in SVG, DXF, and PDF.`,
    `${totalDimIds} dimension references were mapped across sheets, with per-sheet labels, views, and extracted edge geometry.`,
  ];
}

function buildAiAnalysisSources(viewSelectionResponse, totalDimIds) {
  const vs = viewSelectionResponse;
  return [
    {
      icon: "🎯",
      iconMods: [],
      title: "View-selection analysis output",
      description: vs
        ? `Stage 2 view selection, saved ${vs.saved_at_utc || "—"}.`
        : "AI-selected views for this drawing set when Stage 2 JSON is present in the bundle.",
    },
    {
      icon: "{ }",
      iconMods: ["itemIconBlue", "itemIconMono"],
      title: "Dimension and geometry outputs",
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
    availabilityBySheet,
    // bom,
  } = bundle;

  const rawEntries = normalizeGeometryEntries(geometryPerSheet);
  // Single source of truth for "which sheets do we render?" — every
  // downstream consumer (cards, sections, downloads, stats) uses this list.
  const entries = filterRenderableEntries(rawEntries, availabilityBySheet);
  const totalDimIds = countDimensionIds(dimensionSpecs);
  const productTitle = resolveProductTitle(entries, designMeta);
  const title = `${productTitle} — 2D Technical Drawing Set`;
  const designRoute = String(designMeta?.route || "").trim();
  const designLibraryHref = designRoute
    ? `/library/${encodeURIComponent(designRoute)}`
    : `/library/${designId}`;
  const drawingPageHref = designRoute
    ? `/library/2d-technical-drawings/${encodeURIComponent(designRoute)}`
    : `/library/2d-technical-drawings/${designId}`;

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

  const userCdn = isUserPipelineCdnBase(baseUrl);
  const sheets = entries.map((e) => {
    const previewCandidates = sheetPreviewCandidates(baseUrl, e.sheet_num, designId);
    const n = Number(e.sheet_num);
    return {
      src: previewCandidates[0],
      previewCandidates,
      pdfUrl: techdrawSheetPdfViewUrl(designId, n, { userPipeline: userCdn }),
      label: e.label,
    };
  });

  const sheetDownloadRows = buildSheetDownloadRows(entries, baseUrl, designId);

  // Empty-state signal — render the failure notice instead of empty grids
  // when geometry had sheets but every one of them was filtered out by
  // Layer B (either edgeCount === 0 or HEAD-probe said the file is missing).
  const hasRenderableSheets = entries.length > 0;
  const wasFilteredEmpty = rawEntries.length > 0 && entries.length === 0;

  return {
    designId,
    baseUrl,
    hasRenderableSheets,
    wasFilteredEmpty,
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
    // Both library + user-pipeline pages CTA into the same upload flow.
    // (The legacy "/generate" route never existed and led to a 404.)
    // generateHref: "/tools/cad-drawing-pipeline",
    generateHref: "",
    pdfHref: techdrawBundlePdfViewUrl(designId, { userPipeline: userCdn }),
    freecadHref: `${baseUrl}/technical_drawing_simple.FCStd`,
    zipHref: userCdn
      ? techdrawBundlePdfViewUrl(designId, { userPipeline: true })
      : `/api/techdraw-bundle-zip?designId=${encodeURIComponent(designId)}`,
    drawingInfo: buildDrawingInfo(entries, dimensionsResponse, viewSelectionResponse),
    // aiAnalysisSources: buildAiAnalysisSources(viewSelectionResponse, totalDimIds),
    viewCards: buildViewCards(entries, baseUrl, viewSelectionResponse, designId),
    sectionDetailGroups: buildSectionDetailGroups(
      entries,
      dimensionSpecs,
      viewSelectionResponse
    ),
    // bomRows,
    sheetDownloadRows,
    transparencyMetaStats: buildTransparencyMeta(
      entries,
      dimensionsResponse,
      viewSelectionResponse /* , bomRows */
    ),
    transparencyIntroParagraphs: buildTransparencyIntro(
      entries,
      dimensionsResponse,
      viewSelectionResponse,
      dimensionSpecs,
      totalDimIds
    ),
  };
}

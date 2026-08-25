/**
 * Shape CDN pipeline artifacts into cover + review “details” props
 * matching techdraw_review_report cover / DRAWING REVIEW REPORT pages.
 */

/**
 * Best-effort parse of drawing_config_simple.py for sheet index rows.
 * Cover PDF builds the index from ALL config sheets (not filtered geometry).
 * @param {string} pyText
 * @returns {Map<number, { title: string, scale: string, sheetType: string }>}
 */
export function parseDrawingConfigSheets(pyText) {
  const map = new Map();
  const text = String(pyText || "");
  if (!text) return map;

  const re = /['"]sheet_(\d+)['"]\s*:/g;
  let m;
  while ((m = re.exec(text))) {
    const num = Number(m[1]);
    const chunk = text.slice(m.index, m.index + 1200);
    const title =
      chunk.match(/['"]title['"]\s*:\s*['"]([^'"]+)['"]/)?.[1] || "";
    const sheetType =
      chunk.match(/['"]sheet_type['"]\s*:\s*['"]([^'"]+)['"]/)?.[1] || "";
    // Prefer view/section/detail scale (same as FreeCAD cover builder).
    const scaleRaw =
      chunk.match(
        /['"](?:view|section|detail)['"]\s*:\s*\{[\s\S]*?['"]scale['"]\s*:\s*([0-9.]+)/,
      )?.[1] || chunk.match(/['"]scale['"]\s*:\s*([0-9.]+)/)?.[1];
    const scaleNum = Number(scaleRaw);
    const scale = Number.isFinite(scaleNum)
      ? String(Number.isInteger(scaleNum) ? scaleNum.toFixed(1) : scaleNum)
      : scaleRaw
        ? String(scaleRaw)
        : "";
    map.set(num, {
      title: title.trim(),
      scale: scale || "",
      sheetType: sheetType.trim(),
    });
  }
  return map;
}

function metaLookup(dimensionSpecsMeta) {
  /** @type {Map<string, { type: string, value: string, description: string }>} */
  const map = new Map();
  if (!dimensionSpecsMeta || typeof dimensionSpecsMeta !== "object") return map;
  for (const [key, list] of Object.entries(dimensionSpecsMeta)) {
    const sheetMatch = String(key).match(/(\d+)/);
    const sheet = sheetMatch ? Number(sheetMatch[1]) : 0;
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      const id = item.id;
      if (id == null) continue;
      map.set(`${sheet}:${id}`, {
        type: String(item.type || "?"),
        value: item.value != null ? String(item.value) : "",
        description: String(item.description || ""),
      });
    }
  }
  return map;
}

/**
 * Match review_report.pdf: only dimensions that exist as Dim_S{n}_C{id} in the FCStd.
 * @param {string} documentXml
 * @param {object|null} dimensionSpecsMeta
 */
export function placedDimensionsFromFcstdXml(documentXml, dimensionSpecsMeta) {
  const xml = String(documentXml || "");
  if (!xml) return [];
  const meta = metaLookup(dimensionSpecsMeta);
  const re = /<Object name="Dim_S(\d+)_C(\d+)"/g;
  const seen = new Set();
  const rows = [];
  let m;
  while ((m = re.exec(xml))) {
    const sheet = Number(m[1]);
    const cid = Number(m[2]);
    const key = `${sheet}:${cid}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const info = meta.get(key) || { type: "?", value: "", description: "" };
    rows.push({
      index: rows.length + 1,
      sheet,
      type: info.type,
      value: info.value,
      description: info.description,
    });
  }
  rows.sort((a, b) => a.sheet - b.sheet || a.index - b.index);
  rows.forEach((r, i) => {
    r.index = i + 1;
  });
  return rows;
}

/** Fallback when FCStd is unavailable — all meta rows (may over-count vs PDF). */
function flattenDimensionSchedule(dimensionSpecsMeta) {
  if (!dimensionSpecsMeta || typeof dimensionSpecsMeta !== "object") return [];
  const rows = [];
  for (const [key, list] of Object.entries(dimensionSpecsMeta)) {
    const sheetMatch = String(key).match(/(\d+)/);
    const sheet = sheetMatch ? Number(sheetMatch[1]) : 0;
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      rows.push({
        index: 0,
        sheet,
        type: String(item.type || "—"),
        value: item.value != null ? String(item.value) : "",
        description: String(item.description || ""),
      });
    }
  }
  rows.sort((a, b) => a.sheet - b.sheet || a.type.localeCompare(b.type));
  rows.forEach((r, i) => {
    r.index = i + 1;
  });
  return rows;
}

function normalizeRejections(rejections) {
  if (!Array.isArray(rejections)) return [];
  return rejections.map((r) => ({
    sheet: r?.sheet != null ? Number(r.sheet) : null,
    type: String(r?.type || "—"),
    value: r?.value != null ? String(r.value) : "",
    description: String(r?.description || ""),
    reason: String(r?.reason || r?.stage || ""),
  }));
}

function normalizeFcfs(gdtScheme) {
  const fcfs = Array.isArray(gdtScheme?.fcfs) ? gdtScheme.fcfs : [];
  return fcfs.map((f) => ({
    characteristic: String(f?.characteristic || "—"),
    tol: f?.tol != null ? String(f.tol) : "",
    zone: f?.zone != null ? String(f.zone) : "",
    confidence: String(f?.confidence || ""),
    reason: String(f?.reason || ""),
    assumption: String(f?.assumption || ""),
    datumRefs: Array.isArray(f?.datum_refs)
      ? f.datum_refs.map(String).join(" | ")
      : String(f?.datum_refs || ""),
  }));
}

/**
 * Prefer pipeline-authored drawing_details.json (same inputs as PDF cover/review).
 * @param {object|null|undefined} drawingDetailsJson
 * @param {string} designId
 * @returns {object|null}
 */
export function drawingDetailsFromPipelineJson(drawingDetailsJson, designId = "") {
  if (!drawingDetailsJson || typeof drawingDetailsJson !== "object") return null;
  if (!Array.isArray(drawingDetailsJson.sheetIndex)) return null;
  return {
    ...drawingDetailsJson,
    designId: String(
      drawingDetailsJson.designId || designId || "",
    ).trim(),
    fromPipelineJson: true,
  };
}

/**
 * @param {object} args
 * @returns {object|null}
 */
export function buildDrawingDetailsProps({
  designId = "",
  designMeta,
  viewSelectionResponse,
  geometryEntries = [],
  dimensionSpecsMeta = null,
  dimensionRejections = null,
  gdtScheme = null,
  drawingConfigPy = "",
  fcstdDocumentXml = "",
  drawingDetailsJson = null,
}) {
  const fromJson = drawingDetailsFromPipelineJson(drawingDetailsJson, designId);
  if (fromJson) return fromJson;

  const llm = viewSelectionResponse?.llm_data || {};
  const assembly = llm.assembly_info || {};
  const productTitle = String(
    assembly.title ||
      designMeta?.page_title ||
      designMeta?.part_name ||
      "Technical drawing",
  ).trim();

  // PDF cover uses output-folder name when config has no top-level title —
  // that is the design ObjectId. Keep productTitle for context only.
  const coverTitle = String(designId || productTitle).trim();

  const configSheets = parseDrawingConfigSheets(drawingConfigPy);
  let sheetIndex;
  if (configSheets.size > 0) {
    sheetIndex = [...configSheets.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([n, cfg]) => ({
        sheet: n,
        view: cfg.title || `Sheet ${n}`,
        scale: cfg.scale || "",
        content: cfg.sheetType || "",
      }));
  } else {
    sheetIndex = (Array.isArray(geometryEntries) ? geometryEntries : []).map(
      (e) => ({
        sheet: Number(e.sheet_num),
        view: e.label || e.view_name || `Sheet ${e.sheet_num}`,
        scale: "",
        content: "",
      }),
    );
  }

  const placed = placedDimensionsFromFcstdXml(
    fcstdDocumentXml,
    dimensionSpecsMeta,
  );
  const dimSchedule =
    placed.length > 0
      ? placed
      : flattenDimensionSchedule(dimensionSpecsMeta);

  const rejections = normalizeRejections(dimensionRejections);
  const fcfs = normalizeFcfs(gdtScheme);
  const assumed = fcfs.filter((f) => {
    const c = f.confidence.toLowerCase();
    return c === "low" || c === "medium";
  });

  const generatedAt = viewSelectionResponse?.saved_at_utc
    ? new Date(viewSelectionResponse.saved_at_utc).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const nothingToReview =
    rejections.length === 0 && assumed.length === 0 && fcfs.length === 0;

  return {
    designId: String(designId || "").trim(),
    coverTitle,
    productTitle,
    description: String(assembly.description || designMeta?.page_description || "").trim(),
    material: String(assembly.material || "").trim(),
    standard: String(assembly.standard || "ISO First-Angle Projection").trim(),
    units: String(assembly.units || "mm").trim(),
    generatedAt,
    coverStats: {
      sheets: sheetIndex.length,
      controlFrames: fcfs.length,
      dimensionsNotDrawn: rejections.length,
    },
    sheetIndex,
    reviewSummary: {
      dimensionsDrawn: dimSchedule.length,
      selectedNotDrawn: rejections.length,
      controlFrames: fcfs.length,
      assumedTolerances: assumed.length,
    },
    tolerancesToVerify: assumed,
    toleranceSchedule: fcfs,
    dimensionsNotDrawn: rejections,
    dimensionSchedule: dimSchedule,
    nothingToReview,
    hasReviewContent:
      dimSchedule.length > 0 ||
      rejections.length > 0 ||
      fcfs.length > 0,
  };
}

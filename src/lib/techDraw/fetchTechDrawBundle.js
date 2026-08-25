import { BASE_URL } from "@/config";
import {
  libraryCdnRoot,
  resolveLibraryTechDrawRoot,
} from "@/lib/techDraw/techDrawCdnRoots";

const JSON_OPTS = { next: { revalidate: 120 } };
// HEAD probes go straight to the CDN — cheap, no body transfer, same cache.
const HEAD_OPTS = { method: "HEAD", next: { revalidate: 120 } };
// Heuristic floor for "non-empty SVG". Empty <svg/> exports from FreeCAD
// when projection finds 0 visible edges are typically 250–600 bytes.
const MIN_VALID_SVG_BYTES = 800;

function folderUrl(designId) {
  return libraryCdnRoot(designId);
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, JSON_OPTS);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchDesignBasicMeta(designId) {
  if (!BASE_URL) return null;
  try {
    const url = `${BASE_URL}/v1/cad/get-design-basic-meta?design_id=${encodeURIComponent(designId)}`;
    const res = await fetch(url, JSON_OPTS);
    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.meta?.success ? payload?.data || null : null;
  } catch {
    return null;
  }
}

/**
 * HEAD-probe a sheet's preview SVG on CloudFront.
 *
 * Returns true when the file exists (HTTP 200) AND, if the CDN reports a
 * Content-Length, the file is at least ~800 bytes — large enough to not be
 * a blank "<svg></svg>" shell. We do not download the body.
 *
 * Any HEAD failure (404, network error, CDN refusing HEAD) is treated as
 * "missing" so the card is dropped from the rendered grid.
 */
async function probeSheetSvg(baseUrl, sheetNum) {
  const url = `${baseUrl}/svg/sheet_${sheetNum}.svg`;
  try {
    const res = await fetch(url, HEAD_OPTS);
    if (!res.ok) return false;
    const len = Number(res.headers.get("content-length") || "0");
    if (Number.isFinite(len) && len > 0 && len < MIN_VALID_SVG_BYTES) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Collect candidate sheet numbers from geometry_per_sheet.json keys + each
 * entry's ``sheet_num`` field. Returns a sorted ascending list of unique
 * positive integers.
 */
function candidateSheetNums(geometryPerSheet) {
  if (!geometryPerSheet || typeof geometryPerSheet !== "object") return [];
  const nums = new Set();
  for (const [rawKey, entry] of Object.entries(geometryPerSheet)) {
    const fromKey = Number(rawKey);
    if (Number.isInteger(fromKey) && fromKey > 0) nums.add(fromKey);
    const fromEntry = Number(entry?.sheet_num);
    if (Number.isInteger(fromEntry) && fromEntry > 0) nums.add(fromEntry);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

/**
 * Build {sheetNum: boolean} availability map by HEAD-probing each sheet's
 * preview SVG in parallel. Returns null if there are no candidate sheets
 * (so the mapper knows to skip the availability filter entirely).
 */
async function buildAvailabilityMap(baseUrl, geometryPerSheet) {
  const candidates = candidateSheetNums(geometryPerSheet);
  if (!candidates.length) return null;
  const results = await Promise.all(
    candidates.map((n) => probeSheetSvg(baseUrl, n).then((ok) => [n, ok])),
  );
  const map = {};
  for (const [n, ok] of results) map[n] = ok;
  return map;
}

async function fetchText(url) {
  try {
    const res = await fetch(url, JSON_OPTS);
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

/** Read Document.xml from technical_drawing_simple.FCStd (placed Dim_* objects). */
async function fetchFcstdDocumentXml(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/technical_drawing_simple.FCStd`, JSON_OPTS);
    if (!res.ok) return "";
    const buf = Buffer.from(await res.arrayBuffer());
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(buf);
    const file = zip.file("Document.xml");
    if (!file) return "";
    return await file.async("string");
  } catch {
    return "";
  }
}

/**
 * Load pipeline JSON for a library tech-draw folder on CloudFront.
 * When design.version is true (or output_s3_prefix is set), loads from
 * techdraw-v2/{id} instead of legacy 2d-technical-drawings/{id}.
 *
 * @param {string} designId
 * @param {{ version?: boolean, outputS3Prefix?: string }} [options]
 */
export async function fetchTechDrawBundle(designId, options = {}) {
  const designMeta =
    options.designMeta != null
      ? options.designMeta
      : await fetchDesignBasicMeta(designId);

  const version = Boolean(
    options.version ?? designMeta?.version,
  );
  const outputS3Prefix = resolveLibraryTechDrawRoot({
    designId,
    version,
    outputS3Prefix: options.outputS3Prefix ?? designMeta?.output_s3_prefix,
    asPrefixOnly: true,
  });
  const baseUrl = resolveLibraryTechDrawRoot({
    designId,
    version,
    outputS3Prefix: options.outputS3Prefix ?? designMeta?.output_s3_prefix,
  });

  const [
    geometryPerSheet,
    viewSelectionResponse,
    dimensionSpecsMeta,
    dimensionRejections,
    gdtScheme,
    drawingConfigPy,
    fcstdDocumentXml,
    drawingDetailsJson,
  ] = await Promise.all([
    fetchJson(`${baseUrl}/geometry_per_sheet.json`),
    fetchJson(`${baseUrl}/view_selection_response.json`),
    fetchJson(`${baseUrl}/dimension_specs_meta.json`),
    fetchJson(`${baseUrl}/dimension_rejections.json`),
    fetchJson(`${baseUrl}/gdt_scheme.json`),
    fetchText(`${baseUrl}/drawing_config_simple.py`),
    fetchFcstdDocumentXml(baseUrl),
    fetchJson(`${baseUrl}/drawing_details.json`),
  ]);

  const availabilityBySheet = await buildAvailabilityMap(
    baseUrl,
    geometryPerSheet,
  );

  return {
    baseUrl,
    outputS3Prefix: outputS3Prefix || "",
    version,
    svgOnly: version,
    dimensionSpecs: null,
    dimensionsResponse: null,
    dimensionSpecsMeta,
    dimensionRejections,
    gdtScheme,
    drawingConfigPy,
    fcstdDocumentXml,
    drawingDetailsJson,
    geometryPerSheet,
    viewSelectionResponse,
    designMeta,
    availabilityBySheet,
    // bom,
  };
}

export { folderUrl };

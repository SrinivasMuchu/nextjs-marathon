import { DESIGN_GLB_PREFIX_URL } from "@/config";
import { isUserPipelineCdnBase } from "./techDrawCdnRoots";

const MIN_VALID_SVG_BYTES = 800;

/**
 * Build CloudFront folder URL from cad_tech_draw.output_s3_prefix
 * (e.g. user-freecad-techdraw/6a0c091a…).
 */
export function techDrawCdnBaseFromPrefix(outputS3Prefix) {
  const prefix = String(outputS3Prefix || "").trim().replace(/^\//, "");
  if (!prefix) return "";
  return `${DESIGN_GLB_PREFIX_URL.replace(/\/$/, "")}/${prefix}`;
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function probeSheetSvg(baseUrl, sheetNum) {
  const url = `${baseUrl}/svg/sheet_${sheetNum}.svg`;
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
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

/**
 * Load pipeline JSON from a TechDraw output folder (user or library prefix).
 * Client-safe (no server-only APIs).
 */
export async function fetchTechDrawBundleFromPrefix(outputS3Prefix) {
  const prefix = String(outputS3Prefix || "").trim();
  const baseUrl = techDrawCdnBaseFromPrefix(prefix);
  if (!baseUrl) return null;

  const [geometryPerSheet, viewSelectionResponse, dimensionSpecs] = await Promise.all([
    fetchJson(`${baseUrl}/geometry_per_sheet.json`),
    fetchJson(`${baseUrl}/view_selection_response.json`),
    fetchJson(`${baseUrl}/dimension_specs.json`),
  ]);

  if (!geometryPerSheet || typeof geometryPerSheet !== "object") {
    return null;
  }

  const availabilityBySheet = await buildAvailabilityMap(
    baseUrl,
    geometryPerSheet,
  );

  return {
    baseUrl,
    outputS3Prefix: prefix,
    geometryPerSheet,
    viewSelectionResponse,
    dimensionSpecs,
    dimensionsResponse: null,
    designMeta: null,
    availabilityBySheet,
    isUserPipelineOutput: isUserPipelineCdnBase(baseUrl),
  };
}

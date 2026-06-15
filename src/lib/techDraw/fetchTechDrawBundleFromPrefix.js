import { DESIGN_GLB_PREFIX_URL } from "@/config";

const MIN_VALID_SVG_BYTES = 800;
const USER_TECHDRAW_FOLDER = "user-freecad-techdraw";
const JOB_ID_RE = /^[a-f0-9]{24}$/;

/** CloudFront folder for a user pipeline job: …/user-freecad-techdraw/{jobId} */
export function techDrawUserJobCdnBase(jobId) {
  const id = String(jobId || "").trim();
  if (!JOB_ID_RE.test(id)) return "";
  return `${DESIGN_GLB_PREFIX_URL.replace(/\/$/, "")}/${USER_TECHDRAW_FOLDER}/${id}`;
}

/**
 * Build CloudFront folder URL from an explicit S3 prefix (library bundles, etc.).
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

async function loadTechDrawBundleFromBaseUrl(baseUrl, isUserPipelineOutput) {
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
    geometryPerSheet,
    viewSelectionResponse,
    dimensionSpecs,
    dimensionsResponse: null,
    designMeta: null,
    availabilityBySheet,
    isUserPipelineOutput,
  };
}

/** Load user pipeline outputs from CloudFront using the job id (not output_s3_prefix). */
export async function fetchTechDrawBundleForJob(jobId) {
  return loadTechDrawBundleFromBaseUrl(techDrawUserJobCdnBase(jobId), true);
}

/**
 * Load pipeline JSON from a TechDraw output folder (library prefix).
 * Client-safe (no server-only APIs).
 */
export async function fetchTechDrawBundleFromPrefix(outputS3Prefix) {
  const baseUrl = techDrawCdnBaseFromPrefix(outputS3Prefix);
  return loadTechDrawBundleFromBaseUrl(
    baseUrl,
    baseUrl.includes(USER_TECHDRAW_FOLDER),
  );
}

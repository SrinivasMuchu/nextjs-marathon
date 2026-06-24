import { DESIGN_GLB_PREFIX_URL } from "@/config";
import { isUserPipelineCdnBase } from "./techDrawCdnRoots";

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
  // CloudFront HEAD from the browser fails CORS — would mark every sheet false
  // and hide all previews on dashboard (client-side bundle load).
  if (typeof window !== "undefined") return null;

  const candidates = candidateSheetNums(geometryPerSheet);
  if (!candidates.length) return null;
  const results = await Promise.all(
    candidates.map((n) => probeSheetSvg(baseUrl, n).then((ok) => [n, ok])),
  );
  const map = {};
  for (const [n, ok] of results) map[n] = ok;
  return map;
}

async function loadTechDrawBundleFromBaseUrl(
  baseUrl,
  isUserPipelineOutput,
  outputS3Prefix = "",
) {
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
    outputS3Prefix: String(outputS3Prefix || "").trim(),
    geometryPerSheet,
    viewSelectionResponse,
    dimensionSpecs,
    dimensionsResponse: null,
    designMeta: null,
    availabilityBySheet,
    isUserPipelineOutput,
  };
}

/** Load user pipeline outputs from CloudFront (prefers job output_s3_prefix when set). */
export async function fetchTechDrawBundleForJob(jobId, outputS3Prefix = "") {
  const id = String(jobId || "").trim();
  if (!JOB_ID_RE.test(id)) return null;

  const prefixCandidates = [];
  const explicit = String(outputS3Prefix || "").trim();
  if (explicit) prefixCandidates.push(explicit);
  prefixCandidates.push(`qwen_tech_draw_designs/${id}`);
  prefixCandidates.push(`${USER_TECHDRAW_FOLDER}/${id}`);

  const seen = new Set();
  for (const prefix of prefixCandidates) {
    if (!prefix || seen.has(prefix)) continue;
    seen.add(prefix);
    const baseUrl = techDrawCdnBaseFromPrefix(prefix);
    if (!baseUrl) continue;
    const bundle = await loadTechDrawBundleFromBaseUrl(baseUrl, true, prefix);
    if (bundle) return bundle;
  }
  return null;
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
    outputS3Prefix,
  );
}

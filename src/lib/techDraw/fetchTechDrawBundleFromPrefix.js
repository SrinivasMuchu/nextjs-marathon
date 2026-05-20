import { DESIGN_GLB_PREFIX_URL } from "@/config";

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

/**
 * Load pipeline JSON from a TechDraw output folder (user or library prefix).
 * Client-safe (no server-only APIs).
 */
export async function fetchTechDrawBundleFromPrefix(outputS3Prefix) {
  const baseUrl = techDrawCdnBaseFromPrefix(outputS3Prefix);
  if (!baseUrl) return null;

  const [geometryPerSheet, viewSelectionResponse, dimensionSpecs] = await Promise.all([
    fetchJson(`${baseUrl}/geometry_per_sheet.json`),
    fetchJson(`${baseUrl}/view_selection_response.json`),
    fetchJson(`${baseUrl}/dimension_specs.json`),
  ]);

  if (!geometryPerSheet || typeof geometryPerSheet !== "object") {
    return null;
  }

  return {
    baseUrl,
    geometryPerSheet,
    viewSelectionResponse,
    dimensionSpecs,
    dimensionsResponse: null,
    designMeta: null,
    isUserPipelineOutput: baseUrl.includes("user-freecad-techdraw"),
  };
}

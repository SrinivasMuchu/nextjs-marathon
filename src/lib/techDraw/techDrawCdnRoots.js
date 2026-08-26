import { DESIGN_GLB_PREFIX_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";

const CDN = DESIGN_GLB_PREFIX_URL.replace(/\/$/, "");
const LIBRARY = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");
const TECHDRAW_V2_FOLDER = "techdraw-v2";

export function libraryCdnRoot(designId) {
  return `${LIBRARY}/${String(designId || "").trim()}`;
}

/** New FreeCAD library batch outputs (Mongo version: true). */
export function techdrawV2CdnRoot(designId) {
  const id = String(designId || "").trim();
  return `${CDN}/${TECHDRAW_V2_FOLDER}/${id}`;
}

export function techdrawV2Prefix(designId) {
  return `${TECHDRAW_V2_FOLDER}/${String(designId || "").trim()}`;
}

/** Legacy pipeline folder layout (older jobs). */
export function legacyUserPipelineRoot(designId) {
  return `${CDN}/qwen_tech_draw_designs/${String(designId || "").trim()}`;
}

/** Resolve CloudFront folder from cad_tech_draw.output_s3_prefix (e.g. qwen_tech_draw_designs/{id}). */
export function prefixCdnRoot(outputS3Prefix) {
  const prefix = String(outputS3Prefix || "").trim().replace(/^\//, "");
  if (!prefix) return "";
  return `${CDN}/${prefix}`;
}

/**
 * Library 2D drawings: use techdraw-v2 when version is true (or an explicit
 * output_s3_prefix is set); otherwise legacy 2d-technical-drawings/{id}.
 *
 * @param {{ designId: string, version?: boolean, outputS3Prefix?: string, asPrefixOnly?: boolean }} opts
 * @returns {string} full CDN URL, or S3 key prefix when asPrefixOnly
 */
export function resolveLibraryTechDrawRoot({
  designId,
  version = false,
  outputS3Prefix = "",
  asPrefixOnly = false,
} = {}) {
  const id = String(designId || "").trim();
  const explicit = String(outputS3Prefix || "")
    .trim()
    .replace(/^\//, "")
    .replace(/\/$/, "");
  if (explicit) {
    return asPrefixOnly ? explicit : prefixCdnRoot(explicit);
  }
  if (version && id) {
    return asPrefixOnly ? techdrawV2Prefix(id) : techdrawV2CdnRoot(id);
  }
  return asPrefixOnly ? "" : libraryCdnRoot(id);
}

export function isLibraryCdnBase(baseUrl) {
  const b = String(baseUrl || "");
  return b.includes(LIBRARY) || b.includes(`/${TECHDRAW_V2_FOLDER}/`);
}

/** Any user-upload pipeline output on the design-glb CDN (not the public library). */
export function isUserPipelineCdnBase(baseUrl) {
  const b = String(baseUrl || "").trim();
  if (!b || isLibraryCdnBase(b)) return false;
  return b.startsWith(`${CDN}/`);
}

export function resolveTechDrawCdnRoot({ designId, source, prefix }) {
  const explicit = String(prefix || "").trim();
  if (explicit) return prefixCdnRoot(explicit);
  if (String(source || "").toLowerCase() === "user") {
    return legacyUserPipelineRoot(designId);
  }
  return libraryCdnRoot(designId);
}

export function directSheetAssetUrls(baseUrl, sheetNum) {
  const base = String(baseUrl || "").replace(/\/$/, "");
  const n = Number(sheetNum);
  return {
    pdf: `${base}/sheet_${n}.pdf`,
    svg: `${base}/svg/sheet_${n}.svg`,
    svgNodim: `${base}/svg/sheet_${n}_nodim.svg`,
    dxf: `${base}/dxf/sheet_${n}.dxf`,
  };
}

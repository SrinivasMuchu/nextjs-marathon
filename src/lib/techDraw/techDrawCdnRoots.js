import { DESIGN_GLB_PREFIX_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";

const CDN = DESIGN_GLB_PREFIX_URL.replace(/\/$/, "");
const LIBRARY = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");

export function libraryCdnRoot(designId) {
  return `${LIBRARY}/${String(designId || "").trim()}`;
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

export function isLibraryCdnBase(baseUrl) {
  return String(baseUrl || "").includes(LIBRARY);
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

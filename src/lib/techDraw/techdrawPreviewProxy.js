import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";

const PREFIX = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");

/**
 * Same-origin URL so &lt;img&gt; can render SVG/PNG even when CloudFront sends
 * Content-Disposition: attachment or generic octet-stream on the raw asset URL.
 */
export function techdrawAssetProxyUrl(absoluteUrl) {
  if (!absoluteUrl || typeof absoluteUrl !== "string") return absoluteUrl;
  if (!absoluteUrl.startsWith("http")) return absoluteUrl;
  return `/api/techdraw-asset?u=${encodeURIComponent(absoluteUrl)}`;
}

export function techdrawPreviewCandidatesProxied(candidates) {
  if (!Array.isArray(candidates)) return [];
  return candidates.map(techdrawAssetProxyUrl);
}

/**
 * For each remote asset URL, try direct URL first, then proxy fallback.
 * This helps when proxy/API has issues while direct CDN image is accessible.
 */
export function techdrawPreviewCandidatesWithFallback(candidates) {
  if (!Array.isArray(candidates)) return [];
  const out = [];
  for (const c of candidates) {
    if (!c) continue;
    const proxied = techdrawAssetProxyUrl(c);
    if (proxied && proxied !== c) out.push(proxied);
    out.push(c);
  }
  return out;
}

export function isUnderTechdrawPrefix(urlStr) {
  try {
    return typeof urlStr === "string" && urlStr.startsWith(`${PREFIX}/`);
  } catch {
    return false;
  }
}

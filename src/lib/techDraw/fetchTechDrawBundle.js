import { BASE_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";

const JSON_OPTS = { next: { revalidate: 120 } };

function folderUrl(designId) {
  return `${TECH_DRAW_LIBRARY_PREFIX}/${designId}`;
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
 * Load pipeline JSON for a freecad-2d-techdraw folder on CloudFront.
 * BOM: bom.json fetch commented out — re-enable when BOM UI is restored.
 * @param {string} designId — folder name under freecad-2d-techdraw/
 */
export async function fetchTechDrawBundle(designId) {
  const baseUrl = folderUrl(designId);
  const [
    geometryPerSheet,
    viewSelectionResponse,
    designMeta /* , bom */,
  ] =
    await Promise.all([
      fetchJson(`${baseUrl}/geometry_per_sheet.json`),
      fetchJson(`${baseUrl}/view_selection_response.json`),
      fetchDesignBasicMeta(designId),
      // fetchJson(`${baseUrl}/bom.json`),
    ]);

  return {
    baseUrl,
    dimensionSpecs: null,
    dimensionsResponse: null,
    geometryPerSheet,
    viewSelectionResponse,
    designMeta,
    // bom,
  };
}

export { folderUrl };
